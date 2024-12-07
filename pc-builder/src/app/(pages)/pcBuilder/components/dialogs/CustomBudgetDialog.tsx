import React from 'react';
import { BuildPurpose, PCBuild } from '../../types/builds';
import { CUSTOM_BUDGET_CHIPS } from '../../contants/budget';
import { DialogOptions } from '@/app/components/GlobalDialog';

interface CustomBudgetDialogProps {
  purpose: BuildPurpose;
  handleCreateBuild: (budgetValue: number) => void;
  showDialog: (options: DialogOptions) => void;
}

export const CustomBudgetDialog: React.FC<CustomBudgetDialogProps> = ({
  purpose,
  handleCreateBuild,
  showDialog,
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
      <p className="text-sm text-blue-600 dark:text-blue-400">
        Recommended range for {purpose.name.toLowerCase()}:
        <br />₹{purpose.minBudget.toLocaleString()} - 
        {purpose.maxBudget ? `₹${purpose.maxBudget.toLocaleString()}` : 'Above'}
      </p>
    </div>

    <div className="pt-2">
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
        Select your preferred budget:
      </p>
      <div className="flex flex-wrap gap-2">
        {CUSTOM_BUDGET_CHIPS.map((chip) => {
          const isWithinRange = chip.value >= purpose.minBudget && 
            (!purpose.maxBudget || chip.value <= purpose.maxBudget);
          
          return (
            <button
              key={chip.value}
              onClick={() => {
                if (!isWithinRange) {
                  showDialog({
                    type: 'confirm',
                    title: 'Budget Outside Recommended Range',
                    message: (
                      <div className="space-y-3">
                        <p>The selected budget is {chip.value < purpose.minBudget ? 'below' : 'above'} 
                          the recommended range for a {purpose.name.toLowerCase()}.</p>
                        <p>Would you like to continue anyway?</p>
                        <div className="space-y-2">
                          <button
                            onClick={() => handleCreateBuild(chip.value)}
                            className="w-full text-left px-4 py-2 rounded bg-blue-500 hover:bg-blue-600 text-white"
                          >
                            Continue with {chip.label}
                          </button>
                          <button
                            onClick={() => {
                              showDialog({
                                type: 'confirm',
                                title: 'Select Custom Budget',
                                message: <CustomBudgetDialog 
                                  purpose={purpose}
                                  handleCreateBuild={handleCreateBuild}
                                  showDialog={showDialog}
                                />
                              });
                            }}
                            className="w-full text-left px-4 py-2 rounded bg-gray-500 hover:bg-gray-600 text-white"
                          >
                            Select different budget
                          </button>
                        </div>
                      </div>
                    )
                  });
                  return;
                }
                handleCreateBuild(chip.value);
              }}
              className={`px-4 py-2 rounded-full transition-colors
                ${isWithinRange 
                  ? 'bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/40 dark:hover:bg-blue-800/60 text-blue-700 dark:text-blue-300'
                  : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'}
              `}
            >
              {chip.label}
              {isWithinRange && (
                <span className="ml-1 text-xs text-green-500">✓</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  </div>
); 