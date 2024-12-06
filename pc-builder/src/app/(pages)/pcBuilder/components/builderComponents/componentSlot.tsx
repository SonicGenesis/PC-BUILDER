import Image from 'next/image';
import { FiX } from 'react-icons/fi';
import { ComponentType, PCComponent } from '../../types/components';
import { COMPONENT_DISPLAY_NAMES } from '../../contants/budget';

interface ComponentSlotProps {
  type: ComponentType;
  component?: PCComponent;
  isDraggingOver: boolean;
  onRemove: () => void;
}

export const ComponentSlot = ({ 
  type, 
  component, 
  isDraggingOver,
  onRemove 
}: ComponentSlotProps) => {
  return (
    <div
      className={`
        border-2 border-dashed rounded-xl p-4
        ${isDraggingOver && !component
          ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20'
          : 'border-gray-200 dark:border-gray-700'}
        ${component
          ? 'border-solid border-green-400 dark:border-green-600'
          : ''}
      `}
    >
      <p className="text-sm font-medium mb-2 capitalize">{type}</p>
      {component ? (
        <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg relative group">
          <button
            onClick={onRemove}
            className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <FiX className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 relative">
              <Image
                src={component.image || '/images/placeholder.jpg'}
                alt={component.name || ''}
                fill
                className="object-contain"
              />
            </div>
            <div>
              <p className="font-medium text-sm">
                {component.name}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                ₹{component.price.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-sm text-gray-400">
          Drag and drop a {COMPONENT_DISPLAY_NAMES[type].toLowerCase()} here
        </p>
      )}
    </div>
  );
}; 