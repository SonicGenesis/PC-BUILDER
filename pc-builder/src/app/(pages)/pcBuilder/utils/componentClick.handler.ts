import { PCComponent } from '../types/components';
import { PCBuild } from '../types/builds';
import { DialogOptions } from '../../../components/GlobalDialog';
import { BuildSelectionDialog } from '../components/dialogs/BuildSelectionDialog';
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
        message: ComponentReplacementDialog({
          existingComponent,
          newComponent: component,
          build,
          builds,
          updateBuilds,
          showDialog,
        })
      });
      return;
    }

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

  if (builds.length === 1) {
    handleReplacement(builds[0]);
    return;
  }

  showDialog({
    type: 'confirm',
    title: 'Select Build',
    message: BuildSelectionDialog({
      component,
      builds,
      handleReplacement,
      calculateBuildPrice,
    })
  });
}; 