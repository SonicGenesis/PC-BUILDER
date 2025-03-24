import { FiEdit2, FiX } from 'react-icons/fi';
import { PCBuild } from '../../types/builds';
import { ComponentType } from '../../types/components';
import { checkCompatibility } from '../../types/recommendations';
import { CompatibilityTree } from '../compatibiltyComponents/compatibilityTree';
import { ComponentSlot } from './componentSlot';
import { Droppable } from '@hello-pangea/dnd';

interface BuildCardProps {
  build: PCBuild;
  editingBuildId: string | null;
  editingBuildName: string;
  editingBudgetId: string | null;
  editingBudgetValue: number;
  MIN_BUDGET: number;
  onEditName: (buildId: string, name: string) => void;
  onSaveName: () => void;
  onDeleteBuild: (buildId: string, name: string) => void;
  onEditBudget: (buildId: string, budget: number) => void;
  onSaveBudget: () => void;
  onBudgetChange: (value: number) => void;
  onComponentRemove: (buildId: string, type: ComponentType) => void;
  calculateBuildPrice: (build: PCBuild) => number;
}

export const BuildCard = ({
  build,
  editingBuildId,
  editingBuildName,
  editingBudgetId,
  editingBudgetValue,
  MIN_BUDGET,
  onEditName,
  onSaveName,
  onDeleteBuild,
  onEditBudget,
  onSaveBudget,
  onBudgetChange,
  onComponentRemove,
  calculateBuildPrice,
}: BuildCardProps) => {
  return (
    <div
      key={build.id}
      className="neon-card bg-card-bg rounded-xl p-6 w-[400px] relative z-0 overflow-visible"
    >
      <CompatibilityTree nodes={checkCompatibility(build)} build={build} />

      <div className="pl-8">
        <div className="flex justify-between items-center mb-6">
          {editingBuildId === build.id ? (
            <input
              type="text"
              value={editingBuildName}
              onChange={(e) => onEditName(build.id, e.target.value)}
              onBlur={onSaveName}
              onKeyPress={(e) => e.key === 'Enter' && onSaveName()}
              className="text-xl font-bold bg-transparent border-b-2 border-neon-green focus:outline-none focus:border-neon-green text-white px-2 py-1 shadow-[0_2px_8px_rgba(0,255,65,0.5)] neon-text"
              autoFocus
            />
          ) : (
            <h2 
              className="text-xl font-bold text-white cursor-pointer hover:text-neon-green transition-colors neon-text" 
              onClick={() => onEditName(build.id, build.name)}
            >
              {build.name}
            </h2>
          )}
          <button
            onClick={() => onDeleteBuild(build.id, build.name)}
            className="text-white hover:text-neon-green transition-colors"
            aria-label="Delete build"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-white text-sm">Budget:</span>
            {editingBudgetId === build.id ? (
              <div className="flex items-center">
                <input
                  type="number"
                  min={MIN_BUDGET}
                  value={editingBudgetValue}
                  onChange={(e) => onBudgetChange(parseFloat(e.target.value))}
                  onBlur={onSaveBudget}
                  onKeyPress={(e) => e.key === 'Enter' && onSaveBudget()}
                  className="w-24 p-1 bg-transparent border-2 border-neon-green rounded text-white text-sm shadow-[0_0_8px_rgba(0,255,65,0.5)] neon-text"
                  autoFocus
                />
              </div>
            ) : (
              <div 
                className="flex items-center cursor-pointer hover:text-neon-green transition-colors" 
                onClick={() => onEditBudget(build.id, build.budget)}
              >
                <span className="text-neon-green font-semibold neon-text">
                  ₹{build.budget.toLocaleString()}
                </span>
                <FiEdit2 className="w-3 h-3 ml-1 text-neon-green" />
              </div>
            )}
          </div>
          <div className="flex flex-col items-end">
            <span className="text-white text-xs">Current Total:</span>
            <span className={`text-sm font-bold ${calculateBuildPrice(build) > build.budget ? 'text-red-400' : 'text-neon-green neon-text'}`}>
              ₹{calculateBuildPrice(build).toLocaleString()}
            </span>
          </div>
        </div>

        <Droppable droppableId={`build-${build.id}`} direction="horizontal" type="component">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="flex flex-wrap gap-4 "
            >
              {['gpu', 'cpu', 'motherboard', 'ram'].map((type, index) => (
                <ComponentSlot
                  key={type}
                  component={build.components[type as ComponentType]}
                  type={type as ComponentType}
                  index={index}
                  buildId={build.id}
                  onRemove={onComponentRemove}
                />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    </div>
  );
}; 