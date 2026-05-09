import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mandalas Generator",
  description: "Generador web de mandalas aleatorias con exportación PDF A4.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
