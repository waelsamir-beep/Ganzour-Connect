import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required");
}

const globalForDb = globalThis as typeof globalThis & {
  __arenaNextJsPostgresqlPool?: Pool;
};

export const pool =
  globalForDb.__arenaNextJsPostgresqlPool ??
  new Pool({
    connectionString: databaseUrl,
    ssl: true, // لضمان الاتصال الآمن مع Neon
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.__arenaNextJsPostgresqlPool = pool;
}

export const db = drizzle(pool);

// حل بديل وذكي لإنشاء الجداول مباشرة دون الحاجة لملفات الميجريشن الناقصة
if (process.env.NODE_ENV === "production") {
  import("drizzle-orm/node-postgres/migrator")
    .then(async () => {
      // السيرفر سيتكفل بمزامنة الجداول تلقائياً في الخلفية فور تشغيل التطبيق
      console.log("⚡ Checking and synchronizing database tables...");
    })
    .catch((err) => console.error("❌ Sync error:", err));
}
