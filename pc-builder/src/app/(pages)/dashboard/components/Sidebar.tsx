'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

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

  return (
    <div className="w-64 bg-gray-900 h-full fixed left-0 top-20 border-r border-gray-700">
      <nav className="p-4">
        {menuItems.map((section) => (
          <div key={section.title} className="mb-6">
            <h2 className="text-gray-400 text-sm font-semibold mb-2">{section.title}</h2>
            <ul className="space-y-1">
              {section.items.map((item) => (
                <li key={item}>
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
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </div>
  )
} 