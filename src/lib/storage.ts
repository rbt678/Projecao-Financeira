// lib/storage.ts
// Camada de abstração para o localStorage

import { TableDataItem } from "@/components/home/Table";
import { TableDataItemTotal } from "@/components/projecao/MonthTable";
import { generateUUID } from "./uuid-fallback";

const STORAGE_KEY = "dados";

export function saveData(data: TableDataItem[], savings: number): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ transactions: data, savings }));
  } catch (error: unknown) { // Mudança aqui: unknown
    let errorMessage = "Não foi possível salvar os dados. Verifique o espaço disponível ou tente novamente mais tarde.";
        if(error instanceof Error) {
            errorMessage = error.message;
        }
    console.error("Erro ao salvar dados no localStorage:", error);
    throw new Error(errorMessage);  // Lança um erro específico
  }
}

export function getData(): { transactions: TableDataItem[]; savings: number } {
  if (typeof window === "undefined") {
    return { transactions: [], savings: 0 };
  }

  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsedData = JSON.parse(data);
      // Ordena as transações por dia (crescente)
      const sortedTransactions = (parsedData.transactions || []).sort(
        (a: TableDataItem, b: TableDataItem) => a.dia - b.dia
      );
      return {
        transactions: sortedTransactions,
        savings: parsedData.savings || 0,
      };
    }
    return { transactions: [], savings: 0 };
  } catch (error: unknown) {
    let errorMessage = "Não foi possível carregar os dados. Tente novamente.";
        if(error instanceof Error){
            errorMessage = error.message
        }
    console.error("Erro ao ler dados do localStorage:", error);
    throw new Error(errorMessage);
  }
}

export function getDataMonths(): { savings: number; recalculatedMonths: TableDataItemTotal[][] } {
    const { transactions, savings } = getData();

    if (!transactions.length) {
        return { savings, recalculatedMonths: [] };
    }
  const initialTransactions: TableDataItemTotal[] = transactions.map((item) => ({
    ...item,
    total: 0,
    id: item.id || generateUUID(), // Garante que tenha ID
  }));

    const months: TableDataItemTotal[][] = Array.from({ length: 12 }, () =>
        initialTransactions.map((item) => ({ ...item, total: 0 }))
    );

    const recalculatedMonths = recalcFromMonth(0, months, savings);
    return { savings, recalculatedMonths };
}

function recalcFromMonth(
  monthIndex: number,
  months: TableDataItemTotal[][],
  startingValue: number
): TableDataItemTotal[][] {
  const newMonths = structuredClone(months);
  let start = startingValue;

  for (let m = monthIndex; m < newMonths.length; m++) {
    newMonths[m] = recalcMonthFromTransactions(newMonths[m], start);
    start = newMonths[m].length > 0 ? newMonths[m][newMonths[m].length - 1].total : start;
  }
  return newMonths;
}

function recalcMonthFromTransactions(
  transactions: TableDataItemTotal[],
  startingValue: number
): TableDataItemTotal[] {
  let cumulative = startingValue;
  return transactions.map((item) => {
    cumulative += Number(item.valor);
    return { ...item, total: cumulative };
  });
}

export function clearData() {
  try {
      localStorage.removeItem(STORAGE_KEY);
  } catch(error: unknown) { // Mudança aqui: unknown
        let errorMessage = "Erro ao limpar dados.";
        if(error instanceof Error){
            errorMessage = error.message;
        }
      console.error("Erro ao limpar localStorage:", error);
      throw new Error(errorMessage);
  }
}