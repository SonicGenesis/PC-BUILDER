import React from 'react';
import { BuildPurpose, PCBuild, BudgetFlexibility } from '../../types/builds';
import { BUDGET_RANGES } from '../../contants/pcBuilder';
import { PCComponent } from '../../types/components';
import { DialogOptions } from '@/app/components/GlobalDialog';

interface BudgetSelectionDialogProps {
  purpose: BuildPurpose;
  option: {
    id: string;
    label: string;
    description: string;
    icon: React.ReactNode;
  };
  component: PCComponent;
  builds: PCBuild[];
  updateBuilds: (newBuilds: PCBuild[] | ((prev: PCBuild[]) => PCBuild[])) => void;
  showDialog: (options: DialogOptions) => void;
}

export const BudgetSelectionDialog: React.FC<BudgetSelectionDialogProps> = ({
  purpose,
  option,
  component,
  builds,
  updateBuilds,
  showDialog,
}) => (
  <div className="space-y-4">
    {/* Purpose Header */}
    <div className="flex items-center gap-3 mb-4">
      {purpose.icon}
      <div>
        <h3 className="font-medium text-lg">{purpose.name}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {purpose.description}
        </p>
      </div>
    </div>

    {/* Flexibility Option Info */}
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

    {/* Budget Range Info */}
    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
      <p className="text-sm text-blue-600 dark:text-blue-400">
        Recommended range for {purpose.name.toLowerCase()}:
        <br />₹{purpose.minBudget.toLocaleString()} - 
        {purpose.maxBudget ? `₹${purpose.maxBudget.toLocaleString()}` : 'Above'}
      </p>
    </div>

    {/* Budget Range Selection */}
    <div className="space-y-2">
      {BUDGET_RANGES.map((range) => {
        const isRecommended = range.value >= purpose.minBudget && 
          (!purpose.maxBudget || range.value <= purpose.maxBudget);

        return (
          <button
            key={range.value}
            onClick={() => {
              const newBuild: PCBuild = {
                id: `build-${builds.length + 1}`,
                name: `${purpose.name} ${builds.length + 1}`,
                budget: range.value,
                purpose: purpose.id,
                budgetFlexibility: option.id as BudgetFlexibility,
                components: {
                  [component.type]: component
                }
              };
              updateBuilds(prev => [...prev, newBuild]);
              showDialog({
                type: 'success',
                title: 'Build Created',
                message: `Created new ${purpose.name.toLowerCase()} with ${option.label.toLowerCase()} budget of ₹${range.value.toLocaleString()}`
              });
            }}
            className={`w-full text-left px-4 py-3 rounded-lg
              ${isRecommended 
                ? 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                : 'bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
              } transition-colors`}
          >
            <div className="flex justify-between items-center">
              <div>
                <span className="font-medium">{range.label}</span>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  ₹{range.value.toLocaleString()}
                </p>
              </div>
              {isRecommended && (
                <span className="text-green-500 text-sm flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                  Recommended
                </span>
              )}
            </div>
          </button>
        );
      })}
    </div>
  </div>
);