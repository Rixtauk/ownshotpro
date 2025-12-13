import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "OwnShot Pro - AI Image Enhancement",
  description: "Professional AI-powered image enhancement for interiors and more",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Gradient mesh background */}
        <div className="fixed inset-0 bg-gradient-mesh -z-10" />
        {children}
      </body>
    </html>
  );
}
