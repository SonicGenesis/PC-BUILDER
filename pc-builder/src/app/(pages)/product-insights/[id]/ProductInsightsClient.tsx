"use client";
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { graphicsCards } from '../../../../../data/PC.GRAPHICCARDS';
import { processors } from '../../../../../data/PC.PROCESSORS';
import { motherboards } from '../../../../../data/PC.MOTHERBOARDS';
import { ramModules } from '../../../../../data/PC.RAM';
import { useFavorites } from '@/store/useFavorites';
import { Heart, Star, ShoppingCart, MonitorPlay, Briefcase, Coffee } from 'lucide-react';

// Create a union type of all possible component types
type GPUComponent = {
  id: string;
  name: string;
  price: number;
  company: string;
  image: string;
  vram: string;
  brand?: string;
  model?: string;
  type: 'gpu';
};

type CPUComponent = {
  id: string;
  name: string;
  price: number;
  company: string;
  image: string;
  cores: number;
  threads: number;
  base_clock: string;
  turbo_clock: string;
  description: string;
  type: 'cpu';
};

type RAMComponent = {
  id: string;
  name: string;
  price: number;
  company: string;
  image: string;
  capacity: string;
  speed: string;
  type: 'ram';
};

type MotherboardComponent = {
  id: string;
  name: string;
  price: number;
  company: string;
  image: string;
  socket: string;
  formFactor: string;
  integration: string;
  type: 'motherboard';
};

type Component = GPUComponent | CPUComponent | RAMComponent | MotherboardComponent;

type Seller = {
  name: string;
  price: number;
  url: string;
  rating: number;
  delivery: string;
};

type BuildRecommendation = {
  type: 'gaming' | 'workstation' | 'casual';
  title: string;
  description: string;
  icon: React.ReactNode;
  score: number;
  details: string[];
};

export default function ProductInsightsClient({ id }: { id: string }) {
  const [component, setComponent] = useState<Component | null>(null);
  const [sellers, setSellers] = useState<Seller[]>([]);
  const { toggleFavorite, favorites } = useFavorites();

  useEffect(() => {
    const allComponents = [
      ...graphicsCards.map(c => ({ ...c, type: 'gpu' as const })),
      ...processors.map(c => ({ ...c, type: 'cpu' as const })),
      ...motherboards.map(c => ({ ...c, type: 'motherboard' as const })),
      ...ramModules.map(c => ({ ...c, type: 'ram' as const }))
    ];
    
    const found = allComponents.find(comp => comp.id === id);
    setComponent(found || null);

    setSellers([
      {
        name: "Amazon",
        price: found?.price || 0,
        url: "https://amazon.com",
        rating: 4.5,
        delivery: "2-3 days"
      },
      {
        name: "Newegg",
        price: (found?.price || 0) - 1000,
        url: "https://newegg.com",
        rating: 4.3,
        delivery: "3-5 days"
      },
      {
        name: "Local Store",
        price: (found?.price || 0) + 500,
        url: "#",
        rating: 4.7,
        delivery: "Available now"
      }
    ]);
  }, [id]);

  const getBuildRecommendations = (): BuildRecommendation[] => {
    if (!component) return [];

    const recommendations: BuildRecommendation[] = [
      {
        type: 'gaming',
        title: 'Gaming Build',
        icon: <MonitorPlay className="w-6 h-6" />,
        score: getGamingScore(),
        description: 'Ideal for gaming setups',
        details: getGamingDetails()
      },
      {
        type: 'workstation',
        title: 'Workstation Build',
        icon: <Briefcase className="w-6 h-6" />,
        score: getWorkstationScore(),
        description: 'Perfect for professional work',
        details: getWorkstationDetails()
      },
      {
        type: 'casual',
        title: 'Casual Build',
        icon: <Coffee className="w-6 h-6" />,
        score: getCasualScore(),
        description: 'Great for everyday use',
        details: getCasualDetails()
      }
    ];

    return recommendations;
  };

  // Helper functions for scores and details
  const getGamingScore = () => {
    if (!component) return 0;
    if (component.type === 'gpu') {
      const vramGB = parseInt(component.vram);
      return vramGB >= 12 ? 9.5 : vramGB >= 8 ? 8.5 : 7.5;
    }
    return 8;
  };

  const getWorkstationScore = () => {
    if (!component) return 0;
    if (component.type === 'cpu') {
      return component.cores >= 16 ? 9.5 : component.cores >= 8 ? 8.5 : 7.5;
    }
    return 7.5;
  };

  const getCasualScore = () => {
    if (!component) return 0;
    return 8.5;
  };

  const getGamingDetails = () => {
    if (!component) return [];
    if (component.type === 'gpu') {
      return [
        'Excellent for high-FPS gaming',
        'Supports ray tracing',
        'Great for streaming while gaming',
        'VR-ready performance'
      ];
    }
    return ['Good gaming performance'];
  };

  const getWorkstationDetails = () => {
    if (!component) return [];
    if (component.type === 'cpu') {
      return [
        'Excellent multi-threaded performance',
        'Ideal for video editing',
        'Great for 3D rendering',
        'Supports professional workflows'
      ];
    }
    return ['Suitable for professional work'];
  };

  const getCasualDetails = () => {
    if (!component) return [];
    return [
      'Perfect for everyday tasks',
      'Smooth multitasking',
      'Energy efficient',
      'Reliable performance'
    ];
  };

  if (!component) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#111827] pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Product Header */}
        <div className="bg-[#1F2937] rounded-xl p-8 mb-8">
          <div className="flex gap-8">
            {/* Product Image */}
            <div className="w-80 h-80 relative flex-shrink-0">
              <Image
                src={component.image}
                alt={component.name}
                fill
                className="object-contain"
              />
            </div>

            {/* Product Info */}
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">{component.name}</h1>
                  <p className="text-xl text-gray-400 mb-4">{component.company}</p>
                </div>
                <button
                  onClick={() => toggleFavorite(component)}
                  className={`p-2 rounded-lg transition-colors ${
                    favorites.some(f => f.id === component.id)
                      ? 'text-red-500 bg-red-500/10'
                      : 'text-gray-400 hover:text-red-500 hover:bg-red-500/10'
                  }`}
                >
                  <Heart 
                    className={`w-6 h-6 ${
                      favorites.some(f => f.id === component.id) ? 'fill-current' : ''
                    }`} 
                  />
                </button>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <p className="text-sm text-gray-400 mb-1">Price Range</p>
                <p className="text-2xl font-bold text-white">
                  ₹{Math.min(...sellers.map(s => s.price)).toLocaleString()} - 
                  ₹{Math.max(...sellers.map(s => s.price)).toLocaleString()}
                </p>
              </div>

              {/* Quick Specs */}
              <div className="grid grid-cols-2 gap-4">
                {component.type === 'gpu' && (
                  <div>
                    <p className="text-sm text-gray-400">VRAM</p>
                    <p className="text-white">{component.vram}</p>
                  </div>
                )}
                {component.type === 'cpu' && (
                  <>
                    <div>
                      <p className="text-sm text-gray-400">Cores/Threads</p>
                      <p className="text-white">{component.cores}/{component.threads}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Clock Speed</p>
                      <p className="text-white">{component.base_clock} - {component.turbo_clock}</p>
                    </div>
                  </>
                )}
                {component.type === 'ram' && (
                  <>
                    <div>
                      <p className="text-sm text-gray-400">Capacity</p>
                      <p className="text-white">{component.capacity}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Speed</p>
                      <p className="text-white">{component.speed}</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sellers Section */}
        <div className="bg-[#1F2937] rounded-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Available Sellers</h2>
          <div className="grid grid-cols-1 gap-4">
            {sellers.map((seller, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-[#374151] rounded-lg hover:bg-[#404b5f] transition-colors"
              >
                <div className="flex items-center gap-4">
                  <ShoppingCart className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-white">{seller.name}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span>{seller.rating}</span>
                      <span>•</span>
                      <span>{seller.delivery}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-xl font-bold text-white">₹{seller.price.toLocaleString()}</p>
                  <a
                    href={seller.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    View Deal
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Build Recommendations */}
        <div className="bg-[#1F2937] rounded-xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Build Recommendations</h2>
          <div className="grid grid-cols-3 gap-6">
            {getBuildRecommendations().map((rec) => (
              <div
                key={rec.type}
                className="bg-[#374151] rounded-xl p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400">
                    {rec.icon}
                  </div>
                  <div>
                    <h3 className="font-medium text-white">{rec.title}</h3>
                    <p className="text-sm text-gray-400">{rec.description}</p>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-400">Performance Score</span>
                    <span className="text-lg font-bold text-white">{rec.score}/10</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${rec.score * 10}%` }}
                    />
                  </div>
                </div>

                <ul className="space-y-2">
                  {rec.details.map((detail, index) => (
                    <li key={index} className="text-sm text-gray-300 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 