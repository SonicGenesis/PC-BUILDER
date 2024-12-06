import { ComponentRecommendation } from "../types/recommendations";

export const PURPOSE_RECOMMENDATIONS: Record<string, ComponentRecommendation[]> = {
    gaming: [
      { 
        type: 'gpu', 
        minPrice: 50000,    // Updated minimum price
        maxPrice: 200000,   // Updated maximum price for high-end GPUs
        percentage: 40,     // 40% of budget
        priority: 1 
      },
      { 
        type: 'cpu', 
        minPrice: 30000,    // Updated for better CPUs
        maxPrice: 100000,   // Updated for high-end CPUs
        percentage: 25, 
        priority: 2 
      },
      { 
        type: 'motherboard', 
        minPrice: 15000,    // Updated for better motherboards
        maxPrice: 50000,    // Updated for high-end motherboards
        percentage: 20, 
        priority: 3 
      },
      { 
        type: 'ram', 
        minPrice: 10000,    // Updated for better RAM
        maxPrice: 40000,    // Updated for high-end RAM
        percentage: 15, 
        priority: 4 
      },
    ],
    casual: [
      { type: 'cpu', minPrice: 15000, maxPrice: 25000, percentage: 35, priority: 1 },
      { type: 'gpu', minPrice: 15000, maxPrice: 25000, percentage: 25, priority: 2 },
      { type: 'motherboard', minPrice: 5000, maxPrice: 10000, percentage: 20, priority: 3 },
      { type: 'ram', minPrice: 3000, maxPrice: 8000, percentage: 20, priority: 4 },
    ],
    workstation: [
      { type: 'cpu', minPrice: 25000, maxPrice: 40000, percentage: 35, priority: 1 },
      { type: 'ram', minPrice: 10000, maxPrice: 20000, percentage: 25, priority: 2 },
      { type: 'motherboard', minPrice: 10000, maxPrice: 20000, percentage: 20, priority: 3 },
      { type: 'gpu', minPrice: 20000, maxPrice: 30000, percentage: 15, priority: 4 },
    ],
  };
  