import { db } from "@/db";
import { contactMessages } from "@/db/schema";

export async function POST(req: Request) {
  try {
    const { name, phone, message } = await req.json();
    if (!name?.trim() || !phone?.trim() || !message?.trim()) {
      return Response.json({ error: "جميع الحقول مطلوبة" }, { status: 400 });
    }
    await db.insert(contactMessages).values({
      name: name.trim(),
      phone: phone.trim(),
      message: message.trim(),
    });
    return Response.json({ success: true });
  } catch (e) {
    console.error(e);
    return Response.json({ error: "خطأ" }, { status: 500 });
  }
}
