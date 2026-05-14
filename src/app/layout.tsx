import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Burgos & Asociados | Estudio Jurídico",
  description:
    "Estudio jurídico integral con más de 20 años de experiencia. Derecho civil, comercial, laboral, penal y familia.",
  keywords: [
    "estudio jurídico",
    "abogados",
    "Buenos Aires",
    "derecho civil",
    "derecho laboral",
    "derecho penal",
    "Burgos & Asociados",
  ],
  openGraph: {
    title: "Burgos & Asociados | Estudio Jurídico",
    description:
      "Estudio jurídico integral con más de 20 años de experiencia.",
    type: "website",
    locale: "es_AR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
