'use client'

import { motion } from 'framer-motion'
import { ComponentFormData } from '../types'
import { ChangeEvent } from 'react'

interface ComponentFormProps {
  formData: ComponentFormData
  isEditing: boolean
  onSubmit: (e: React.FormEvent) => void
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
  onCancel: () => void
  componentType: 'CPU' | 'GPU' | 'Motherboard' | 'RAM'
}

const componentFields = {
  CPU: [
    { name: 'name', label: 'Name', type: 'text' },
    { name: 'price', label: 'Price', type: 'number' },
    { name: 'company', label: 'Company', type: 'text' },
    { name: 'cores', label: 'Cores', type: 'number' },
    { name: 'threads', label: 'Threads', type: 'number' },
    { name: 'base_clock', label: 'Base Clock (GHz)', type: 'text' },
    { name: 'turbo_clock', label: 'Turbo Clock (GHz)', type: 'text' },
    { name: 'description', label: 'Description', type: 'textarea' },
    { name: 'image', label: 'Image URL', type: 'url' }
  ],
  GPU: [
    { name: 'name', label: 'Name', type: 'text' },
    { name: 'price', label: 'Price', type: 'number' },
    { name: 'company', label: 'Company', type: 'text' },
    { name: 'brand', label: 'Brand', type: 'text' },
    { name: 'model', label: 'Model', type: 'text' },
    { name: 'vram', label: 'VRAM', type: 'text' },
    { name: 'image', label: 'Image URL', type: 'url' }
  ],
  Motherboard: [
    { name: 'name', label: 'Name', type: 'text' },
    { name: 'price', label: 'Price', type: 'number' },
    { name: 'company', label: 'Company', type: 'text' },
    { name: 'integration', label: 'Integration', type: 'select', options: ['Intel', 'AMD'] },
    { name: 'socket', label: 'Socket', type: 'text' },
    { name: 'formFactor', label: 'Form Factor', type: 'select', options: ['ATX', 'Micro-ATX', 'E-ATX'] },
    { name: 'image', label: 'Image URL', type: 'url' }
  ],
  RAM: [
    { name: 'name', label: 'Name', type: 'text' },
    { name: 'price', label: 'Price', type: 'number' },
    { name: 'company', label: 'Company', type: 'text' },
    { name: 'capacity', label: 'Capacity', type: 'text' },
    { name: 'speed', label: 'Speed', type: 'text' },
    { name: 'type', label: 'Type', type: 'select', options: ['DDR4', 'DDR5'] },
    { name: 'image', label: 'Image URL', type: 'url' }
  ]
}

export default function ComponentForm({
  formData,
  isEditing,
  onSubmit,
  onChange,
  onCancel,
  componentType
}: ComponentFormProps) {
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    const finalValue = e.target.type === 'number' ? parseFloat(value) : value
    onChange(e)
  }

  const renderField = (field: any) => {
    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            name={field.name}
            value={formData[field.name] || ''}
            onChange={handleInputChange}
            className="w-full border bg-gray-800 text-white border-gray-700 rounded px-3 py-2 h-24"
            required
          />
        )
      case 'select':
        return (
          <select
            name={field.name}
            value={formData[field.name] || ''}
            onChange={handleInputChange}
            className="w-full border bg-gray-800 text-white border-gray-700 rounded px-3 py-2"
            required
          >
            <option value="">Select {field.label}</option>
            {field.options.map((option: string) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        )
      default:
        return (
          <input
            type={field.type}
            name={field.name}
            value={formData[field.name] || ''}
            onChange={handleInputChange}
            className="w-full border bg-gray-800 text-white border-gray-700 rounded px-3 py-2"
            required
            step={field.type === 'number' ? 'any' : undefined}
          />
        )
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {componentFields[componentType].map((field) => (
          <div key={field.name} className={field.type === 'textarea' ? 'col-span-2' : ''}>
            <label className="block text-sm font-medium mb-1 text-gray-200">
              {field.label}
            </label>
            {renderField(field)}
          </div>
        ))}
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