import React, { useState } from 'react';
import { Sale, PropertyType } from '../types';
import { HomeIcon, BuildingIcon, TrashIcon, MapPinIcon, BuildingOfficeIcon, ChevronDownIcon, WarehouseIcon, FarmIcon } from './icons';

interface SalesHistoryProps {
  sales: Sale[];
  onClearHistory: () => void;
}

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
});

const PropertyIcon: React.FC<{ type: PropertyType }> = ({ type }) => {
    const iconClass = "w-8 h-8 mr-4 text-indigo-500 dark:text-indigo-400 flex-shrink-0";
    switch(type) {
        case PropertyType.APARTAMENTO:
        case PropertyType.FLAT:
            return <BuildingIcon className={iconClass} />;
        case PropertyType.CASA:
            return <HomeIcon className={iconClass} />;
        case PropertyType.TERRENO:
            return <MapPinIcon className={iconClass} />;
        case PropertyType.COMERCIAL:
            return <BuildingOfficeIcon className={iconClass} />;
        case PropertyType.GALPAO:
            return <WarehouseIcon className={iconClass} />;
        case PropertyType.CHACARA:
        case PropertyType.FAZENDA:
            return <FarmIcon className={iconClass} />;
        default:
            return <BuildingIcon className={iconClass} />;
    }
}

const SalesHistory: React.FC<SalesHistoryProps> = ({ sales, onClearHistory }) => {
  const [expandedSaleId, setExpandedSaleId] = useState<string | null>(null);

  const handleToggleDetails = (saleId: string) => {
    setExpandedSaleId(currentId => (currentId === saleId ? null : saleId));
  };

  return (
    <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Histórico de Vendas</h2>
        {sales.length > 0 && (
            <button 
                onClick={onClearHistory}
                className="flex items-center px-3 py-1.5 text-sm font-medium text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/50 rounded-md hover:bg-red-200 dark:hover:bg-red-900 transition-colors"
                aria-label="Limpar histórico de vendas"
            >
                <TrashIcon className="w-4 h-4 mr-1.5" />
                Limpar
            </button>
        )}
      </div>
      <div className="max-h-96 overflow-y-auto pr-2 -mr-2">
        {sales.length === 0 ? (
          <p className="text-center text-slate-500 dark:text-slate-400 py-8">Nenhuma venda registrada ainda.</p>
        ) : (
          <ul className="divide-y divide-slate-200 dark:divide-slate-700">
            {sales.map((sale) => {
              const isExpanded = expandedSaleId === sale.id;
              const saleDateFormatted = new Date(sale.saleDate + 'T00:00:00').toLocaleDateString('pt-BR');
              return (
              <li key={sale.id} className="py-3 transition-colors duration-200">
                <div 
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => handleToggleDetails(sale.id)}
                    role="button"
                    aria-expanded={isExpanded}
                    aria-controls={`sale-details-${sale.id}`}
                >
                    <div className="flex items-center overflow-hidden">
                        <PropertyIcon type={sale.propertyType} />
                        <div className="overflow-hidden">
                            <p className="font-semibold text-slate-700 dark:text-slate-200 truncate" title={`${sale.clientName} - ${sale.condoName}`}>{sale.clientName}</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">{sale.propertyType} - {saleDateFormatted}</p>
                        </div>
                    </div>
                    <div className="flex items-center ml-4 flex-shrink-0">
                        <div className="text-right">
                            <p className="font-semibold text-green-600 dark:text-green-400">{currencyFormatter.format(sale.totalCommission)}</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">({sale.commissionRate}%)</p>
                        </div>
                        <ChevronDownIcon className={`w-5 h-5 ml-2 text-slate-400 transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                    </div>
                </div>

                <div
                    id={`sale-details-${sale.id}`}
                    className={`transition-all duration-300 ease-in-out overflow-hidden ${isExpanded ? 'max-h-60 pt-3 mt-3 border-t border-slate-200 dark:border-slate-700' : 'max-h-0'}`}
                >
                    {isExpanded && (
                         <div className="text-sm text-slate-600 dark:text-slate-300 space-y-2 pl-12 pr-4">
                            <p><strong className="font-semibold text-slate-700 dark:text-slate-200">Data da Venda:</strong> {saleDateFormatted}</p>
                            <p><strong className="font-semibold text-slate-700 dark:text-slate-200">Cliente:</strong> {sale.clientName}</p>
                            <p><strong className="font-semibold text-slate-700 dark:text-slate-200">Condomínio:</strong> {sale.condoName}</p>
                            <p><strong className="font-semibold text-slate-700 dark:text-slate-200">Valor da Venda:</strong> {currencyFormatter.format(sale.propertyValue)}</p>
                            {sale.propertySize && sale.propertySize > 0 && (
                                <>
                                    <p><strong className="font-semibold text-slate-700 dark:text-slate-200">Metragem:</strong> {sale.propertySize} m²</p>
                                    <p><strong className="font-semibold text-slate-700 dark:text-slate-200">Valor/m²:</strong> {currencyFormatter.format(sale.propertyValue / sale.propertySize)}</p>
                                </>
                            )}
                            <p><strong className="font-semibold text-slate-700 dark:text-slate-200">Taxa de Comissão:</strong> {sale.commissionRate}%</p>
                         </div>
                    )}
                </div>
              </li>
            )})}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SalesHistory;