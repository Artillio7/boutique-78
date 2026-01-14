import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "SAWEI - Équipements Automobiles Professionnels",
  description: "Catalogue d'équipements automobiles professionnels. Ponts élévateurs, démonte-pneus, diagnostics, cabines de peinture.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
