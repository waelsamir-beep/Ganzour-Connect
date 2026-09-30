import { db } from "@/db";
import { announcements } from "@/db/schema";
import { isAdmin } from "@/lib/auth";
import { desc, eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

/** عام: الإعلانات النشطة — أو الإدارة بكلمة المرور ترى الكل */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const pw = searchParams.get("pw");
  try {
    let query = db.select().from(announcements).$dynamic();
    if (isAdmin(pw)) {
      query = query.orderBy(desc(announcements.createdAt));
    } else {
      query = query
        .where(eq(announcements.active, true))
        .orderBy(desc(announcements.createdAt))
        .limit(5);
    }
    const rows = await query;
    return Response.json({ announcements: rows });
  } catch (e) {
    console.error(e);
    return Response.json({ announcements: [] }, { status: 500 });
  }
}

/** الإدارة: نشر إعلان جديد */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!isAdmin(body.pw)) {
      return Response.json({ error: "غير مصرح" }, { status: 401 });
    }
    const { title, message } = body;
    if (!title?.trim() || !message?.trim()) {
      return Response.json({ error: "العنوان والنص مطلوبان" }, { status: 400 });
    }
    const [row] = await db
      .insert(announcements)
      .values({ title: title.trim(), message: message.trim(), active: true })
      .returning();
    return Response.json({ success: true, announcement: row });
  } catch (e) {
    console.error(e);
    return Response.json({ error: "حدث خطأ" }, { status: 500 });
  }
}
