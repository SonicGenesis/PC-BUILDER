import Image from 'next/image';
import { FiX } from 'react-icons/fi';
import { ComponentType, PCComponent } from '../../types/components';
import { COMPONENT_DISPLAY_NAMES } from '../../contants/budget';
import { Draggable } from '@hello-pangea/dnd';

interface ComponentSlotProps {
  type: ComponentType;
  component?: PCComponent;
  index: number;
  buildId: string;
  onRemove: (buildId: string, type: ComponentType) => void;
}

export const ComponentSlot = ({ 
  type, 
  component, 
  index,
  buildId,
  onRemove 
}: ComponentSlotProps) => {
  return (
    <div
      className={`
        border rounded-xl p-4 transition-all
        ${component
          ? 'border-neon-green neon-glow bg-card-bg'
          : 'border-dashed border-gray-700 hover:border-neon-green/50'}
      `}
    >
      <p className="text-sm font-medium mb-2 text-neon-green neon-text">{COMPONENT_DISPLAY_NAMES[type]}</p>
      {component ? (
        <Draggable draggableId={`${buildId}-${type}`} index={index}>
          {(provided) => (
            <div 
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              className="bg-dark-bg p-3 rounded-lg relative group border border-neon-green/30"
            >
              <button
                onClick={() => onRemove(buildId, type)}
                className="absolute -top-2 -right-2 bg-card-bg text-neon-green p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity border border-neon-green neon-glow"
              >
                <FiX className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 relative">
                  <Image
                    src={component.image || '/images/placeholder.jpg'}
                    alt={component.name || ''}
                    fill
                    className="object-contain rounded"
                  />
                </div>
                <div>
                  <p className="font-medium text-sm text-white">
                    {component.name}
                  </p>
                  <p className="text-sm text-neon-green">
                    ${component.price.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          )}
        </Draggable>
      ) : (
        <div className="h-20 flex items-center justify-center">
          <p className="text-sm text-gray-400 text-center px-2">
            Drag and drop a {COMPONENT_DISPLAY_NAMES[type].toLowerCase()} here
          </p>
        </div>
      )}
    </div>
  );
}; 