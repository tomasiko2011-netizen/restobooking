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
        const phone = credentials?.phone as string;
        const name = credentials?.name as string;
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

        return user ? { id: user.id, name: user.name, phone: user.phone, role: user.role } : null;
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
