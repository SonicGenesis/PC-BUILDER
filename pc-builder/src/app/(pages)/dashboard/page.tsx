'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Modal from '@/app/components/Modal'
import { processors } from '../../../../data/PC.PROCESSORS'
import { graphicsCards } from '../../../../data/PC.GRAPHICCARDS'
import { motherboards } from '../../../../data/PC.MOTHERBOARDS'
import { ramModules } from '../../../../data/PC.RAM'
import { storage } from '@/data/storage'
import { powerSupplies } from '@/data/power-supplies'
import { cases } from '@/data/cases'
import { coolers } from '@/data/coolers'

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
  const itemsPerPage = 5 
  const [formData, setFormData] = useState<ComponentFormData>({
    id: '',
    name: '',
    price: 0,
    company: '',
    image: '',
  })
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [componentToDelete, setComponentToDelete] = useState<string | null>(null)

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
    setIsModalOpen(true)
  }

  const handleDelete = (id: string) => {
    setComponentToDelete(id)
    setIsDeleteModalOpen(true)
  }

  const confirmDelete = () => {
    if (componentToDelete) {
      // In a real app, this would make an API call
      console.log(`Deleting component with id: ${componentToDelete}`)
      setIsDeleteModalOpen(false)
      setComponentToDelete(null)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would make an API call
    console.log(isEditing ? 'Updating:' : 'Adding:', formData)
    setIsModalOpen(false)
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
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.1 }}
          className={`px-3 py-1 rounded-lg ${
            currentPage === i
              ? 'bg-neon-green/20 text-neon-green border border-neon-green shadow-neon-glow'
              : 'bg-card-bg text-white border border-neon-green/30 hover:border-neon-green/60'
          }`}
        >
          {i}
        </motion.button>
      )
    }
    return buttons
  }

  // Add this function to handle new component
  const handleAddNew = () => {
    setIsEditing(false)
    resetForm()
    setIsModalOpen(true)
  }

  return (
    <div className="px-6 pb-6">
      {/* Dashboard Content */}
      <div className="relative z-20">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold neon-text">Component Management Dashboard</h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddNew}
            className="neon-button px-4 py-2 rounded-full hover:shadow-neon-glow-lg"
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
              className={`px-4 py-2 rounded-lg ${
                selectedType === type 
                  ? 'neon-border text-neon-green shadow-neon-glow' 
                  : 'bg-card-bg text-white border border-neon-green/20 hover:border-neon-green/50'
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
            resetForm()
            setIsEditing(false)
          }}
          title={isEditing ? 'Edit Component' : 'Add New Component'}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-white">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full border bg-dark-bg text-white border-neon-green/30 rounded-lg px-3 py-2 focus:border-neon-green focus:ring-1 focus:ring-neon-green/50 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-white">Price</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="w-full border bg-dark-bg text-white border-neon-green/30 rounded-lg px-3 py-2 focus:border-neon-green focus:ring-1 focus:ring-neon-green/50 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-white">Company</label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  className="w-full border bg-dark-bg text-white border-neon-green/30 rounded-lg px-3 py-2 focus:border-neon-green focus:ring-1 focus:ring-neon-green/50 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-white">Image URL</label>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  className="w-full border bg-dark-bg text-white border-neon-green/30 rounded-lg px-3 py-2 focus:border-neon-green focus:ring-1 focus:ring-neon-green/50 focus:outline-none"
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
                className="bg-card-bg text-white px-4 py-2 rounded-lg border border-neon-green/30 hover:border-neon-green/60"
              >
                Cancel
              </motion.button>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05, boxShadow: "0 0 10px #00ff41" }}
                whileTap={{ scale: 0.95 }}
                className="neon-button px-4 py-2 rounded-lg"
              >
                {isEditing ? 'Update' : 'Add'}
              </motion.button>
            </div>
          </form>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false)
            setComponentToDelete(null)
          }}
          title="Confirm Delete"
        >
          <div className="space-y-4">
            <p className="text-gray-200">
              Are you sure you want to delete this component? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsDeleteModalOpen(false)}
                className="bg-card-bg text-white px-4 py-2 rounded-lg border border-neon-green/30 hover:border-neon-green/60"
              >
                Cancel
              </motion.button>
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={confirmDelete}
                className="bg-black text-neon-green border border-neon-green hover:bg-neon-green/20 px-4 py-2 rounded-lg shadow-neon-glow"
              >
                Delete
              </motion.button>
            </div>
          </div>
        </Modal>

        {/* Separate table and pagination */}
        <div className="flex flex-col gap-4">
          {/* Table in its own container */}
          <div className="overflow-x-auto rounded-lg border border-neon-green/30 shadow-neon-glow">
            <table className="min-w-full bg-card-bg">
              <thead>
                <tr className="bg-dark-bg">
                  <th className="px-6 py-3 border-b border-neon-green/20 text-left text-neon-green">Name</th>
                  <th className="px-6 py-3 border-b border-neon-green/20 text-left text-neon-green">Price</th>
                  <th className="px-6 py-3 border-b border-neon-green/20 text-left text-neon-green">Company</th>
                  <th className="px-6 py-3 border-b border-neon-green/20 text-left text-neon-green">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neon-green/10">
                {getCurrentItems().map((component: any) => (
                  <tr key={component.id} className="hover:bg-black/50 transition-colors">
                    <td className="px-6 py-4 text-white">{component.name}</td>
                    <td className="px-6 py-4 text-neon-green">{formatPrice(component.price)}</td>
                    <td className="px-6 py-4 text-white">{component.company}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <motion.button
                          onClick={() => handleEdit(component)}
                          whileHover={{ scale: 1.05, boxShadow: "0 0 8px #00ff41" }}
                          whileTap={{ scale: 0.95 }}
                          className="border border-neon-green/50 text-neon-green px-3 py-1 rounded-lg hover:bg-neon-green/10"
                        >
                          Edit
                        </motion.button>
                        <motion.button
                          onClick={() => handleDelete(component.id)}
                          whileHover={{ scale: 1.05, boxShadow: "0 0 8px #00ff41" }}
                          whileTap={{ scale: 0.95 }}
                          className="border border-neon-green/50 text-neon-green px-3 py-1 rounded-lg hover:bg-neon-green/10"
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

          {/* Pagination in its own container */}
          <div className="flex items-center justify-between bg-card-bg rounded-lg border border-neon-green/30 shadow-neon-glow p-4">
            <div className="text-white">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, componentData[selectedType].length)} of {componentData[selectedType].length} entries
            </div>
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-lg ${
                  currentPage === 1
                    ? 'bg-dark-bg text-gray-500 cursor-not-allowed'
                    : 'border border-neon-green/30 text-white hover:border-neon-green/60 hover:text-neon-green'
                }`}
              >
                Previous
              </motion.button>
              <div className="flex items-center gap-2">
                {renderPaginationButtons()}
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded-lg ${
                  currentPage === totalPages
                    ? 'bg-dark-bg text-gray-500 cursor-not-allowed'
                    : 'border border-neon-green/30 text-white hover:border-neon-green/60 hover:text-neon-green'
                }`}
              >
                Next
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
