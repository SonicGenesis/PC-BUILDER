"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { graphicsCards } from '../../../../data/PC.GRAPHICCARDS';
import { processors } from '../../../../data/PC.PROCESSORS';
import { motherboards } from '../../../../data/PC.MOTHERBOARDS';
import { ramModules } from '../../../../data/PC.RAM';
import Image from 'next/image';
import { FiEdit2, FiHeart, FiPlus, FiX, FiChevronDown, FiChevronRight, FiMonitor, FiPlay, FiCpu, FiCode, FiFilm, FiLock, FiUnlock, FiMaximize2, FiChevronLeft } from 'react-icons/fi';
import { HiHeart } from 'react-icons/hi';
import { useDialog } from '@/app/components/GlobalDialog';
import { useFavorites } from '@/store/useFavorites';
import {  RecommendationWithComponents } from './types/recommendations';
import { BUDGET_FLEXIBILITY_OPTIONS, BUDGET_RANGES, BUILD_PURPOSES, MIN_BUDGET } from './contants/pcBuilder';
import { COMPONENT_DISPLAY_NAMES, CUSTOM_BUDGET_CHIPS } from './contants/budget';
import { PURPOSE_RECOMMENDATIONS } from './contants/purposeRecemmendations';
import {  PCComponent, ComponentType, CategoryState } from './types/components';
import { BudgetFlexibility, BuildPurpose, PCBuild } from './types/builds';
import { DragDropResult } from './types/dragDrop';
import { checkCompatibility } from './types/recommendations';
import { getRecommendationMatch } from './utils/recommendations.helper';
import { PC_BUILDS_STORAGE_KEY } from './contants/builder.constant';

import { BuildHeader, EmptyBuildState, ComponentSlot } from './components/builderComponents/index';
import { BuildCard } from './components/builderComponents/buildCard';
import { BuilderSidenavComponents } from './components/builderComponents/builderSidenavComponents';
import { BuilderSidenavFavorites } from './components/builderComponents/builderSidenavFavorites';
import { handleDragEnd as dragDropHandler } from './utils/dragDrop.handler';
import { BuildsManagementButtons } from './components/builderComponents/BuildsManagementButtons';
import { BudgetFlexibilityDialog } from './components/dialogs/BudgetFlexibilityDialog';

// Update the CompatibilityTree component



// Add this constant for the storage key


export default function PcBuilderScreen() {
  const [builds, setBuilds] = useState<PCBuild[]>([]);

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
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            Choose the primary purpose for your PC build:
          </p>
          <div className="space-y-3">
            {BUILD_PURPOSES.map((purpose) => (
              <button
                key={purpose.id}
                onClick={() => showBudgetSelection(purpose)}
                className="w-full flex items-center gap-4 px-4 py-3 rounded-lg 
                  bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 
                  dark:hover:bg-gray-600 transition-colors"
              >
                <div className="text-gray-600 dark:text-gray-300">
                  {purpose.icon}
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-medium text-gray-800 dark:text-gray-200">
                    {purpose.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Estimated: ₹{purpose.minBudget.toLocaleString()} - 
                    {purpose.maxBudget ? `₹${purpose.maxBudget.toLocaleString()}` : 'Above'}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
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
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            {purpose.icon}
            <div>
              <h3 className="font-medium text-lg">{purpose.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {purpose.description}
              </p>
            </div>
          </div>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
            <p className="text-sm text-blue-600 dark:text-blue-400">
              Recommended range for {purpose.name.toLowerCase()}:
              <br />₹{purpose.minBudget.toLocaleString()} - 
              {purpose.maxBudget ? `₹${purpose.maxBudget.toLocaleString()}` : 'Above'}
            </p>
          </div>

          <div className="pt-2">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Select your preferred budget:
            </p>
            <div className="flex flex-wrap gap-2">
              {CUSTOM_BUDGET_CHIPS.map((chip) => {
                const isWithinRange = chip.value >= purpose.minBudget && 
                  (!purpose.maxBudget || chip.value <= purpose.maxBudget);
                
                return (
                  <button
                    key={chip.value}
                    onClick={() => {
                      if (!isWithinRange) {
                        showDialog({
                          type: 'confirm',
                          title: 'Budget Outside Recommended Range',
                          message: (
                            <div className="space-y-3">
                              <p>The selected budget is {chip.value < purpose.minBudget ? 'below' : 'above'} 
                                the recommended range for a {purpose.name.toLowerCase()}.</p>
                              <p>Would you like to continue anyway?</p>
                              <div className="space-y-2">
                                <button
                                  onClick={() => handleCreateBuild(chip.value)}
                                  className="w-full text-left px-4 py-2 rounded bg-blue-500 hover:bg-blue-600 text-white"
                                >
                                  Continue with {chip.label}
                                </button>
                                <button
                                  onClick={() => {
                                    // Go back to budget selection
                                  }}
                                  className="w-full text-left px-4 py-2 rounded bg-gray-500 hover:bg-gray-600 text-white"
                                >
                                  Select different budget
                                </button>
                              </div>
                            </div>
                          )
                        });
                        return;
                      }
                      handleCreateBuild(chip.value);
                    }}
                    className={`px-4 py-2 rounded-full transition-colors
                      ${isWithinRange 
                        ? 'bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/40 dark:hover:bg-blue-800/60 text-blue-700 dark:text-blue-300'
                        : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'}
                    `}
                  >
                    {chip.label}
                    {isWithinRange && (
                      <span className="ml-1 text-xs text-green-500">✓</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )
    });
  };

  const showBudgetSelection = (purpose: BuildPurpose) => {
    showDialog({
      type: 'confirm',
      title: 'Budget Flexibility',
      message: (
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            How flexible is your budget for this {purpose.name.toLowerCase()}?
          </p>
          <div className="space-y-3">
            {BUDGET_FLEXIBILITY_OPTIONS.map((option) => (
              <button
                key={option.id}
                onClick={() => {
                  // After selecting flexibility, show budget options
                  showDialog({
                    type: 'confirm',
                    title: `Select Budget for ${purpose.name}`,
                    message: (
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 mb-4">
                          {purpose.icon}
                          <div>
                            <h3 className="font-medium text-lg">{purpose.name}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {purpose.description}
                            </p>
                          </div>
                        </div>

                        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            {option.icon}
                            <span className="font-medium text-blue-700 dark:text-blue-300">
                              {option.label}
                            </span>
                          </div>
                          <p className="text-sm text-blue-600 dark:text-blue-400">
                            {option.description}
                          </p>
                        </div>

                        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                          <p className="text-sm text-blue-600 dark:text-blue-400">
                            Recommended range for {purpose.name.toLowerCase()}:
                            <br />₹{purpose.minBudget.toLocaleString()} - 
                            {purpose.maxBudget ? `₹${purpose.maxBudget.toLocaleString()}` : 'Above'}
                          </p>
                        </div>

                        <div className="pt-2">
                          <p className="text-gray-600 dark:text-gray-400 mb-3">
                            Select your preferred budget range:
                          </p>
                          <div className="space-y-2">
                            {BUDGET_RANGES.map((range) => (
                              <button
                                key={range.value}
                                onClick={() => {
                                  updateBuilds(prev => [...prev, {
                                    id: `build-${prev.length + 1}`,
                                    name: `${purpose.name} ${prev.length + 1}`,
                                    budget: range.value,
                                    purpose: purpose.id,
                                    budgetFlexibility: option.id as BudgetFlexibility,
                                    components: {}
                                  }]);
                                  showDialog({
                                    type: 'success',
                                    title: 'Build Created',
                                    message: `Created new ${purpose.name.toLowerCase()} with ${option.label.toLowerCase()} budget of ₹${range.value.toLocaleString()}`
                                  });
                                }}
                                className={`w-full text-left px-4 py-3 rounded-lg
                                  ${range.value >= purpose.minBudget && (!purpose.maxBudget || range.value <= purpose.maxBudget)
                                    ? 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                                    : 'bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400'}
                                  transition-colors text-gray-800 dark:text-gray-200`}
                              >
                                <div className="flex justify-between items-center">
                                  <span>{range.label}</span>
                                  {(range.value >= purpose.minBudget && (!purpose.maxBudget || range.value <= purpose.maxBudget)) && (
                                    <span className="text-green-500 text-sm">Recommended</span>
                                  )}
                                </div>
                              </button>
                            ))}
                            
                            {/* Add custom budget option */}
                            <button
                              onClick={() => handleCustomBudget(purpose)}
                              className="w-full text-left px-4 py-3 rounded-lg
                                bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600
                                transition-colors text-gray-800 dark:text-gray-200 mt-4"
                            >
                              <div className="flex justify-between items-center">
                                <div>
                                  <span className="font-medium">Custom Budget</span>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Choose from preset amounts or enter your own
                                  </p>
                                </div>
                                <FiEdit2 className="w-5 h-5 text-blue-500" />
                              </div>
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  });
                }}
                className="w-full flex items-center gap-4 px-4 py-3 rounded-lg 
                  bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 
                  dark:hover:bg-gray-600 transition-colors"
              >
                <div className="text-gray-600 dark:text-gray-300">
                  {option.icon}
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-medium text-gray-800 dark:text-gray-200">
                    {option.label}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {option.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
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
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            Choose the primary purpose for your PC build with {component.name}:
          </p>
          <div className="space-y-3">
            {BUILD_PURPOSES.map((purpose) => (
              <button
                key={purpose.id}
                onClick={() => showBudgetSelectionWithComponent(purpose, component)}
                className="w-full flex items-center gap-4 px-4 py-3 rounded-lg 
                  bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 
                  dark:hover:bg-gray-600 transition-colors"
              >
                <div className="text-gray-600 dark:text-gray-300">
                  {purpose.icon}
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-medium text-gray-800 dark:text-gray-200">
                    {purpose.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Estimated: ₹{purpose.minBudget.toLocaleString()} - 
                    {purpose.maxBudget ? `₹${purpose.maxBudget.toLocaleString()}` : 'Above'}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
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

  // Add a function to clear all builds (optional)
  const clearAllBuilds = () => {
    showDialog({
      type: 'confirm',
      title: 'Clear All Builds',
      message: 'Are you sure you want to delete all builds? This cannot be undone.',
      onConfirm: () => {
        updateBuilds([]);
        localStorage.removeItem(PC_BUILDS_STORAGE_KEY);
        showDialog({
          type: 'success',
          title: 'Builds Cleared',
          message: 'All builds have been deleted'
        });
      }
    });
  };

  // Add a function to export builds (optional)
  const exportBuilds = () => {
    const dataStr = JSON.stringify(builds, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    const exportFileDefaultName = `pc-builds-${new Date().toISOString().slice(0, 10)}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // Add a function to import builds (optional)
  const importBuilds = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedBuilds = JSON.parse(e.target?.result as string);
        updateBuilds(prev => [...prev, ...importedBuilds]);
        showDialog({
          type: 'success',
          title: 'Builds Imported',
          message: `Successfully imported ${importedBuilds.length} builds`
        });
      } catch (error) {
        showDialog({
          type: 'error',
          title: 'Import Failed',
          message: 'Failed to import builds. Please check the file format.'
        });
      }
    };
    reader.readAsText(file);
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
    // If no builds exist, prompt to create one
    if (builds.length === 0) {
      createBuildWithComponent(component);
      return;
    }

    const handleReplacement = (build: PCBuild) => {
      const existingComponent = build.components[component.type];
      
      if (existingComponent) {
        showDialog({
          type: 'confirm',
          title: 'Replace Component',
          message: (
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-400">
                This build already has a {COMPONENT_DISPLAY_NAMES[component.type].toLowerCase()}:
              </p>
              
              {/* Comparison View */}
              <div className="grid grid-cols-2 gap-4">
                {/* Existing Component */}
                <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                  <div className="text-xs text-red-500 mb-2">Current Component</div>
                  <div className="flex items-start gap-3">
                    <div className="w-16 h-16 relative bg-gray-200 dark:bg-gray-600 rounded-lg flex-shrink-0">
                      <Image
                        src={existingComponent.image || '/images/placeholder.jpg'}
                        alt={existingComponent.name}
                        fill
                        className="object-contain p-2"
                      />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">{existingComponent.name}</h4>
                      <p className="text-sm text-gray-500">₹{existingComponent.price.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                {/* New Component */}
                <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                  <div className="text-xs text-green-500 mb-2">New Component</div>
                  <div className="flex items-start gap-3">
                    <div className="w-16 h-16 relative bg-gray-200 dark:bg-gray-600 rounded-lg flex-shrink-0">
                      <Image
                        src={component.image || '/images/placeholder.jpg'}
                        alt={component.name}
                        fill
                        className="object-contain p-2"
                      />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">{component.name}</h4>
                      <p className="text-sm text-gray-500">₹{component.price.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Price Difference */}
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-blue-600 dark:text-blue-400">Price Difference:</span>
                  <span className={`font-medium ${
                    component.price > existingComponent.price 
                      ? 'text-red-500' 
                      : 'text-green-500'
                  }`}>
                    {component.price > existingComponent.price ? '+' : ''}
                    ₹{(component.price - existingComponent.price).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const updatedBuilds = builds.map(b => 
                      b.id === build.id 
                        ? { ...b, components: { ...b.components, [component.type]: component } }
                        : b
                    );
                    updateBuilds(updatedBuilds);
                    showDialog({
                      type: 'success',
                      title: 'Component Replaced',
                      message: `Successfully replaced with ${component.name}`
                    });
                  }}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Replace Component
                </button>
                <button
                  onClick={() => {
                    showDialog({
                      type: 'success',
                      title: 'Cancelled',
                      message: 'Component replacement cancelled'
                    });
                  }}
                  className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Keep Existing
                </button>
              </div>
            </div>
          )
        });
        return;
      }

      // Add new component if no existing component
      const updatedBuilds = builds.map(b => 
        b.id === build.id 
          ? { ...b, components: { ...b.components, [component.type]: component } }
          : b
      );
      updateBuilds(updatedBuilds);
      showDialog({
        type: 'success',
        title: 'Component Added',
        message: `${component.name} added to ${build.name}`
      });
    };

    // If only one build exists
    if (builds.length === 1) {
      handleReplacement(builds[0]);
      return;
    }

    // If multiple builds exist, show build selection dialog
    showDialog({
      type: 'confirm',
      title: 'Select Build',
      message: (
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            Select which build to add {component.name} to:
          </p>
          <div className="space-y-2">
            {builds.map((build) => (
              <button
                key={build.id}
                onClick={() => handleReplacement(build)}
                className="w-full flex items-center justify-between px-4 py-3 rounded-lg
                  bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 
                  dark:hover:bg-gray-600 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-gray-800 dark:text-gray-200">
                    {build.name}
                  </span>
                  {build.components[component.type] && (
                    <span className="text-xs px-2 py-1 rounded-full bg-yellow-500/10 text-yellow-500">
                      Will replace existing {COMPONENT_DISPLAY_NAMES[component.type]}
                    </span>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">
                    Current Total: ₹{calculateBuildPrice(build).toLocaleString()}
                  </div>
                  {build.components[component.type] && (
                    <div className="text-xs text-gray-400">
                      New Total: ₹{(
                        calculateBuildPrice(build) - 
                        (build.components[component.type]?.price || 0) + 
                        component.price
                      ).toLocaleString()}
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )
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
              <div className="py-4 px-6 border-b border-gray-700 bg-[#1F2937] sticky top-0 z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <h2 className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 text-xl">
                        QUICKPICK VAULT
                      </h2>
                      <div className="px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20">
                        <span className="text-xs font-medium text-purple-400">
                          Favorites
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-400 mt-1">
                      Your handpicked collection of preferred components
                    </p>
                  </div>
                  <div className="text-xs text-gray-400">
                    {favorites.length} items
                  </div>
                </div>
              </div>
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

