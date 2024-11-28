import { ChevronDown, Sparkles, ArrowUp, ArrowDown } from 'lucide-react';

interface Option {
  value: string;
  label: string;
  icon: React.ReactNode;
}

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
}

export function CustomSelect({ value, onChange, options }: CustomSelectProps) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 pr-10 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value} className="flex items-center gap-2">
            {option.label}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
        <ChevronDown className="h-5 w-5 text-gray-400" />
      </div>
    </div>
  );
}