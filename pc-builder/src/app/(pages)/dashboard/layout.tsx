'use client'

import Sidebar from './components/Sidebar'
import Image from 'next/image'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen relative">
      {/* Main Background */}
      <div className="fixed inset-0 z-0">
        <Image 
          src="/images/bgBG.png" 
          alt="Neon Background" 
          fill 
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/85" />
      </div>
      
      {/* Dashboard Layout */}
      <div className="relative z-10 min-h-screen">
        <Sidebar />
        <div className="ml-64 pt-20">
          {children}
        </div>
      </div>
    </div>
  )
} 