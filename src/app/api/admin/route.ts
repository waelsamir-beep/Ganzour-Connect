import { db } from "@/db";
import { categories, craftsmen, contactMessages } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { ensureSeeded } from "@/lib/seed";

export const dynamic = "force-dynamic";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "janzour123";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const pw = searchParams.get("pw");
  if (pw !== ADMIN_PASSWORD) {
    return Response.json({ error: "كلمة المرور غير صحيحة" }, { status: 401 });
  }
  try {
    await ensureSeeded();
    const all = await db
      .select({
        id: craftsmen.id,
        name: craftsmen.name,
        profession: craftsmen.profession,
        categoryId: craftsmen.categoryId,
        categoryName: categories.name,
        phone: craftsmen.phone,
        location: craftsmen.location,
        rating: craftsmen.rating,
        ratingsCount: craftsmen.ratingsCount,
        views: craftsmen.views,
        verified: craftsmen.verified,
        available: craftsmen.available,
        featured: craftsmen.featured,
        createdAt: craftsmen.createdAt,
      })
      .from(craftsmen)
      .leftJoin(categories, eq(craftsmen.categoryId, categories.id))
      .orderBy(desc(craftsmen.createdAt));
    const cats = await db.select().from(categories);
    const msgs = await db
      .select()
      .from(contactMessages)
      .orderBy(desc(contactMessages.createdAt))
      .limit(50);
    return Response.json({ craftsmen: all, categories: cats, messages: msgs });
  } catch (e) {
    console.error(e);
    return Response.json({ error: "خطأ" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { password } = await req.json();
    if (password === ADMIN_PASSWORD) return Response.json({ success: true });
    return Response.json({ error: "كلمة المرور غير صحيحة" }, { status: 401 });
  } catch {
    return Response.json({ error: "خطأ" }, { status: 500 });
  }
}
