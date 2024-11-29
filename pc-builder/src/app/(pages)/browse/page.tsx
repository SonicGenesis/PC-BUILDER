"use client";
import React, { useState, useEffect } from 'react';
import { graphicsCards } from '../../../../data/PC.GRAPHICCARDS';
import { processors } from '../../../../data/PC.PROCESSORS';
import { motherboards } from '../../../../data/PC.MOTHERBOARDS';
import { ramModules } from '../../../../data/PC.RAM';
import Image from 'next/image';
import { FiSearch, FiX, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

// Define types for different component categories
type ComponentType = 'gpu' | 'cpu' | 'motherboard' | 'ram' | 'all';

// Define filter options for each component type
type FilterValues = string[];

type FilterConfig = {
  name: string;
  filters: Record<string, FilterValues>;
};

type FilterConfigs = {
  [K in Exclude<ComponentType, 'all'>]: FilterConfig;
};

const filterConfigs: FilterConfigs = {
  gpu: {
    name: 'Graphics Cards',
    filters: {
      brand: ['NVIDIA', 'AMD', 'Intel'],
      vram: ['4GB', '6GB', '8GB', '12GB', '16GB', '24GB'],
      memoryType: ['GDDR6', 'GDDR6X'],
      powerConsumption: ['150W-250W', '250W-350W', '350W+']
    }
  },
  cpu: {
    name: 'Processors',
    filters: {
      brand: ['AMD', 'Intel'],
      cores: ['4', '6', '8', '10', '12', '16'],
      socket: ['AM4', 'AM5', 'LGA1700', 'LGA1200'],
      clockSpeed: ['3.0-3.5GHz', '3.5-4.0GHz', '4.0-4.5GHz', '4.5GHz+']
    }
  },
  ram: {
    name: 'Memory',
    filters: {
      formFactor: ['DIMM', 'RDIMM', 'SO-DIMM'],
      capacity: ['4GB', '8GB', '16GB', '32GB', '64GB'],
      speed: ['2666MHz', '3200MHz', '3600MHz', '4000MHz+'],
      features: ['RGB', 'ECC', 'Low Profile']
    }
  },
  motherboard: {
    name: 'Motherboards',
    filters: {
      formFactor: ['ATX', 'Micro-ATX', 'Mini-ITX'],
      socket: ['AM4', 'AM5', 'LGA1700', 'LGA1200'],
      chipset: ['B550', 'X570', 'Z690', 'Z790'],
      features: ['WiFi', 'Bluetooth', 'RGB']
    }
  }
};

// Define deals and promotions
const deals = [
  {
    id: 1,
    title: "Epic Games Sale",
    description: "Up to 75% off on selected titles",
    image: "/images/epic-games-sale.jpg",
    discount: "75%",
    endDate: "2024-04-30"
  },
  {
    id: 2,
    title: "Steam Spring Sale",
    description: "Massive discounts on popular games",
    image: "/images/steam-sale.jpg",
    discount: "80%",
    endDate: "2024-04-25"
  },
  // Add more deals...
];

// Define featured components
const featuredComponents = [
  {
    id: 1,
    name: "NVIDIA GeForce RTX 4090",
    type: "gpu",
    discount: "10%",
    originalPrice: 149999,
    discountedPrice: 134999,
    image: "/images/GRAPGHIC_CARD.jpg"
  },
  {
    id: 2,
    name: "AMD Ryzen 9 7950X",
    type: "cpu",
    discount: "15%",
    originalPrice: 59999,
    discountedPrice: 50999,
    image: "/images/PROCESSOR.jpg"
  },
  {
    id: 3,
    name: "G.Skill Trident Z5 RGB",
    type: "ram",
    discount: "20%",
    originalPrice: 24999,
    discountedPrice: 19999,
    image: "/images/MEMORY.jpg",
    specs: "32GB (2x16GB) DDR5-6000"
  },
  {
    id: 4,
    name: "ASUS ROG Maximus Z790 Hero",
    type: "motherboard",
    discount: "12%",
    originalPrice: 69999,
    discountedPrice: 61599,
    image: "/images/pc-build-preview.jpg"
  },
  {
    id: 5,
    name: "AMD Radeon RX 7900 XTX",
    type: "gpu",
    discount: "8%",
    originalPrice: 109999,
    discountedPrice: 101199,
    image: "/images/GRAPGHIC_CARD.jpg"
  },
  {
    id: 6,
    name: "Intel Core i9-13900K",
    type: "cpu",
    discount: "18%",
    originalPrice: 64999,
    discountedPrice: 53299,
    image: "/images/PROCESSOR.jpg"
  },
  {
    id: 7,
    name: "Corsair Dominator Platinum RGB",
    type: "ram",
    discount: "25%",
    originalPrice: 29999,
    discountedPrice: 22499,
    image: "/images/MEMORY.jpg",
    specs: "64GB (2x32GB) DDR5-5600"
  },
  {
    id: 8,
    name: "MSI MEG Z790 ACE",
    type: "motherboard",
    discount: "15%",
    originalPrice: 74999,
    discountedPrice: 63749,
    image: "/images/pc-build-preview.jpg"
  },
  {
    id: 9,
    name: "NVIDIA GeForce RTX 4080",
    type: "gpu",
    discount: "12%",
    originalPrice: 119999,
    discountedPrice: 105599,
    image: "/images/GRAPGHIC_CARD.jpg"
  }
];

// Add these helper functions at the top of the file
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

const formatIndianPrice = (price: number) => {
  const priceString = price.toString();
  const lastThree = priceString.substring(priceString.length - 3);
  const otherNumbers = priceString.substring(0, priceString.length - 3);
  const formatted = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
  return formatted + (formatted ? ',' : '') + lastThree;
};

// Define the interfaces to match your actual data structure
interface BaseComponent {
  id: string;
  name: string;
  price: number;
  company: string;
  image: string;
  type: ComponentType;
  originalPrice?: number;
}

interface GPU extends BaseComponent {
  type: 'gpu';
  vram: string;
  brand?: string;
  model?: string;
}

interface CPU extends BaseComponent {
  type: 'cpu';
  cores: number;
  threads: number;
  base_clock: string;
  turbo_clock: string;
  description: string;
}

interface RAM extends BaseComponent {
  type: 'ram';
  capacity: string;
  speed: string;
  modules: number;
}

interface Motherboard extends BaseComponent {
  type: 'motherboard';
  socket: string;
  formFactor: string;
  integration?: string;
  chipset?: string;
}

type Component = GPU | CPU | RAM | Motherboard;

// Update the component mapping with proper type assertions
const allComponents: Component[] = [
  ...graphicsCards.map(c => ({ 
    ...c, 
    type: 'gpu' as const,
    originalPrice: c.price * 1.1
  })) as GPU[],
  ...processors.map(c => ({ 
    ...c, 
    type: 'cpu' as const,
    originalPrice: c.price * 1.15
  })) as CPU[],
  ...motherboards.map(c => ({ 
    ...c, 
    type: 'motherboard' as const,
    chipset: c.integration || 'Unknown',
    originalPrice: c.price * 1.12
  })) as Motherboard[],
  ...ramModules.map(c => ({ 
    ...c, 
    type: 'ram' as const,
    originalPrice: c.price * 1.2
  })) as RAM[]
];

export default function BrowsePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<ComponentType>('all');
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  // Function to get relevant filters based on search and component type
  const getRelevantFilters = () => {
    if (selectedType === 'all') {
      if (searchTerm.toLowerCase().includes('gpu') || searchTerm.toLowerCase().includes('graphics')) {
        return filterConfigs.gpu.filters;
      } else if (searchTerm.toLowerCase().includes('cpu') || searchTerm.toLowerCase().includes('processor')) {
        return filterConfigs.cpu.filters;
      } else if (searchTerm.toLowerCase().includes('ram') || searchTerm.toLowerCase().includes('memory')) {
        return filterConfigs.ram.filters;
      } else if (searchTerm.toLowerCase().includes('motherboard')) {
        return filterConfigs.motherboard.filters;
      }
      return {};
    }
    
    // Since we know selectedType is not 'all' at this point, it must be a valid key of filterConfigs
    return filterConfigs[selectedType as Exclude<ComponentType, 'all'>].filters;
  };

  // Function to toggle filter sections
  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Function to toggle filter values
  const toggleFilter = (category: string, value: string) => {
    setActiveFilters(prev => {
      const current = prev[category] || [];
      const updated = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value];
      return {
        ...prev,
        [category]: updated
      };
    });
  };

  // Update the getFilteredComponents function with type guards
  const getFilteredComponents = () => {
    return allComponents.filter(component => {
      // Search term filter
      if (searchTerm && !component.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }

      // Component type filter
      if (selectedType !== 'all' && component.type !== selectedType) {
        return false;
      }

      // Active filters
      for (const [category, selectedValues] of Object.entries(activeFilters)) {
        if (selectedValues.length === 0) continue;

        switch (category) {
          case 'brand':
            if (!selectedValues.some(value => component.company?.includes(value))) {
              return false;
            }
            break;
          case 'vram':
            if (component.type === 'gpu' && !selectedValues.includes(component.vram)) {
              return false;
            }
            break;
          // Add more cases as needed
        }
      }

      return true;
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Search and Filter Bar */}
        <div className="flex gap-4 mb-8">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search components..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border dark:bg-gray-800 dark:border-gray-700"
            />
            <FiSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          
          {/* Component Type Selector */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as ComponentType)}
            className="px-4 py-2 rounded-lg border dark:bg-gray-800 dark:border-gray-700"
          >
            <option value="all">All Components</option>
            <option value="gpu">Graphics Cards</option>
            <option value="cpu">Processors</option>
            <option value="ram">Memory</option>
            <option value="motherboard">Motherboards</option>
          </select>
        </div>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <div className="w-64 flex-shrink-0">
            {/* Today's Deals Section */}
            <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
              <h3 className="font-semibold mb-4">Today's Deals</h3>
              {deals.slice(0, 3).map(deal => (
                <div key={deal.id} className="mb-4 last:mb-0">
                  <div className="relative h-32 mb-2 rounded-lg overflow-hidden">
                    <Image
                      src={deal.image}
                      alt={deal.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded">
                      -{deal.discount}
                    </div>
                  </div>
                  <h4 className="font-medium text-sm">{deal.title}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Ends {formatDate(deal.endDate)}
                  </p>
                </div>
              ))}
            </div>

            {/* Dynamic Filters */}
            <div className="space-y-4">
              {Object.entries(getRelevantFilters()).map(([category, values]) => (
                <div key={category} className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
                  <button
                    onClick={() => toggleSection(category)}
                    className="w-full flex justify-between items-center mb-2"
                  >
                    <span className="font-semibold capitalize">
                      {category.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    {expandedSections[category] ? <FiChevronUp /> : <FiChevronDown />}
                  </button>
                  
                  <AnimatePresence>
                    {expandedSections[category] && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="space-y-2"
                      >
                        {(values as string[]).map((value) => (
                          <label key={value} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={activeFilters[category]?.includes(value) || false}
                              onChange={() => toggleFilter(category, value)}
                              className="rounded border-gray-300 dark:border-gray-600"
                            />
                            <span className="text-sm">{value}</span>
                          </label>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Featured Components */}
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">Featured Components</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {featuredComponents.map(component => (
                  <div key={component.id} className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
                    <div className="relative h-48 mb-4">
                      <Image
                        src={component.image}
                        alt={component.name}
                        fill
                        className="object-contain"
                      />
                      <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded">
                        -{component.discount}
                      </div>
                    </div>
                    <h3 className="font-semibold mb-2">{component.name}</h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-500 line-through">
                        ₹{formatIndianPrice(component.originalPrice)}
                      </span>
                      <span className="text-lg font-bold text-green-500">
                        ₹{formatIndianPrice(component.discountedPrice)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Filtered Components */}
            <div className="mt-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">All Components</h2>
                <span className="text-sm text-gray-500">
                  {getFilteredComponents().length} items found
                </span>
              </div>
              
              {getFilteredComponents().length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-lg p-8 text-center">
                  <p className="text-gray-500 dark:text-gray-400">
                    No components found matching your criteria
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {getFilteredComponents().map((component) => (
                    <div key={component.id} className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow hover:shadow-lg transition-shadow">
                      <div className="relative h-48 mb-4">
                        <Image
                          src={component.image || '/images/placeholder.jpg'}
                          alt={component.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <div className="space-y-2">
                        <h3 className="font-semibold text-lg">{component.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {component.company}
                        </p>
                        {component.type === 'gpu' && (
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            VRAM: {component.vram}
                          </p>
                        )}
                        <div className="flex items-baseline gap-2">
                          <span className="text-lg font-bold text-green-500">
                            ₹{formatIndianPrice(component.price)}
                          </span>
                          {component.originalPrice && component.originalPrice > component.price && (
                            <>
                              <span className="text-sm text-gray-500 line-through">
                                ₹{formatIndianPrice(component.originalPrice)}
                              </span>
                              <span className="text-sm text-green-500">
                                {Math.round(((component.originalPrice - component.price) / component.originalPrice) * 100)}% off
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}