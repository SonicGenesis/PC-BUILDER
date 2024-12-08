'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Modal from '@/app/components/Modal'
import ComponentTable from './components/ComponentTable'
import ComponentForm from './components/ComponentForm'
import { ComponentFormData } from './types'
import { processors } from '../../../../../data/PC.PROCESSORS'
import { gpus } from '../../../../../data/PC.GPUS'
import { motherboards } from '../../../../../data/PC.MOTHERBOARDS'
import { rams } from '../../../../../data/PC.RAMS'

type ComponentType = 'CPU' | 'GPU' | 'Motherboard' | 'RAM'

export default function ComponentManagementPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [componentToDelete, setComponentToDelete] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5
  const [formData, setFormData] = useState<ComponentFormData>({
    id: '',
    name: '',
    price: 0,
    company: '',
    image: '',
  })
  const [selectedType, setSelectedType] = useState<ComponentType>('CPU')

  const componentData = {
    CPU: processors,
    GPU: gpus,
    Motherboard: motherboards,
    RAM: rams
  }

  const handleAddNew = () => {
    setIsEditing(false)
    resetForm()
    setIsModalOpen(true)
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

  const handleCloseModal = () => {
    setIsModalOpen(false)
    resetForm()
    setIsEditing(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log(isEditing ? 'Updating:' : 'Adding:', formData)
    setIsModalOpen(false)
    resetForm()
    setIsEditing(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev: ComponentFormData) => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) : value
    }))
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

  const getCurrentItems = () => {
    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    return componentData[selectedType].slice(indexOfFirstItem, indexOfLastItem)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-4">Component Management</h1>
          <div className="flex gap-2">
            {Object.keys(componentData).map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type as ComponentType)}
                className={`px-4 py-2 rounded ${
                  selectedType === type
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAddNew}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add New Component
        </motion.button>
      </div>

      <ComponentTable
        items={getCurrentItems()}
        onEdit={handleEdit}
        onDelete={handleDelete}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        totalItems={componentData[selectedType].length}
        onPageChange={handlePageChange}
      />

      {/* Modals */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={isEditing ? 'Edit Component' : 'Add New Component'}
      >
        <ComponentForm
          formData={formData}
          isEditing={isEditing}
          onSubmit={handleSubmit}
          onChange={handleInputChange}
          onCancel={handleCloseModal}
        />
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
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
              className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </motion.button>
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (componentToDelete) {
                  console.log(`Deleting component with id: ${componentToDelete}`)
                  setIsDeleteModalOpen(false)
                  setComponentToDelete(null)
                }
              }}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Delete
            </motion.button>
          </div>
        </div>
      </Modal>
    </div>
  )
} 