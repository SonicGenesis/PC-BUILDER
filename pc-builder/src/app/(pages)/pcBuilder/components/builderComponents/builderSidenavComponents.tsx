import React from 'react';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import Image from 'next/image';
import { FiChevronDown, FiChevronRight, FiHeart } from 'react-icons/fi';
import { HiHeart } from 'react-icons/hi';
import { PCComponent, ComponentType, CategoryState } from '../../types/components';
import { PCBuild } from '../../types/builds';
import { COMPONENT_DISPLAY_NAMES } from '../../contants/budget';
import { checkCompatibility } from '../../types/recommendations';
import { getRecommendationMatch } from '../../utils/recommendations.helper';

// Component Interfaces
interface BuilderSidenavComponentsProps {
  componentsByType: Record<ComponentType, PCComponent[]>;
  builds: PCBuild[];
  expandedCategories: CategoryState;
  toggleCategory: (type: ComponentType) => void;
  getRecommendationStatus: (type: ComponentType, build: PCBuild) => any;
  toggleFavorite: (component: PCComponent) => void;
  favorites: PCComponent[];
  handleComponentClick: (component: PCComponent) => void;
}

interface ComponentCardProps {
  component: PCComponent;
  builds: PCBuild[];
  provided: any;
  toggleFavorite: (component: PCComponent) => void;
  favorites: PCComponent[];
  handleComponentClick: (component: PCComponent) => void;
}

// Subcomponents
const ComponentPrice: React.FC<{ price: number }> = ({ price }) => (
  <div className="flex items-baseline gap-1">
    <span className="text-base font-bold text-white">
      ₹{Math.floor(price).toLocaleString()}
    </span>
    <span className="text-xs text-gray-400">
      .{(price % 1).toFixed(2).slice(2)}
    </span>
  </div>
);

const MatchIndicator: React.FC<{ match: number }> = ({ match }) => (
  <div className="flex items-center gap-2 mt-2">
    <div className="flex-1 h-1 rounded-full bg-gray-700 overflow-hidden">
      <div 
        className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full"
        style={{ width: `${match}%` }}
      />
    </div>
    <span className="text-xs text-green-400">{match}% match</span>
  </div>
);

const FavoriteButton: React.FC<{
  component: PCComponent;
  toggleFavorite: (component: PCComponent) => void;
  favorites: PCComponent[];
}> = ({ component, toggleFavorite, favorites }) => (
  <button
    onClick={(e) => {
      e.stopPropagation();
      toggleFavorite(component);
    }}
    className={`p-1.5 rounded-full transition-all transform hover:scale-110 flex-shrink-0
      ${favorites.some(c => c.id === component.id)
        ? 'text-red-500'
        : 'text-gray-400 opacity-0 group-hover:opacity-100'
      }`}
  >
    {favorites.some(c => c.id === component.id) ? (
      <HiHeart className="w-5 h-5" />
    ) : (
      <FiHeart className="w-5 h-5" />
    )}
  </button>
);

const ComponentHeader: React.FC<{
  component: PCComponent;
  isRecommended: boolean;
  toggleFavorite: (component: PCComponent) => void;
  favorites: PCComponent[];
}> = ({ component, isRecommended, toggleFavorite, favorites }) => (
  <div className="flex justify-between items-start gap-2">
    <div className="flex-1">
      <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full mb-1 inline-block
        ${isRecommended ? 
          'bg-green-500/10 text-green-400' : 
          'bg-blue-500/10 text-blue-400'
        }`}
      >
        {COMPONENT_DISPLAY_NAMES[component.type]}
      </span>
      <h3 className="font-medium text-white text-sm leading-tight mb-0.5 break-words">
        {component.name}
      </h3>
      <p className="text-xs text-gray-400 mb-1">
        by {component.company}
      </p>
    </div>
    <FavoriteButton 
      component={component}
      toggleFavorite={toggleFavorite}
      favorites={favorites}
    />
  </div>
);

const ComponentCardContent: React.FC<{
  component: PCComponent;
  isRecommended: boolean;
  bestMatch: number | null;
  toggleFavorite: (component: PCComponent) => void;
  favorites: PCComponent[];
}> = ({ component, isRecommended, bestMatch, toggleFavorite, favorites }) => (
  <div className="flex gap-3 relative z-[1]">
    <div className={`w-16 h-16 relative bg-[#2D3748] rounded-lg p-1.5 flex items-center justify-center flex-shrink-0
      ${isRecommended ? 'ring-1 ring-green-500/20' : ''}
    `}>
      <Image
        src={component.image || '/images/placeholder.jpg'}
        alt={component.name}
        fill
        className="object-contain p-1.5"
      />
    </div>

    <div className="flex-1">
      <ComponentHeader 
        component={component}
        isRecommended={isRecommended}
        toggleFavorite={toggleFavorite}
        favorites={favorites}
      />
      <ComponentPrice price={component.price} />
      {isRecommended && bestMatch && <MatchIndicator match={bestMatch} />}
    </div>
  </div>
);

const ComponentCard: React.FC<ComponentCardProps> = ({
  component,
  builds,
  provided,
  toggleFavorite,
  favorites,
  handleComponentClick
}) => {
  const recommendations = builds.map(build => {
    const match = getRecommendationMatch(component, build);
    return {
      buildName: build.name,
      match: match,
      isCompatible: checkCompatibility(build).some(node => 
        node.type === component.type && 
        node.status === 'compatible'
      )
    };
  }).filter(rec => rec.match && rec.match > 70);

  const bestMatch = recommendations.length > 0 ? 
    Math.max(...recommendations.map(r => r.match || 0)) : 
    null;

  const isRecommended = recommendations.length > 0;

  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      className={`bg-[#374151] p-3 rounded-lg relative group transition-all hover:shadow-lg hover:bg-[#3D4759] cursor-pointer
        ${isRecommended ? 
          'ring-2 ring-green-500/50 dark:ring-green-400/50 shadow-[0_0_10px_rgba(34,197,94,0.2)] dark:shadow-[0_0_15px_rgba(34,197,94,0.15)]' : 
          'hover:shadow-black/5'
        }
      `}
      onClick={() => handleComponentClick(component)}
    >
      {isRecommended && (
        <>
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-green-400/5 rounded-lg" />
          <div className="absolute -top-2 -right-2 flex items-center gap-1 bg-gradient-to-r from-green-500 to-green-400 text-white text-[10px] px-2 py-1 rounded-full shadow-lg z-10">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
            Recommended
          </div>
        </>
      )}
      
      <ComponentCardContent 
        component={component}
        isRecommended={isRecommended}
        bestMatch={bestMatch}
        toggleFavorite={toggleFavorite}
        favorites={favorites}
      />
    </div>
  );
};

const ComponentCategory: React.FC<{
  type: ComponentType;
  components: PCComponent[];
  builds: PCBuild[];
  expandedCategories: CategoryState;
  toggleCategory: (type: ComponentType) => void;
  getRecommendationStatus: (type: ComponentType, build: PCBuild) => any;
  toggleFavorite: (component: PCComponent) => void;
  favorites: PCComponent[];
  handleComponentClick: (component: PCComponent) => void;
}> = ({
  type,
  components,
  builds,
  expandedCategories,
  toggleCategory,
  getRecommendationStatus,
  toggleFavorite,
  favorites,
  handleComponentClick
}) => (
  <div className="bg-[#2D3748] rounded-lg overflow-hidden">
    <button
      onClick={() => toggleCategory(type)}
      className="w-full px-4 py-3 flex items-center justify-between text-white hover:bg-[#374151] transition-colors relative"
    >
      <span className="font-medium flex items-center gap-2">
        {COMPONENT_DISPLAY_NAMES[type]}
        {builds.map(build => {
          const status = getRecommendationStatus(type, build);
          if (status?.hasRecommendations) {
            return (
              <span key={build.id} className="flex items-center">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="ml-2 text-xs text-green-400">
                  {status.count} recommended
                </span>
              </span>
            );
          }
          return null;
        })}
      </span>
      {expandedCategories[type] ? (
        <FiChevronDown className="w-5 h-5" />
      ) : (
        <FiChevronRight className="w-5 h-5" />
      )}
    </button>
    
    <div className={`
      overflow-hidden transition-all duration-200 ease-in-out
      ${expandedCategories[type] ? 'max-h-[400px]' : 'max-h-0'}
    `}>
      {builds.length > 0 && (
        <div className="px-4 py-2 bg-gray-800">
          {builds.map(build => {
            const status = getRecommendationStatus(type, build);
            if (status?.hasRecommendations) {
              return (
                <div key={build.id} className="text-sm text-gray-400">
                  <p className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500" />
                    For {build.name}:
                  </p>
                  <p className="ml-4">
                    Budget allocation: ₹{Math.round(status.targetBudget).toLocaleString()} ({status.percentage}%)
                  </p>
                  <p className="ml-4">
                    {status.count} compatible options found
                  </p>
                </div>
              );
            }
            return null;
          })}
        </div>
      )}
      <div className="space-y-2 p-2 overflow-y-auto max-h-[350px] scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
        {components.map((component, index) => (
          <Draggable
            key={component.id}
            draggableId={component.id}
            index={index}
          >
            {(provided) => (
              <ComponentCard
                component={component}
                builds={builds}
                provided={provided}
                toggleFavorite={toggleFavorite}
                favorites={favorites}
                handleComponentClick={handleComponentClick}
              />
            )}
          </Draggable>
        ))}
      </div>
    </div>
  </div>
);

export const BuilderSidenavComponents: React.FC<BuilderSidenavComponentsProps> = ({
  componentsByType,
  builds,
  expandedCategories,
  toggleCategory,
  getRecommendationStatus,
  toggleFavorite,
  favorites,
  handleComponentClick
}) => {
  return (
    <Droppable droppableId="components">
      {(provided) => (
        <div
          {...provided.droppableProps}
          ref={provided.innerRef}
          className="space-y-4"
        >
          {Object.entries(componentsByType).map(([type, components]) => (
            <ComponentCategory
              key={type}
              type={type as ComponentType}
              components={components}
              builds={builds}
              expandedCategories={expandedCategories}
              toggleCategory={toggleCategory}
              getRecommendationStatus={getRecommendationStatus}
              toggleFavorite={toggleFavorite}
              favorites={favorites}
              handleComponentClick={handleComponentClick}
            />
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
}; 