import React from 'react';
import { ComponentNode } from '../../types/recommendations';


interface CompatibilityNodeProps {
  node: ComponentNode;
  selectedNode: ComponentNode | null;
  onNodeSelect: (node: ComponentNode | null) => void;
}

export const CompatibilityNode: React.FC<CompatibilityNodeProps> = ({
  node,
  selectedNode,
  onNodeSelect,
}) => {
  return (
    <button
      onClick={() => onNodeSelect(selectedNode?.type === node.type ? null : node)}
      className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2
        w-4 h-4 rounded-full cursor-pointer transition-all duration-200
        hover:scale-110 group"
    >
      {/* Base node circle */}
      <div className={`
        w-full h-full rounded-full z-20 relative
        ${node.status === 'compatible' ? 'bg-green-500' : 
          node.status === 'incompatible' ? 'bg-red-500' : 
          node.status === 'pending' ? 'bg-yellow-500' : 
          'bg-gray-600'}
        ${selectedNode?.type === node.type ? 'ring-2 ring-white' : ''}
      `}>
        {/* Warning indicator */}
        {node.status === 'incompatible' && (
          <span className="absolute -right-1 -top-1 w-3 h-3 bg-red-500 
            rounded-full flex items-center justify-center z-30">
            <span className="text-white text-xs">!</span>
          </span>
        )}
      </div>

      {/* Pulsating waves - Multiple rings for better effect */}
      {(node.status === 'incompatible' || node.status === 'pending') && (
        <>
          {/* First wave */}
          <div className={`
            absolute inset-0 rounded-full animate-wave-1 z-10
            ${node.status === 'incompatible' 
              ? 'bg-red-500/40' 
              : 'bg-yellow-500/40'}
          `} />
          
          {/* Second wave */}
          <div className={`
            absolute inset-0 rounded-full animate-wave-2 z-9
            ${node.status === 'incompatible' 
              ? 'bg-red-500/30' 
              : 'bg-yellow-500/30'}
          `} />
          
          {/* Third wave */}
          <div className={`
            absolute inset-0 rounded-full animate-wave-3 z-8
            ${node.status === 'incompatible' 
              ? 'bg-red-500/20' 
              : 'bg-yellow-500/20'}
          `} />
        </>
      )}

      {/* Hover tooltip */}
      <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 
        px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap
        opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none
        border border-gray-700 shadow-lg z-50">
        {node.status === 'incompatible' 
          ? 'Compatibility Issue - Click to view' 
          : node.status === 'pending' 
            ? 'Needs Verification - Click to view'
            : 'Click to view details'}
      </div>
    </button>
  );
};