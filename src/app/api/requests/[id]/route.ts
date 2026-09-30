import { db } from "@/db";
import { craftsmen, joinRequests } from "@/db/schema";
import { isAdmin } from "@/lib/auth";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

/** الإدارة: موافقة أو رفض الطلب */
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    if (!isAdmin(body.pw)) {
      return Response.json({ error: "غير مصرح" }, { status: 401 });
    }

    const rows = await db
      .select()
      .from(joinRequests)
      .where(eq(joinRequests.id, parseInt(id)));
    if (rows.length === 0) {
      return Response.json({ error: "الطلب غير موجود" }, { status: 404 });
    }
    const reqRow = rows[0];

    if (body.action === "approve") {
      await db.insert(craftsmen).values({
        name: reqRow.name,
        profession: reqRow.profession,
        categoryId: body.categoryId
          ? parseInt(body.categoryId)
          : reqRow.categoryId,
        phone: reqRow.phone,
        whatsapp: reqRow.phone,
        location: body.location || reqRow.location || "جنزور",
        description: reqRow.note,
        experienceYears: body.experienceYears
          ? parseInt(body.experienceYears)
          : 1,
        rating: 4.0,
        ratingsCount: 0,
        verified: true,
        available: true,
        featured: false,
      });
      await db
        .update(joinRequests)
        .set({ status: "approved" })
        .where(eq(joinRequests.id, parseInt(id)));
      return Response.json({ success: true, approved: true });
    }

    if (body.action === "reject") {
      await db
        .update(joinRequests)
        .set({ status: "rejected" })
        .where(eq(joinRequests.id, parseInt(id)));
      return Response.json({ success: true });
    }

    return Response.json({ error: "إجراء غير معروف" }, { status: 400 });
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
  await db.delete(joinRequests).where(eq(joinRequests.id, parseInt(id)));
  return Response.json({ success: true });
}
