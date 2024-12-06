import React, { useState } from 'react';
import { ComponentNode } from '@/app/(pages)/pcBuilder/types/recommendations';
import { PCBuild } from '@/app/(pages)/pcBuilder/types/builds';
import { CompatibilityNode } from './compatibiltyNode';
import { CompatibilityDetailsPanel } from './compatibilityDetailsPanel';
import { DependencyLine } from './dependencyLine';

interface CompatibilityTreeProps {
  nodes: ComponentNode[];
  build: PCBuild;
}

export const CompatibilityTree: React.FC<CompatibilityTreeProps> = ({ nodes, build }) => {
  const [selectedNode, setSelectedNode] = useState<ComponentNode | null>(null);

  return (
    <div className="absolute left-0 top-0 h-full flex">
      {/* Compatibility Tree */}
      <div className="w-8 h-full flex flex-col items-center relative z-10">
        {nodes.map((node, index) => (
          <div key={node.type} className="flex-1 relative w-full">
            {/* Vertical line with pulsing effect for issues */}
            <div 
              className={`absolute left-1/2 w-0.5 h-full transform -translate-x-1/2
                ${node.status === 'compatible' ? 'bg-green-500' : 
                  node.status === 'incompatible' ? 'bg-red-500 animate-pulse-fast' : 
                  node.status === 'pending' ? 'bg-yellow-500 animate-pulse-slow' : 
                  'bg-gray-600'}`}
            />
            
            <CompatibilityNode
              node={node}
              selectedNode={selectedNode}
              onNodeSelect={setSelectedNode}
            />

            {/* Dependency lines */}
            {node.dependencies.map(dep => (
              <DependencyLine
                key={`${node.type}-${dep}`}
                node={node}
                depIndex={nodes.findIndex(n => n.type === dep)}
                currentIndex={index}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Details Panel */}
      {selectedNode && (
        <CompatibilityDetailsPanel
          selectedNode={selectedNode}
          build={build}
          nodes={nodes}
        />
      )}
    </div>
  );
};