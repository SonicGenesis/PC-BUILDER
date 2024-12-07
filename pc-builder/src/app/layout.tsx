import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NavbarWrapper from './components/NavbarWrapper'
import Providers from './components/Providers'

const inter = Inter({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: "PC Builder",
  description: "Build your perfect PC with our AI-powered assistant",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <NavbarWrapper />
          {children}
        </Providers>
      </body>
    </html>
  );
}