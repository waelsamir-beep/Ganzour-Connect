import { db } from "@/db";
import { categories, craftsmen, reviews } from "@/db/schema";
import { count, eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const rows = await db
      .select({
        id: craftsmen.id,
        name: craftsmen.name,
        profession: craftsmen.profession,
        categoryId: craftsmen.categoryId,
        categoryName: categories.name,
        categoryIcon: categories.icon,
        phone: craftsmen.phone,
        whatsapp: craftsmen.whatsapp,
        location: craftsmen.location,
        address: craftsmen.address,
        description: craftsmen.description,
        experienceYears: craftsmen.experienceYears,
        rating: craftsmen.rating,
        ratingsCount: craftsmen.ratingsCount,
        views: craftsmen.views,
        verified: craftsmen.verified,
        available: craftsmen.available,
        featured: craftsmen.featured,
        avatarEmoji: craftsmen.avatarEmoji,
        createdAt: craftsmen.createdAt,
      })
      .from(craftsmen)
      .leftJoin(categories, eq(craftsmen.categoryId, categories.id))
      .where(eq(craftsmen.id, parseInt(id)));

    if (rows.length === 0) {
      return Response.json({ error: "غير موجود" }, { status: 404 });
    }

    // increment views (fire and forget)
    await db
      .update(craftsmen)
      .set({ views: (rows[0].views ?? 0) + 1 })
      .where(eq(craftsmen.id, parseInt(id)));

    const revs = await db
      .select()
      .from(reviews)
      .where(eq(reviews.craftsmanId, parseInt(id)));

    // related
    const related = await db
      .select({
        id: craftsmen.id,
        name: craftsmen.name,
        profession: craftsmen.profession,
        categoryName: categories.name,
        phone: craftsmen.phone,
        location: craftsmen.location,
        rating: craftsmen.rating,
        verified: craftsmen.verified,
        avatarEmoji: craftsmen.avatarEmoji,
      })
      .from(craftsmen)
      .leftJoin(categories, eq(craftsmen.categoryId, categories.id))
      .where(eq(craftsmen.categoryId, rows[0].categoryId ?? -1))
      .limit(4);

    return Response.json({
      craftsman: { ...rows[0], views: (rows[0].views ?? 0) + 1 },
      reviews: revs.reverse(),
      related: related.filter((r) => r.id !== parseInt(id)),
    });
  } catch (e) {
    console.error(e);
    return Response.json({ error: "خطأ" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const allowed: Record<string, any> = {};
    const fields = [
      "name",
      "profession",
      "categoryId",
      "phone",
      "whatsapp",
      "location",
      "address",
      "description",
      "experienceYears",
      "verified",
      "available",
      "featured",
      "avatarEmoji",
    ];
    for (const f of fields) {
      if (body[f] !== undefined) allowed[f] = body[f];
    }
    if (Object.keys(allowed).length === 0) {
      return Response.json({ error: "لا يوجد بيانات" }, { status: 400 });
    }
    await db
      .update(craftsmen)
      .set(allowed)
      .where(eq(craftsmen.id, parseInt(id)));
    return Response.json({ success: true });
  } catch (e) {
    console.error(e);
    return Response.json({ error: "خطأ في التعديل" }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await db.delete(craftsmen).where(eq(craftsmen.id, parseInt(id)));
    return Response.json({ success: true });
  } catch (e) {
    console.error(e);
    return Response.json({ error: "خطأ في الحذف" }, { status: 500 });
  }
}
