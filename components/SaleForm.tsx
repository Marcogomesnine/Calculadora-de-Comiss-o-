import React, { useState, useEffect } from 'react';
import { PropertyType } from '../types';
import { CalculatorIcon, PlusIcon } from './icons';

interface SaleFormData {
    clientName: string;
    propertyType: PropertyType;
    condoName: string;
    propertyValue: string;
    propertySize: string;
    commissionRate: string;
    saleDate: string;
}

interface SaleFormProps {
  onCalculate: (data: SaleFormData) => void;
  isLoading: boolean;
}

const SaleForm: React.FC<SaleFormProps> = ({ onCalculate, isLoading }) => {
  const initialFormState: SaleFormData = {
    clientName: '',
    propertyType: PropertyType.APARTAMENTO,
    condoName: '',
    propertyValue: '',
    propertySize: '',
    commissionRate: '6',
    saleDate: new Date().toISOString().split('T')[0],
  };

  const [formData, setFormData] = useState<SaleFormData>(initialFormState);
  const [displayPropertyValue, setDisplayPropertyValue] = useState('');
  const [pricePerSqM, setPricePerSqM] = useState('');
  const [error, setError] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const value = parseFloat(formData.propertyValue);
    const size = parseFloat(formData.propertySize);
    if (value > 0 && size > 0) {
        const price = value / size;
        setPricePerSqM(new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price));
    } else {
        setPricePerSqM('');
    }
  }, [formData.propertyValue, formData.propertySize]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePropertyValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const digitsOnly = value.replace(/\D/g, '');

    if (!digitsOnly) {
      setDisplayPropertyValue('');
      setFormData(prev => ({ ...prev, propertyValue: '' }));
      return;
    }

    const numberValue = parseInt(digitsOnly, 10) / 100;

    const formattedValue = new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numberValue);
    
    setDisplayPropertyValue(formattedValue);
    setFormData(prev => ({ ...prev, propertyValue: numberValue.toString() }));
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const { clientName, condoName, propertyValue, commissionRate, saleDate, propertySize } = formData;
    if (!clientName || !condoName || !propertyValue || !commissionRate || !saleDate || !propertySize) {
        setError('Todos os campos são obrigatórios.');
        return;
    }
    const propValueNum = parseFloat(propertyValue);
    const propSizeNum = parseFloat(propertySize);
    const commRateNum = parseFloat(commissionRate);

    if (isNaN(propValueNum) || propValueNum <= 0 || isNaN(commRateNum) || commRateNum <= 0 || isNaN(propSizeNum) || propSizeNum <= 0) {
        setError('Valores do imóvel, metragem e comissão devem ser números positivos.');
        return;
    }
    
    onCalculate(formData);
    setIsSaved(true);
  };

  const handleNewSale = () => {
    setFormData(initialFormState);
    setDisplayPropertyValue('');
    setPricePerSqM('');
    setError('');
    setIsSaved(false);
  };

  const inputClasses = "mt-1 block w-full px-3 py-2 bg-slate-50 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-700 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:focus:ring-offset-slate-900 transition-colors";
  const selectClasses = "mt-1 block w-full pl-3 pr-10 py-2 text-base bg-slate-50 dark:bg-slate-900/50 border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm rounded-md transition-colors";
  const labelClasses = "block text-sm font-bold text-slate-700 dark:text-slate-300";

  return (
    <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg">
      <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">Registrar Nova Venda</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="clientName" className={labelClasses}>Nome do Cliente</label>
          <input
            type="text"
            id="clientName"
            name="clientName"
            value={formData.clientName}
            onChange={handleChange}
            className={inputClasses}
            placeholder="Ex: João da Silva"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="propertyType" className={labelClasses}>Tipo de Imóvel</label>
            <select
              id="propertyType"
              name="propertyType"
              value={formData.propertyType}
              onChange={handleChange}
              className={selectClasses}
            >
              {Object.values(PropertyType).map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="condoName" className={labelClasses}>Nome do Condomínio</label>
            <input
              type="text"
              id="condoName"
              name="condoName"
              value={formData.condoName}
              onChange={handleChange}
              className={inputClasses}
              placeholder="Ex: Residencial Flores"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="propertyValue" className={labelClasses}>Valor do Imóvel (R$)</label>
            <input
              type="text"
              id="propertyValue"
              name="propertyValue"
              value={displayPropertyValue}
              onChange={handlePropertyValueChange}
              className={inputClasses}
              placeholder="500.000,00"
            />
          </div>
          <div>
              <label htmlFor="propertySize" className={labelClasses}>Metragem (m²)</label>
              <input
                  type="number"
                  id="propertySize"
                  name="propertySize"
                  value={formData.propertySize}
                  onChange={handleChange}
                  step="0.01"
                  className={inputClasses}
                  placeholder="Ex: 120"
              />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
              <label htmlFor="pricePerSqM" className={labelClasses}>Valor do m²</label>
              <input
                  type="text"
                  id="pricePerSqM"
                  name="pricePerSqM"
                  value={pricePerSqM}
                  readOnly
                  className={`${inputClasses} bg-slate-100 dark:bg-slate-800/50 cursor-not-allowed`}
                  placeholder="Calculado"
              />
          </div>
          <div>
            <label htmlFor="commissionRate" className={labelClasses}>Comissão (%)</label>
            <input
              type="number"
              id="commissionRate"
              name="commissionRate"
              value={formData.commissionRate}
              onChange={handleChange}
              step="0.1"
              className={inputClasses}
              placeholder="Ex: 6"
            />
          </div>
          <div>
            <label htmlFor="saleDate" className={labelClasses}>Data da Venda</label>
            <input
              type="date"
              id="saleDate"
              name="saleDate"
              value={formData.saleDate}
              onChange={handleChange}
              className={inputClasses}
            />
          </div>
        </div>

        {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

        <div className="flex items-center gap-4 pt-2">
            <button
              type="submit"
              disabled={isLoading || isSaved}
              className="flex-grow flex items-center justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 dark:disabled:bg-indigo-800 disabled:cursor-not-allowed transition-all"
            >
              {isLoading ? (
                'Salvando...'
                ) : isSaved ? (
                'Venda Salva!'
                ) : (
                <>
                    <CalculatorIcon className="w-5 h-5 mr-2" />
                    Salvar Venda
                </>
              )}
            </button>
            {isSaved && (
                <button
                    type="button"
                    onClick={handleNewSale}
                    className="flex items-center justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-slate-600 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-colors"
                    aria-label="Registrar nova venda"
                >
                    <PlusIcon className="w-5 h-5 mr-1.5" />
                    Nova Venda
                </button>
            )}
        </div>
      </form>
    </div>
  );
};

export default SaleForm;