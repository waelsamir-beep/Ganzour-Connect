import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import PwaProvider from "@/components/PwaProvider";
import InstallBanner from "@/components/InstallBanner";
import SiteFooter from "@/components/SiteFooter";
import ThemeToggle from "@/components/ThemeToggle";

const APP_NAME = "دليل المهن - جنزور";
const APP_DESC =
  "تطبيق دليل المهن جنزور — أرقام موثوقة للحرفيين والمهنيين: كهرباء، سباكة، نجارة، دهانات، بناء، ميكانيكا، تنظيف والمزيد. مجاني ويشتغل بدون إنترنت.";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${APP_NAME} | أرقام موثوقة للحرفيين`,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESC,
  applicationName: APP_NAME,
  manifest: "/manifest.json",
  keywords: [
    "جنزور",
    "دليل المهن",
    "حرفيين جنزور",
    "كهربائي جنزور",
    "سباك جنزور",
    "نجار جنزور",
    "ليبيا",
    "طرابلس",
  ],
  icons: {
    icon: [
      { url: "/favicon.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/icons/icon-180.png", sizes: "180x180" }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "مهن جنزور",
  },
  formatDetection: { telephone: true },
  openGraph: {
    type: "website",
    locale: "ar_LY",
    siteName: APP_NAME,
    title: APP_NAME,
    description: APP_DESC,
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: APP_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: APP_NAME,
    description: APP_DESC,
    images: ["/og-image.png"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: "#1a73e8",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(localStorage.getItem("janzour_theme")==="dark")document.documentElement.classList.add("dark")}catch(e){}`,
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800;900&family=Tajawal:wght@400;500;700;800;900&display=swap"
          rel="stylesheet"
        />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="مهن جنزور" />
      </head>
      <body className="bg-[#eef2f7] dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased">
        <PwaProvider>
          <ThemeToggle />
          {children}
          <SiteFooter />
          <InstallBanner />
        </PwaProvider>
      </body>
    </html>
  );
}
