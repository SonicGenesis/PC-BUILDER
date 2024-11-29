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

type GamePerformance = {
  name: string;
  fps1080p: number;
  fps1440p: number;
  fps4k: number;
  settings: 'Ultra' | 'High' | 'Medium' | 'Low';
  rayTracing?: boolean;
  dlss?: boolean;
};

type GPUTier = 'Entry' | 'Mid-Range' | 'High-End' | 'Enthusiast';

// Add this function to determine GPU tier
const getGPUTier = (gpu: GPUComponent): GPUTier => {
  const price = gpu.price;
  if (price > 150000) return 'Enthusiast';
  if (price > 80000) return 'High-End';
  if (price > 40000) return 'Mid-Range';
  return 'Entry';
};

// Add this function to get game performance data
const getGamePerformance = (gpu: GPUComponent): GamePerformance[] => {
  const tier = getGPUTier(gpu);
  
  const games: GamePerformance[] = [
    {
      name: "Cyberpunk 2077",
      fps1080p: tier === 'Enthusiast' ? 140 : tier === 'High-End' ? 100 : tier === 'Mid-Range' ? 60 : 30,
      fps1440p: tier === 'Enthusiast' ? 100 : tier === 'High-End' ? 70 : tier === 'Mid-Range' ? 45 : 20,
      fps4k: tier === 'Enthusiast' ? 60 : tier === 'High-End' ? 40 : tier === 'Mid-Range' ? 25 : 15,
      settings: tier === 'Enthusiast' || tier === 'High-End' ? 'Ultra' : tier === 'Mid-Range' ? 'High' : 'Medium',
      rayTracing: tier === 'Enthusiast' || tier === 'High-End',
      dlss: true
    },
    {
      name: "GTA V",
      fps1080p: tier === 'Enthusiast' ? 165 : tier === 'High-End' ? 140 : tier === 'Mid-Range' ? 100 : 60,
      fps1440p: tier === 'Enthusiast' ? 140 : tier === 'High-End' ? 100 : tier === 'Mid-Range' ? 70 : 40,
      fps4k: tier === 'Enthusiast' ? 90 : tier === 'High-End' ? 60 : tier === 'Mid-Range' ? 40 : 25,
      settings: tier === 'Enthusiast' || tier === 'High-End' ? 'Ultra' : tier === 'Mid-Range' ? 'High' : 'Medium'
    },
    {
      name: "Red Dead Redemption 2",
      fps1080p: tier === 'Enthusiast' ? 150 : tier === 'High-End' ? 120 : tier === 'Mid-Range' ? 80 : 45,
      fps1440p: tier === 'Enthusiast' ? 120 : tier === 'High-End' ? 90 : tier === 'Mid-Range' ? 60 : 30,
      fps4k: tier === 'Enthusiast' ? 70 : tier === 'High-End' ? 50 : tier === 'Mid-Range' ? 35 : 20,
      settings: tier === 'Enthusiast' || tier === 'High-End' ? 'Ultra' : tier === 'Mid-Range' ? 'High' : 'Medium',
      dlss: true
    },
    // Add more games as needed
  ];

  return games;
};

// Add these new types
type RAMPerformance = {
  useCase: string;
  performance: string;
  benefits: string[];
  recommendedWith?: string[];
  limitations?: string[];
};

type CPUWorkload = {
  name: string;
  score: number;
  description: string;
  recommendedRam?: string;
  multiThread?: boolean;
  benefits: string[];
};

// Add these functions after your existing ones
const getRAMPerformance = (ram: RAMComponent): RAMPerformance[] => {
  const capacity = parseInt(ram.capacity);
  const speed = parseInt(ram.speed);
  
  return [
    {
      useCase: "Gaming",
      performance: capacity >= 32 ? "Excellent" : capacity >= 16 ? "Good" : "Basic",
      benefits: [
        `${capacity >= 32 ? "Perfect" : "Sufficient"} for modern gaming`,
        `${speed >= 3600 ? "Excellent" : "Good"} for reducing game stuttering`,
        `${capacity >= 16 ? "Allows multiple games and apps" : "Basic multitasking"} while gaming`,
      ],
      recommendedWith: [
        "RTX 4080/4090 for 4K gaming",
        "Latest gen Ryzen/Intel CPUs",
      ],
      limitations: capacity < 16 ? ["May struggle with newer games"] : undefined
    },
    {
      useCase: "Content Creation",
      performance: capacity >= 64 ? "Excellent" : capacity >= 32 ? "Good" : "Basic",
      benefits: [
        `${capacity >= 64 ? "Seamless" : "Decent"} video editing experience`,
        `${capacity >= 32 ? "Smooth" : "Basic"} 3D rendering capabilities`,
        `${speed >= 3600 ? "Fast" : "Standard"} file processing`,
      ],
      recommendedWith: [
        "Workstation CPUs with high core count",
        "Professional GPUs for rendering",
      ]
    },
    {
      useCase: "Multitasking",
      performance: capacity >= 32 ? "Excellent" : capacity >= 16 ? "Good" : "Basic",
      benefits: [
        `Can handle ${capacity >= 32 ? "numerous" : "multiple"} applications simultaneously`,
        `${speed >= 3600 ? "Quick" : "Standard"} application switching`,
        `${capacity >= 16 ? "Smooth" : "Basic"} browser performance with multiple tabs`,
      ]
    }
  ];
};

const getCPUWorkloads = (cpu: CPUComponent): CPUWorkload[] => {
  const hasHighThreads = cpu.threads >= 16;
  const hasHighCores = cpu.cores >= 8;
  const isHighEnd = cpu.price > 30000;
  
  return [
    {
      name: "Gaming Performance",
      score: hasHighCores ? 9.5 : 8.0,
      description: `${hasHighCores ? "Excellent" : "Good"} for modern gaming`,
      recommendedRam: hasHighCores ? "32GB DDR4-3600" : "16GB DDR4-3200",
      benefits: [
        `${hasHighCores ? "Superior" : "Good"} frame rates in CPU-intensive games`,
        `${hasHighThreads ? "Excellent" : "Decent"} for streaming while gaming`,
        `${isHighEnd ? "Minimal" : "Low"} gaming latency`,
      ]
    },
    {
      name: "Content Creation",
      score: hasHighThreads ? 9.0 : 7.5,
      multiThread: true,
      recommendedRam: "32GB or higher",
      description: `${hasHighThreads ? "Professional" : "Capable"} content creation`,
      benefits: [
        `${hasHighThreads ? "Fast" : "Standard"} video rendering`,
        `${hasHighCores ? "Excellent" : "Good"} for 3D modeling`,
        `${hasHighThreads ? "Efficient" : "Basic"} multitasking while rendering`,
      ]
    },
    {
      name: "Productivity",
      score: hasHighCores ? 9.0 : 8.0,
      description: `${hasHighCores ? "Premium" : "Solid"} productivity performance`,
      recommendedRam: "16GB or higher",
      benefits: [
        `${hasHighThreads ? "Seamless" : "Good"} multitasking`,
        `${hasHighCores ? "Quick" : "Standard"} application loading`,
        "Smooth system responsiveness",
      ]
    }
  ];
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
      const tier = getGPUTier(component);
      return [
        `${tier} level gaming performance`,
        `Ideal for ${tier === 'Enthusiast' ? '4K' : tier === 'High-End' ? '1440p' : '1080p'} gaming`,
        component.vram >= '8' ? 'Excellent for high-texture games' : 'Good for most modern games',
        tier === 'Enthusiast' || tier === 'High-End' ? 'Ray tracing capable' : 'Standard rendering',
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

        {component.type === 'gpu' && (
          <div className="bg-[#1F2937] rounded-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">Gaming Performance</h2>
            <div className="space-y-6">
              {getGamePerformance(component).map((game) => (
                <div key={game.name} className="bg-[#374151] rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-white">{game.name}</h3>
                    <div className="flex items-center gap-2">
                      {game.rayTracing && (
                        <span className="px-2 py-1 bg-green-500/10 text-green-400 text-xs rounded-full">
                          Ray Tracing
                        </span>
                      )}
                      {game.dlss && (
                        <span className="px-2 py-1 bg-blue-500/10 text-blue-400 text-xs rounded-full">
                          DLSS
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-400 mb-1">1080p</p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold text-white">{game.fps1080p}</span>
                        <span className="text-gray-400">FPS</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 mb-1">1440p</p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold text-white">{game.fps1440p}</span>
                        <span className="text-gray-400">FPS</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 mb-1">4K</p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold text-white">{game.fps4k}</span>
                        <span className="text-gray-400">FPS</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400">Recommended Settings:</span>
                    <span className={`text-sm px-2 py-1 rounded-full ${
                      game.settings === 'Ultra' ? 'bg-purple-500/10 text-purple-400' :
                      game.settings === 'High' ? 'bg-blue-500/10 text-blue-400' :
                      game.settings === 'Medium' ? 'bg-yellow-500/10 text-yellow-400' :
                      'bg-red-500/10 text-red-400'
                    }`}>
                      {game.settings}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {component.type === 'ram' && (
          <div className="bg-[#1F2937] rounded-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">Performance Analysis</h2>
            <div className="space-y-6">
              {getRAMPerformance(component).map((perf) => (
                <div key={perf.useCase} className="bg-[#374151] rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">{perf.useCase}</h3>
                      <span className={`text-sm px-2 py-1 rounded-full ${
                        perf.performance === 'Excellent' ? 'bg-green-500/10 text-green-400' :
                        perf.performance === 'Good' ? 'bg-blue-500/10 text-blue-400' :
                        'bg-yellow-500/10 text-yellow-400'
                      }`}>
                        {perf.performance} Performance
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-400 mb-2">Benefits</h4>
                      <ul className="space-y-2">
                        {perf.benefits.map((benefit, index) => (
                          <li key={index} className="text-sm text-gray-300 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {perf.recommendedWith && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-400 mb-2">Recommended Pairings</h4>
                        <ul className="space-y-2">
                          {perf.recommendedWith.map((rec, index) => (
                            <li key={index} className="text-sm text-gray-300 flex items-center gap-2">
                              <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {perf.limitations && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-400 mb-2">Limitations</h4>
                        <ul className="space-y-2">
                          {perf.limitations.map((limitation, index) => (
                            <li key={index} className="text-sm text-gray-300 flex items-center gap-2">
                              <span className="w-1.5 h-1.5 bg-red-400 rounded-full" />
                              {limitation}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {component.type === 'cpu' && (
          <div className="bg-[#1F2937] rounded-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">Workload Performance</h2>
            <div className="space-y-6">
              {getCPUWorkloads(component).map((workload) => (
                <div key={workload.name} className="bg-[#374151] rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">{workload.name}</h3>
                      <p className="text-sm text-gray-400">{workload.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {workload.multiThread && (
                        <span className="px-2 py-1 bg-purple-500/10 text-purple-400 text-xs rounded-full">
                          Multi-threaded
                        </span>
                      )}
                      <span className="text-2xl font-bold text-white">{workload.score}/10</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${workload.score * 10}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-400 mb-2">Benefits</h4>
                      <ul className="space-y-2">
                        {workload.benefits.map((benefit, index) => (
                          <li key={index} className="text-sm text-gray-300 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {workload.recommendedRam && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-400">Recommended RAM:</span>
                        <span className="text-sm px-2 py-1 rounded-full bg-green-500/10 text-green-400">
                          {workload.recommendedRam}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 