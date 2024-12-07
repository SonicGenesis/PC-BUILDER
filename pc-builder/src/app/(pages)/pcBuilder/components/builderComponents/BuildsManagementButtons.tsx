import React from 'react';

interface BuildsManagementButtonsProps {
  exportBuilds: () => void;
  importBuilds: (event: React.ChangeEvent<HTMLInputElement>) => void;
  clearAllBuilds: () => void;
}

export const BuildsManagementButtons: React.FC<BuildsManagementButtonsProps> = ({
  exportBuilds,
  importBuilds,
  clearAllBuilds,
}) => (
  <div className="flex gap-2">
    <button
      onClick={exportBuilds}
      className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
    >
      Export Builds
    </button>
    <label className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600 cursor-pointer">
      Import Builds
      <input
        type="file"
        accept=".json"
        className="hidden"
        onChange={importBuilds}
      />
    </label>
    <button
      onClick={clearAllBuilds}
      className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
    >
      Clear All
    </button>
  </div>
); 