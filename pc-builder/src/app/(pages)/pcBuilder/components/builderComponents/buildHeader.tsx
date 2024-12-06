import { FiPlus } from 'react-icons/fi';

interface BuildHeaderProps {
  buildsCount: number;
  onAddNewBuild: () => void;
}

export const BuildHeader = ({ buildsCount, onAddNewBuild }: BuildHeaderProps) => {
  return (
    <div className="bg-[#1F2937] p-4 rounded-xl mb-6 sticky top-20 z-10">
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">
              CUSTOM BUILDS
            </h1>
            <div className="px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/20">
              <span className="text-xs font-medium text-green-400">
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
          className="bg-gradient-to-r from-green-400 to-emerald-400 text-white px-4 py-2 rounded-lg 
            flex items-center gap-2 hover:opacity-90 transition-opacity shadow-lg shadow-green-500/20"
        >
          <FiPlus /> New Build
        </button>
      </div>
    </div>
  );
}; 