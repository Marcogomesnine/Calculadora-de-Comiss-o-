import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Sale, PropertyType, ChartData } from './types';
import SaleForm from './components/SaleForm';
import CommissionResult from './components/CommissionResult';
import SalesHistory from './components/SalesHistory';
import DateFilter from './components/DateFilter'; // Importa o novo componente
import { DollarIcon, DocumentArrowDownIcon } from './components/icons';

// --- Funções e Componentes para o Gráfico Anual ---

const currencyFormatter = (value: number) => {
    if (value >= 1000) {
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
};

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="p-2 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg shadow-lg">
                <p className="label font-bold text-slate-700 dark:text-slate-200">{`${label}`}</p>
                <p className="intro text-teal-600 dark:text-teal-400">{`Previsto : ${fullCurrencyFormatter(payload[0].value)}`}</p>
            </div>
        );
    }
    return null;
};

const AnnualSummaryChart: React.FC<{ data: ChartData[] }> = ({ data }) => {
    const hasData = data.some(d => d.valor > 0);

    return (
        <div className="w-full h-96 bg-white dark:bg-slate-800 p-4 md:p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">Previsão de Renda Mensal ({new Date().getFullYear()})</h3>
            {hasData ? (
                <ResponsiveContainer width="100%" height="90%">
                    <BarChart data={data} margin={{ top: 5, right: 10, left: 20, bottom: 5 }}>
                        <defs>
                            <linearGradient id="colorAnnual" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#2dd4bf" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#0d9488" stopOpacity={1}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} vertical={false} />
                        <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 12 }} tickLine={false} axisLine={false} />
                        <YAxis tickFormatter={currencyFormatter} tick={{ fill: '#64748b', fontSize: 12 }} tickLine={false} axisLine={false} />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(20, 184, 166, 0.1)' }} />
                        <Bar dataKey="valor" fill="url(#colorAnnual)" name="Renda Mensal" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            ) : (
                <div className="flex items-center justify-center h-full text-center text-slate-500 dark:text-slate-400">
                    <p>Nenhuma comissão registrada para o período selecionado.</p>
                </div>
            )}
        </div>
    );
};

const SummaryStats: React.FC<{ totalVGV: number; totalCommissions: number }> = ({ totalVGV, totalCommissions }) => (
    <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg">
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">Relatório Geral</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col p-4 bg-slate-100 dark:bg-slate-900/50 rounded-lg">
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">VGV Total (Período)</span>
                <span className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-1">{fullCurrencyFormatter(totalVGV)}</span>
            </div>
            <div className="flex flex-col p-4 bg-slate-100 dark:bg-slate-900/50 rounded-lg">
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Comissão Total (Período)</span>
                <span className="text-3xl font-bold text-green-600 dark:text-green-400 mt-1">{fullCurrencyFormatter(totalCommissions)}</span>
            </div>
        </div>
    </div>
);


// --- Componente Principal da Aplicação ---

const App: React.FC = () => {
    const [salesHistory, setSalesHistory] = useState<Sale[]>(() => {
        try {
            const savedSales = localStorage.getItem('salesHistory');
            return savedSales ? JSON.parse(savedSales) : [];
        } catch (error) {
            console.error("Could not parse sales history from localStorage", error);
            return [];
        }
    });

    const [currentSaleResult, setCurrentSaleResult] = useState<Sale | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [filterDates, setFilterDates] = useState<{ start: string | null; end: string | null }>({ start: null, end: null });

    useEffect(() => {
        try {
            localStorage.setItem('salesHistory', JSON.stringify(salesHistory));
        } catch (error) {
            console.error("Could not save sales history to localStorage", error);
        }
    }, [salesHistory]);

    const handleCalculateAndSave = (data: {
        clientName: string;
        propertyType: PropertyType;
        condoName: string;
        propertyValue: string;
        propertySize: string;
        commissionRate: string;
        saleDate: string;
    }) => {
        setIsLoading(true);
        setTimeout(() => {
            const propertyValue = parseFloat(data.propertyValue);
            const propertySize = parseFloat(data.propertySize);
            const commissionRate = parseFloat(data.commissionRate);
            const totalCommission = propertyValue * (commissionRate / 100);
            const monthlyInstallment = totalCommission / 12;
            const newSale: Sale = {
                id: new Date().toISOString(),
                clientName: data.clientName,
                propertyType: data.propertyType,
                condoName: data.condoName,
                propertyValue: propertyValue,
                propertySize: propertySize,
                commissionRate: commissionRate,
                totalCommission: totalCommission,
                monthlyInstallment: monthlyInstallment,
                saleDate: data.saleDate,
            };
            setCurrentSaleResult(newSale);
            setSalesHistory(prevHistory => [newSale, ...prevHistory].sort((a, b) => new Date(b.saleDate).getTime() - new Date(a.saleDate).getTime()));
            setIsLoading(false);
        }, 500);
    };

    const handleClearHistory = () => {
        setSalesHistory([]);
        setCurrentSaleResult(null);
        setFilterDates({ start: null, end: null });
    };
    
    const handleFilterChange = (start: string | null, end: string | null) => {
        setFilterDates({ start, end });
    };

    const handleExportAllData = () => {
        if (salesHistory.length === 0) return;
    
        const headers = [
            "Data da Venda",
            "Cliente",
            "Tipo de Imóvel",
            "Condomínio",
            "Valor do Imóvel (R$)",
            "Metragem (m²)",
            "Valor/m² (R$)",
            "Comissão (%)",
            "Comissão Total (R$)",
            "Recebimento Mensal (R$)"
        ];
    
        // Formata valores monetários com separador de milhares e vírgula decimal
        const formatCurrencyForCSV = (value: number | undefined) => {
            if (typeof value !== 'number' || isNaN(value)) return '';
            return new Intl.NumberFormat('pt-BR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }).format(value);
        };
        
        // Formata outros números (tamanho, taxas) apenas com vírgula decimal
        const formatSimpleNumberForCSV = (value: number | undefined) => {
            if (typeof value !== 'number' || isNaN(value)) return '';
            return value.toString().replace('.', ',');
        };
        
        const csvContent = [
            headers.join(';'),
            ...salesHistory.map(sale => [
                new Date(sale.saleDate + 'T00:00:00').toLocaleDateString('pt-BR'),
                `"${sale.clientName.replace(/"/g, '""')}"`,
                sale.propertyType,
                `"${sale.condoName.replace(/"/g, '""')}"`,
                formatCurrencyForCSV(sale.propertyValue),
                formatSimpleNumberForCSV(sale.propertySize),
                sale.propertySize ? formatCurrencyForCSV(sale.propertyValue / sale.propertySize) : '',
                formatSimpleNumberForCSV(sale.commissionRate),
                formatCurrencyForCSV(sale.totalCommission),
                formatCurrencyForCSV(sale.monthlyInstallment)
            ].join(';'))
        ].join('\n');
    
        const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            const today = new Date().toISOString().split('T')[0];
            link.setAttribute("href", url);
            link.setAttribute("download", `relatorio_completo_vendas_${today}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const filteredSales = salesHistory.filter(sale => {
        if (!filterDates.start && !filterDates.end) return true;
        const saleDate = new Date(sale.saleDate + 'T00:00:00');
        const startDate = filterDates.start ? new Date(filterDates.start + 'T00:00:00') : null;
        const endDate = filterDates.end ? new Date(filterDates.end + 'T23:59:59') : null;
        
        if (startDate && saleDate < startDate) return false;
        if (endDate && saleDate > endDate) return false;
        
        return true;
    });

    const getAnnualChartData = (sales: Sale[]): ChartData[] => {
        const monthlyTotals: { [key: number]: number } = {};
        const currentYear = new Date().getFullYear();
    
        for (let i = 0; i < 12; i++) {
            monthlyTotals[i] = 0;
        }
    
        sales.forEach(sale => {
            const saleDate = new Date(sale.saleDate + 'T00:00:00');
            const startMonth = saleDate.getMonth();
            const startYear = saleDate.getFullYear();
    
            for (let i = 0; i < 12; i++) {
                const installmentDate = new Date(startYear, startMonth + i, 1);
                
                if (installmentDate.getFullYear() === currentYear) {
                    const monthIndex = installmentDate.getMonth();
                    monthlyTotals[monthIndex] += sale.monthlyInstallment;
                }
            }
        });
    
        return Array.from({ length: 12 }, (_, i) => {
            const monthName = new Date(currentYear, i).toLocaleString('pt-BR', { month: 'short' }).replace('.', '').toUpperCase();
            return {
                month: monthName,
                valor: monthlyTotals[i] || 0,
            };
        });
    };

    const annualData = getAnnualChartData(filteredSales);
    const totalVGV = filteredSales.reduce((acc, sale) => acc + sale.propertyValue, 0);
    const totalCommissions = filteredSales.reduce((acc, sale) => acc + sale.totalCommission, 0);

    return (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-200 font-sans p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <header className="pb-8 mb-8 border-b border-slate-200 dark:border-slate-800">
                    <div className="flex flex-col sm:flex-row items-center justify-center text-center sm:justify-between gap-4">
                        <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
                            <div className="flex items-center gap-3">
                                <DollarIcon className="w-10 h-10 text-indigo-500"/>
                                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
                                    Calculadora de Comissão
                                </h1>
                            </div>
                            <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">
                                Uma ferramenta para corretores de imóveis.
                            </p>
                        </div>
                        <button 
                            onClick={handleExportAllData}
                            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-slate-950 disabled:bg-indigo-400 dark:disabled:bg-indigo-800 disabled:cursor-not-allowed transition-colors"
                            disabled={salesHistory.length === 0}
                            aria-label="Baixar relatório completo em CSV"
                        >
                            <DocumentArrowDownIcon className="w-5 h-5 mr-2" />
                            Baixar Relatório Completo
                        </button>
                    </div>
                </header>

                <main className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
                    {/* Coluna da Esquerda: Ações e Resultado Imediato */}
                    <div className="flex flex-col gap-8">
                        <SaleForm onCalculate={handleCalculateAndSave} isLoading={isLoading} />
                        <CommissionResult sale={currentSaleResult} />
                    </div>
                    
                    {/* Coluna da Direita: Histórico e Resumo */}
                    <div className="flex flex-col gap-8">
                        {salesHistory.length > 0 && (
                            <>
                                <DateFilter 
                                    startDate={filterDates.start}
                                    endDate={filterDates.end}
                                    onFilterChange={handleFilterChange}
                                />
                                <SummaryStats totalVGV={totalVGV} totalCommissions={totalCommissions} />
                            </>
                        )}
                        <SalesHistory sales={filteredSales} onClearHistory={handleClearHistory} />
                        {filteredSales.length > 0 && (
                            <AnnualSummaryChart data={annualData} />
                        )}
                         {salesHistory.length > 0 && filteredSales.length === 0 && (
                             <div className="text-center p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg">
                                <p className="text-slate-500 dark:text-slate-400">Nenhuma venda encontrada para o período selecionado.</p>
                            </div>
                        )}
                    </div>
                </main>
                
                <footer className="text-center mt-12 py-4 border-t border-slate-200 dark:border-slate-700">
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        © {new Date().getFullYear()} Calculadora Imobiliária. Todos os direitos reservados.
                    </p>
                </footer>
            </div>
        </div>
    );
};

export default App;