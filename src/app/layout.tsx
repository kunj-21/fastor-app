import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fastor",
  description: "Fastor mobile app — built from the Figma design task",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500&family=League+Spartan:wght@300;400;500;700&family=Mulish:wght@400;500;600;700&display=swap"
        />
      </head>
      <body>
        {/* 375px design canvas; the shell centres it on larger screens. */}
        <main className="mx-auto flex min-h-dvh w-full max-w-[430px] flex-col bg-white">{children}</main>
      </body>
    </html>
  );
}
