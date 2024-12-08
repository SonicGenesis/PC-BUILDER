'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const menuItems = [
  {
    title: 'Core Components',
    items: ['Component Management', 'Category Management', 'Bulk Operations'],
    path: '/dashboard/components'
  },
  {
    title: 'Price & Compatibility',
    items: ['Price Tracking', 'Compatibility Rules', 'Price Alerts'],
    path: '/dashboard/price-compatibility'
  },
  {
    title: 'Build Analytics',
    items: ['Build Tracking', 'Performance Metrics', 'Popular Builds'],
    path: '/dashboard/analytics'
  },
  {
    title: 'User Management',
    items: ['User Profiles', 'Access Control', 'Activity Logs'],
    path: '/dashboard/users'
  }
]

export default function Sidebar() {
  const pathname = usePathname()
  const [expandedSections, setExpandedSections] = useState<string[]>(menuItems.map(item => item.title))

  const toggleSection = (title: string) => {
    setExpandedSections(prev => 
      prev.includes(title) 
        ? prev.filter(t => t !== title)
        : [...prev, title]
    )
  }

  return (
    <div className="w-64 bg-gray-900 h-full fixed left-0 top-20 border-r border-gray-700">
      <nav className="p-4">
        {menuItems.map((section) => (
          <div key={section.title} className="mb-6">
            <button
              onClick={() => toggleSection(section.title)}
              className="w-full flex items-center justify-between text-gray-400 hover:text-gray-200 text-sm font-semibold mb-2 group"
            >
              <span>{section.title}</span>
              <motion.svg
                animate={{ rotate: expandedSections.includes(section.title) ? 180 : 0 }}
                className="w-4 h-4 transition-transform group-hover:text-gray-200"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </motion.svg>
            </button>
            <AnimatePresence>
              {expandedSections.includes(section.title) && (
                <motion.ul
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-1 overflow-hidden"
                >
                  {section.items.map((item) => (
                    <motion.li
                      key={item}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: -20, opacity: 0 }}
                    >
                      <Link href={`${section.path}/${item.toLowerCase().replace(/\s+/g, '-')}`}>
                        <motion.div
                          whileHover={{ x: 4 }}
                          className={`px-4 py-2 rounded-lg text-sm ${
                            pathname.includes(item.toLowerCase().replace(/\s+/g, '-'))
                              ? 'bg-blue-600 text-white'
                              : 'text-gray-300 hover:bg-gray-800'
                          }`}
                        >
                          {item}
                        </motion.div>
                      </Link>
                    </motion.li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
        ))}
      </nav>
    </div>
  )
} 