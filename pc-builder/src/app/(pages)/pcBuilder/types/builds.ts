import { ReactNode } from 'react';
import { PCComponent, ComponentType } from './components';

export type BuildPurpose = {
  id: string;
  name: string;
  description: string;
  minBudget: number;
  maxBudget: number;
  icon: ReactNode;
};

export type BudgetFlexibility = 'strict' | 'flexible' | 'very_flexible';

export type PCBuild = {
  id: string;
  name: string;
  budget: number;
  purpose: string;
  budgetFlexibility: BudgetFlexibility;
  components: {
    [key in ComponentType]?: PCComponent;
  };
};

export type BudgetRange = {
  label: string;
  value: number;
}; 