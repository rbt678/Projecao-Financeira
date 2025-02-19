// lib/formatUtils.ts
// Funções de formatação (moeda, etc.)

export const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };