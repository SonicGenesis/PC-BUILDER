import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type ComponentType = 'gpu' | 'cpu' | 'motherboard' | 'ram';
type PCComponent = {
  id: string;
  name: string;
  price: number;
  company: string;
  type: ComponentType;
  image?: string;
};

interface FavoritesStore {
  favorites: PCComponent[];
  toggleFavorite: (component: PCComponent) => void;
}

export const useFavorites = create<FavoritesStore>()(
  persist(
    (set) => ({
      favorites: [],
      toggleFavorite: (component) =>
        set((state) => {
          const exists = state.favorites.find((c) => c.id === component.id);
          if (exists) {
            return {
              favorites: state.favorites.filter((c) => c.id !== component.id),
            };
          }
          return {
            favorites: [...state.favorites, component],
          };
        }),
    }),
    {
      name: 'favorites-storage',
    }
  )
); 