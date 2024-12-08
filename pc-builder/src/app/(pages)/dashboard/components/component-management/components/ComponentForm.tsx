'use client'

import { motion } from 'framer-motion'
import { ComponentFormData } from '../types'

interface ComponentFormProps {
  formData: ComponentFormData
  isEditing: boolean
  onSubmit: (e: React.FormEvent) => void
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onCancel: () => void
}

export default function ComponentForm({
  formData,
  isEditing,
  onSubmit,
  onChange,
  onCancel
}: ComponentFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-200">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={onChange}
            className="w-full border bg-gray-800 text-white border-gray-700 rounded px-3 py-2"
            required
          />
        </div>
        {/* Other form fields... */}
      </div>
      <div className="flex justify-end gap-2">
        <motion.button
          type="button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onCancel}
          className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Cancel
        </motion.button>
        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {isEditing ? 'Update' : 'Add'}
        </motion.button>
      </div>
    </form>
  )
} 