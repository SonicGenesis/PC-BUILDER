import { BudgetRange, BuildPurpose } from '@/app/(pages)/pcBuilder/types/builds';
import { FiMonitor, FiPlay, FiCpu, FiCode, FiFilm, FiLock, FiUnlock, FiMaximize2 } from 'react-icons/fi';

export const BUDGET_RANGES: BudgetRange[] = [
  { label: 'Budget Build (Below ₹75,000)', value: 75000 },
  { label: 'Mid Range (Below ₹1,50,000)', value: 150000 },
  { label: 'High End (Below ₹2,50,000)', value: 250000 },
  { label: 'Premium (Below ₹3,50,000)', value: 350000 },
  { label: 'Ultra Premium (₹3,50,000+)', value: 500000 },
];

export const BUILD_PURPOSES: BuildPurpose[] = [
  {
    id: 'casual',
    name: 'Casual Build',
    description: 'For everyday computing, web browsing, and light office work',
    minBudget: 30000,
    maxBudget: 100000,
    icon: <FiMonitor className="w-5 h-5" /> // You'll need to import FiMonitor
  },
  {
    id: 'gaming',
    name: 'Gaming Build',
    description: 'For high-performance gaming and streaming',
    minBudget: 75000,
    maxBudget: 500000,
    icon: <FiPlay className="w-5 h-5" /> // You'll need to import FiPlay
  },
  {
    id: 'mining',
    name: 'Mining Rig',
    description: 'Optimized for cryptocurrency mining',
    minBudget: 200000,
    maxBudget: 500000,
    icon: <FiCpu className="w-5 h-5" /> // You'll need to import FiCpu
  },
  {
    id: 'workstation',
    name: 'Workstation Build',
    description: 'For professional work, content creation, and development',
    minBudget: 15000,
    maxBudget: 80000,
    icon: <FiCode className="w-5 h-5" /> // You'll need to import FiCode
  },
  {
    id: 'rendering',
    name: 'Rendering Station',
    description: '3D rendering, video editing, and heavy computational tasks',
    minBudget: 150000,
    maxBudget: 400000,
    icon: <FiFilm className="w-5 h-5" /> // You'll need to import FiFilm
  }
];

export const MIN_BUDGET = 5000; 


// Add this constant for flexibility options
export const BUDGET_FLEXIBILITY_OPTIONS = [
  {
    id: 'strict',
    label: 'Strict Budget',
    description: 'Must stay within the selected budget',
    icon: <FiLock className="w-5 h-5" />
  },
  {
    id: 'flexible',
    label: 'Somewhat Flexible',
    description: 'Can extend 10-15% above if needed',
    icon: <FiUnlock className="w-5 h-5" />
  },
  {
    id: 'very_flexible',
    label: 'Very Flexible',
    description: 'Performance is priority over budget',
    icon: <FiMaximize2 className="w-5 h-5" />
  }
];
