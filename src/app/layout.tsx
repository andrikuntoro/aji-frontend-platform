import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aksi Protect Indonesia | Platform Agen Asuransi",
  description: "Platform komprehensif agen asuransi seluruh Indonesia untuk belajar, sharing, dan berkompetisi dalam kapabilitas menjual.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
