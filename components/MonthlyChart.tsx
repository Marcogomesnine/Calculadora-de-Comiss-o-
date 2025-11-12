import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartData } from '../types';

interface MonthlyChartProps {
  data: ChartData[];
}

const currencyFormatter = (value: number) => {
  if(value >= 1000) {
      return `R$${(value / 1000).toFixed(0)}k`;
  }
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

const fullCurrencyFormatter = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(value);
}

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-2 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg shadow-lg">
          <p className="label font-bold text-slate-700 dark:text-slate-200">{`${label}`}</p>
          <p className="intro text-indigo-600 dark:text-indigo-400">{`Valor : ${fullCurrencyFormatter(payload[0].value)}`}</p>
        </div>
      );
    }
  
    return null;
  };

const MonthlyChart: React.FC<MonthlyChartProps> = ({ data }) => {
  return (
    <div className="w-full h-80 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-lg">
      <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">Recebimento Mensal (1 Ano)</h3>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 10,
            left: 20,
            bottom: 5,
          }}
          barSize={20}
        >
          <defs>
              <linearGradient id="colorMonthly" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#818cf8" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={1}/>
              </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} vertical={false}/>
          <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 12 }}  tickLine={false} axisLine={false}/>
          <YAxis tickFormatter={currencyFormatter} tick={{ fill: '#64748b', fontSize: 12 }} tickLine={false} axisLine={false} />
          <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(99, 102, 241, 0.1)'}}/>
          <Bar dataKey="valor" fill="url(#colorMonthly)" name="Valor Recebido" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyChart;