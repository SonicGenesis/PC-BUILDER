import { PCBuild } from '../types/builds';
import { PC_BUILDS_STORAGE_KEY } from '../contants/builder.constant';
import { DialogOptions } from '@/app/components/GlobalDialog';

interface BuildManagementProps {
  builds: PCBuild[];
  updateBuilds: (newBuilds: PCBuild[] | ((prev: PCBuild[]) => PCBuild[])) => void;
  showDialog: (options: DialogOptions) => void;
}

export const buildManagement = {
  clearAllBuilds: ({ updateBuilds, showDialog }: BuildManagementProps) => {
    showDialog({
      type: 'confirm',
      title: 'Clear All Builds',
      message: 'Are you sure you want to delete all builds? This cannot be undone.',
      onConfirm: () => {
        updateBuilds([]);
        localStorage.removeItem(PC_BUILDS_STORAGE_KEY);
        showDialog({
          type: 'success',
          title: 'Builds Cleared',
          message: 'All builds have been deleted'
        });
      }
    });
  },

  exportBuilds: ({ builds }: BuildManagementProps) => {
    const dataStr = JSON.stringify(builds, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    const exportFileDefaultName = `pc-builds-${new Date().toISOString().slice(0, 10)}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  },

  importBuilds: (
    event: React.ChangeEvent<HTMLInputElement>,
    { updateBuilds, showDialog }: BuildManagementProps
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedBuilds = JSON.parse(e.target?.result as string);
        updateBuilds(prev => [...prev, ...importedBuilds]);
        showDialog({
          type: 'success',
          title: 'Builds Imported',
          message: `Successfully imported ${importedBuilds.length} builds`
        });
      } catch (error) {
        showDialog({
          type: 'error',
          title: 'Import Failed',
          message: 'Failed to import builds. Please check the file format.'
        });
      }
    };
    reader.readAsText(file);
  }
}; 