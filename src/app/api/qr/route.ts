import QRCode from "qrcode";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const target = searchParams.get("url") || new URL(req.url).origin;
    const svg = await QRCode.toString(target, {
      type: "svg",
      margin: 1,
      width: 320,
      color: { dark: "#1a73e8", light: "#ffffff" },
      errorCorrectionLevel: "M",
    });
    return new Response(svg, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch {
    return new Response("qr error", { status: 500 });
  }
}
