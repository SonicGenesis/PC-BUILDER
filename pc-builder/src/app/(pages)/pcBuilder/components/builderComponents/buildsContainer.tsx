import { PCBuild } from '../../types/builds';
import { ComponentType } from '../../types/components';
import { BuildHeader } from './buildHeader';
import { EmptyBuildState } from './emptyBuildState';
import { BuildCard } from './buildCard';
import { Droppable } from '@hello-pangea/dnd';
import { ComponentSlot } from './componentSlot';
import { checkCompatibility } from '../../types/recommendations';
import { CompatibilityTree } from '../compatibiltyComponents/compatibilityTree';
import { FiEdit2, FiX } from 'react-icons/fi';

interface BuildsContainerProps {
  builds: PCBuild[];
  isSidebarCollapsed: boolean;
  editingBuildId: string | null;
  editingBuildName: string;
  editingBudgetId: string | null;
  editingBudgetValue: number;
  MIN_BUDGET: number;
  onAddNewBuild: () => void;
  setEditingBuildName: (value: string) => void;
  saveBuildName: () => void;
  startEditingBuildName: (buildId: string, name: string) => void;
  handleBuildDelete: (buildId: string, name: string) => void;
  setEditingBudgetValue: (value: number) => void;
  saveBudget: () => void;
  startEditingBudget: (buildId: string, budget: number) => void;
  handleComponentRemove: (buildId: string, type: ComponentType) => void;
  calculateBuildPrice: (build: PCBuild) => number;
}

export const BuildsContainer = ({
  builds,
  isSidebarCollapsed,
  editingBuildId,
  editingBuildName,
  editingBudgetId,
  editingBudgetValue,
  MIN_BUDGET,
  onAddNewBuild,
  setEditingBuildName,
  saveBuildName,
  startEditingBuildName,
  handleBuildDelete,
  setEditingBudgetValue,
  saveBudget,
  startEditingBudget,
  handleComponentRemove,
  calculateBuildPrice,
}: BuildsContainerProps) => {
  return (
    <div className={`flex-1 flex flex-col transition-all duration-300
      ${isSidebarCollapsed ? 'ml-8' : ''}`}>
      <BuildHeader 
        buildsCount={builds.length} 
        onAddNewBuild={onAddNewBuild} 
      />

      <div className="flex gap-6 overflow-x-auto pb-6">
        {builds.length === 0 ? (
          <EmptyBuildState onAddNewBuild={onAddNewBuild} />
        ) : (
          builds.map((build) => (
            <div
              key={build.id}
              className="bg-[#1F2937] rounded-xl p-6 min-w-[350px] relative z-0 overflow-visible"
            >
              <CompatibilityTree nodes={checkCompatibility(build)} build={build} />

              <div className="pl-8">
                <div className="flex justify-between items-center mb-6">
                  {editingBuildId === build.id ? (
                    <input
                      type="text"
                      value={editingBuildName}
                      onChange={(e) => setEditingBuildName(e.target.value)}
                      onBlur={saveBuildName}
                      onKeyPress={(e) => e.key === 'Enter' && saveBuildName()}
                      className="text-xl font-bold bg-transparent border-b border-gray-600 focus:outline-none focus:border-blue-500 text-white"
                      autoFocus
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-bold text-white">{build.name}</h2>
                      <button
                        onClick={() => startEditingBuildName(build.id, build.name)}
                        className="p-1 text-gray-400 hover:text-gray-300"
                      >
                        <FiEdit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleBuildDelete(build.id, build.name)}
                        className="p-1 text-gray-400 hover:text-gray-300"
                      >
                        <FiX className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  <div className="text-right">
                    <div className="flex items-center justify-end gap-2 mb-1">
                      {editingBudgetId === build.id ? (
                        <input
                          type="number"
                          min={MIN_BUDGET}
                          value={editingBudgetValue}
                          onChange={(e) => {
                            const value = Math.max(0, parseInt(e.target.value) || 0);
                            setEditingBudgetValue(value);
                          }}
                          onBlur={saveBudget}
                          onKeyPress={(e) => e.key === 'Enter' && saveBudget()}
                          className="w-32 px-2 py-1 text-sm bg-transparent border-b border-gray-600 
                            focus:outline-none focus:border-blue-500 text-white text-right"
                          placeholder={`Min ₹${MIN_BUDGET.toLocaleString()}`}
                          autoFocus
                        />
                      ) : (
                        <>
                          <span className="text-sm text-gray-400">
                            Budget: ₹{build.budget.toLocaleString()}
                          </span>
                          <button
                            onClick={() => startEditingBudget(build.id, build.budget)}
                            className="p-1 text-gray-400 hover:text-gray-300"
                          >
                            <FiEdit2 size={12} />
                          </button>
                        </>
                      )}
                    </div>
                    <p className={`text-lg font-medium ${
                      calculateBuildPrice(build) > build.budget 
                        ? 'text-red-500' 
                        : 'text-white'
                    }`}>
                      Total: ₹{calculateBuildPrice(build).toLocaleString()}
                    </p>
                  </div>
                </div>
                
                <Droppable droppableId={build.id}>
                  {(provided, snapshot) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="space-y-4"
                    >
                      {['cpu', 'motherboard', 'ram', 'gpu'].map((type) => (
                        <ComponentSlot
                          key={type}
                          type={type as ComponentType}
                          component={build.components[type as ComponentType]}
                          isDraggingOver={snapshot.isDraggingOver}
                          onRemove={() => handleComponentRemove(build.id, type as ComponentType)}
                        />
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}; 