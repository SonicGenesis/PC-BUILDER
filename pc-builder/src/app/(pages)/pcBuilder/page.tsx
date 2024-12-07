"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import { graphicsCards } from '../../../../data/PC.GRAPHICCARDS';
import { processors } from '../../../../data/PC.PROCESSORS';
import { motherboards } from '../../../../data/PC.MOTHERBOARDS';
import { ramModules } from '../../../../data/PC.RAM';
import { FiChevronRight, FiChevronLeft } from 'react-icons/fi';
import { useDialog } from '@/app/components/GlobalDialog';
import { useFavorites } from '@/store/useFavorites';
import {  RecommendationWithComponents } from './types/recommendations';
import { MIN_BUDGET } from './contants/pcBuilder';
import { PURPOSE_RECOMMENDATIONS } from './contants/purposeRecemmendations';
import {  PCComponent, ComponentType, CategoryState } from './types/components';
import { BuildPurpose, PCBuild } from './types/builds';
import { DragDropResult } from './types/dragDrop';
import { PC_BUILDS_STORAGE_KEY } from './contants/builder.constant';
import { BuildHeader, EmptyBuildState } from './components/builderComponents/index';
import { BuildCard } from './components/builderComponents/buildCard';
import { BuilderSidenavComponents } from './components/builderComponents/builderSidenavComponents';
import { BuilderSidenavFavorites } from './components/builderComponents/builderSidenavFavorites';
import { handleDragEnd as dragDropHandler } from './utils/dragDrop.handler';
import { BuildsManagementButtons } from './components/builderComponents/BuildsManagementButtons';
import { BudgetFlexibilityDialog } from './components/dialogs/BudgetFlexibilityDialog';
import { CustomBudgetDialog } from './components/dialogs/CustomBudgetDialog';
import { buildManagement } from './utils/buildManagement';
import { handleComponentClick as componentClickHandler } from './utils/componentClick.handler';
import { BudgetFlexibilityOptionsDialog } from './components/dialogs/BudgetFlexibilityOptionsDialog';
import { BuildPurposeSelectionDialog } from './components/dialogs/BuildPurposeSelectionDialog';
import { ComponentLibraryHeader } from './components/builderComponents/ComponentLibraryHeader';
import { FavoritesHeader } from './components/builderComponents/FavoritesHeader';
import { NewBuildPurposeDialog } from './components/dialogs/NewBuildPurposeDialog';


export default function PcBuilderScreen() {
  const [builds, setBuilds] = useState<PCBuild[]>([]);
  // Add a function to clear all builds (optional)
  const clearAllBuilds = () => {
    buildManagement.clearAllBuilds({ builds, updateBuilds, showDialog });
  };

  // Add a function to export builds (optional)
  const exportBuilds = () => {
    buildManagement.exportBuilds({ builds, updateBuilds, showDialog });
  };

  // Add a function to import builds (optional)
  const importBuilds = (event: React.ChangeEvent<HTMLInputElement>) => {
    buildManagement.importBuilds(event, { builds, updateBuilds, showDialog });
  };
  // Handle localStorage in useEffect
  useEffect(() => {
    // Load builds from localStorage on mount
    const savedBuilds = localStorage.getItem(PC_BUILDS_STORAGE_KEY);
    if (savedBuilds) {
      try {
        const parsedBuilds = JSON.parse(savedBuilds);
        setBuilds(parsedBuilds);
      } catch (error) {
        console.error('Error loading builds from localStorage:', error);
      }
    }
  }, []); // Empty dependency array means this runs once on mount

  // Save to localStorage whenever builds change
  useEffect(() => {
    localStorage.setItem(PC_BUILDS_STORAGE_KEY, JSON.stringify(builds));
  }, [builds]);

  // Create a wrapper function for setBuilds
  const updateBuilds = (newBuilds: PCBuild[] | ((prev: PCBuild[]) => PCBuild[])) => {
    setBuilds(newBuilds);
  };

  const { showDialog } = useDialog();
  const [availableComponents, setAvailableComponents] = useState<PCComponent[]>([]);

  // Initialize availableComponents in useEffect
  useEffect(() => {
    const components: PCComponent[] = [
      ...graphicsCards.map(c => ({ ...c, type: 'gpu' as const })),
      ...processors.map(c => ({ ...c, type: 'cpu' as const })),
      ...motherboards.map(c => ({ ...c, type: 'motherboard' as const })),
      ...ramModules.map(c => ({ ...c, type: 'ram' as const }))
    ];
    setAvailableComponents(components);
  }, []);

  const { favorites, toggleFavorite } = useFavorites();

  const [editingBuildId, setEditingBuildId] = useState<string | null>(null);
  const [editingBuildName, setEditingBuildName] = useState('');

  const [expandedCategories, setExpandedCategories] = useState<CategoryState>({
    gpu: true,
    cpu: false,
    motherboard: false,
    ram: false
  });

  const toggleCategory = (category: ComponentType) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const addNewBuild = () => {
    showDialog({
      type: 'confirm',
      title: 'Select Build Purpose',
      message: (
        <NewBuildPurposeDialog
          showBudgetSelection={showBudgetSelection}
        />
      )
    });
  };

  const startEditingBuildName = (buildId: string, currentName: string) => {
    setEditingBuildId(buildId);
    setEditingBuildName(currentName);
  };

  const saveBuildName = () => {
    if (!editingBuildId || !editingBuildName.trim()) return;
    
    updateBuilds(prev => prev.map(build => 
      build.id === editingBuildId 
        ? { ...build, name: editingBuildName.trim() }
        : build
    ));
    
    setEditingBuildId(null);
    setEditingBuildName('');
  };

  const calculateBuildPrice = (build: PCBuild) => {
    return Object.values(build.components).reduce((total, component) => {
      return total + (component?.price || 0);
    }, 0);
  };

  const handleComponentRemove = (buildId: string, componentType: ComponentType) => {
    updateBuilds(prev => prev.map(build => {
      if (build.id === buildId) {
        const newComponents = { ...build.components };
        delete newComponents[componentType];
        return { ...build, components: newComponents };
      }
      return build;
    }));
  };

  const handleBuildDelete = (buildId: string, buildName: string) => {
    showDialog({
      type: 'confirm',
      title: 'Delete Build',
      message: `Are you sure you want to delete "${buildName}"?`,
      onConfirm: () => {
        updateBuilds(prev => prev.filter(b => b.id !== buildId));
        showDialog({
          type: 'success',
          title: 'Build Deleted',
          message: `"${buildName}" has been deleted`
        });
      }
    });
  };

  const componentsByType = availableComponents.reduce((acc, component) => {
    if (!acc[component.type]) {
      acc[component.type] = [];
    }
    acc[component.type].push(component);
    return acc;
  }, {} as Record<ComponentType, PCComponent[]>);

  // Add this new state for budget editing
  const [editingBudgetId, setEditingBudgetId] = useState<string | null>(null);
  const [editingBudgetValue, setEditingBudgetValue] = useState<number>(0);

  // Add these new functions
  const startEditingBudget = (buildId: string, currentBudget: number) => {
    setEditingBudgetId(buildId);
    setEditingBudgetValue(currentBudget);
  };

  const saveBudget = () => {
    if (!editingBudgetId) return;
    
    if (editingBudgetValue < MIN_BUDGET) {
      showDialog({
        type: 'error',
        title: 'Invalid Budget',
        message: `Budget cannot be less than ₹${MIN_BUDGET.toLocaleString()}. Please enter a higher amount.`
      });
      return;
    }
    
    updateBuilds(prev => prev.map(build => 
      build.id === editingBudgetId 
        ? { ...build, budget: editingBudgetValue }
        : build
    ));
    
    setEditingBudgetId(null);
  };

  // Modify the handleCustomBudget function
  const handleCustomBudget = (purpose: BuildPurpose) => {
    console.log('Opening custom budget dialog');

    const handleCreateBuild = (budgetValue: number) => {
      console.log('Creating build with budget:', budgetValue);
      updateBuilds(prev => [...prev, {
        id: `build-${prev.length + 1}`,
        name: `${purpose.name} ${prev.length + 1}`,
        budget: budgetValue,
        purpose: purpose.id,
        budgetFlexibility: 'strict',
        components: {}
      }]);

      showDialog({
        type: 'success',
        title: 'Build Created',
        message: `Created new ${purpose.name.toLowerCase()} with budget: ₹${budgetValue.toLocaleString()}`
      });
    };

    showDialog({
      type: 'confirm',
      title: 'Select Custom Budget',
      message: (
        <CustomBudgetDialog
          purpose={purpose}
          handleCreateBuild={handleCreateBuild}
          showDialog={showDialog}
        />
      )
    });
  };

  const showBudgetSelection = (purpose: BuildPurpose) => {
    showDialog({
      type: 'confirm',
      title: 'Budget Flexibility',
      message: (
        <BudgetFlexibilityOptionsDialog
          purpose={purpose}
          updateBuilds={updateBuilds}
          showDialog={showDialog}
          handleCustomBudget={handleCustomBudget}
        />
      )
    });
  };

  // Move getRecommendedComponents inside the component
  const getRecommendedComponents = (build: PCBuild): RecommendationWithComponents[] => {
    const recommendations = PURPOSE_RECOMMENDATIONS[build.purpose] || [];
    const budget = build.budget;
    
    return recommendations.map(rec => {
      const targetPrice = (budget * rec.percentage) / 100;
      const tolerance = build.budgetFlexibility === 'strict' ? 0.1 : 
                       build.budgetFlexibility === 'flexible' ? 0.2 : 0.3;
      
      const minPrice = targetPrice * (1 - tolerance);
      const maxPrice = targetPrice * (1 + tolerance);
      
      const recommendedComponents = availableComponents.filter((comp: PCComponent) => 
        comp.type === rec.type && 
        comp.price >= minPrice && 
        comp.price <= maxPrice
      );

      return {
        ...rec,
        components: recommendedComponents,
      };
    });
  };

  // Move getRecommendationStatus inside as well
  const getRecommendationStatus = (type: ComponentType, build: PCBuild) => {
    const recommendations = getRecommendedComponents(build);
    const recommendation = recommendations.find((rec: RecommendationWithComponents) => rec.type === type);
    
    if (!recommendation) return null;
    
    return {
      hasRecommendations: recommendation.components.length > 0,
      count: recommendation.components.length,
      percentage: recommendation.percentage,
      targetBudget: (build.budget * recommendation.percentage) / 100
    };
  };

  // Move the helper functions inside the component
  const createBuildWithComponent = (component: PCComponent) => {
    showDialog({
      type: 'confirm',
      title: 'Select Build Purpose',
      message: (
        <BuildPurposeSelectionDialog
          component={component}
          showBudgetSelectionWithComponent={showBudgetSelectionWithComponent}
        />
      )
    });
  };

  const showBudgetSelectionWithComponent = (purpose: BuildPurpose, component: PCComponent) => {
    showDialog({
      type: 'confirm',
      title: 'Budget Flexibility',
      message: (
        <BudgetFlexibilityDialog
          purpose={purpose}
          showDialog={showDialog}
          component={component}
          builds={builds}
          updateBuilds={updateBuilds}
        />
      )
    });
  };

  const handleDragEnd = (result: DragDropResult) => {
    dragDropHandler({
      result,
      builds,
      availableComponents,
      updateBuilds,
      showDialog,
      calculateBuildPrice,
      createBuildWithComponent,
    });
  };


  // Keep these state declarations
  const [sidebarWidth, setSidebarWidth] = useState(320); // Default width 320px
  const [isResizing, setIsResizing] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const minWidth = 280; // Minimum sidebar width
  const maxWidth = 480; // Maximum sidebar width

  // Keep these handlers
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isResizing) {
      const newWidth = e.clientX;
      if (newWidth >= minWidth && newWidth <= maxWidth) {
        setSidebarWidth(newWidth);
      }
    }
  }, [isResizing]);

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, handleMouseMove, handleMouseUp]);

  // Add this new function near your other handlers
  const handleComponentClick = (component: PCComponent) => {
    componentClickHandler({
      component,
      builds,
      updateBuilds,
      showDialog,
      createBuildWithComponent,
      calculateBuildPrice,
    });
  };

  return (
    <div className="min-h-screen w-full pt-20 pb-16 bg-[#111827]">
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex gap-6 px-6 pt-4 relative">
          {/* Sidebar Container */}
          <div 
            className="w-80 flex-shrink-0 flex flex-col h-[calc(100vh-6rem)] space-y-4 relative"
            style={{ width: sidebarWidth }}
          >
            {/* Component Library Section */}
            <div className="flex-1 bg-[#1F2937] rounded-xl overflow-hidden flex flex-col">
              <ComponentLibraryHeader />
              <div className="p-4 overflow-y-auto flex-1">
                <BuilderSidenavComponents 
                  componentsByType={componentsByType}
                  builds={builds}
                  expandedCategories={expandedCategories}
                  toggleCategory={toggleCategory}
                  getRecommendationStatus={getRecommendationStatus}
                  toggleFavorite={toggleFavorite}
                  favorites={favorites}
                  handleComponentClick={handleComponentClick}
                />
              </div>
            </div>

            {/* Favorites Section */}
            <div className="flex-1 bg-[#1F2937] rounded-xl overflow-hidden flex flex-col mt-4">
              <FavoritesHeader favoritesCount={favorites.length} />
              <div className="p-4 overflow-y-auto flex-1">
                <BuilderSidenavFavorites 
                  favorites={favorites}
                  toggleFavorite={toggleFavorite}
                />
              </div>
            </div>

            {/* Simple resize handle */}
            <div
              className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-blue-500/50"
              onMouseDown={() => setIsResizing(true)}
            />
          </div>

          {/* Toggle Sidebar Button */}
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className={`absolute left-2 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full 
              bg-[#1F2937] hover:bg-[#2D3748] transition-all duration-300
              ${isSidebarCollapsed ? 'translate-x-0' : 'translate-x-0'}`}
          >
            {isSidebarCollapsed ? (
              <FiChevronRight className="w-5 h-5 text-gray-400" />
            ) : (
              <FiChevronLeft className="w-5 h-5 text-gray-400" />
            )}
          </button>

          {/* Main Content */}
          <div className={`flex-1 flex flex-col transition-all duration-300
            ${isSidebarCollapsed ? 'ml-8' : ''}`}>
            <BuildHeader 
              buildsCount={builds.length} 
              onAddNewBuild={addNewBuild} 
            />

            <div className="flex gap-6 overflow-x-auto pb-6">
              {builds.length === 0 ? (
                <EmptyBuildState onAddNewBuild={addNewBuild} />
              ) : (
                builds.map((build) => (
                  <BuildCard
                    key={build.id}
                    build={build}
                    editingBuildId={editingBuildId}
                    editingBuildName={editingBuildName}
                    editingBudgetId={editingBudgetId}
                    editingBudgetValue={editingBudgetValue}
                    MIN_BUDGET={MIN_BUDGET}
                    onEditName={startEditingBuildName}
                    onSaveName={saveBuildName}
                    onDeleteBuild={handleBuildDelete}
                    onEditBudget={startEditingBudget}
                    onSaveBudget={saveBudget}
                    onBudgetChange={setEditingBudgetValue}
                    onComponentRemove={handleComponentRemove}
                    calculateBuildPrice={calculateBuildPrice}
                  />
                ))
              )}
            </div>

            <BuildsManagementButtons 
              exportBuilds={exportBuilds}
              importBuilds={importBuilds}
              clearAllBuilds={clearAllBuilds}
            />
          </div>
        </div>
      </DragDropContext>
    </div>
  );
}