import { ComponentType } from "../types/components";
import { BudgetRange } from "../types/recommendations";

// Add this near your other constants
export const CUSTOM_BUDGET_CHIPS = [
    { value: 75000, label: '₹75,000' },
    { value: 100000, label: '₹1,00,000' },
    { value: 150000, label: '₹1,50,000' },
    { value: 200000, label: '₹2,00,000' },
    { value: 250000, label: '₹2,50,000' },
    { value: 300000, label: '₹3,00,000' },
    { value: 350000, label: '₹3,50,000' },
    { value: 400000, label: '₹4,00,000' },
    { value: 500000, label: '₹5,00,000' },
  ];

  export const COMPONENT_DISPLAY_NAMES: Record<ComponentType, string> = {
    gpu: 'Graphics Card',
    cpu: 'Processor',
    motherboard: 'Motherboard',
    ram: 'Memory (RAM)'
  };
  
  export const BUDGET_RANGES: BudgetRange[] = [
    { label: 'Budget Build (Below ₹75,000)', value: 75000 },
    { label: 'Mid Range (Below ₹1,50,000)', value: 150000 },
    { label: 'High End (Below ₹2,50,000)', value: 250000 },
    { label: 'Premium (Below ₹3,50,000)', value: 350000 },
    { label: 'Ultra Premium (₹3,50,000+)', value: 500000 },
  ];