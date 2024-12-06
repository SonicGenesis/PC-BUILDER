import { PCBuild } from './builds';
import { ComponentType, PCComponent } from './components';

export type ComponentRecommendation = {
    type: ComponentType;
    minPrice: number;
    maxPrice: number;
    percentage: number; // Percentage of budget to allocate
    priority: number; // 1 is highest priority
};
// Keep this type definition outside
export type RecommendationWithComponents = ComponentRecommendation & {
    components: PCComponent[];
};

// First, add these new types near your other type definitions
export type CompatibilityStatus = 'compatible' | 'incompatible' | 'pending' | 'empty';

// First, add this type for compatibility messages
export type CompatibilityMessage = {
    status: CompatibilityStatus;
    message: string;
};

// Enhance the ComponentNode type
export type ComponentNode = {
    type: ComponentType;
    status: CompatibilityStatus;
    dependencies: ComponentType[];
    message?: string; // Add this for tooltip messages
};

// Add this type and constant for budget ranges
export type BudgetRange = {
    label: string;
    value: number;
};

export const checkCompatibility = (build: PCBuild): ComponentNode[] => {
    const messages: Record<ComponentType, CompatibilityMessage> = {
        cpu: {
            status: build.components.cpu ? 'compatible' : 'empty',
            message: build.components.cpu ? 'CPU installed' : 'Install a CPU first'
        },
        motherboard: {
            status: 'empty',
            message: ''
        },
        ram: {
            status: 'empty',
            message: ''
        },
        gpu: {
            status: 'empty',
            message: ''
        }
    };

    // Check motherboard compatibility
    if (build.components.motherboard) {
        if (!build.components.cpu) {
            messages.motherboard = {
                status: 'pending',
                message: 'Install CPU first to verify compatibility'
            };
        } else {
            // Example socket compatibility check
            const cpuSocket = build.components.cpu.name.includes('AMD') ? 'AM4' : 'LGA1700';
            const mbSocket = build.components.motherboard.name.includes('AMD') ? 'AM4' : 'LGA1700';

            messages.motherboard = {
                status: cpuSocket === mbSocket ? 'compatible' : 'incompatible',
                message: cpuSocket === mbSocket ?
                    'Compatible with installed CPU' :
                    'CPU socket mismatch! Please check motherboard compatibility'
            };
        }
    }

    // Check RAM compatibility
    if (build.components.ram) {
        if (!build.components.motherboard) {
            messages.ram = {
                status: 'pending',
                message: 'Install motherboard first to verify compatibility'
            };
        } else {
            // Example RAM compatibility check
            const isCompatible = build.components.motherboard.name.includes('DDR4') ===
                build.components.ram.name.includes('DDR4');

            messages.ram = {
                status: isCompatible ? 'compatible' : 'incompatible',
                message: isCompatible ?
                    'RAM is compatible with motherboard' :
                    'RAM type mismatch! Check DDR generation compatibility'
            };
        }
    }

    // Check GPU compatibility
    if (build.components.gpu) {
        if (!build.components.motherboard || !build.components.cpu) {
            messages.gpu = {
                status: 'pending',
                message: 'Install CPU and motherboard first to verify compatibility'
            };
        } else {
            // Example power requirement check
            const hasEnoughPower = build.components.gpu.name.includes('4090') ?
                build.components.cpu.name.includes('i9') || build.components.cpu.name.includes('5950X') :
                true;

            messages.gpu = {
                status: hasEnoughPower ? 'compatible' : 'incompatible',
                message: hasEnoughPower ?
                    'GPU is compatible with system' :
                    'CPU might bottleneck this GPU! Consider upgrading CPU'
            };
        }
    }

    return [
        {
            type: 'cpu',
            status: messages.cpu.status,
            dependencies: [],
            message: messages.cpu.message
        },
        {
            type: 'motherboard',
            status: messages.motherboard.status,
            dependencies: ['cpu'],
            message: messages.motherboard.message
        },
        {
            type: 'ram',
            status: messages.ram.status,
            dependencies: ['motherboard'],
            message: messages.ram.message
        },
        {
            type: 'gpu',
            status: messages.gpu.status,
            dependencies: ['cpu', 'motherboard'],
            message: messages.gpu.message
        }
    ];
};

