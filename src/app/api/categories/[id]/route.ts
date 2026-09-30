import { db } from "@/db";
import { categories } from "@/db/schema";
import { isAdmin } from "@/lib/auth";
import { SECTIONS } from "@/lib/constants";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

/** الإدارة: تعديل تصنيف */
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await req.json();
    if (!isAdmin(body.pw)) {
      return Response.json({ error: "غير مصرح" }, { status: 401 });
    }
    const updates: Record<string, unknown> = {};
    if (body.name?.trim()) {
      const clean = body.name.trim();
      const others = await db
        .select()
        .from(categories)
        .where(eq(categories.name, clean));
      if (others.some((c) => c.id !== parseInt(id))) {
        return Response.json({ error: "التصنيف موجود بالفعل" }, { status: 400 });
      }
      updates.name = clean;
    }
    if (body.icon?.trim()) updates.icon = body.icon.trim();
    if (body.description !== undefined)
      updates.description = body.description?.trim() || null;
    if (body.section && SECTIONS.find((s) => s.name === body.section)) {
      updates.section = body.section;
    }
    if (Object.keys(updates).length === 0) {
      return Response.json({ error: "لا يوجد تعديل" }, { status: 400 });
    }
    await db.update(categories).set(updates).where(eq(categories.id, parseInt(id)));
    return Response.json({ success: true });
  } catch (e) {
    console.error(e);
    return Response.json({ error: "حدث خطأ" }, { status: 500 });
  }
}

/** الإدارة: حذف تصنيف (المهنيين فيه يتحولون لغير مصنّف) */
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { searchParams } = new URL(req.url);
  if (!isAdmin(searchParams.get("pw"))) {
    return Response.json({ error: "غير مصرح" }, { status: 401 });
  }
  await db.delete(categories).where(eq(categories.id, parseInt(id)));
  return Response.json({ success: true });
}
