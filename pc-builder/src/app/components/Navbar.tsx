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
            href === '/dashboard' 
              ? 'bg-gradient-to-r from-blue-600 to-purple-600'
              : 'bg-gradient-to-r from-green-600 to-teal-600'
          } rounded-full blur-sm group-hover:blur-md transition-all ${
            isActive ? 'opacity-100 scale-110' : 'opacity-80'
          }`}></span>
          <span className={`relative px-6 py-2 rounded-full ${
            href === '/dashboard'
              ? 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600'
              : 'bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600'
          } text-white font-semibold transition-all hover:scale-105 ${
            isActive ? 'scale-105 shadow-lg ring-2 ring-white/20' : ''
          }`}>
            {children}
            {isActive && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-white"></span>
            )}
          </span>
        </Link>
      );
    }

    return (
      <Link
        href={href}
        className={`relative text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white 
          transition-all hover:scale-105 font-medium group px-4 py-2 ${
            isActive ? 'text-gray-900 dark:text-white scale-105' : ''
          }`}
      >
        <span className={`absolute inset-0 rounded-lg transition-all duration-300 group-hover:opacity-100
          ${isActive ? 'opacity-100' : 'opacity-0'}`}>
          <span className="absolute top-0 left-[20%] right-[20%] h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent"></span>
          <span className="absolute bottom-0 left-[20%] right-[20%] h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent"></span>
          <span className="absolute left-0 top-[20%] bottom-[20%] w-[2px] bg-gradient-to-b from-transparent via-blue-500 to-transparent"></span>
          <span className="absolute right-0 top-[20%] bottom-[20%] w-[2px] bg-gradient-to-b from-transparent via-blue-500 to-transparent"></span>
          <span className="absolute top-0 left-0 w-3 h-3 border-l-2 border-t-2 border-blue-500 rounded-tl"></span>
          <span className="absolute top-0 right-0 w-3 h-3 border-r-2 border-t-2 border-blue-500 rounded-tr"></span>
          <span className="absolute bottom-0 left-0 w-3 h-3 border-l-2 border-b-2 border-blue-500 rounded-bl"></span>
          <span className="absolute bottom-0 right-0 w-3 h-3 border-r-2 border-b-2 border-blue-500 rounded-br"></span>
        </span>
        {children}
      </Link>
    );
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 dark:bg-[#111827]/80 dark:border-gray-800 fixed w-full top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0 hover:scale-105 transition-transform">
            <Link href="/" className="relative w-32 h-8 block">
              <Image
                src="/images/logo.png"
                alt="PC Listing Logo"
                fill
                className="object-contain"
                priority
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
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
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all hover:scale-110 text-gray-600 dark:text-gray-300"
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
          <div className="md:hidden py-4 bg-white dark:bg-[#111827] rounded-b-2xl shadow-xl">
            <div className="flex flex-col space-y-4 p-2">
              <Link
                href="/"
                className={`relative text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white 
                  px-3 py-2 rounded-lg transition-all ${
                    isActiveRoute('/') ? 'text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800' : ''
                  }`}
              >
                {isActiveRoute('/') && (
                  <>
                    <span className="absolute top-0 left-[20%] right-[20%] h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent"></span>
                    <span className="absolute bottom-0 left-[20%] right-[20%] h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent"></span>
                    <span className="absolute left-0 top-[20%] bottom-[20%] w-[2px] bg-gradient-to-b from-transparent via-blue-500 to-transparent"></span>
                    <span className="absolute right-0 top-[20%] bottom-[20%] w-[2px] bg-gradient-to-b from-transparent via-blue-500 to-transparent"></span>
                    <span className="absolute top-0 left-0 w-2 h-2 border-l-2 border-t-2 border-blue-500 rounded-tl"></span>
                    <span className="absolute top-0 right-0 w-2 h-2 border-r-2 border-t-2 border-blue-500 rounded-tr"></span>
                    <span className="absolute bottom-0 left-0 w-2 h-2 border-l-2 border-b-2 border-blue-500 rounded-bl"></span>
                    <span className="absolute bottom-0 right-0 w-2 h-2 border-r-2 border-b-2 border-blue-500 rounded-br"></span>
                  </>
                )}
                Home
              </Link>
              <Link
                href="/dashboard"
                className={`relative text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white 
                  px-3 py-2 rounded-lg transition-all ${
                    isActiveRoute('/dashboard') ? 'text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800' : ''
                  }`}
              >
                {isActiveRoute('/dashboard') && (
                  <>
                    <span className="absolute top-0 left-[20%] right-[20%] h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent"></span>
                    <span className="absolute bottom-0 left-[20%] right-[20%] h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent"></span>
                    <span className="absolute left-0 top-[20%] bottom-[20%] w-[2px] bg-gradient-to-b from-transparent via-blue-500 to-transparent"></span>
                    <span className="absolute right-0 top-[20%] bottom-[20%] w-[2px] bg-gradient-to-b from-transparent via-blue-500 to-transparent"></span>
                    <span className="absolute top-0 left-0 w-2 h-2 border-l-2 border-t-2 border-blue-500 rounded-tl"></span>
                    <span className="absolute top-0 right-0 w-2 h-2 border-r-2 border-t-2 border-blue-500 rounded-tr"></span>
                    <span className="absolute bottom-0 left-0 w-2 h-2 border-l-2 border-b-2 border-blue-500 rounded-bl"></span>
                    <span className="absolute bottom-0 right-0 w-2 h-2 border-r-2 border-b-2 border-blue-500 rounded-br"></span>
                  </>
                )}
                Dashboard
              </Link>
              <Link
                href="/about"
                className={`relative text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white 
                  px-3 py-2 rounded-lg transition-all ${
                    isActiveRoute('/about') ? 'text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800' : ''
                  }`}
              >
                {isActiveRoute('/about') && (
                  <>
                    <span className="absolute top-0 left-[20%] right-[20%] h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent"></span>
                    <span className="absolute bottom-0 left-[20%] right-[20%] h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent"></span>
                    <span className="absolute left-0 top-[20%] bottom-[20%] w-[2px] bg-gradient-to-b from-transparent via-blue-500 to-transparent"></span>
                    <span className="absolute right-0 top-[20%] bottom-[20%] w-[2px] bg-gradient-to-b from-transparent via-blue-500 to-transparent"></span>
                    <span className="absolute top-0 left-0 w-2 h-2 border-l-2 border-t-2 border-blue-500 rounded-tl"></span>
                    <span className="absolute top-0 right-0 w-2 h-2 border-r-2 border-t-2 border-blue-500 rounded-tr"></span>
                    <span className="absolute bottom-0 left-0 w-2 h-2 border-l-2 border-b-2 border-blue-500 rounded-bl"></span>
                    <span className="absolute bottom-0 right-0 w-2 h-2 border-r-2 border-b-2 border-blue-500 rounded-br"></span>
                  </>
                )}
                About
              </Link>
              <Link
                href="/browse"
                className={`relative text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white 
                  px-3 py-2 rounded-lg transition-all ${
                    isActiveRoute('/browse') ? 'text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800' : ''
                  }`}
              >
                {isActiveRoute('/browse') && (
                  <>
                    <span className="absolute top-0 left-[20%] right-[20%] h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent"></span>
                    <span className="absolute bottom-0 left-[20%] right-[20%] h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent"></span>
                    <span className="absolute left-0 top-[20%] bottom-[20%] w-[2px] bg-gradient-to-b from-transparent via-blue-500 to-transparent"></span>
                    <span className="absolute right-0 top-[20%] bottom-[20%] w-[2px] bg-gradient-to-b from-transparent via-blue-500 to-transparent"></span>
                    <span className="absolute top-0 left-0 w-2 h-2 border-l-2 border-t-2 border-blue-500 rounded-tl"></span>
                    <span className="absolute top-0 right-0 w-2 h-2 border-r-2 border-t-2 border-blue-500 rounded-tr"></span>
                    <span className="absolute bottom-0 left-0 w-2 h-2 border-l-2 border-b-2 border-blue-500 rounded-bl"></span>
                    <span className="absolute bottom-0 right-0 w-2 h-2 border-r-2 border-b-2 border-blue-500 rounded-br"></span>
                  </>
                )}
                Browse
              </Link>
              <Link
                href="/pcBuilder"
                className={`relative text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white 
                  px-3 py-2 rounded-lg transition-all ${
                    isActiveRoute('/pcBuilder') ? 'text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800' : ''
                  }`}
              >
                {isActiveRoute('/pcBuilder') && (
                  <>
                    <span className="absolute top-0 left-[20%] right-[20%] h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent"></span>
                    <span className="absolute bottom-0 left-[20%] right-[20%] h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent"></span>
                    <span className="absolute left-0 top-[20%] bottom-[20%] w-[2px] bg-gradient-to-b from-transparent via-blue-500 to-transparent"></span>
                    <span className="absolute right-0 top-[20%] bottom-[20%] w-[2px] bg-gradient-to-b from-transparent via-blue-500 to-transparent"></span>
                    <span className="absolute top-0 left-0 w-2 h-2 border-l-2 border-t-2 border-blue-500 rounded-tl"></span>
                    <span className="absolute top-0 right-0 w-2 h-2 border-r-2 border-t-2 border-blue-500 rounded-tr"></span>
                    <span className="absolute bottom-0 left-0 w-2 h-2 border-l-2 border-b-2 border-blue-500 rounded-bl"></span>
                    <span className="absolute bottom-0 right-0 w-2 h-2 border-r-2 border-b-2 border-blue-500 rounded-br"></span>
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