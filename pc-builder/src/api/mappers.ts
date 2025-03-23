import { ComponentBase } from './components';

// Type definitions matching those in the browse page
export type ComponentType = 'gpu' | 'cpu' | 'motherboard' | 'ram';

export type BaseComponent = {
  id: string;
  name: string;
  price: number;
  company: string;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  seller: string;
  availability: string;
  type: ComponentType;
};

export type GPUComponent = BaseComponent & {
  category: 'gpu';
  vram: string;
  brand: string;
  model: string;
};

export type CPUComponent = BaseComponent & {
  category: 'cpu';
  cores: number;
  threads: number;
  base_clock: string;
  turbo_clock: string;
  description: string;
};

export type RAMComponent = BaseComponent & {
  category: 'ram';
  type: string;
  capacity: string;
  speed: string;
};

export type MotherboardComponent = BaseComponent & {
  category: 'motherboard';
  socket: string;
  formFactor: string;
  integration: string;
};

export type MappedComponent = GPUComponent | CPUComponent | RAMComponent | MotherboardComponent;

export type SearchSuggestion = {
  id: string;
  name: string;
  category: ComponentType;
  image: string;
  price: number;
};

/**
 * Maps API component data to UI component format
 */
export const mapComponentData = (item: ComponentBase): MappedComponent => {
  // Prepare base component data
  const baseComponent: BaseComponent = {
    id: item._id,
    name: item.name,
    price: parseFloat(item.price),
    company: item.brand,
    image: item.imageUrl || '/images/placeholder.jpg',
    category: item.componentTypeValue.toLowerCase() as ComponentType,
    rating: item.rating || 4.0,
    reviews: item.reviewCount || 0,
    seller: item.provider?.name || "Generic Provider",
    availability: item.inStock ? "In Stock" : "Out of Stock",
    type: item.componentTypeValue.toLowerCase() as ComponentType
  };

  // Add type-specific fields
  switch (item.componentTypeValue) {
    case 'GPU':
      return {
        ...baseComponent,
        category: 'gpu',
        vram: item.specifications?.memorySize || 'N/A',
        brand: item.brand,
        model: item.model || 'Standard'
      } as GPUComponent;

    case 'CPU':
      return {
        ...baseComponent,
        category: 'cpu',
        cores: parseInt(item.specifications?.cores || '0'),
        threads: parseInt(item.specifications?.threads || '0'),
        base_clock: item.specifications?.baseClock || 'N/A',
        turbo_clock: item.specifications?.boostClock || 'N/A',
        description: item.specifications?.description || ''
      } as CPUComponent;

    case 'Motherboard':
      return {
        ...baseComponent,
        category: 'motherboard',
        socket: item.specifications?.socket || 'N/A',
        formFactor: item.specifications?.formFactor || 'N/A',
        integration: item.specifications?.chipset || 'N/A'
      } as MotherboardComponent;

    case 'RAM':
      return {
        ...baseComponent,
        category: 'ram',
        type: item.specifications?.type || 'N/A',
        capacity: item.specifications?.capacity || 'N/A',
        speed: item.specifications?.speed || 'N/A'
      } as RAMComponent;

    default:
      return baseComponent as MappedComponent;
  }
};

/**
 * Maps API search results to UI search suggestion format
 */
export const mapSearchSuggestion = (item: ComponentBase): SearchSuggestion => {
  return {
    id: item._id,
    name: item.name,
    category: item.componentTypeValue.toLowerCase() as ComponentType,
    image: item.imageUrl || '/images/placeholder.jpg',
    price: parseFloat(item.price)
  };
}; 