import { db } from "@/db";
import { joinRequests, categories } from "@/db/schema";
import { isAdmin } from "@/lib/auth";
import { isValidEgyptPhone, normalizePhone } from "@/lib/constants";
import { desc, eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

/** الإدارة فقط: عرض الطلبات */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  if (!isAdmin(searchParams.get("pw"))) {
    return Response.json({ error: "غير مصرح" }, { status: 401 });
  }
  const rows = await db
    .select({
      id: joinRequests.id,
      name: joinRequests.name,
      phone: joinRequests.phone,
      profession: joinRequests.profession,
      categoryId: joinRequests.categoryId,
      categoryName: categories.name,
      location: joinRequests.location,
      note: joinRequests.note,
      status: joinRequests.status,
      createdAt: joinRequests.createdAt,
    })
    .from(joinRequests)
    .leftJoin(categories, eq(joinRequests.categoryId, categories.id))
    .orderBy(desc(joinRequests.createdAt));
  return Response.json({ requests: rows });
}

/** عام: المهني يرسل طلب انضمام */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, phone, profession, categoryId, location, note } = body;

    if (!name?.trim() || !phone?.trim() || !profession?.trim()) {
      return Response.json(
        { error: "الاسم ورقم الموبايل والمهنة حقول مطلوبة" },
        { status: 400 }
      );
    }
    if (!isValidEgyptPhone(phone)) {
      return Response.json(
        { error: "رقم الموبايل غير صحيح — اكتبه بالشكل 01xxxxxxxxx" },
        { status: 400 }
      );
    }

    await db.insert(joinRequests).values({
      name: name.trim(),
      phone: normalizePhone(phone),
      profession: profession.trim(),
      categoryId: categoryId ? parseInt(categoryId) : null,
      location: location?.trim() || null,
      note: note?.trim() || null,
      status: "pending",
    });

    return Response.json({ success: true });
  } catch (e) {
    console.error(e);
    return Response.json({ error: "حدث خطأ، حاول مرة أخرى" }, { status: 500 });
  }
}
