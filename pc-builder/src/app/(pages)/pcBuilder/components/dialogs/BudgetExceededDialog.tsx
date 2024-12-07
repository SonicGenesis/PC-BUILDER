import React from 'react';
import { PCComponent } from '../../types/components';

interface BudgetExceededDialogProps {
  component: PCComponent;
  newTotal: number;
  currentBudget: number;
  onIncreaseBudget: () => void;
  onAddAnyway: () => void;
  onCancel: () => void;
}

export const BudgetExceededDialog: React.FC<BudgetExceededDialogProps> = ({
  component,
  newTotal,
  currentBudget,
  onIncreaseBudget,
  onAddAnyway,
  onCancel,
}) => (
  <div className="space-y-4">
    <p>Adding this component will exceed your budget by ₹{(newTotal - currentBudget).toLocaleString()}.</p>
    <p>Would you like to:</p>
    <div className="space-y-2">
      <button
        onClick={onIncreaseBudget}
        className="w-full text-left px-4 py-2 rounded bg-blue-500 hover:bg-blue-600 text-white"
      >
        Increase budget to ₹{newTotal.toLocaleString()}
      </button>
      <button
        onClick={onAddAnyway}
        className="w-full text-left px-4 py-2 rounded bg-gray-500 hover:bg-gray-600 text-white"
      >
        Add anyway (Exceed budget)
      </button>
      <button
        onClick={onCancel}
        className="w-full text-left px-4 py-2 rounded bg-red-500 hover:bg-red-600 text-white"
      >
        Cancel
      </button>
    </div>
  </div>
); 