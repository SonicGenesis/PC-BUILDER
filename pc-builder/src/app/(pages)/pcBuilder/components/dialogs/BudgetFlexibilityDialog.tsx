import React from 'react';
import { BuildPurpose, PCBuild } from '../../types/builds';
import { BUDGET_FLEXIBILITY_OPTIONS } from '../../contants/pcBuilder';
import { BudgetSelectionDialog } from './BudgetSelectionDialog';
import { DialogOptions } from '@/app/components/GlobalDialog';
import { PCComponent } from '../../types/components';

interface BudgetFlexibilityDialogProps {
  purpose: BuildPurpose;
  showDialog: (options: DialogOptions) => void;
  component: PCComponent;
  builds: PCBuild[];
  updateBuilds: (newBuilds: PCBuild[] | ((prev: PCBuild[]) => PCBuild[])) => void;
}

export const BudgetFlexibilityDialog: React.FC<BudgetFlexibilityDialogProps> = ({
  purpose,
  showDialog,
  component,
  builds,
  updateBuilds,
}) => (
  <div className="space-y-4">
    <p className="text-gray-600 dark:text-gray-400">
      How flexible is your budget for this {purpose.name.toLowerCase()}?
    </p>
    <div className="space-y-3">
      {BUDGET_FLEXIBILITY_OPTIONS.map((option) => (
        <button
          key={option.id}
          onClick={() => {
            showDialog({
              type: 'confirm',
              title: `Select Budget for ${purpose.name}`,
              message: (
                <BudgetSelectionDialog
                  purpose={purpose}
                  option={option}
                  component={component}
                  builds={builds}
                  updateBuilds={updateBuilds}
                  showDialog={showDialog}
                />
              )
            });
          }}
          className="w-full flex items-center gap-4 px-4 py-3 rounded-lg 
            bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 
            dark:hover:bg-gray-600 transition-colors"
        >
          <div className="text-gray-600 dark:text-gray-300">
            {option.icon}
          </div>
          <div className="flex-1 text-left">
            <h3 className="font-medium text-gray-800 dark:text-gray-200">
              {option.label}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {option.description}
            </p>
          </div>
        </button>
      ))}
    </div>
  </div>
); 