'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Modal from '@/app/components/Modal'
import { processors } from '../../../../data/PC.PROCESSORS'
import { graphicsCards } from '../../../../data/PC.GRAPHICCARDS'
import { motherboards } from '../../../../data/PC.MOTHERBOARDS'
import { ramModules } from '../../../../data/PC.RAM'

type ComponentType = 'CPU' | 'GPU' | 'Motherboard' | 'RAM'

interface ComponentFormData {
  id: string
  name: string
  price: number
  company: string
  image: string
  [key: string]: any // For additional dynamic fields
}

export default function DashboardPage() {
  const [selectedType, setSelectedType] = useState<ComponentType>('CPU')
  const [isEditing, setIsEditing] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5 // Number of items to show per page
  const [formData, setFormData] = useState<ComponentFormData>({
    id: '',
    name: '',
    price: 0,
    company: '',
    image: '',
  })
  const [isModalOpen, setIsModalOpen] = useState(false)

  const componentData = {
    CPU: processors,
    GPU: graphicsCards,
    Motherboard: motherboards,
    RAM: ramModules,
  }

  const handleTypeChange = (type: ComponentType) => {
    setSelectedType(type)
    setIsEditing(false)
    setCurrentPage(1)
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      id: '',
      name: '',
      price: 0,
      company: '',
      image: '',
    })
  }

  const handleEdit = (component: any) => {
    setFormData(component)
    setIsEditing(true)
  }

  const handleDelete = (id: string) => {
    // In a real app, this would make an API call
    console.log(`Deleting component with id: ${id}`)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would make an API call
    console.log('Submitting:', formData)
    resetForm()
    setIsEditing(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) : value
    }))
  }

  // Add this helper function for consistent price formatting
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price)
  }

  // Pagination logic
  const getCurrentItems = () => {
    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    return componentData[selectedType].slice(indexOfFirstItem, indexOfLastItem)
  }

  const totalPages = Math.ceil(componentData[selectedType].length / itemsPerPage)

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }

  const renderPaginationButtons = () => {
    const buttons = []
    for (let i = 1; i <= totalPages; i++) {
      buttons.push(
        <motion.button
          key={i}
          onClick={() => handlePageChange(i)}
          whileTap={{ scale: 0.8 }}
          whileHover={{ scale: 1.1 }}
          className={`px-3 py-1 rounded ${
            currentPage === i
              ? 'bg-blue-600 text-white'
              : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
          }`}
        >
          {i}
        </motion.button>
      )
    }
    return buttons
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Component Management Dashboard</h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add New Component
        </motion.button>
      </div>

      {/* Component Type Selector */}
      <div className="flex gap-4 mb-6">
        {Object.keys(componentData).map((type) => (
          <motion.button
            key={type}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleTypeChange(type as ComponentType)}
            className={`px-4 py-2 rounded ${
              selectedType === type 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
            }`}
          >
            {type}
          </motion.button>
        ))}
      </div>

      {/* Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          if (!isEditing) resetForm()
        }}
        title={isEditing ? 'Edit Component' : 'Add New Component'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-200">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full border bg-gray-800 text-white border-gray-700 rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-200">Price</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full border bg-gray-800 text-white border-gray-700 rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-200">Company</label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                className="w-full border bg-gray-800 text-white border-gray-700 rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-200">Image URL</label>
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleInputChange}
                className="w-full border bg-gray-800 text-white border-gray-700 rounded px-3 py-2"
                required
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsModalOpen(false)}
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
      </Modal>

      {/* Table section */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-900 border border-gray-700">
          <thead>
            <tr className="bg-gray-800">
              <th className="px-6 py-3 border-b border-gray-700 text-left text-gray-200">Name</th>
              <th className="px-6 py-3 border-b border-gray-700 text-left text-gray-200">Price</th>
              <th className="px-6 py-3 border-b border-gray-700 text-left text-gray-200">Company</th>
              <th className="px-6 py-3 border-b border-gray-700 text-left text-gray-200">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {getCurrentItems().map((component: any) => (
              <tr key={component.id} className="hover:bg-gray-800">
                <td className="px-6 py-4 text-gray-200">{component.name}</td>
                <td className="px-6 py-4 text-gray-200">{formatPrice(component.price)}</td>
                <td className="px-6 py-4 text-gray-200">{component.company}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(component)}
                      className="bg-yellow-600 text-white px-3 py-1 rounded hover:bg-yellow-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(component.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Updated pagination controls */}
        <div className="mt-4 flex items-center justify-between">
          <div className="text-gray-200">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, componentData[selectedType].length)} of {componentData[selectedType].length} entries
          </div>
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded ${
                currentPage === 1
                  ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
              }`}
            >
              Previous
            </motion.button>
            {renderPaginationButtons()}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded ${
                currentPage === totalPages
                  ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
              }`}
            >
              Next
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  )
}
