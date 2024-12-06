import { ReactNode } from 'react';

export type ComponentType = 'gpu' | 'cpu' | 'motherboard' | 'ram';

export type PCComponent = {
  id: string;
  name: string;
  price: number;
  company: string;
  type: ComponentType;
  image?: string;
};

export const COMPONENT_DISPLAY_NAMES: Record<ComponentType, string> = {
  gpu: 'Graphics Card',
  cpu: 'Processor',
  motherboard: 'Motherboard',
  ram: 'Memory (RAM)'
}; 

export type CategoryState = {
  [key in ComponentType]: boolean;
};



