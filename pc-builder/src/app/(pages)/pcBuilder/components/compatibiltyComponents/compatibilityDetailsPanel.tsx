import React from 'react';
import Image from 'next/image';
import { ComponentNode } from '@/app/(pages)/pcBuilder/types/recommendations';
import { PCBuild } from '@/app/(pages)/pcBuilder/types/builds';
import { COMPONENT_DISPLAY_NAMES } from '@/app/(pages)/pcBuilder/contants/budget';

interface CompatibilityDetailsPanelProps {
  selectedNode: ComponentNode;
  build: PCBuild;
  nodes: ComponentNode[];
}

export const CompatibilityDetailsPanel: React.FC<CompatibilityDetailsPanelProps> = ({
  selectedNode,
  build,
  nodes
}) => {
  return (
    <div className="ml-4 w-64 bg-gray-800 rounded-lg p-4 shadow-xl border border-gray-700 
      animate-slideIn absolute left-full top-1/2 -translate-y-1/2 z-50"
    >
      {/* Arrow pointing to the node */}
      <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 
        border-t-8 border-t-transparent 
        border-r-8 border-r-gray-800 
        border-b-8 border-b-transparent"
      />
      
      <StatusHeader selectedNode={selectedNode} />
      <div className="space-y-3">
        <ComponentInfo selectedNode={selectedNode} build={build} />
        <CompatibilityStatus selectedNode={selectedNode} />
        <DependenciesList selectedNode={selectedNode} nodes={nodes} />
        <RecommendationsSection selectedNode={selectedNode} build={build} />
      </div>
    </div>
  );
};

// Sub-components for the details panel
const StatusHeader: React.FC<{ selectedNode: ComponentNode }> = ({ selectedNode }) => (
  <div className="flex items-center gap-2 mb-3">
    <div className={`w-3 h-3 rounded-full flex-shrink-0
      ${selectedNode.status === 'compatible' ? 'bg-green-500' : 
        selectedNode.status === 'incompatible' ? 'bg-red-500' : 
        selectedNode.status === 'pending' ? 'bg-yellow-500' : 
        'bg-gray-600'}`}
    />
    <h3 className="font-medium text-white">
      {COMPONENT_DISPLAY_NAMES[selectedNode.type]}
    </h3>
  </div>
);

const ComponentInfo: React.FC<{ selectedNode: ComponentNode; build: PCBuild }> = ({ 
  selectedNode, 
  build 
}) => {
  const component = build.components[selectedNode.type];
  
  if (!component) {
    return (
      <div className="bg-gray-700/50 rounded-lg p-3">
        <p className="text-sm text-gray-400">No component installed</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-700 rounded-lg p-3">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-10 h-10 relative bg-gray-600 rounded">
          <Image
            src={component.image || '/images/placeholder.jpg'}
            alt={component.name || ''}
            fill
            className="object-contain p-1"
          />
        </div>
        <div>
          <p className="text-sm text-white font-medium">{component.name}</p>
          <p className="text-xs text-gray-400">{component.company}</p>
        </div>
      </div>
    </div>
  );
};

const CompatibilityStatus: React.FC<{ selectedNode: ComponentNode }> = ({ selectedNode }) => (
  <div className={`rounded-lg p-3 ${
    selectedNode.status === 'compatible' ? 'bg-green-500/10 border border-green-500/20' :
    selectedNode.status === 'incompatible' ? 'bg-red-500/10 border border-red-500/20' :
    selectedNode.status === 'pending' ? 'bg-yellow-500/10 border border-yellow-500/20' :
    'bg-gray-700'
  }`}>
    <h4 className={`text-sm font-medium mb-1 ${
      selectedNode.status === 'compatible' ? 'text-green-400' :
      selectedNode.status === 'incompatible' ? 'text-red-400' :
      selectedNode.status === 'pending' ? 'text-yellow-400' :
      'text-gray-400'
    }`}>
      {selectedNode.status === 'compatible' ? 'Compatible' :
       selectedNode.status === 'incompatible' ? 'Compatibility Issue' :
       selectedNode.status === 'pending' ? 'Pending Verification' :
       'Not Installed'}
    </h4>
    <p className="text-sm text-gray-300">{selectedNode.message}</p>
  </div>
);

const DependenciesList: React.FC<{ 
  selectedNode: ComponentNode; 
  nodes: ComponentNode[] 
}> = ({ selectedNode, nodes }) => {
  if (!selectedNode.dependencies.length) return null;

  return (
    <div className="bg-gray-700 rounded-lg p-3">
      <h4 className="text-sm font-medium text-gray-300 mb-2">Required Components</h4>
      <div className="space-y-2">
        {selectedNode.dependencies.map(dep => {
          const depNode = nodes.find(n => n.type === dep);
          return (
            <div key={dep} className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full
                ${depNode?.status === 'compatible' ? 'bg-green-500' :
                  depNode?.status === 'incompatible' ? 'bg-red-500' :
                  depNode?.status === 'pending' ? 'bg-yellow-500' :
                  'bg-gray-500'}`}
              />
              <span className="text-sm text-gray-400">
                {COMPONENT_DISPLAY_NAMES[dep]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const RecommendationsSection: React.FC<{ 
  selectedNode: ComponentNode; 
  build: PCBuild 
}> = ({ selectedNode, build }) => {
  if (selectedNode.status !== 'incompatible') return null;

  return (
    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
      <h4 className="text-sm font-medium text-blue-400 mb-2">Recommendations</h4>
      <ul className="text-sm text-gray-300 space-y-1 list-disc list-inside">
        {selectedNode.type === 'motherboard' && build.components.cpu && (
          <li>Look for motherboards compatible with {build.components.cpu.name} socket type</li>
        )}
        {selectedNode.type === 'ram' && build.components.motherboard && (
          <li>Ensure RAM generation matches motherboard specifications</li>
        )}
        {selectedNode.type === 'gpu' && build.components.cpu && (
          <li>Consider a more balanced CPU-GPU combination</li>
        )}
      </ul>
    </div>
  );
};