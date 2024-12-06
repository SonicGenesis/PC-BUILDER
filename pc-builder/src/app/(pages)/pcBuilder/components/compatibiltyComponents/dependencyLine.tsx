import React from 'react';
import { ComponentNode } from '@/app/(pages)/pcBuilder/types/recommendations';

interface DependencyLineProps {
  node: ComponentNode;
  depIndex: number;
  currentIndex: number;
}

export const DependencyLine: React.FC<DependencyLineProps> = ({ 
  node, 
  depIndex, 
  currentIndex 
}) => {
  if (depIndex === -1) return null;
  
  return (
    <div
      className={`absolute left-1/2 w-4 border-t transform -translate-y-1/2
        ${node.status === 'compatible' ? 'border-green-500' : 
          node.status === 'incompatible' ? 'border-red-500 animate-pulse-fast' : 
          node.status === 'pending' ? 'border-yellow-500 animate-pulse-slow' : 
          'border-gray-600'}`}
      style={{
        top: `${(depIndex - currentIndex) * 100}%`
      }}
    />
  );
};