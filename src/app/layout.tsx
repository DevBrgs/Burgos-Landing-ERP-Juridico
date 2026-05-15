import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Burgos & Asociados | Estudio Jurídico en Buenos Aires",
  description:
    "Estudio jurídico integral en CABA con más de 20 años de experiencia. Derecho civil, comercial, laboral, penal y familia. Consulta inicial sin cargo.",
  keywords: [
    "estudio jurídico Buenos Aires",
    "abogados CABA",
    "derecho civil",
    "derecho laboral",
    "derecho penal",
    "derecho de familia",
    "derecho comercial",
    "Burgos & Asociados",
    "abogado Buenos Aires",
    "consulta legal",
  ],
  openGraph: {
    title: "Burgos & Asociados | Estudio Jurídico",
    description:
      "Estudio jurídico integral en Buenos Aires. Más de 20 años de experiencia. Consulta inicial sin cargo.",
    type: "website",
    locale: "es_AR",
    siteName: "Burgos & Asociados",
  },
  twitter: {
    card: "summary_large_image",
    title: "Burgos & Asociados | Estudio Jurídico",
    description: "Soluciones legales integrales en Buenos Aires.",
  },
  alternates: {
    canonical: "https://erplandingburgos.vercel.app",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} h-full antialiased`}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#c9a84c" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="apple-touch-icon" href="/logo-burgos.png" />
      </head>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
