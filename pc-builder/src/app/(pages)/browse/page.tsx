"use client";
import { useState, useEffect, useMemo, useRef } from 'react';
import Image from 'next/image';
import { graphicsCards } from '../../../../data/PC.GRAPHICCARDS';
import { motherboards } from '../../../../data/PC.MOTHERBOARDS';
import { processors } from '../../../../data/PC.PROCESSORS';
import { ramModules } from '../../../../data/PC.RAM';
import { Slider } from '@/app/components/Slider';
import { Star, ArrowUpDown, Cpu, MonitorPlay, CircuitBoard, HardDrive, Heart } from 'lucide-react';
import { CustomSelect } from '@/app/components/CustomSelect';
import Link from 'next/link';
import { useFavorites } from '@/store/useFavorites';

// Add this type definition near the top with other types
type ComponentType = 'gpu' | 'cpu' | 'motherboard' | 'ram';

// Define strict types for components
type BaseComponent = {
  id: string;
  name: string;
  price: number;
  company: string;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  seller: string;
  availability: string;
  type: ComponentType;
};

type GPUComponent = BaseComponent & {
  category: 'gpu';
  vram: string;
  brand: string;
  model: string;
};

type CPUComponent = BaseComponent & {
  category: 'cpu';
  cores: number;
  threads: number;
  base_clock: string;
  turbo_clock: string;
  description: string;
};

type RAMComponent = BaseComponent & {
  category: 'ram';
  type: string;
  capacity: string;
  speed: string;
};

type MotherboardComponent = BaseComponent & {
  category: 'motherboard';
  socket: string;
  formFactor: string;
  integration: string;
};

// Define a type for mapped components
type MappedComponent = (GPUComponent | CPUComponent | RAMComponent | MotherboardComponent) & {
  rating: number;
  reviews: number;
  seller: string;
  availability: string;
  type: ComponentType;
};

// Types for dynamic filters
type FilterOption = {
  label: string;
  value: string;
  count: number;
};

type DynamicFilters = {
  [key: string]: {
    label: string;
    options: FilterOption[];
  };
};

// Add new types for search suggestions
type SearchSuggestion = {
    id: string;
    name: string;
    category: ComponentType;
    image: string;
    price: number;
};

// Add this type for category-specific filters
type CategoryFilters = {
    [K in ComponentType]: {
        [key: string]: {
            label: string;
            options: FilterOption[];
        };
    };
};

export default function BrowsePage() {
    // 1. Group all useState hooks together at the top
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [priceRange, setPriceRange] = useState([0, 200000]);
    const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'featured'>('featured');
    const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
    const [dynamicFilters, setDynamicFilters] = useState<DynamicFilters>({});
    const [showSearchDropdown, setShowSearchDropdown] = useState(false);
    const [searchSuggestions, setSearchSuggestions] = useState<SearchSuggestion[]>([]);
    const [isMounted, setIsMounted] = useState(false);
    const [collapsedFilters, setCollapsedFilters] = useState<Record<string, boolean>>({});

    // 2. All useRef hooks
    const searchRef = useRef<HTMLDivElement>(null);

    // 3. All useMemo hooks
    const allComponents = useMemo(() => {
        const gpuComponents: MappedComponent[] = graphicsCards.map(item => ({
            ...item,
            category: 'gpu' as const,
            type: 'gpu',
            rating: 4.5,
            reviews: 128,
            seller: "Amazon",
            availability: "In Stock",
            image: item.image || '/images/placeholder.jpg',
            brand: item.brand || item.company,
            model: item.model || 'Standard'
        }));

        const cpuComponents: MappedComponent[] = processors.map(item => ({
            ...item,
            category: 'cpu' as const,
            type: 'cpu',
            rating: 4.3,
            reviews: 95,
            seller: "Newegg",
            availability: "In Stock",
            image: item.image || '/images/placeholder.jpg'
        }));

        const mbComponents: MappedComponent[] = motherboards.map(item => ({
            ...item,
            category: 'motherboard' as const,
            type: 'motherboard',
            rating: 4.2,
            reviews: 76,
            seller: "Amazon",
            availability: "Limited Stock",
            image: item.image || '/images/placeholder.jpg'
        }));

        const ramComponents: MappedComponent[] = ramModules.map(item => ({
            ...item,
            category: 'ram' as const,
            type: 'ram',
            rating: 4.4,
            reviews: 112,
            seller: "Newegg",
            availability: "In Stock",
            image: item.image || '/images/placeholder.jpg'
        }));

        return [...gpuComponents, ...cpuComponents, ...mbComponents, ...ramComponents];
    }, []);

    // 4. All useEffect hooks
    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        const filters: DynamicFilters = {};
        const components = allComponents;

        // Only show filters for the selected category (except when 'all' is selected)
        const relevantComponents = selectedCategory === 'all' 
            ? components 
            : components.filter(c => c.category === selectedCategory);

        // Common manufacturer filter for all categories
        filters.manufacturer = {
            label: 'Manufacturer',
            options: Array.from(new Set(relevantComponents.map(c => c.company)))
                .map(brand => ({
                    label: brand,
                    value: brand,
                    count: relevantComponents.filter(c => c.company === brand).length
                }))
        };

        // Category-specific filters
        switch (selectedCategory) {
            case 'gpu':
                filters.vram = {
                    label: 'VRAM',
                    options: Array.from(new Set(relevantComponents
                        .filter((c): c is MappedComponent & GPUComponent => c.category === 'gpu')
                        .map(c => c.vram)))
                        .map(vram => ({
                            label: vram,
                            value: vram,
                            count: relevantComponents.filter(c => c.category === 'gpu' && (c as GPUComponent).vram === vram).length
                        }))
                };
                break;

            case 'cpu':
                filters.cores = {
                    label: 'Cores',
                    options: Array.from(new Set(relevantComponents
                        .filter((c): c is MappedComponent & CPUComponent => c.category === 'cpu')
                        .map(c => c.cores)))
                        .map(cores => ({
                            label: `${cores} Cores`,
                            value: String(cores),
                            count: relevantComponents.filter(c => c.category === 'cpu' && (c as CPUComponent).cores === cores).length
                        }))
                };
                filters.baseClock = {
                    label: 'Base Clock',
                    options: Array.from(new Set(relevantComponents
                        .filter((c): c is MappedComponent & CPUComponent => c.category === 'cpu')
                        .map(c => c.base_clock)))
                        .map(clock => ({
                            label: clock,
                            value: clock,
                            count: relevantComponents.filter(c => c.category === 'cpu' && (c as CPUComponent).base_clock === clock).length
                        }))
                };
                break;

            case 'motherboard':
                filters.socket = {
                    label: 'Socket',
                    options: Array.from(new Set(relevantComponents
                        .filter((c): c is MappedComponent & MotherboardComponent => c.category === 'motherboard')
                        .map(c => c.socket)))
                        .map(socket => ({
                            label: socket,
                            value: socket,
                            count: relevantComponents.filter(c => c.category === 'motherboard' && (c as MotherboardComponent).socket === socket).length
                        }))
                };
                filters.formFactor = {
                    label: 'Form Factor',
                    options: Array.from(new Set(relevantComponents
                        .filter((c): c is MappedComponent & MotherboardComponent => c.category === 'motherboard')
                        .map(c => c.formFactor)))
                        .map(ff => ({
                            label: ff,
                            value: ff,
                            count: relevantComponents.filter(c => c.category === 'motherboard' && (c as MotherboardComponent).formFactor === ff).length
                        }))
                };
                break;

            case 'ram':
                filters.capacity = {
                    label: 'Capacity',
                    options: Array.from(new Set(relevantComponents
                        .filter((c): c is MappedComponent & RAMComponent => c.category === 'ram')
                        .map(c => c.capacity)))
                        .map(cap => ({
                            label: cap,
                            value: cap,
                            count: relevantComponents.filter(c => c.category === 'ram' && (c as RAMComponent).capacity === cap).length
                        }))
                };
                filters.speed = {
                    label: 'Speed',
                    options: Array.from(new Set(relevantComponents
                        .filter((c): c is MappedComponent & RAMComponent => c.category === 'ram')
                        .map(c => c.speed)))
                        .map(speed => ({
                            label: speed,
                            value: speed,
                            count: relevantComponents.filter(c => c.category === 'ram' && (c as RAMComponent).speed === speed).length
                        }))
                };
                break;
        }

        setDynamicFilters(filters);
    }, [selectedCategory, allComponents]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowSearchDropdown(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // 5. Custom hooks (if any)
    const { toggleFavorite, favorites } = useFavorites();

    // Add toggle function for collapsible filters
    const toggleFilter = (filterKey: string) => {
        setCollapsedFilters(prev => ({
            ...prev,
            [filterKey]: !prev[filterKey]
        }));
    };

    if (!isMounted) {
        return (
            <div className="min-h-screen bg-[#111827]">
                <div className="container mx-auto px-4">
                    <div className="py-6">
                        {/* Add a loading skeleton or spinner here */}
                    </div>
                </div>
            </div>
        );
    }

    const categoryOptions = [
        { value: 'all', label: 'All Categories', icon: <CircuitBoard className="w-4 h-4" /> },
        { value: 'cpu', label: 'Processors', icon: <Cpu className="w-4 h-4" /> },
        { value: 'gpu', label: 'Graphics Cards', icon: <MonitorPlay className="w-4 h-4" /> },
        { value: 'motherboard', label: 'Motherboards', icon: <CircuitBoard className="w-4 h-4" /> },
        { value: 'ram', label: 'Memory', icon: <HardDrive className="w-4 h-4" /> }
    ];

    // Generate search suggestions based on input
    const handleSearchInput = (value: string) => {
        setSearchQuery(value);
        if (value.length > 0) {
            const suggestions = allComponents
                .filter(comp => 
                    comp.name.toLowerCase().includes(value.toLowerCase()) ||
                    comp.company.toLowerCase().includes(value.toLowerCase())
                )
                .slice(0, 5)
                .map(comp => ({
                    id: comp.id,
                    name: comp.name,
                    category: comp.type,
                    image: comp.image,
                    price: comp.price
                }));
            setSearchSuggestions(suggestions);
            setShowSearchDropdown(true);
        } else {
            setShowSearchDropdown(false);
        }
    };

    // Get category-specific filters
    const getCategoryFilters = (category: ComponentType) => {
        switch(category) {
            case 'gpu':
                return ['VRAM', 'Core Clock', 'Memory Type'];
            case 'cpu':
                return ['Cores', 'Socket', 'Base Clock'];
            case 'motherboard':
                return ['Socket', 'Form Factor', 'Chipset'];
            case 'ram':
                return ['Capacity', 'Speed', 'Type'];
            default:
                return [];
        }
    };

    const filteredComponents = allComponents.filter(component => {
        // Category matching
        const matchesCategory = selectedCategory === 'all' || component.category === selectedCategory;
        
        // Search query matching
        const matchesSearch = component.name.toLowerCase().includes(searchQuery.toLowerCase());
        
        // Price range matching
        const matchesPrice = component.price >= priceRange[0] && component.price <= priceRange[1];
        
        // Filter matching based on component type
        const matchesFilters = Object.entries(selectedFilters).every(([key, values]) => {
            if (values.length === 0) return true;

            switch (component.category) {
                case 'gpu':
                    if (key === 'manufacturer') return values.includes(component.company);
                    if (key === 'vram') return values.includes((component as GPUComponent).vram);
                    break;

                case 'cpu':
                    if (key === 'manufacturer') return values.includes(component.company);
                    if (key === 'cores') return values.includes(String((component as CPUComponent).cores));
                    if (key === 'baseClock') return values.includes((component as CPUComponent).base_clock);
                    break;

                case 'motherboard':
                    if (key === 'manufacturer') return values.includes(component.company);
                    if (key === 'socket') return values.includes((component as MotherboardComponent).socket);
                    if (key === 'formFactor') return values.includes((component as MotherboardComponent).formFactor);
                    break;

                case 'ram':
                    if (key === 'manufacturer') return values.includes(component.company);
                    if (key === 'capacity') return values.includes((component as RAMComponent).capacity);
                    if (key === 'speed') return values.includes((component as RAMComponent).speed);
                    break;
            }
            return true;
        });

        return matchesCategory && matchesSearch && matchesPrice && matchesFilters;
    }).sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        return 0;
    });

    // Add a helper function to check if a component is favorite
    const isComponentFavorite = (componentId: string) => {
        return favorites.some(fav => fav.id === componentId);
    };

    return (
        <div className="min-h-screen bg-[#111827]">
            <div className="container mx-auto px-4">
                {/* Enhanced Search Section */}
                <div className="py-6">
                    <div className="flex flex-col gap-4">
                        <div className="relative" ref={searchRef}>
                            {/* Search Input */}
                            <div className="flex items-center gap-4">
                                <div className="relative flex-1">
                                    <input
                                        type="search"
                                        value={searchQuery}
                                        onChange={(e) => handleSearchInput(e.target.value)}
                                        onFocus={() => setShowSearchDropdown(true)}
                                        placeholder="Search components..."
                                        className="w-full px-4 py-3 pl-10 rounded-lg bg-[#374151] border border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    />
                                    <svg 
                                        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                                        fill="none" 
                                        stroke="currentColor" 
                                        viewBox="0 0 24 24"
                                    >
                                        <path 
                                            strokeLinecap="round" 
                                            strokeLinejoin="round" 
                                            strokeWidth={2} 
                                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                                        />
                                    </svg>
                                </div>
                                <CustomSelect
                                    value={selectedCategory}
                                    onChange={setSelectedCategory}
                                    options={categoryOptions}
                                />
                            </div>

                            {/* Search Dropdown */}
                            {showSearchDropdown && searchQuery && (
                                <div className="absolute w-full mt-2 bg-[#1F2937] rounded-lg shadow-xl border border-gray-700 z-50">
                                    {/* Category-specific filters */}
                                    {selectedCategory !== 'all' && (
                                        <div className="p-4 border-b border-gray-700">
                                            <h4 className="text-sm font-medium text-gray-400 mb-2">
                                                Suggested Filters
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                {getCategoryFilters(selectedCategory as ComponentType).map((filter) => (
                                                    <button
                                                        key={filter}
                                                        className="px-3 py-1 text-sm bg-[#374151] text-gray-300 rounded-full hover:bg-blue-600 hover:text-white transition-colors"
                                                    >
                                                        {filter}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Search Suggestions */}
                                    <div className="max-h-[400px] overflow-y-auto">
                                        {searchSuggestions.map((suggestion) => (
                                            <Link
                                                key={suggestion.id}
                                                href={`/product-insights/${suggestion.id}`}
                                                className="flex items-center gap-4 p-4 hover:bg-[#374151] transition-colors"
                                                onClick={() => setShowSearchDropdown(false)}
                                            >
                                                <div className="w-12 h-12 relative flex-shrink-0">
                                                    <Image
                                                        src={suggestion.image}
                                                        alt={suggestion.name}
                                                        fill
                                                        className="object-contain"
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="text-white text-sm font-medium">
                                                        {suggestion.name}
                                                    </h4>
                                                    <p className="text-gray-400 text-xs">
                                                        {suggestion.category.toUpperCase()}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-white font-medium">
                                                        ₹{suggestion.price.toLocaleString()}
                                                    </p>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex gap-6">
                    {/* Filters Sidebar */}
                    <aside className="w-64 flex-shrink-0">
                        <div className="sticky top-20 max-h-[calc(100vh-5rem)] overflow-y-auto custom-scrollbar">
                            <div className="space-y-4 pr-4 border-r border-gray-700">
                                {/* Price Range */}
                                <div className="bg-gradient-to-br from-[#1F2937] to-[#111827] p-4 rounded-lg border border-gray-800">
                                    <h3 className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 font-medium mb-4">
                                        Price Range
                                    </h3>
                                    <Slider
                                        value={priceRange}
                                        onChange={setPriceRange}
                                        min={0}
                                        max={200000}
                                        step={5000}
                                    />
                                    <div className="flex justify-between mt-2 text-sm text-gray-400">
                                        <span>₹{priceRange[0].toLocaleString()}</span>
                                        <span>₹{priceRange[1].toLocaleString()}</span>
                                    </div>
                                </div>

                                {/* Dynamic Filters */}
                                {Object.entries(dynamicFilters).map(([key, filter]) => {
                                    // Skip duplicate type filter if it's already shown in category-specific filters
                                    if (selectedCategory !== 'all' && key === 'type') return null;

                                    return (
                                        <div key={key} className="bg-gradient-to-br from-[#1F2937] to-[#111827] p-4 rounded-lg border border-gray-800">
                                            <button 
                                                onClick={() => toggleFilter(key)}
                                                className="w-full flex items-center justify-between text-left"
                                            >
                                                <h3 className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 font-medium">
                                                    {filter.label}
                                                </h3>
                                                <svg 
                                                    className={`w-5 h-5 transition-transform ${
                                                        collapsedFilters[key] ? 'rotate-180' : ''
                                                    }`}
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path 
                                                        strokeLinecap="round" 
                                                        strokeLinejoin="round" 
                                                        strokeWidth={2} 
                                                        d="M19 9l-7 7-7-7"
                                                    />
                                                </svg>
                                            </button>
                                            
                                            <div className={`space-y-1 mt-2 ${
                                                collapsedFilters[key] ? 'hidden' : ''
                                            }`}>
                                                {filter.options.map(option => (
                                                    <label 
                                                        key={option.value} 
                                                        className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-[#374151] transition-colors cursor-pointer text-gray-300 group"
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedFilters[key]?.includes(option.value) || false}
                                                            onChange={(e) => {
                                                                setSelectedFilters(prev => {
                                                                    const current = prev[key] || [];
                                                                    return {
                                                                        ...prev,
                                                                        [key]: e.target.checked
                                                                            ? [...current, option.value]
                                                                            : current.filter(v => v !== option.value)
                                                                    };
                                                                });
                                                            }}
                                                            className="rounded border-gray-600 bg-[#374151] text-blue-500 focus:ring-offset-[#1F2937]"
                                                        />
                                                        <span className="text-sm flex-1 group-hover:text-white transition-colors">
                                                            {option.label}
                                                        </span>
                                                        <span className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors">
                                                            ({option.count})
                                                        </span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1">
                        {/* Sort Bar */}
                        <div className="flex justify-between items-center mb-6 bg-gradient-to-r from-[#1F2937] to-[#111827] p-4 rounded-lg border border-gray-800">
                            <p className="text-gray-400">
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 font-medium">
                                    {filteredComponents.length}
                                </span> items found
                            </p>
                            <button
                                onClick={() => setSortBy(prev => 
                                    prev === 'price-asc' ? 'price-desc' : 'price-asc'
                                )}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-700 hover:bg-[#374151] hover:text-blue-400 transition-all"
                            >
                                <ArrowUpDown className="w-4 h-4" />
                                <span>Sort by price</span>
                            </button>
                        </div>

                        {/* Component List */}
                        <div className="space-y-4">
                            {filteredComponents.map((component) => (
                                <div
                                    key={component.id}
                                    className="bg-gradient-to-r from-[#1F2937] to-[#111827] rounded-lg shadow-lg hover:shadow-xl transition-all p-4 border border-gray-800 group"
                                >
                                    <div className="flex gap-4">
                                        {/* Image and Basic Info - Clickable */}
                                        <Link 
                                            href={`/product-insights/${component.id}`}
                                            className="flex gap-4 flex-1"
                                        >
                                            {/* Image */}
                                            <div className="w-32 h-32 relative flex-shrink-0">
                                                <Image
                                                    src={component.image || '/images/placeholder.jpg'}
                                                    alt={component.name}
                                                    fill
                                                    className="object-contain"
                                                />
                                            </div>

                                            {/* Details */}
                                            <div className="flex-1 flex justify-between">
                                                <div>
                                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">{component.name}</h3>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                                        {component.company}
                                                    </p>
                                                    
                                                    {/* Quick Specs */}
                                                    <div className="space-y-1">
                                                        {'vram' in component && (
                                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                                <span className="text-gray-500">VRAM:</span> {component.vram}
                                                            </p>
                                                        )}
                                                        {'cores' in component && (
                                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                                <span className="text-gray-500">Cores/Threads:</span> {component.cores}/{component.threads}
                                                            </p>
                                                        )}
                                                        {'capacity' in component && (
                                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                                <span className="text-gray-500">Capacity:</span> {component.capacity}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex flex-col items-end justify-between">
                                                    <div className="flex items-center gap-4">
                                                        <div className="text-right">
                                                            <p className="text-xl font-bold text-gray-900 dark:text-white">₹{component.price.toLocaleString()}</p>
                                                            <p className="text-sm text-gray-500">{component.availability}</p>
                                                        </div>
                                                        <button 
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                toggleFavorite(component);
                                                            }}
                                                            className={`p-2 rounded-lg transition-colors ${
                                                                isComponentFavorite(component.id) 
                                                                    ? 'text-red-500 bg-red-50 dark:bg-red-900/20' 
                                                                    : 'text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
                                                            }`}
                                                        >
                                                            <Heart 
                                                                className={`w-5 h-5 ${
                                                                    isComponentFavorite(component.id) ? 'fill-current' : ''
                                                                }`} 
                                                            />
                                                        </button>
                                                    </div>

                                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                                        <span>{component.rating}</span>
                                                        <span>•</span>
                                                        <span>{component.reviews} reviews</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </main>
                </div>
            </div>

            {/* PC Builder Button */}
            <Link 
                href="/pcBuilder" 
                className="fixed bottom-8 right-8 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-all duration-300 flex items-center gap-2 hover:scale-105 transform"
            >
                <span>PC Builder</span>
                <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                >
                    <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                </svg>
            </Link>
        </div>
    );
}