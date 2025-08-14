// app/layout.tsx
import "@/styles/global.css";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Providers from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DocuFam",
  description: "Your trusted family document manager",
  applicationName: "DocuFam",
  authors: [{ name: "DocuFam" }],
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#2CA6A4", // Your teal brand color instead
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        {/* Removed bg-gray-50 text-gray-900 - let global.css handle this */}
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
