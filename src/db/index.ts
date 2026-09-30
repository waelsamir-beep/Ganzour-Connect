import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
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
    ssl: true, // مهم جداً لضمان استقرار الاتصال الآمن مع سيرفرات Neon
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.__arenaNextJsPostgresqlPool = pool;
}

export const db = drizzle(pool);

// كود سحري لإنشاء الجداول في Neon تلقائياً عند بدء تشغيل التطبيق دون تدخل منك
if (process.env.NODE_ENV === "production") {
  migrate(db, { migrationsFolder: "./drizzle" })
    .then(() => console.log("✅ Database tables initialized successfully!"))
    .catch((err) => console.error("❌ Failed to initialize tables:", err));
}
