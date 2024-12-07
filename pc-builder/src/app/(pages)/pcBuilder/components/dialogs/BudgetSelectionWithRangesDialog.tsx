import React from 'react';
import { BuildPurpose, PCBuild, BudgetFlexibility } from '../../types/builds';
import { BUDGET_RANGES } from '../../contants/pcBuilder';
import { DialogOptions } from '@/app/components/GlobalDialog';
import { FiEdit2 } from 'react-icons/fi';

interface BudgetSelectionWithRangesDialogProps {
  purpose: BuildPurpose;
  option: {
    id: string;
    label: string;
    description: string;
    icon: React.ReactNode;
  };
  updateBuilds: (newBuilds: PCBuild[] | ((prev: PCBuild[]) => PCBuild[])) => void;
  showDialog: (options: DialogOptions) => void;
  handleCustomBudget: (purpose: BuildPurpose) => void;
}

export const BudgetSelectionWithRangesDialog: React.FC<BudgetSelectionWithRangesDialogProps> = ({
  purpose,
  option,
  updateBuilds,
  showDialog,
  handleCustomBudget,
}) => (
  <div className="space-y-4">
    <div className="flex items-center gap-3 mb-4">
      {purpose.icon}
      <div>
        <h3 className="font-medium text-lg">{purpose.name}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {purpose.description}
        </p>
      </div>
    </div>

    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
      <div className="flex items-center gap-2 mb-2">
        {option.icon}
        <span className="font-medium text-blue-700 dark:text-blue-300">
          {option.label}
        </span>
      </div>
      <p className="text-sm text-blue-600 dark:text-blue-400">
        {option.description}
      </p>
    </div>

    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
      <p className="text-sm text-blue-600 dark:text-blue-400">
        Recommended range for {purpose.name.toLowerCase()}:
        <br />₹{purpose.minBudget.toLocaleString()} - 
        {purpose.maxBudget ? `₹${purpose.maxBudget.toLocaleString()}` : 'Above'}
      </p>
    </div>

    <div className="pt-2">
      <p className="text-gray-600 dark:text-gray-400 mb-3">
        Select your preferred budget range:
      </p>
      <div className="space-y-2">
        {BUDGET_RANGES.map((range) => (
          <button
            key={range.value}
            onClick={() => {
              updateBuilds(prev => [...prev, {
                id: `build-${prev.length + 1}`,
                name: `${purpose.name} ${prev.length + 1}`,
                budget: range.value,
                purpose: purpose.id,
                budgetFlexibility: option.id as BudgetFlexibility,
                components: {}
              }]);
              showDialog({
                type: 'success',
                title: 'Build Created',
                message: `Created new ${purpose.name.toLowerCase()} with ${option.label.toLowerCase()} budget of ₹${range.value.toLocaleString()}`
              });
            }}
            className={`w-full text-left px-4 py-3 rounded-lg
              ${range.value >= purpose.minBudget && (!purpose.maxBudget || range.value <= purpose.maxBudget)
                ? 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                : 'bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400'}
              transition-colors text-gray-800 dark:text-gray-200`}
          >
            <div className="flex justify-between items-center">
              <span>{range.label}</span>
              {(range.value >= purpose.minBudget && (!purpose.maxBudget || range.value <= purpose.maxBudget)) && (
                <span className="text-green-500 text-sm">Recommended</span>
              )}
            </div>
          </button>
        ))}
        
        {/* Custom budget option */}
        <button
          onClick={() => handleCustomBudget(purpose)}
          className="w-full text-left px-4 py-3 rounded-lg
            bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600
            transition-colors text-gray-800 dark:text-gray-200 mt-4"
        >
          <div className="flex justify-between items-center">
            <div>
              <span className="font-medium">Custom Budget</span>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Choose from preset amounts or enter your own
              </p>
            </div>
            <FiEdit2 className="w-5 h-5 text-blue-500" />
          </div>
        </button>
      </div>
    </div>
  </div>
); 