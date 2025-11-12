import React from 'react';
import { Sale } from '../types';
import { ChartData } from '../types';
import MonthlyChart from './MonthlyChart';
import { ChartBarIcon } from './icons';

interface CommissionResultProps {
  sale: Sale | null;
}

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
});

const CommissionResult: React.FC<CommissionResultProps> = ({ sale }) => {
  if (!sale) {
    return (
      <div className="flex items-center justify-center min-h-[400px] bg-white dark:bg-slate-800 rounded-xl p-8 text-slate-500 border-2 border-dashed border-slate-300 dark:border-slate-700 shadow-lg">
        <div className="text-center">
            <ChartBarIcon className="w-16 h-16 mx-auto mb-4 text-slate-400 dark:text-slate-500" />
            <p className="font-semibold text-slate-600 dark:text-slate-300">Aguardando cálculo...</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Preencha o formulário para ver os resultados aqui.</p>
        </div>
      </div>
    );
  }

  const chartData: ChartData[] = Array.from({ length: 12 }, (_, i) => {
    const month = new Date(0, i).toLocaleString('pt-BR', { month: 'short' }).replace('.', '').toUpperCase();
    return {
      month,
      valor: sale.monthlyInstallment,
    };
  });

  return (
    <div className="space-y-6">
        <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">Resumo do Cálculo Atual</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col p-4 bg-slate-100 dark:bg-slate-900/50 rounded-lg">
                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Comissão Total</span>
                    <span className="text-3xl font-bold text-green-600 dark:text-green-400 mt-1">{currencyFormatter.format(sale.totalCommission)}</span>
                </div>
                <div className="flex flex-col p-4 bg-slate-100 dark:bg-slate-900/50 rounded-lg">
                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Recebimento Mensal (12x)</span>
                    <span className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">{currencyFormatter.format(sale.monthlyInstallment)}</span>
                </div>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-300 space-y-1">
                <p><strong className="font-semibold text-slate-700 dark:text-slate-200">Cliente:</strong> {sale.clientName}</p>
                <p><strong className="font-semibold text-slate-700 dark:text-slate-200">Imóvel:</strong> {sale.propertyType} em {sale.condoName}</p>
                <p><strong className="font-semibold text-slate-700 dark:text-slate-200">Valor da Venda:</strong> {currencyFormatter.format(sale.propertyValue)}</p>
                {sale.propertySize && sale.propertySize > 0 && (
                    <>
                        <p><strong className="font-semibold text-slate-700 dark:text-slate-200">Metragem:</strong> {sale.propertySize} m²</p>
                        <p><strong className="font-semibold text-slate-700 dark:text-slate-200">Valor/m²:</strong> {currencyFormatter.format(sale.propertyValue / sale.propertySize)}</p>
                    </>
                )}
                <p><strong className="font-semibold text-slate-700 dark:text-slate-200">Data da Venda:</strong> {new Date(sale.saleDate + 'T00:00:00').toLocaleDateString('pt-BR')}</p>
            </div>
        </div>
        <MonthlyChart data={chartData} />
    </div>
  );
};

export default CommissionResult;