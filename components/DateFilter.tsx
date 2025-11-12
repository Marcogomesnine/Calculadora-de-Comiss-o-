import React from 'react';
import { FilterIcon } from './icons';

interface DateFilterProps {
  startDate: string | null;
  endDate: string | null;
  onFilterChange: (start: string | null, end: string | null) => void;
}

const DateFilter: React.FC<DateFilterProps> = ({ startDate, endDate, onFilterChange }) => {
  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange(e.target.value || null, endDate);
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange(startDate, e.target.value || null);
  };

  const handleClearFilter = () => {
    onFilterChange(null, null);
  };

  const hasFilter = startDate || endDate;

  const inputClasses = "block w-full px-3 py-2 bg-slate-50 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-700 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:focus:ring-offset-slate-900 transition-colors";
  const labelClasses = "block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1";

  return (
    <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg">
      <div className="flex items-center gap-3 mb-4">
        <FilterIcon className="w-6 h-6 text-indigo-500" />
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Filtrar por Período</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
        <div>
          <label htmlFor="startDate" className={labelClasses}>Data de Início</label>
          <input
            type="date"
            id="startDate"
            value={startDate || ''}
            onChange={handleStartDateChange}
            className={inputClasses}
          />
        </div>
        <div>
          <label htmlFor="endDate" className={labelClasses}>Data Final</label>
          <input
            type="date"
            id="endDate"
            value={endDate || ''}
            onChange={handleEndDateChange}
            min={startDate || ''}
            className={inputClasses}
          />
        </div>
      </div>
      {hasFilter && (
        <div className="mt-4">
            <button
              onClick={handleClearFilter}
              className="w-full text-center px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-200 dark:bg-slate-700/50 rounded-md hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
            >
              Limpar Filtro
            </button>
        </div>
      )}
    </div>
  );
};

export default DateFilter;
