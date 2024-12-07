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

interface ComponentCardProps {
  component: PCComponent;
  builds: PCBuild[];
  provided: any;
  toggleFavorite: (component: PCComponent) => void;
  favorites: PCComponent[];
  handleComponentClick: (component: PCComponent) => void;
}

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
      {/* Recommendation Indicator */}
      {isRecommended && (
        <>
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-green-400/5 rounded-lg" />
          <div className="absolute -top-2 -right-2 flex items-center gap-1 bg-gradient-to-r from-green-500 to-green-400 text-white text-[10px] px-2 py-1 rounded-full shadow-lg z-10">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
            Recommended
          </div>
        </>
      )}
      
      {/* Component Content */}
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

const ComponentCardContent: React.FC<{
  component: PCComponent;
  isRecommended: boolean;
  bestMatch: number | null;
  toggleFavorite: (component: PCComponent) => void;
  favorites: PCComponent[];
}> = ({ component, isRecommended, bestMatch, toggleFavorite, favorites }) => (
  <div className="flex gap-3 relative z-[1]">
    {/* Component Image */}
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

    {/* Component Details */}
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

// Additional subcomponents...
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

// Export the main component
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

// Create remaining subcomponents... 