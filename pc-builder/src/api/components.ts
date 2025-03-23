import { apiClient, ApiResponse } from './client';

// Define types for component data from the API
export type ComponentBase = {
  _id: string;
  name: string;
  price: string;
  brand: string;
  model?: string;
  imageUrl?: string;
  componentTypeValue: string;
  specifications: Record<string, any>;
  rating?: number;
  reviewCount?: number;
  inStock?: boolean;
  provider?: {
    name: string;
    _id: string;
  }
};

// Development environment flag
const isDevelopment = process.env.NODE_ENV === 'development';

// Mock data for development environment
const mockCPUs: ComponentBase[] = [
  {
    _id: 'cpu1',
    name: 'Intel Core i9-13900K',
    price: '58999',
    brand: 'Intel',
    imageUrl: '/images/products/cpu-intel-13900k.png',
    componentTypeValue: 'CPU',
    specifications: {
      cores: '24',
      threads: '32',
      baseClock: '3.0 GHz',
      boostClock: '5.8 GHz',
      socket: 'LGA 1700'
    },
    rating: 4.8,
    reviewCount: 156,
    inStock: true,
    provider: {
      name: 'Amazon',
      _id: 'provider1'
    }
  },
  {
    _id: 'cpu2',
    name: 'AMD Ryzen 9 7950X',
    price: '57499',
    brand: 'AMD',
    imageUrl: '/images/products/cpu-amd-7950x.png',
    componentTypeValue: 'CPU',
    specifications: {
      cores: '16',
      threads: '32',
      baseClock: '4.5 GHz',
      boostClock: '5.7 GHz',
      socket: 'AM5'
    },
    rating: 4.7,
    reviewCount: 124,
    inStock: true,
    provider: {
      name: 'Newegg',
      _id: 'provider2'
    }
  }
];

const mockGPUs: ComponentBase[] = [
  {
    _id: 'gpu1',
    name: 'NVIDIA GeForce RTX 4090',
    price: '179999',
    brand: 'NVIDIA',
    model: 'Founders Edition',
    imageUrl: '/images/products/gpu-rtx-4090.png',
    componentTypeValue: 'GPU',
    specifications: {
      memorySize: '24GB',
      memoryType: 'GDDR6X',
      coreClock: '2.23 GHz',
      boostClock: '2.52 GHz',
      tdp: '450W'
    },
    rating: 4.9,
    reviewCount: 87,
    inStock: true,
    provider: {
      name: 'BestBuy',
      _id: 'provider3'
    }
  },
  {
    _id: 'gpu2',
    name: 'AMD Radeon RX 7900 XTX',
    price: '124999',
    brand: 'AMD',
    imageUrl: '/images/products/gpu-amd-7900xtx.png',
    componentTypeValue: 'GPU',
    specifications: {
      memorySize: '24GB',
      memoryType: 'GDDR6',
      coreClock: '1.9 GHz',
      boostClock: '2.5 GHz',
      tdp: '355W'
    },
    rating: 4.6,
    reviewCount: 62,
    inStock: true,
    provider: {
      name: 'Amazon',
      _id: 'provider1'
    }
  }
];

const mockMotherboards: ComponentBase[] = [
  {
    _id: 'mb1',
    name: 'ASUS ROG Maximus Z790 Hero',
    price: '62999',
    brand: 'ASUS',
    imageUrl: '/images/products/mb-asus-z790.png',
    componentTypeValue: 'Motherboard',
    specifications: {
      socket: 'LGA 1700',
      formFactor: 'ATX',
      chipset: 'Intel Z790',
      memorySlots: '4',
      maxMemory: '128GB'
    },
    rating: 4.8,
    reviewCount: 52,
    inStock: true,
    provider: {
      name: 'Newegg',
      _id: 'provider2'
    }
  }
];

const mockRAM: ComponentBase[] = [
  {
    _id: 'ram1',
    name: 'Corsair Vengeance RGB Pro 32GB',
    price: '13999',
    brand: 'Corsair',
    imageUrl: '/images/products/ram-corsair.png',
    componentTypeValue: 'RAM',
    specifications: {
      capacity: '32GB (2x16GB)',
      speed: 'DDR4-3600MHz',
      type: 'DDR4',
      timing: 'CL18',
      voltage: '1.35V'
    },
    rating: 4.7,
    reviewCount: 218,
    inStock: true,
    provider: {
      name: 'Amazon',
      _id: 'provider1'
    }
  }
];

// All mock data by component type
const mockData: Record<string, ComponentBase[]> = {
  'CPU': mockCPUs,
  'GPU': mockGPUs,
  'Motherboard': mockMotherboards,
  'RAM': mockRAM
};

export type SearchParams = {
  limit?: string;
  page?: string;
  sort?: string;
  brand?: string;
  priceMin?: string;
  priceMax?: string;
};

// Create a mock response function
const createMockResponse = <T>(data: T): Promise<ApiResponse<T>> => {
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      resolve({
        success: true,
        data,
        message: 'Mock data retrieved successfully',
        pagination: {
          total: Array.isArray(data) ? data.length : 1,
          page: 1,
          limit: 100,
          pages: 1
        }
      });
    }, 800); // Simulate a typical API response time
  });
};

export const componentService = {
  /**
   * Get all components of a specific type
   */
  getAllByType: <T>(type: string, params?: SearchParams): Promise<ApiResponse<T>> => {
    // Use mock data in development if enabled
    if (isDevelopment) {
      const mockComponents = mockData[type] || [];
      return createMockResponse(mockComponents as unknown as T);
    }
    
    return apiClient.get<T>(`/api/public/components/${type}`, false, params);
  },
  
  /**
   * Get all component types
   */
  getComponentTypes: (): Promise<ApiResponse<string[]>> => {
    if (isDevelopment) {
      return createMockResponse(['CPU', 'GPU', 'Motherboard', 'RAM']);
    }
    
    return apiClient.get<string[]>('/api/public/component-types', false);
  },
  
  /**
   * Get all products (components) with optional filters
   */
  getAllProducts: <T>(params?: SearchParams & { componentType?: string }): Promise<ApiResponse<T>> => {
    if (isDevelopment) {
      let allMockComponents: ComponentBase[] = [];
      
      // If componentType is specified, only return that type
      if (params?.componentType) {
        allMockComponents = mockData[params.componentType] || [];
      } else {
        // Otherwise, return all components
        Object.values(mockData).forEach(components => {
          allMockComponents = [...allMockComponents, ...components];
        });
      }
      
      return createMockResponse(allMockComponents as unknown as T);
    }
    
    return apiClient.get<T>('/api/public/products', false, params);
  },
  
  /**
   * Get a single component by ID
   */
  getById: <T>(type: string, id: string): Promise<ApiResponse<T>> => {
    if (isDevelopment) {
      const component = mockData[type]?.find(comp => comp._id === id);
      return createMockResponse(component as unknown as T);
    }
    
    return apiClient.get<T>(`/api/public/components/${type}/${id}`, false);
  },
  
  /**
   * Search components using AI
   */
  searchWithAI: <T>(query: string): Promise<ApiResponse<T>> => {
    if (isDevelopment) {
      // Simple mock search across all components
      const allComponents = Object.values(mockData).flat();
      const results = allComponents.filter(comp => 
        comp.name.toLowerCase().includes(query.toLowerCase()) ||
        comp.brand.toLowerCase().includes(query.toLowerCase())
      );
      
      return createMockResponse(results as unknown as T);
    }
    
    return apiClient.get<T>(`/api/ai/search`, false, { query });
  },
  
  /**
   * Create a new component (requires authentication)
   */
  create: <T>(type: string, data: any): Promise<ApiResponse<T>> => {
    return apiClient.post<T>(`/api/protected/components/${type}`, data, true);
  },
  
  /**
   * Update a component (requires authentication)
   */
  update: <T>(type: string, id: string, data: any): Promise<ApiResponse<T>> => {
    return apiClient.put<T>(`/api/protected/components/${type}/${id}`, data, true);
  },
  
  /**
   * Delete a component (requires authentication)
   */
  delete: (type: string, id: string): Promise<ApiResponse<null>> => {
    return apiClient.delete<null>(`/api/protected/components/${type}/${id}`, true);
  },
  
  /**
   * Get purchase URLs for a specific product using AI
   */
  getProductUrls: <T>(productName: string, specifications?: Record<string, string>): Promise<ApiResponse<T>> => {
    if (isDevelopment) {
      return createMockResponse({
        urls: [
          { retailer: 'Amazon', url: 'https://amazon.com/product', price: '$599.99' },
          { retailer: 'Newegg', url: 'https://newegg.com/product', price: '$579.99' },
          { retailer: 'BestBuy', url: 'https://bestbuy.com/product', price: '$609.99' }
        ]
      } as unknown as T);
    }
    
    const params: Record<string, string> = { 
      productName 
    };
    
    if (specifications) {
      params.specifications = JSON.stringify(specifications);
    }
    
    return apiClient.get<T>('/api/ai/product-urls', true, params);
  }
}; 