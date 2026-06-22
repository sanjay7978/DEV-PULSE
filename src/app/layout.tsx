import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dev Pulse",
  description: "AI-powered GitHub developer profile analysis",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
