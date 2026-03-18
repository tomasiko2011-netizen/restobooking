import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { v4 as uuid } from "uuid";
import * as schema from "./schema";

const client = createClient({
  url: process.env.TURSO_URL || "file:local.db",
  authToken: process.env.TURSO_AUTH_TOKEN,
});
const db = drizzle(client, { schema });

async function seed() {
  console.log("Seeding database...");

  // === CITIES ===
  const cityData = [
    { id: uuid(), name: "Алматы", slug: "almaty", lat: 43.2380, lng: 76.9450 },
    { id: uuid(), name: "Астана", slug: "astana", lat: 51.1605, lng: 71.4704 },
    { id: uuid(), name: "Шымкент", slug: "shymkent", lat: 42.3154, lng: 69.5867 },
    { id: uuid(), name: "Тараз", slug: "taraz", lat: 42.9000, lng: 71.3667 },
    { id: uuid(), name: "Караганда", slug: "karaganda", lat: 49.8047, lng: 73.1094 },
    { id: uuid(), name: "Актобе", slug: "aktobe", lat: 50.2839, lng: 57.1670 },
    { id: uuid(), name: "Павлодар", slug: "pavlodar", lat: 52.2873, lng: 76.9674 },
    { id: uuid(), name: "Семей", slug: "semey", lat: 50.4111, lng: 80.2275 },
    { id: uuid(), name: "Атырау", slug: "atyrau", lat: 47.1167, lng: 51.8833 },
    { id: uuid(), name: "Костанай", slug: "kostanay", lat: 53.2198, lng: 63.6354 },
  ];

  for (const city of cityData) {
    await db.insert(schema.cities).values(city).onConflictDoNothing();
  }
  console.log(`✓ ${cityData.length} cities`);

  const cityMap: Record<string, string> = {};
  for (const c of cityData) cityMap[c.slug] = c.id;

  // === ADMIN USER ===
  const adminId = uuid();
  await db.insert(schema.users).values({
    id: adminId, email: "admin@restobooking.kz", name: "Admin",
    role: "admin", cityId: cityMap.almaty,
  }).onConflictDoNothing();

  // === RESTAURANTS ===
  const restaurantData = [
    // АЛМАТЫ
    { name: "Baharat", slug: "baharat", cuisine: "Восточная, Узбекская", address: "ул. Шевченко 94", lat: 43.24539, lng: 76.935237, phone: "+7 707 535 9436", city: "almaty", price: 3, cap: 30, deposit: 3000 },
    { name: "Shafran", slug: "shafran", cuisine: "Узбекская, Казахская", address: "ул. Толе би 207", lat: 43.2535, lng: 76.9221, phone: "+7 700 244 4444", city: "almaty", price: 3, cap: 40, deposit: 5000 },
    { name: "Кишлак", slug: "kishlak", cuisine: "Восточная, Шашлык", address: "пр. Сейфуллина 540а", lat: 43.24076, lng: 76.934847, phone: "+7 747 679 5979", city: "almaty", price: 3, cap: 50, deposit: 5000 },
    { name: "Саксаул", slug: "saksaul", cuisine: "Казахская, Европейская", address: "ул. Толе би 128", lat: 43.252378, lng: 76.916045, phone: "+7 707 128 7128", city: "almaty", price: 4, cap: 35, deposit: 10000 },
    { name: "Naryn", slug: "naryn", cuisine: "Казахская, Халяль", address: "ул. Толе би 273/4", lat: 43.2578, lng: 76.9294, phone: "+7 708 400 4014", city: "almaty", price: 2, cap: 25, deposit: 2000 },
    { name: "Rumi Плов центр", slug: "rumi-plov", cuisine: "Узбекская, Плов", address: "пр. Абылай хана 92а", lat: 43.2548, lng: 76.9492, phone: "+7 700 800 9292", city: "almaty", price: 2, cap: 30, deposit: 0 },
    { name: "Lanzhou", slug: "lanzhou-almaty", cuisine: "Китайская, Лагман", address: "пр. Жибек Жолы 65а", lat: 43.262435, lng: 76.947737, phone: "+7 700 161 1161", city: "almaty", price: 2, cap: 20, deposit: 0 },
    { name: "Manhattan лагманхана", slug: "manhattan", cuisine: "Уйгурская, Лагман", address: "ул. Прокофьева 165", lat: 43.242192, lng: 76.875559, phone: "+7 777 302 9596", city: "almaty", price: 1, cap: 15, deposit: 0 },
    { name: "Имбирь", slug: "imbir", cuisine: "Восточная, Домашняя", address: "ул. Утеген батыра 5", lat: 43.250183, lng: 76.852728, phone: "+7 747 942 9351", city: "almaty", price: 2, cap: 25, deposit: 0 },
    { name: "Bukhara.kz", slug: "bukhara", cuisine: "Бухарская, Узбекская", address: "мкр. Сайран 2/2", lat: 43.232436, lng: 76.869422, phone: "+7 700 812 7070", city: "almaty", price: 2, cap: 20, deposit: 2000 },
    // АЛМАТЫ — 2GIS
    { name: "Ziyafet Steak House", slug: "ziyafet", cuisine: "Барбекю, Стейки", address: "ул. Желтоксан 172", lat: 43.243, lng: 76.9285, phone: "+7 700 172 1720", city: "almaty", price: 3, cap: 40, deposit: 5000 },
    { name: "Mahalla", slug: "mahalla", cuisine: "Восточная, Грузинская", address: "ТРЦ ADK, пр. Сатпаева 90", lat: 43.2374, lng: 76.89, phone: "+7 707 831 0033", city: "almaty", price: 2, cap: 30, deposit: 3000 },
    { name: "Alani", slug: "alani", cuisine: "Восточная, Казахская", address: "ул. Луганского 19", lat: 43.231, lng: 76.911, phone: "+7 700 190 1900", city: "almaty", price: 2, cap: 40, deposit: 3000 },
    { name: "Tal", slug: "tal", cuisine: "Восточная, Европейская", address: "ул. Навои 200 блок 3", lat: 43.2248, lng: 76.876, phone: "+7 700 200 2000", city: "almaty", price: 3, cap: 40, deposit: 4000 },
    { name: "Parasat", slug: "parasat", cuisine: "Казахская, Банкетная", address: "ул. Жамбыла 154", lat: 43.245878, lng: 76.91687, phone: "+7 708 044 1313", city: "almaty", price: 2, cap: 40, deposit: 3000 },
    { name: "Shyngys Han", slug: "shyngys-han", cuisine: "Казахская, Банкетная", address: "ул. Нурмакова 25", lat: 43.255802, lng: 76.905485, phone: "+7 705 875 9999", city: "almaty", price: 2, cap: 40, deposit: 3000 },

    // АСТАНА
    { name: "Узбечка №1", slug: "uzbekchka", cuisine: "Узбекская, Плов", address: "ул. Алихан Бокейхан 10", lat: 51.114461, lng: 71.438914, phone: "+7 701 186 6868", city: "astana", price: 2, cap: 30, deposit: 3000 },
    { name: "KaRima центр плова", slug: "karima", cuisine: "Узбекская, Плов", address: "ул. Достык 12/1", lat: 51.125693, lng: 71.42708, phone: "+7 700 883 0000", city: "astana", price: 2, cap: 25, deposit: 0 },
    { name: "На Востоке, на востоке", slug: "na-vostoke", cuisine: "Узбекская, Восточная", address: "пр. Туран 44/2", lat: 51.112922, lng: 71.403144, phone: "+7 700 400 4402", city: "astana", price: 3, cap: 40, deposit: 5000 },
    { name: "Kutaisi", slug: "kutaisi", cuisine: "Грузинская", address: "пр. Момышулы 13", lat: 51.137939, lng: 71.469827, phone: "+7 700 130 1300", city: "astana", price: 3, cap: 30, deposit: 3000 },
    { name: "Lanzhou", slug: "lanzhou-astana", cuisine: "Китайская, Лагман", address: "ул. Сарайшык 5", lat: 51.135651, lng: 71.423635, phone: "+7 700 161 1161", city: "astana", price: 2, cap: 20, deposit: 0 },
    // АСТАНА — 2GIS
    { name: "La Mia Piazza", slug: "la-mia-piazza", cuisine: "Итальянская, Европейская", address: "пр. Туран 22/1", lat: 51.128, lng: 71.43, phone: "+7 700 221 2210", city: "astana", price: 3, cap: 40, deposit: 4000 },
    { name: "The Moon", slug: "the-moon", cuisine: "Паназиатская, Европейская", address: "ул. Акмешит 1 блок 6", lat: 51.156, lng: 71.425, phone: "+7 700 160 1600", city: "astana", price: 3, cap: 30, deposit: 4000 },
    { name: "Ranch", slug: "ranch", cuisine: "Стейки, Гриль", address: "ул. Динмухамед Конаев 14", lat: 51.173, lng: 71.42, phone: "+7 700 140 1400", city: "astana", price: 3, cap: 40, deposit: 5000 },
    { name: "Гаухартас", slug: "gauhartas", cuisine: "Казахская, Банкетная", address: "ул. Ермека Серкебаева 11", lat: 51.167842, lng: 71.389026, phone: "+7 776 007 7725", city: "astana", price: 2, cap: 40, deposit: 3000 },

    // ШЫМКЕНТ
    { name: "Ясин", slug: "yasin", cuisine: "Восточная, Самса", address: "пр. Назарбаева 53а", lat: 42.362843, lng: 69.635688, phone: "+7 700 530 5300", city: "shymkent", price: 2, cap: 30, deposit: 2000 },
    { name: "Мизам", slug: "mizam", cuisine: "Узбекская, Лагман", address: "Тамерлановское шоссе 214Б", lat: 42.3285, lng: 69.6501, phone: "+7 700 214 2140", city: "shymkent", price: 1, cap: 25, deposit: 0 },
    { name: "Aurum Family", slug: "aurum", cuisine: "Восточная, Европейская", address: "пр. Тауке хана 93а", lat: 42.313855, lng: 69.618399, phone: "+7 702 088 8008", city: "shymkent", price: 3, cap: 40, deposit: 5000 },
    // ШЫМКЕНТ — 2GIS
    { name: "Murager", slug: "murager", cuisine: "Европейская, Фьюжн", address: "ул. Елшибек батыра 118", lat: 42.32555, lng: 69.636191, phone: "+7 775 446 5808", city: "shymkent", price: 2, cap: 40, deposit: 3000 },
    { name: "Vavilon", slug: "vavilon", cuisine: "Многокухонная, Банкетная", address: "ул. Сыперган ата 715", lat: 42.357133, lng: 69.556239, phone: "+7 700 715 7150", city: "shymkent", price: 2, cap: 40, deposit: 3000 },

    // ТАРАЗ
    { name: "Жеті тандыр", slug: "jeti-tandyr", cuisine: "Восточная, Тандыр", address: "ул. Сулейменова 26в", lat: 42.8875, lng: 71.3586, phone: "+7 778 970 7007", city: "taraz", price: 2, cap: 25, deposit: 0 },
    { name: "AJWA чайхана", slug: "ajwa", cuisine: "Восточная, Чайхана", address: "пр. Абая 22а", lat: 42.912449, lng: 71.397221, phone: "+7 776 377 3777", city: "taraz", price: 2, cap: 30, deposit: 2000 },
    { name: "Jamm&Bull's", slug: "jamm-bulls", cuisine: "Микс, Шашлык", address: "ул. Ташкентская 195а", lat: 42.875117, lng: 71.368926, phone: "+7 771 099 9599", city: "taraz", price: 3, cap: 35, deposit: 3000 },
    // ТАРАЗ — 2GIS
    { name: "AYU", slug: "ayu", cuisine: "Европейская", address: "ул. Каратая Турысова 3а", lat: 42.889, lng: 71.373, phone: "+7 700 030 0300", city: "taraz", price: 2, cap: 25, deposit: 2000 },
    { name: "Остров Кэма", slug: "ostrov-kema", cuisine: "Многокухонная, Банкетная", address: "ул. Титова 1", lat: 42.882, lng: 71.383, phone: "+7 700 010 0100", city: "taraz", price: 2, cap: 40, deposit: 3000 },
    { name: "Sakartvelo", slug: "sakartvelo", cuisine: "Грузинская", address: "ул. Сулейменова 16", lat: 42.896, lng: 71.37, phone: "+7 700 160 1600", city: "taraz", price: 2, cap: 25, deposit: 2000 },
    { name: "Marvarid", slug: "marvarid", cuisine: "Восточная, Многокухонная", address: "ул. Комратова 94", lat: 42.875, lng: 71.39, phone: "+7 700 940 9400", city: "taraz", price: 2, cap: 30, deposit: 2000 },
    { name: "Astrum", slug: "astrum", cuisine: "Европейская, Рыбный", address: "ул. Тауке хана 15а", lat: 42.887, lng: 71.381, phone: "+7 700 150 1500", city: "taraz", price: 2, cap: 30, deposit: 2000 },

    // КАРАГАНДА
    { name: "Viva La Plov", slug: "viva-la-plov", cuisine: "Узбекская, Плов", address: "ул. Жангозина 11", lat: 49.820187, lng: 73.092664, phone: "+7 700 110 1100", city: "karaganda", price: 3, cap: 30, deposit: 3000 },
    { name: "Жаровня", slug: "zharovnya", cuisine: "Шашлык, Гриль", address: "ул. Рахимова 138/2", lat: 49.7954, lng: 73.1152, phone: "+7 775 000 0444", city: "karaganda", price: 2, cap: 25, deposit: 0 },
    // КАРАГАНДА — 2GIS
    { name: "Villa Borghese", slug: "villa-borghese", cuisine: "Итальянская, Европейская", address: "Музейный переулок 4", lat: 49.807391, lng: 73.067358, phone: "+7 700 040 0400", city: "karaganda", price: 3, cap: 40, deposit: 5000 },
    { name: "Da Vinci", slug: "da-vinci", cuisine: "Азиатская, Европейская", address: "пр. Назарбаева 21", lat: 49.805, lng: 73.09, phone: "+7 700 210 2100", city: "karaganda", price: 3, cap: 40, deposit: 5000 },
    { name: "Lumi", slug: "lumi", cuisine: "Кавказская, Казахская", address: "пр. Нуркена Абдирова 30в", lat: 49.805769, lng: 73.099643, phone: "+7 700 300 3000", city: "karaganda", price: 2, cap: 30, deposit: 3000 },
    { name: "Gurami", slug: "gurami", cuisine: "Грузинская, Халяль", address: "Arena Park, мкр. Байкена Ашимова 7/1", lat: 49.7926, lng: 73.137, phone: "+7 700 071 0710", city: "karaganda", price: 2, cap: 25, deposit: 2000 },

    // АКТОБЕ
    { name: "GAIA", slug: "gaia-aktobe", cuisine: "Европейская, Японская", address: "пр. Абилкайыр-хана 54", lat: 50.292905, lng: 57.158128, phone: "+7 707 911 5544", city: "aktobe", price: 2, cap: 30, deposit: 2000 },
    { name: "Assado", slug: "assado-aktobe", cuisine: "Стейки, Бургеры", address: "пр. Тауелсиздик 9Б", lat: 50.278559, lng: 57.144102, phone: "+7 747 989 1010", city: "aktobe", price: 2, cap: 25, deposit: 2000 },
    { name: "Koster", slug: "koster-aktobe", cuisine: "Стейки, Паста", address: "пр. Санкибай батыра 177в", lat: 50.279065, lng: 57.157010, phone: "+7 701 036 0300", city: "aktobe", price: 2, cap: 25, deposit: 2000 },
    { name: "Manhattan", slug: "manhattan-aktobe", cuisine: "Европейская, Суши", address: "пр. Санкибай батыра 14а", lat: 50.291406, lng: 57.157851, phone: "+7 700 140 1400", city: "aktobe", price: 2, cap: 30, deposit: 2000 },

    // ПАВЛОДАР
    { name: "Bremen", slug: "bremen-pavlodar", cuisine: "Итальянская, Гриль", address: "ул. Академика Сатпаева 253/1", lat: 52.265085, lng: 76.943538, phone: "+7 705 324 8888", city: "pavlodar", price: 2, cap: 50, deposit: 2000 },
    { name: "Chechil", slug: "chechil-pavlodar", cuisine: "Итальянская, Пицца", address: "ул. Усолка 1/3", lat: 52.250621, lng: 76.954758, phone: "+7 705 391 8080", city: "pavlodar", price: 2, cap: 30, deposit: 2000 },
    { name: "Loka", slug: "loka-pavlodar", cuisine: "Авторская кухня", address: "ул. Ломова 150/4", lat: 52.265204, lng: 76.977025, phone: "+7 777 162 4785", city: "pavlodar", price: 2, cap: 25, deposit: 2000 },
    { name: "Alpenhof", slug: "alpenhof-pavlodar", cuisine: "Немецкая, Пивоварня", address: "ул. Сураганова 19а", lat: 52.293330, lng: 76.972891, phone: "+7 776 903 9995", city: "pavlodar", price: 2, cap: 30, deposit: 2000 },

    // СЕМЕЙ
    { name: "Adis", slug: "adis-semey", cuisine: "Авторская, Европейская", address: "пр. Шоже Каржаубайулы 155", lat: 50.426439, lng: 80.267705, phone: "+7 707 200 8000", city: "semey", price: 3, cap: 30, deposit: 2000 },
    { name: "Pinta Bar & Grill", slug: "pinta-semey", cuisine: "Европейская, Гриль", address: "ул. Чайжунусова 92", lat: 50.402718, lng: 80.256603, phone: "+7 708 467 0010", city: "semey", price: 2, cap: 40, deposit: 2000 },
    { name: "Premium", slug: "premium-semey", cuisine: "Европейская, Восточная", address: "ул. Кабанбай батыра 65", lat: 50.422353, lng: 80.247332, phone: "+7 776 177 7171", city: "semey", price: 2, cap: 25, deposit: 2000 },
    { name: "Mamuka", slug: "mamuka-semey", cuisine: "Грузинская", address: "ул. Ибраева 145а", lat: 50.408079, lng: 80.250544, phone: "+7 776 076 6949", city: "semey", price: 2, cap: 25, deposit: 2000 },

    // АТЫРАУ
    { name: "Meiman", slug: "meiman-atyrau", cuisine: "Восточная, Халяль", address: "ТД Plaza, ул. Абдрахманов 43", lat: 47.121358, lng: 51.938920, phone: "+7 771 241 4141", city: "atyrau", price: 2, cap: 30, deposit: 2000 },
    { name: "NES", slug: "nes-atyrau", cuisine: "Халяль, Стейки", address: "ТРЦ Атырау, пр. Сатпаева 17а", lat: 47.105527, lng: 51.895748, phone: "+7 771 833 0107", city: "atyrau", price: 2, cap: 25, deposit: 2000 },
    { name: "Хуторок", slug: "khutorok-atyrau", cuisine: "Украинская, Европейская", address: "пр. Азаттык 2а", lat: 47.111527, lng: 51.923538, phone: "+7 705 862 2261", city: "atyrau", price: 2, cap: 25, deposit: 2000 },
    { name: "Mindal", slug: "mindal-atyrau", cuisine: "Восточная, Казахская", address: "мкр. Сарыарка 31а", lat: 47.106361, lng: 51.907688, phone: "+7 701 052 5005", city: "atyrau", price: 2, cap: 35, deposit: 2000 },

    // КОСТАНАЙ
    { name: "IZUMI", slug: "izumi-kostanay", cuisine: "Грузинская, Восточная", address: "ТРЦ Kostanay plaza, пр. Назарбаева 193", lat: 53.235808, lng: 63.613066, phone: "+7 776 134 7777", city: "kostanay", price: 2, cap: 25, deposit: 2000 },
    { name: "Мясоед", slug: "myasoed-kostanay", cuisine: "Шашлык, Стейки", address: "ул. Баймагамбетова 30", lat: 53.198623, lng: 63.609084, phone: "+7 707 382 6770", city: "kostanay", price: 2, cap: 25, deposit: 2000 },
    { name: "Kinza", slug: "kinza-kostanay", cuisine: "Грузинская, Хинкали", address: "ул. Байтурсынова 45а", lat: 53.212597, lng: 63.627239, phone: "+7 700 726 3498", city: "kostanay", price: 2, cap: 30, deposit: 2000 },
  ];

  const restaurantIds: string[] = [];
  for (const r of restaurantData) {
    const id = uuid();
    restaurantIds.push(id);
    await db.insert(schema.restaurants).values({
      id,
      cityId: cityMap[r.city],
      name: r.name,
      slug: r.slug,
      cuisine: r.cuisine,
      address: r.address,
      lat: r.lat,
      lng: r.lng,
      phone: r.phone,
      priceRange: r.price,
      capacityPerSlot: r.cap,
      depositAmount: r.deposit,
      depositRequired: r.deposit > 0,
      rating: 4.3 + Math.random() * 0.7,
    }).onConflictDoNothing();
  }
  console.log(`✓ ${restaurantData.length} restaurants`);

  // === PRICING RULES ===
  for (let i = 0; i < restaurantIds.length; i++) {
    // Peak: Fri-Sat evening 1.3x
    await db.insert(schema.pricingRules).values({
      id: uuid(), restaurantId: restaurantIds[i],
      dayOfWeek: 5, timeStart: "19:00", timeEnd: "22:00",
      multiplier: 1.3, label: "Пятница вечер",
    });
    await db.insert(schema.pricingRules).values({
      id: uuid(), restaurantId: restaurantIds[i],
      dayOfWeek: 6, timeStart: "19:00", timeEnd: "22:00",
      multiplier: 1.5, label: "Суббота вечер",
    });
    // Off-peak: weekday lunch discount
    await db.insert(schema.pricingRules).values({
      id: uuid(), restaurantId: restaurantIds[i],
      dayOfWeek: null, timeStart: "12:00", timeEnd: "15:00",
      multiplier: 0.8, label: "Бизнес-ланч -20%",
    });
  }
  console.log(`✓ ${restaurantIds.length * 3} pricing rules`);

  console.log("\n✅ Seed complete!");
  console.log(`   ${cityData.length} cities, ${restaurantData.length} restaurants`);
  process.exit(0);
}

seed().catch((e) => { console.error(e); process.exit(1); });
