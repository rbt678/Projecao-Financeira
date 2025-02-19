// lib/dataRequests.tsx

'use client'

import { TableDataItem } from "@/UI/table";

interface TableDataItemTotal extends TableDataItem {
    total: number;
}

function recalcFromMonth(
    monthIndex: number,
    months: TableDataItemTotal[][],
    startingValue: number
): TableDataItemTotal[][] {
    const newMonths = [...months];
    let start = startingValue;
    for (let m = monthIndex; m < newMonths.length; m++) {
        newMonths[m] = recalcMonthFromTransactions(newMonths[m], start);
        start =
            newMonths[m].length > 0
                ? newMonths[m][newMonths[m].length - 1].total
                : start;
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


export function saveData(data: TableDataItem[], savings: number) {
    localStorage.setItem("dados", JSON.stringify({ transactions: data, savings }));
}

export function getData(): { transactions: TableDataItem[]; savings: number } {
    if (typeof window === "undefined") {
        return { transactions: [], savings: 0 }; // Evita erro no servidor
    }

    const data = localStorage.getItem("dados");
    let transactions = [];
    let savings = 0;

    if (data) {
        try {
            const parsedData = JSON.parse(data);
            transactions = parsedData.transactions || [];
            savings = parsedData.savings || 0;
        } catch (error) {
            console.error("Erro ao parsear os dados do localStorage:", error);
        }
    }

    return { transactions, savings };
}

export function getDataMonths(): {savings: number, recalculatedMonths: TableDataItemTotal[][]} {
    const data = getData();
    const savings = data.savings;

    if(!data.transactions.length) {
        return {savings, recalculatedMonths: []}
    }

    // Cria uma cópia profunda das transações para o mês base
    const initialTransactions: TableDataItemTotal[] = data.transactions.map(
        (item) => ({ ...item, total: 0 })
    );

    // Cria 12 cópias (uma para cada mês)
    const months: TableDataItemTotal[][] = Array.from(
        { length: 12 },
        () => initialTransactions.map((item) => ({ ...item, total: 0 }))
    );
    
    // Recalcula os totais encadeados
    const recalculatedMonths = recalcFromMonth(0, months, savings);

    return {savings, recalculatedMonths}
}