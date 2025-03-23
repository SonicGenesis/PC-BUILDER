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
      <body className={`${inter.className} bg-dark-bg text-white`}>
        <Providers>
          <div className="min-h-screen bg-gradient-to-b from-background to-dark-bg">
            <NavbarWrapper />
            <main className="pt-28 container mx-auto px-4">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}