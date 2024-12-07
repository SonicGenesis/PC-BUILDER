import { DragDropResult } from '../types/dragDrop';
import { PCComponent } from '../types/components';
import { PCBuild } from '../types/builds';
import { COMPONENT_DISPLAY_NAMES } from '../contants/budget';
import { DialogOptions } from '@/app/components/GlobalDialog';
import { BudgetExceededDialog } from '../components/dialogs/BudgetExceededDialog';
import { ReplaceComponentDialog } from '../components/dialogs/ReplaceComponentDialog';

interface DragDropHandlerProps {
  result: DragDropResult;
  builds: PCBuild[];
  availableComponents: PCComponent[];
  updateBuilds: (newBuilds: PCBuild[] | ((prev: PCBuild[]) => PCBuild[])) => void;
  showDialog: (props: DialogOptions) => void;
  calculateBuildPrice: (build: PCBuild) => number;
  createBuildWithComponent: (component: PCComponent) => void;
}

export const handleDragEnd = ({
  result,
  builds,
  availableComponents,
  updateBuilds,
  showDialog,
  calculateBuildPrice,
  createBuildWithComponent,
}: DragDropHandlerProps) => {
  if (!result.destination) return;

  const { destination, draggableId } = result;
  const originalId = draggableId.startsWith('fav-') ? draggableId.slice(4) : draggableId;
  const component = availableComponents.find((c: PCComponent) => c.id === originalId);
  
  if (!component) return;

  // If no builds exist, start the build creation process
  if (builds.length === 0) {
    createBuildWithComponent(component);
    return;
  }

  // Handle dropping component into a build
  if (destination.droppableId.startsWith('build-')) {
    const buildIndex = builds.findIndex(b => b.id === destination.droppableId);
    if (buildIndex === -1) return;

    const updatedBuilds = [...builds];
    const build = updatedBuilds[buildIndex];
    
    const existingComponent = build.components[component.type];
    const newTotal = calculateBuildPrice(build) - (existingComponent?.price || 0) + component.price;

    if (newTotal > build.budget) {
      showDialog({
        type: 'confirm',
        title: 'Budget Exceeded',
        message: (
          <BudgetExceededDialog
            component={component}
            newTotal={newTotal}
            currentBudget={build.budget}
            onIncreaseBudget={() => {
              const newBuilds = builds.map(b => 
                b.id === build.id 
                  ? { ...b, budget: newTotal }
                  : b
              );
              updateBuilds(newBuilds);
              build.components[component.type] = component;
              updateBuilds(updatedBuilds);
              showDialog({
                type: 'success',
                title: 'Budget Updated',
                message: `Budget increased and ${component.name} added to build`
              });
            }}
            onAddAnyway={() => {
              build.components[component.type] = component;
              updateBuilds(updatedBuilds);
              showDialog({
                type: 'success',
                title: 'Component Added',
                message: `${component.name} added to build (over budget)`
              });
            }}
            onCancel={() => {
              showDialog({
                type: 'success',
                title: 'Action Cancelled',
                message: 'Component not added to maintain budget'
              });
            }}
          />
        )
      });
      return;
    }

    if (build.components[component.type]) {
      showDialog({
        type: 'confirm',
        title: 'Replace Component',
        message: (
          <ReplaceComponentDialog
            existingComponent={build.components[component.type]!}
            newComponent={component}
          />
        ),
        onConfirm: () => {
          build.components[component.type] = component;
          updateBuilds(updatedBuilds);
          showDialog({
            type: 'success',
            title: 'Component Replaced',
            message: `Successfully replaced with ${component.name} in ${build.name}`
          });
        }
      });
      return;
    }

    // Add component to build if there's no existing component
    build.components[component.type] = component;
    updateBuilds(updatedBuilds);
    
    showDialog({
      type: 'success',
      title: 'Component Added',
      message: `${COMPONENT_DISPLAY_NAMES[component.type]} "${component.name}" has been added to ${build.name}`
    });
  }
}; 