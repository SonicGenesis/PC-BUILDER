import React from 'react';

export const ComponentLibraryHeader: React.FC = () => (
  <div className="py-4 px-6 border-b border-gray-700 bg-[#1F2937] sticky top-0 z-10">
    <div className="flex items-center gap-3">
      <h2 className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 text-xl">
        COMPONENT LIBRARY
      </h2>
      <div className="px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20">
        <span className="text-xs font-medium text-blue-400">
          Drag & Drop
        </span>
      </div>
    </div>
    <p className="text-sm text-gray-400 mt-1">
      Browse and select from our curated collection of high-performance parts
    </p>
  </div>
); 