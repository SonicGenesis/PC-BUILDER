import { FiPlus } from 'react-icons/fi';

interface BuildHeaderProps {
  buildsCount: number;
  onAddNewBuild: () => void;
}

export const BuildHeader = ({ buildsCount, onAddNewBuild }: BuildHeaderProps) => {
  return (
    <div className="bg-card-bg p-4 rounded-xl mb-6 sticky top-20 z-10 neon-card">
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-neon-green neon-flicker">
              CUSTOM BUILDS
            </h1>
            <div className="px-2 py-0.5 rounded-full bg-neon-green/10 border border-neon-green/30">
              <span className="text-xs font-medium text-neon-green neon-text">
                {buildsCount} {buildsCount === 1 ? 'Build' : 'Builds'}
              </span>
            </div>
          </div>
          <p className="text-sm text-gray-400 mt-1">
            Design and customize your perfect PC configuration
          </p>
        </div>
        <button
          onClick={onAddNewBuild}
          className="neon-button text-neon-green px-4 py-2 rounded-lg 
            flex items-center gap-2 hover:bg-neon-green-glow transition-all"
        >
          <FiPlus /> New Build
        </button>
      </div>
    </div>
  );
}; 