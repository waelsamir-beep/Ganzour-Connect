import { db } from "@/db";
import { craftsmen, reviews } from "@/db/schema";
import { avg, count, eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const rows = await db
    .select()
    .from(reviews)
    .where(eq(reviews.craftsmanId, parseInt(id)));
  return Response.json({ reviews: rows.reverse() });
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { reviewerName, rating, comment } = body;
    if (!reviewerName?.trim() || !rating) {
      return Response.json({ error: "الاسم والتقييم مطلوبان" }, { status: 400 });
    }
    const r = Math.max(1, Math.min(5, parseInt(rating)));
    await db.insert(reviews).values({
      craftsmanId: parseInt(id),
      reviewerName: reviewerName.trim(),
      rating: r,
      comment: comment?.trim() || null,
    });
    // recompute rating
    const agg = await db
      .select({ avg: avg(reviews.rating), cnt: count() })
      .from(reviews)
      .where(eq(reviews.craftsmanId, parseInt(id)));
    const avgVal = agg[0]?.avg ? parseFloat(String(agg[0].avg)) : r;
    const cntVal = agg[0]?.cnt ?? 1;
    // blend with existing base to keep stable
    const existing = await db
      .select()
      .from(craftsmen)
      .where(eq(craftsmen.id, parseInt(id)));
    if (existing.length > 0) {
      const base = existing[0].ratingsCount ?? 0;
      // if base large, compute weighted
      const newCount = base + 1;
      const oldRating = existing[0].rating ?? 4;
      const newRating =
        base > 10
          ? (oldRating * base + r) / newCount
          : avgVal;
      await db
        .update(craftsmen)
        .set({
          rating: Math.round(newRating * 10) / 10,
          ratingsCount: newCount,
        })
        .where(eq(craftsmen.id, parseInt(id)));
    }
    return Response.json({ success: true });
  } catch (e) {
    console.error(e);
    return Response.json({ error: "خطأ" }, { status: 500 });
  }
}
