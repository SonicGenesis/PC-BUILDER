import React from 'react';

interface FavoritesHeaderProps {
  favoritesCount: number;
}

export const FavoritesHeader: React.FC<FavoritesHeaderProps> = ({
  favoritesCount
}) => (
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
        {favoritesCount} items
      </div>
    </div>
  </div>
); 