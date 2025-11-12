export enum PropertyType {
  APARTAMENTO = 'Apartamento',
  CASA = 'Casa',
  TERRENO = 'Terreno',
  COMERCIAL = 'Comercial',
  FLAT = 'Flat',
  GALPAO = 'Galpão',
  CHACARA = 'Chácara',
  FAZENDA = 'Fazenda',
}

export interface Sale {
  id: string;
  clientName: string;
  propertyType: PropertyType;
  condoName: string;
  propertyValue: number;
  propertySize?: number;
  commissionRate: number;
  totalCommission: number;
  monthlyInstallment: number;
  saleDate: string;
}

export interface ChartData {
  month: string;
  valor: number;
}