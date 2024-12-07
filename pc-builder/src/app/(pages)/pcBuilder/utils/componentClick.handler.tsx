import React from 'react';
import { PCComponent } from '../types/components';
import { PCBuild } from '../types/builds';
import { COMPONENT_DISPLAY_NAMES } from '../contants/budget';
import { DialogOptions } from '../../../components/GlobalDialog';
import { ComponentReplacementDialog } from '../components/dialogs/ComponentReplacementDialog';

interface ComponentClickHandlerProps {
  component: PCComponent;
  builds: PCBuild[];
  updateBuilds: (newBuilds: PCBuild[] | ((prev: PCBuild[]) => PCBuild[])) => void;
  showDialog: (options: DialogOptions) => void;
  createBuildWithComponent: (component: PCComponent) => void;
  calculateBuildPrice: (build: PCBuild) => number;
}

export const handleComponentClick = ({
  component,
  builds,
  updateBuilds,
  showDialog,
  createBuildWithComponent,
  calculateBuildPrice,
}: ComponentClickHandlerProps) => {
  // If no builds exist, prompt to create one
  if (builds.length === 0) {
    createBuildWithComponent(component);
    return;
  }

  const handleReplacement = (build: PCBuild) => {
    const existingComponent = build.components[component.type];
    
    if (existingComponent) {
      showDialog({
        type: 'confirm',
        title: 'Replace Component',
        message: (
          <ComponentReplacementDialog
            existingComponent={existingComponent}
            newComponent={component}
            build={build}
            builds={builds}
            updateBuilds={updateBuilds}
            showDialog={showDialog}
          />
        )
      });
      return;
    }

    // Add new component if no existing component
    const updatedBuilds = builds.map(b => 
      b.id === build.id 
        ? { ...b, components: { ...b.components, [component.type]: component } }
        : b
    );
    updateBuilds(updatedBuilds);
    showDialog({
      type: 'success',
      title: 'Component Added',
      message: `${component.name} added to ${build.name}`
    });
  };

  // If only one build exists
  if (builds.length === 1) {
    handleReplacement(builds[0]);
    return;
  }

  // If multiple builds exist, show build selection dialog
  showDialog({
    type: 'confirm',
    title: 'Select Build',
    message: (
      <div className="space-y-4">
        <p className="text-gray-600 dark:text-gray-400">
          Select which build to add {component.name} to:
        </p>
        <div className="space-y-2">
          {builds.map((build) => (
            <button
              key={build.id}
              onClick={() => handleReplacement(build)}
              className="w-full flex items-center justify-between px-4 py-3 rounded-lg
                bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 
                dark:hover:bg-gray-600 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-gray-800 dark:text-gray-200">
                  {build.name}
                </span>
                {build.components[component.type] && (
                  <span className="text-xs px-2 py-1 rounded-full bg-yellow-500/10 text-yellow-500">
                    Will replace existing {COMPONENT_DISPLAY_NAMES[component.type]}
                  </span>
                )}
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">
                  Current Total: ₹{calculateBuildPrice(build).toLocaleString()}
                </div>
                {build.components[component.type] && (
                  <div className="text-xs text-gray-400">
                    New Total: ₹{(
                      calculateBuildPrice(build) - 
                      (build.components[component.type]?.price || 0) + 
                      component.price
                    ).toLocaleString()}
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    )
  });
}; 