import { db } from "@/db";
import { categories, craftsmen } from "@/db/schema";
import { SECTIONS } from "@/lib/constants";
import { ensureSeeded } from "@/lib/seed";
import { count, eq, sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

/** الأقسام الرئيسية مع عدد الحرفيين في كل قسم */
export async function GET() {
  try {
    await ensureSeeded();
    const result = [];
    for (const s of SECTIONS) {
      const [{ value }] = await db
        .select({ value: count() })
        .from(craftsmen)
        .leftJoin(categories, eq(craftsmen.categoryId, categories.id))
        .where(sql`coalesce(${categories.section}, 'الحرفيين') = ${s.name}`);
      result.push({ ...s, count: value });
    }
    return Response.json({ sections: result });
  } catch (e) {
    console.error(e);
    return Response.json({ sections: [] }, { status: 500 });
  }
}
