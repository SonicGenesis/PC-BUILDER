import React from 'react';
import { PCComponent } from '../../types/components';
import { BuildPurpose } from '../../types/builds';
import { BUILD_PURPOSES } from '../../contants/pcBuilder';

interface BuildPurposeSelectionDialogProps {
  component: PCComponent;
  showBudgetSelectionWithComponent: (purpose: BuildPurpose, component: PCComponent) => void;
}

export const BuildPurposeSelectionDialog: React.FC<BuildPurposeSelectionDialogProps> = ({
  component,
  showBudgetSelectionWithComponent,
}) => (
  <div className="space-y-4">
    <p className="text-gray-600 dark:text-gray-400">
      Choose the primary purpose for your PC build with {component.name}:
    </p>
    <div className="space-y-3">
      {BUILD_PURPOSES.map((purpose) => (
        <button
          key={purpose.id}
          onClick={() => showBudgetSelectionWithComponent(purpose, component)}
          className="w-full flex items-center gap-4 px-4 py-3 rounded-lg 
            bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 
            dark:hover:bg-gray-600 transition-colors"
        >
          <div className="text-gray-600 dark:text-gray-300">
            {purpose.icon}
          </div>
          <div className="flex-1 text-left">
            <h3 className="font-medium text-gray-800 dark:text-gray-200">
              {purpose.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Estimated: ₹{purpose.minBudget.toLocaleString()} - 
              {purpose.maxBudget ? `₹${purpose.maxBudget.toLocaleString()}` : 'Above'}
            </p>
          </div>
        </button>
      ))}
    </div>
  </div>
); 