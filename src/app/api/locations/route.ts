import { db } from "@/db";
import { craftsmen } from "@/db/schema";
import { ensureSeeded } from "@/lib/seed";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

/** العناوين الموجودة فعلياً عند الحرفيين */
export async function GET() {
  try {
    await ensureSeeded();
    const rows = await db
      .select({ location: craftsmen.location })
      .from(craftsmen)
      .where(eq(craftsmen.available, true));
    const set = new Set(
      rows.map((r) => r.location.trim()).filter((l) => l.length > 0)
    );
    const locations = [...set].sort((a, b) => a.localeCompare(b, "ar"));
    return Response.json({ locations });
  } catch (e) {
    console.error(e);
    return Response.json({ locations: [] }, { status: 500 });
  }
}
