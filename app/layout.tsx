import type { Metadata, Viewport } from "next";
import "@fontsource-variable/archivo/wdth.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "paltahaus · Paltas Hass de La Cruz, al por mayor y al detalle",
  description: "Del árbol a tu mesa. Paltas Hass de La Cruz, región de Valparaíso. Contáctanos para precios minorista y mayorista.",
};

export const viewport: Viewport = { themeColor: "#eaf1e4" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-CL">
      <body>{children}</body>
    </html>
  );
}
