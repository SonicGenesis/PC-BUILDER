import React from 'react';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import Image from 'next/image';
import { FiHeart } from 'react-icons/fi';
import { HiHeart } from 'react-icons/hi';
import { PCComponent } from '../../types/components';
import { COMPONENT_DISPLAY_NAMES } from '../../contants/budget';

interface BuilderSidenavFavoritesProps {
  favorites: PCComponent[];
  toggleFavorite: (component: PCComponent) => void;
}

const FavoriteCard: React.FC<{
  component: PCComponent;
  provided: any;
  toggleFavorite: (component: PCComponent) => void;
}> = ({ component, provided, toggleFavorite }) => (
  <div
    ref={provided.innerRef}
    {...provided.draggableProps}
    {...provided.dragHandleProps}
    className="bg-gray-700 p-3 rounded-lg relative group hover:bg-gray-600 transition-all"
  >
    <div className="flex gap-3">
      <div className="w-14 h-14 relative bg-gray-800 rounded-lg p-1.5 flex items-center justify-center flex-shrink-0">
        <Image
          src={component.image || '/images/placeholder.jpg'}
          alt={component.name}
          fill
          className="object-contain p-1.5"
        />
      </div>

      <div className="flex-1">
        <div className="flex justify-between items-start gap-2">
          <div className="flex-1">
            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 mb-1 inline-block">
              {COMPONENT_DISPLAY_NAMES[component.type]}
            </span>
            <h3 className="font-medium text-white text-sm leading-tight mb-0.5 break-words">
              {component.name}
            </h3>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(component);
            }}
            className="p-1.5 rounded-full text-red-500 transition-all transform hover:scale-110 flex-shrink-0"
          >
            <HiHeart className="w-5 h-5" />
          </button>
        </div>

        <ComponentPrice price={component.price} />
      </div>
    </div>
  </div>
);

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

export const BuilderSidenavFavorites: React.FC<BuilderSidenavFavoritesProps> = ({
  favorites,
  toggleFavorite
}) => {
  return (
    <Droppable droppableId="favorites">
      {(provided) => (
        <div
          {...provided.droppableProps}
          ref={provided.innerRef}
          className="space-y-2"
        >
          {favorites.map((component, index) => (
            <Draggable
              key={component.id}
              draggableId={`fav-${component.id}`}
              index={index}
            >
              {(provided) => (
                <FavoriteCard
                  component={component}
                  provided={provided}
                  toggleFavorite={toggleFavorite}
                />
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
}; 