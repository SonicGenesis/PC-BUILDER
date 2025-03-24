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
      className={`bg-card-bg p-3 rounded-lg relative group transition-all cursor-pointer
        ${isRecommended ? 
          'neon-border neon-glow' : 
          'border border-gray-800 hover:border-neon-green/50 hover:shadow-neon-glow'
        }
      `}
      onClick={() => handleComponentClick(component)}
    >
      {/* Recommendation Indicator */}
      {isRecommended && (
        <>
          <div className="absolute inset-0 bg-neon-green-glow/10 rounded-lg" />
          <div className="absolute -top-2 -right-2 flex items-center gap-1 bg-neon-green text-black text-[10px] px-2 py-1 rounded-full shadow-neon-glow z-10">
            <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse"></span>
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
    <div className={`w-16 h-16 relative bg-dark-bg rounded-lg p-1.5 flex items-center justify-center flex-shrink-0
      ${isRecommended ? 'ring-1 ring-neon-green' : ''}
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
        ? 'text-neon-green neon-text'
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

const ComponentPrice: React.FC<{ price: number }> = ({ price }) => (
  <p className="text-neon-green font-medium text-sm neon-text">
    ₹{price.toLocaleString()}
  </p>
);

const MatchIndicator: React.FC<{ match: number }> = ({ match }) => (
  <div className="flex items-center mt-1">
    <div className="bg-dark-bg rounded-full h-1.5 w-full">
      <div 
        className="bg-neon-green h-1.5 rounded-full"
        style={{ width: `${match}%` }}
      />
    </div>
    <span className="text-[10px] font-medium text-neon-green ml-2 neon-text">
      {Math.round(match)}% Match
    </span>
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
          'bg-neon-green/10 text-neon-green border border-neon-green/30' : 
          'bg-gray-700 text-gray-300'
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
  <div className="bg-[#1E2939] rounded-lg overflow-hidden">
    <button
      onClick={() => toggleCategory(type)}
      className="w-full px-4 py-3 flex items-center justify-between text-white hover:bg-[#2A3749] transition-colors relative"
    >
      <span className="font-medium flex items-center gap-2">
        {COMPONENT_DISPLAY_NAMES[type]}
        {builds.map(build => {
          const status = getRecommendationStatus(type, build);
          if (status?.hasRecommendations) {
            return (
              <span key={build.id} className="flex items-center">
                <span className="w-2 h-2 rounded-full bg-neon-green" />
                <span className="ml-2 text-xs text-neon-green">
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
    
    {expandedCategories[type] && (
      <div className="p-4 bg-[#161D29] border-t border-[#2A3749]">
        <div className="space-y-3">
          {components.map((component, index) => (
            <Draggable key={component.id} draggableId={component.id} index={index}>
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
          {components.length === 0 && (
            <div className="text-center py-4 text-gray-400">
              <p>No components found</p>
            </div>
          )}
        </div>
      </div>
    )}
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
    <div className="flex flex-col">
      <div className="bg-[#172030] p-4 rounded-t-lg">
        <div className="flex justify-between items-center">
          <h2 className="text-[#4D9FFF] font-bold text-lg">COMPONENT LIBRARY</h2>
          <span className="text-gray-400 text-xs">Drag & Drop</span>
        </div>
        <p className="text-gray-400 text-sm mt-1">
          Browse and select from our curated collection of high-performance parts
        </p>
      </div>

      <Droppable droppableId="components">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="space-y-1 bg-[#13192A] p-2 rounded-b-lg"
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
    </div>
  );
}; 