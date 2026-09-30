import { db } from "@/db";
import { categories, craftsmen } from "@/db/schema";
import { ensureSeeded } from "@/lib/seed";
import { isAdmin } from "@/lib/auth";
import { isValidEgyptPhone, normalizePhone } from "@/lib/constants";
import { and, desc, eq, ilike, or, sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    await ensureSeeded();
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.trim() ?? "";
    const categoryId = searchParams.get("categoryId");
    const categoryName = searchParams.get("category");
    const location = searchParams.get("location")?.trim() ?? "";
    const section = searchParams.get("section")?.trim() ?? "";
    const verifiedOnly = searchParams.get("verified") === "1";
    const sort = searchParams.get("sort") ?? "featured";
    const limit = Math.min(parseInt(searchParams.get("limit") ?? "100"), 200);

    const conditions: any[] = [eq(craftsmen.available, true)];

    // We'll fetch with join to include category info
    let query = db
      .select({
        id: craftsmen.id,
        name: craftsmen.name,
        profession: craftsmen.profession,
        categoryId: craftsmen.categoryId,
        categoryName: categories.name,
        categoryIcon: categories.icon,
        section: categories.section,
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
      .$dynamic();

    if (categoryId && categoryId !== "all") {
      conditions.push(eq(craftsmen.categoryId, parseInt(categoryId)));
    } else if (section) {
      // كل تصنيفات القسم (اللي مفيش تصنيف له يتحسب حرفة)
      conditions.push(sql`coalesce(${categories.section}, 'الحرفيين') = ${section}`);
    }
    if (categoryName && categoryName !== "الكل") {
      conditions.push(eq(categories.name, categoryName));
    }
    if (verifiedOnly) {
      conditions.push(eq(craftsmen.verified, true));
    }
    if (location && location !== "all") {
      conditions.push(ilike(craftsmen.location, `%${location}%`));
    }
    if (search) {
      conditions.push(
        or(
          ilike(craftsmen.name, `%${search}%`),
          ilike(craftsmen.profession, `%${search}%`),
          ilike(craftsmen.location, `%${search}%`),
          ilike(craftsmen.description, `%${search}%`),
          ilike(categories.name, `%${search}%`)
        )
      );
    }

    query = query.where(and(...conditions));

    // sorting
    if (sort === "rating") {
      query = query.orderBy(desc(craftsmen.rating), desc(craftsmen.ratingsCount));
    } else if (sort === "newest") {
      query = query.orderBy(desc(craftsmen.createdAt));
    } else if (sort === "views") {
      query = query.orderBy(desc(craftsmen.views));
    } else {
      query = query.orderBy(
        desc(craftsmen.featured),
        desc(craftsmen.verified),
        desc(craftsmen.rating)
      );
    }

    const rows = await query.limit(limit);
    return Response.json({ craftsmen: rows });
  } catch (e) {
    console.error(e);
    return Response.json({ craftsmen: [] }, { status: 500 });
  }
}

/** الإدارة فقط: إضافة مهني جديد */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      pw,
      name,
      profession,
      categoryId,
      categoryName,
      phone,
      whatsapp,
      location,
      address,
      description,
      experienceYears,
      verified,
      featured,
      avatarEmoji,
    } = body;

    if (!isAdmin(pw)) {
      return Response.json(
        { error: "الإضافة متاحة للإدارة فقط" },
        { status: 401 }
      );
    }

    if (!name?.trim() || !profession?.trim() || !phone?.trim()) {
      return Response.json(
        { error: "الاسم والمهنة ورقم الموبايل حقول مطلوبة" },
        { status: 400 }
      );
    }

    if (!isValidEgyptPhone(phone)) {
      return Response.json(
        { error: "رقم الموبايل غير صحيح — اكتبه بالشكل 01xxxxxxxxx" },
        { status: 400 }
      );
    }

    let finalCategoryId: number | null = categoryId ? parseInt(categoryId) : null;

    if (!finalCategoryId && categoryName) {
      const existing = await db
        .select()
        .from(categories)
        .where(eq(categories.name, categoryName));
      if (existing.length > 0) finalCategoryId = existing[0].id;
    }

    const [row] = await db
      .insert(craftsmen)
      .values({
        name: name.trim(),
        profession: profession.trim(),
        categoryId: finalCategoryId,
        phone: normalizePhone(phone),
        whatsapp: normalizePhone(whatsapp?.trim() || phone),
        location: location?.trim() || "جنزور",
        address: address?.trim() || null,
        description: description?.trim() || null,
        experienceYears: experienceYears ? parseInt(experienceYears) : 1,
        rating: 4.0,
        ratingsCount: 0,
        verified: verified !== undefined ? !!verified : true,
        available: true,
        featured: !!featured,
        avatarEmoji: avatarEmoji || "👷",
      })
      .returning();

    return Response.json({ success: true, craftsman: row });
  } catch (e) {
    console.error(e);
    return Response.json({ error: "حدث خطأ أثناء الإضافة" }, { status: 500 });
  }
}
