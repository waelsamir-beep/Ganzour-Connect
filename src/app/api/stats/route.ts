import { db } from "@/db";
import { categories, craftsmen } from "@/db/schema";
import { count, eq } from "drizzle-orm";
import { ensureSeeded } from "@/lib/seed";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await ensureSeeded();
    const [total] = await db.select({ value: count() }).from(craftsmen);
    const [verified] = await db
      .select({ value: count() })
      .from(craftsmen)
      .where(eq(craftsmen.verified, true));
    const [cats] = await db.select({ value: count() }).from(categories);
    return Response.json({
      total: total.value,
      verified: verified.value,
      categories: cats.value,
    });
  } catch {
    return Response.json({ total: 0, verified: 0, categories: 0 });
  }
}
