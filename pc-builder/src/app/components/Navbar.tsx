"use client";

import Link from "next/link";
import { useState } from "react";
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActiveRoute = (route: string) => pathname === route;

  const NavLink = ({ href, children, special = false }: { href: string; children: React.ReactNode; special?: boolean }) => {
    const isActive = isActiveRoute(href);

    if (special) {
      return (
        <Link href={href} className="relative group">
          <span className={`absolute inset-0 ${
            isActive ? 'opacity-100 scale-110' : 'opacity-80'
          } bg-neon-green-glow rounded-full blur-sm group-hover:blur-md transition-all`}></span>
          <span className={`relative px-6 py-2 rounded-full 
            bg-card-bg border border-neon-green text-neon-green font-semibold 
            transition-all hover:scale-105 neon-glow
            ${isActive ? 'scale-105 shadow-neon-glow-lg' : ''}`}>
            {children}
            {isActive && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-neon-green"></span>
            )}
          </span>
        </Link>
      );
    }

    return (
      <Link
        href={href}
        className={`relative text-white hover:text-neon-green
          transition-all hover:scale-105 font-medium group px-4 py-2 ${
            isActive ? 'text-neon-green scale-105 neon-text' : ''
          }`}
      >
        <span className={`absolute inset-0 rounded-lg transition-all duration-300 group-hover:opacity-100
          ${isActive ? 'opacity-100' : 'opacity-0'}`}>
          <span className="absolute top-0 left-[20%] right-[20%] h-[1px] bg-gradient-to-r from-transparent via-neon-green to-transparent"></span>
          <span className="absolute bottom-0 left-[20%] right-[20%] h-[1px] bg-gradient-to-r from-transparent via-neon-green to-transparent"></span>
          <span className="absolute left-0 top-[20%] bottom-[20%] w-[1px] bg-gradient-to-b from-transparent via-neon-green to-transparent"></span>
          <span className="absolute right-0 top-[20%] bottom-[20%] w-[1px] bg-gradient-to-b from-transparent via-neon-green to-transparent"></span>
          <span className="absolute top-0 left-0 w-3 h-3 border-l-[1px] border-t-[1px] border-neon-green rounded-tl"></span>
          <span className="absolute top-0 right-0 w-3 h-3 border-r-[1px] border-t-[1px] border-neon-green rounded-tr"></span>
          <span className="absolute bottom-0 left-0 w-3 h-3 border-l-[1px] border-b-[1px] border-neon-green rounded-bl"></span>
          <span className="absolute bottom-0 right-0 w-3 h-3 border-r-[1px] border-b-[1px] border-neon-green rounded-br"></span>
        </span>
        {children}
      </Link>
    );
  };

  return (
    <nav className="fixed w-full top-4 z-50 px-4">
      <div className="max-w-7xl mx-auto bg-black/90 backdrop-blur-md neon-border-pulse rounded-xl px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0 hover:scale-105 transition-transform">
            <Link href="/" className="relative w-40 h-10 block">
              <Image
                src="/images/logoGreen.png"
                alt="PC Builder Logo"
                fill
                className="object-contain"
                priority
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-5">
            <NavLink href="/">Home</NavLink>
            <NavLink href="/dashboard" special>Dashboard</NavLink>
            <NavLink href="/about">About</NavLink>
            <NavLink href="/browse">Browse</NavLink>
            <NavLink href="/pcBuilder" special>PC Builder</NavLink>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-full hover:bg-card-bg/50 transition-all hover:scale-110 text-white border border-neon-green/40"
            >
              {!isMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 bg-dark-bg neon-border-pulse rounded-xl">
            <div className="flex flex-col space-y-4 p-4">
              <Link
                href="/"
                className={`relative text-white hover:text-neon-green
                  px-3 py-2 rounded-lg transition-all ${
                    isActiveRoute('/') ? 'text-neon-green bg-card-bg neon-text' : ''
                  }`}
              >
                {isActiveRoute('/') && (
                  <>
                    <span className="absolute top-0 left-[20%] right-[20%] h-[1px] bg-gradient-to-r from-transparent via-neon-green to-transparent"></span>
                    <span className="absolute bottom-0 left-[20%] right-[20%] h-[1px] bg-gradient-to-r from-transparent via-neon-green to-transparent"></span>
                    <span className="absolute left-0 top-[20%] bottom-[20%] w-[1px] bg-gradient-to-b from-transparent via-neon-green to-transparent"></span>
                    <span className="absolute right-0 top-[20%] bottom-[20%] w-[1px] bg-gradient-to-b from-transparent via-neon-green to-transparent"></span>
                    <span className="absolute top-0 left-0 w-2 h-2 border-l-[1px] border-t-[1px] border-neon-green rounded-tl"></span>
                    <span className="absolute top-0 right-0 w-2 h-2 border-r-[1px] border-t-[1px] border-neon-green rounded-tr"></span>
                    <span className="absolute bottom-0 left-0 w-2 h-2 border-l-[1px] border-b-[1px] border-neon-green rounded-bl"></span>
                    <span className="absolute bottom-0 right-0 w-2 h-2 border-r-[1px] border-b-[1px] border-neon-green rounded-br"></span>
                  </>
                )}
                Home
              </Link>
              <Link
                href="/dashboard"
                className={`relative text-white hover:text-neon-green
                  px-3 py-2 rounded-lg transition-all ${
                    isActiveRoute('/dashboard') ? 'text-neon-green bg-card-bg neon-text' : ''
                  }`}
              >
                {isActiveRoute('/dashboard') && (
                  <>
                    <span className="absolute top-0 left-[20%] right-[20%] h-[1px] bg-gradient-to-r from-transparent via-neon-green to-transparent"></span>
                    <span className="absolute bottom-0 left-[20%] right-[20%] h-[1px] bg-gradient-to-r from-transparent via-neon-green to-transparent"></span>
                    <span className="absolute left-0 top-[20%] bottom-[20%] w-[1px] bg-gradient-to-b from-transparent via-neon-green to-transparent"></span>
                    <span className="absolute right-0 top-[20%] bottom-[20%] w-[1px] bg-gradient-to-b from-transparent via-neon-green to-transparent"></span>
                    <span className="absolute top-0 left-0 w-2 h-2 border-l-[1px] border-t-[1px] border-neon-green rounded-tl"></span>
                    <span className="absolute top-0 right-0 w-2 h-2 border-r-[1px] border-t-[1px] border-neon-green rounded-tr"></span>
                    <span className="absolute bottom-0 left-0 w-2 h-2 border-l-[1px] border-b-[1px] border-neon-green rounded-bl"></span>
                    <span className="absolute bottom-0 right-0 w-2 h-2 border-r-[1px] border-b-[1px] border-neon-green rounded-br"></span>
                  </>
                )}
                Dashboard
              </Link>
              <Link
                href="/about"
                className={`relative text-white hover:text-neon-green
                  px-3 py-2 rounded-lg transition-all ${
                    isActiveRoute('/about') ? 'text-neon-green bg-card-bg neon-text' : ''
                  }`}
              >
                {isActiveRoute('/about') && (
                  <>
                    <span className="absolute top-0 left-[20%] right-[20%] h-[1px] bg-gradient-to-r from-transparent via-neon-green to-transparent"></span>
                    <span className="absolute bottom-0 left-[20%] right-[20%] h-[1px] bg-gradient-to-r from-transparent via-neon-green to-transparent"></span>
                    <span className="absolute left-0 top-[20%] bottom-[20%] w-[1px] bg-gradient-to-b from-transparent via-neon-green to-transparent"></span>
                    <span className="absolute right-0 top-[20%] bottom-[20%] w-[1px] bg-gradient-to-b from-transparent via-neon-green to-transparent"></span>
                    <span className="absolute top-0 left-0 w-2 h-2 border-l-[1px] border-t-[1px] border-neon-green rounded-tl"></span>
                    <span className="absolute top-0 right-0 w-2 h-2 border-r-[1px] border-t-[1px] border-neon-green rounded-tr"></span>
                    <span className="absolute bottom-0 left-0 w-2 h-2 border-l-[1px] border-b-[1px] border-neon-green rounded-bl"></span>
                    <span className="absolute bottom-0 right-0 w-2 h-2 border-r-[1px] border-b-[1px] border-neon-green rounded-br"></span>
                  </>
                )}
                About
              </Link>
              <Link
                href="/browse"
                className={`relative text-white hover:text-neon-green
                  px-3 py-2 rounded-lg transition-all ${
                    isActiveRoute('/browse') ? 'text-neon-green bg-card-bg neon-text' : ''
                  }`}
              >
                {isActiveRoute('/browse') && (
                  <>
                    <span className="absolute top-0 left-[20%] right-[20%] h-[1px] bg-gradient-to-r from-transparent via-neon-green to-transparent"></span>
                    <span className="absolute bottom-0 left-[20%] right-[20%] h-[1px] bg-gradient-to-r from-transparent via-neon-green to-transparent"></span>
                    <span className="absolute left-0 top-[20%] bottom-[20%] w-[1px] bg-gradient-to-b from-transparent via-neon-green to-transparent"></span>
                    <span className="absolute right-0 top-[20%] bottom-[20%] w-[1px] bg-gradient-to-b from-transparent via-neon-green to-transparent"></span>
                    <span className="absolute top-0 left-0 w-2 h-2 border-l-[1px] border-t-[1px] border-neon-green rounded-tl"></span>
                    <span className="absolute top-0 right-0 w-2 h-2 border-r-[1px] border-t-[1px] border-neon-green rounded-tr"></span>
                    <span className="absolute bottom-0 left-0 w-2 h-2 border-l-[1px] border-b-[1px] border-neon-green rounded-bl"></span>
                    <span className="absolute bottom-0 right-0 w-2 h-2 border-r-[1px] border-b-[1px] border-neon-green rounded-br"></span>
                  </>
                )}
                Browse
              </Link>
              <Link
                href="/pcBuilder"
                className={`relative text-white hover:text-neon-green
                  px-3 py-2 rounded-lg transition-all ${
                    isActiveRoute('/pcBuilder') ? 'text-neon-green bg-card-bg neon-text' : ''
                  }`}
              >
                {isActiveRoute('/pcBuilder') && (
                  <>
                    <span className="absolute top-0 left-[20%] right-[20%] h-[1px] bg-gradient-to-r from-transparent via-neon-green to-transparent"></span>
                    <span className="absolute bottom-0 left-[20%] right-[20%] h-[1px] bg-gradient-to-r from-transparent via-neon-green to-transparent"></span>
                    <span className="absolute left-0 top-[20%] bottom-[20%] w-[1px] bg-gradient-to-b from-transparent via-neon-green to-transparent"></span>
                    <span className="absolute right-0 top-[20%] bottom-[20%] w-[1px] bg-gradient-to-b from-transparent via-neon-green to-transparent"></span>
                    <span className="absolute top-0 left-0 w-2 h-2 border-l-[1px] border-t-[1px] border-neon-green rounded-tl"></span>
                    <span className="absolute top-0 right-0 w-2 h-2 border-r-[1px] border-t-[1px] border-neon-green rounded-tr"></span>
                    <span className="absolute bottom-0 left-0 w-2 h-2 border-l-[1px] border-b-[1px] border-neon-green rounded-bl"></span>
                    <span className="absolute bottom-0 right-0 w-2 h-2 border-r-[1px] border-b-[1px] border-neon-green rounded-br"></span>
                  </>
                )}
                PC Builder
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}