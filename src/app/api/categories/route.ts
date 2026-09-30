import { db } from "@/db";
import { categories, craftsmen } from "@/db/schema";
import { ensureSeeded } from "@/lib/seed";
import { isAdmin } from "@/lib/auth";
import { SECTIONS } from "@/lib/constants";
import { count, eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await ensureSeeded();
    const cats = await db.select().from(categories);
    // counts
    const counts: Record<number, number> = {};
    for (const c of cats) {
      const [{ value }] = await db
        .select({ value: count() })
        .from(craftsmen)
        .where(eq(craftsmen.categoryId, c.id));
      counts[c.id] = value;
    }
    const total = await db.select({ value: count() }).from(craftsmen);
    return Response.json({
      categories: cats.map((c) => ({ ...c, count: counts[c.id] ?? 0 })),
      total: total[0]?.value ?? 0,
    });
  } catch (e) {
    console.error(e);
    return Response.json({ categories: [], total: 0 }, { status: 500 });
  }
}

/** الإدارة فقط: إضافة تصنيف جديد */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!isAdmin(body.pw)) {
      return Response.json({ error: "غير مصرح" }, { status: 401 });
    }
    const { name, icon, description, section } = body;
    if (!name?.trim()) {
      return Response.json({ error: "اسم التصنيف مطلوب" }, { status: 400 });
    }
    const cleanName = name.trim();
    const existing = await db
      .select()
      .from(categories)
      .where(eq(categories.name, cleanName));
    if (existing.length > 0) {
      return Response.json({ error: "التصنيف موجود بالفعل" }, { status: 400 });
    }
    const validSection =
      SECTIONS.find((s) => s.name === section)?.name ?? "الحرفيين";
    const [row] = await db
      .insert(categories)
      .values({
        name: cleanName,
        icon: icon?.trim() || "🛠️",
        description: description?.trim() || null,
        section: validSection,
      })
      .returning();
    return Response.json({ success: true, category: row });
  } catch (e) {
    console.error(e);
    return Response.json({ error: "حدث خطأ" }, { status: 500 });
  }
}
