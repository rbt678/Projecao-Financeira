// hooks/useTransactions.ts
'use client';

import { useState, useCallback, useEffect } from "react";
import { getData, saveData } from "@/lib/storage";
import { TableDataItem } from "@/components/home/Table";
import { useImmer } from "use-immer";
import { generateUUID } from "@/lib/uuid-fallback";

export function useTransactions() {
    const [transactions, setTransactions] = useImmer<TableDataItem[]>([]);
    const [savings, setSavings] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        try {
            const { transactions: storedTransactions, savings: storedSavings } = getData();
            setTransactions(storedTransactions.map(item => ({ ...item, id: item.id || generateUUID() })));
            setSavings(storedSavings);
        } catch (err: unknown) { // Mudança aqui: unknown
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Erro ao carregar os dados.");
            }
        }
    }, [setTransactions, setSavings]);


    const updateTransactions = useCallback((updatedTransactions: TableDataItem[]) => {
        setTransactions(updatedTransactions);
    }, [setTransactions]);


    const updateSavings = useCallback((value: number) => {
        setSavings(value);
    }, []);

    const saveTransactions = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            saveData(transactions, savings);
            return true;

        } catch (err: unknown) { // Mudança aqui: unknown
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Erro ao salvar os dados.");
            }
        } finally {
            setIsLoading(false);
        }
    }, [transactions, savings]);

    return { transactions, savings, updateTransactions, updateSavings, isLoading, error, saveTransactions };
}