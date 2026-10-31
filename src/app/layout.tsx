import type { Metadata, Viewport } from "next";
import { Literata, Public_Sans } from "next/font/google";
import "./globals.css";

const publicSans = Public_Sans({
  subsets: ["latin"],
  variable: "--font-public-sans",
});
const literata = Literata({ subsets: ["latin"], variable: "--font-literata" });

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://dolarbna.vercel.app";
const TITLE = "Dólar BNA: cotización de divisa y billete";
const DESCRIPTION =
  "Cotización del dólar divisa y billete del Banco de la Nación Argentina, con historial desde 2020, gráfico de evolución y variación diaria.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  authors: [{ name: "CallvúTech", url: "https://www.callvutech.com.ar" }],
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: "/",
    siteName: "Dólar BNA",
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#18202e" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es-AR" className={`${publicSans.variable} ${literata.variable}`}>
      <body>{children}</body>
    </html>
  );
}
