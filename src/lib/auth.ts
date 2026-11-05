import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { v4 as uuid } from "uuid";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Phone",
      credentials: {
        phone: { label: "Телефон", type: "tel", placeholder: "+7 700 123 4567" },
        name: { label: "Имя", type: "text", placeholder: "Ваше имя" },
      },
      async authorize(credentials) {
        const phone = typeof credentials?.phone === "string" ? credentials.phone : "";
        const name = typeof credentials?.name === "string" ? credentials.name : "";
        if (!phone) return null;

        // Find or create user by phone
        let [user] = await db.select().from(users)
          .where(eq(users.phone, phone)).limit(1);

        if (!user) {
          const id = uuid();
          await db.insert(users).values({
            id,
            phone,
            name: name || "Гость",
            role: "user",
          });
          [user] = await db.select().from(users)
            .where(eq(users.id, id)).limit(1);
        }

        if (!user) return null;

        // Вход по телефону без подтверждения (нет OTP) — любой, кто знает номер,
        // может войти под этим аккаунтом. Поэтому привилегированные роли
        // (owner/admin) через этот провайдер НЕ пускаем, пока не появится OTP.
        // Новые пользователи создаются только с ролью "user" (см. выше).
        if (user.role === "admin" || user.role === "owner") {
          console.warn("[auth] phone login refused for privileged account", user.id);
          return null;
        }

        return { id: user.id, name: user.name, phone: user.phone, role: "user" };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role || "user";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { id?: string }).id = token.id as string;
        (session.user as { role?: string }).role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
});
