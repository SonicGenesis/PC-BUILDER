import React from 'react';
import Image from 'next/image';
import { PCComponent } from '../../types/components';
import { PCBuild } from '../../types/builds';
import { COMPONENT_DISPLAY_NAMES } from '../../contants/budget';
import { DialogOptions } from '@/app/components/GlobalDialog';

interface ComponentReplacementDialogProps {
  existingComponent: PCComponent;
  newComponent: PCComponent;
  build: PCBuild;
  builds: PCBuild[];
  updateBuilds: (newBuilds: PCBuild[] | ((prev: PCBuild[]) => PCBuild[])) => void;
  showDialog: (options: DialogOptions) => void;
}

export const ComponentReplacementDialog: React.FC<ComponentReplacementDialogProps> = ({
  existingComponent,
  newComponent,
  build,
  builds,
  updateBuilds,
  showDialog,
}) => (
  <div className="space-y-4">
    <p className="text-gray-600 dark:text-gray-400">
      This build already has a {COMPONENT_DISPLAY_NAMES[newComponent.type].toLowerCase()}:
    </p>
    
    {/* Comparison View */}
    <div className="grid grid-cols-2 gap-4">
      {/* Existing Component */}
      <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
        <div className="text-xs text-red-500 mb-2">Current Component</div>
        <div className="flex items-start gap-3">
          <div className="w-16 h-16 relative bg-gray-200 dark:bg-gray-600 rounded-lg flex-shrink-0">
            <Image
              src={existingComponent.image || '/images/placeholder.jpg'}
              alt={existingComponent.name}
              fill
              className="object-contain p-2"
            />
          </div>
          <div>
            <h4 className="font-medium text-sm">{existingComponent.name}</h4>
            <p className="text-sm text-gray-500">₹{existingComponent.price.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* New Component */}
      <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
        <div className="text-xs text-green-500 mb-2">New Component</div>
        <div className="flex items-start gap-3">
          <div className="w-16 h-16 relative bg-gray-200 dark:bg-gray-600 rounded-lg flex-shrink-0">
            <Image
              src={newComponent.image || '/images/placeholder.jpg'}
              alt={newComponent.name}
              fill
              className="object-contain p-2"
            />
          </div>
          <div>
            <h4 className="font-medium text-sm">{newComponent.name}</h4>
            <p className="text-sm text-gray-500">₹{newComponent.price.toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>

    {/* Price Difference */}
    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
      <div className="flex justify-between items-center">
        <span className="text-sm text-blue-600 dark:text-blue-400">Price Difference:</span>
        <span className={`font-medium ${
          newComponent.price > existingComponent.price 
            ? 'text-red-500' 
            : 'text-green-500'
        }`}>
          {newComponent.price > existingComponent.price ? '+' : ''}
          ₹{(newComponent.price - existingComponent.price).toLocaleString()}
        </span>
      </div>
    </div>

    <div className="flex gap-2">
      <button
        onClick={() => {
          const updatedBuilds = builds.map(b => 
            b.id === build.id 
              ? { ...b, components: { ...b.components, [newComponent.type]: newComponent } }
              : b
          );
          updateBuilds(updatedBuilds);
          showDialog({
            type: 'success',
            title: 'Component Replaced',
            message: `Successfully replaced with ${newComponent.name}`
          });
        }}
        className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        Replace Component
      </button>
      <button
        onClick={() => {
          showDialog({
            type: 'success',
            title: 'Cancelled',
            message: 'Component replacement cancelled'
          });
        }}
        className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
      >
        Keep Existing
      </button>
    </div>
  </div>
); 