import { db } from "@/db";
import { announcements } from "@/db/schema";
import { isAdmin } from "@/lib/auth";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

/** الإدارة: تفعيل/تعطيل أو تعديل إعلان */
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
    if (body.active !== undefined) updates.active = !!body.active;
    if (body.title?.trim()) updates.title = body.title.trim();
    if (body.message?.trim()) updates.message = body.message.trim();
    if (Object.keys(updates).length === 0) {
      return Response.json({ error: "لا يوجد تعديل" }, { status: 400 });
    }
    await db
      .update(announcements)
      .set(updates)
      .where(eq(announcements.id, parseInt(id)));
    return Response.json({ success: true });
  } catch (e) {
    console.error(e);
    return Response.json({ error: "حدث خطأ" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { searchParams } = new URL(req.url);
  if (!isAdmin(searchParams.get("pw"))) {
    return Response.json({ error: "غير مصرح" }, { status: 401 });
  }
  await db.delete(announcements).where(eq(announcements.id, parseInt(id)));
  return Response.json({ success: true });
}
