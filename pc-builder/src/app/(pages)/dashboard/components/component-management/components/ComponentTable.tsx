'use client'

import { motion } from 'framer-motion'
import { formatPrice } from '@/lib/utils'
import Pagination from './Pagination'

interface ComponentTableProps {
  items: any[]
  onEdit: (component: any) => void
  onDelete: (id: string) => void
  currentPage: number
  itemsPerPage: number
  totalItems: number
  onPageChange: (page: number) => void
}

export default function ComponentTable({ 
  items, 
  onEdit, 
  onDelete, 
  currentPage,
  itemsPerPage,
  totalItems,
  onPageChange
}: ComponentTableProps) {
  return (
    <div>
      <div className="overflow-x-auto rounded-lg border border-gray-700">
        <table className="min-w-full bg-gray-900">
          <thead>
            <tr className="bg-gray-800">
              <th className="px-6 py-3 border-b border-gray-700 text-left text-gray-200">Name</th>
              <th className="px-6 py-3 border-b border-gray-700 text-left text-gray-200">Price</th>
              <th className="px-6 py-3 border-b border-gray-700 text-left text-gray-200">Company</th>
              <th className="px-6 py-3 border-b border-gray-700 text-left text-gray-200">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {items.map((component) => (
              <tr key={component.id} className="hover:bg-gray-800">
                <td className="px-6 py-4 text-gray-200">{component.name}</td>
                <td className="px-6 py-4 text-gray-200">{formatPrice(component.price)}</td>
                <td className="px-6 py-4 text-gray-200">{component.company}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <motion.button
                      onClick={() => onEdit(component)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-yellow-600 text-white px-3 py-1 rounded hover:bg-yellow-700"
                    >
                      Edit
                    </motion.button>
                    <motion.button
                      onClick={() => onDelete(component.id)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    >
                      Delete
                    </motion.button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination
        currentPage={currentPage}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={onPageChange}
      />
    </div>
  )
} 