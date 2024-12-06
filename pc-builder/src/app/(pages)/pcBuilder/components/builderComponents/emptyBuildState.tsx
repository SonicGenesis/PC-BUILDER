import { FiPlus } from 'react-icons/fi';

interface EmptyBuildStateProps {
  onAddNewBuild: () => void;
}

export const EmptyBuildState = ({ onAddNewBuild }: EmptyBuildStateProps) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-[#1F2937] rounded-xl p-12">
      <div className="w-24 h-24 mb-6 text-gray-400">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
          />
        </svg>
      </div>
      <h3 className="text-xl font-bold text-white mb-2">No PC Builds Yet</h3>
      <p className="text-gray-400 text-center mb-6">
        Start creating your custom PC build by clicking the New Build button
      </p>
      <button
        onClick={onAddNewBuild}
        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
      >
        <FiPlus /> Create Your First Build
      </button>
    </div>
  );
}; 