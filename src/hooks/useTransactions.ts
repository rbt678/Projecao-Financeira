// hooks/useTransactions.ts
'use client'; // Adicionado 'use client'

import { useState, useCallback, useEffect } from "react";
import { getData, saveData } from "@/lib/storage";
import { TableDataItem } from "@/components/home/Table";
import { useImmer } from "use-immer";

export function useTransactions() {
    const [transactions, setTransactions] = useImmer<TableDataItem[]>([]);
    const [savings, setSavings] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(false); // Carregando para salvar
    const [error, setError] = useState<string | null>(null); // Armazena mensagens de erro

    // Inicializa os dados do localStorage
    useEffect(() => {
        try {
            const { transactions: storedTransactions, savings: storedSavings } = getData();
            setTransactions(storedTransactions.map(item => ({ ...item, id: item.id || crypto.randomUUID() }))); // Garante ID
            setSavings(storedSavings);
        } catch (err: any) {
            setError(err.message || "Erro ao carregar os dados."); // Define o erro
        }
    }, [setTransactions]);


    const updateTransactions = useCallback((updatedTransactions: TableDataItem[]) => {
        setTransactions(updatedTransactions);
    }, [setTransactions]);


    const updateSavings = useCallback((value: number) => {
        setSavings(value);
    }, []);

    const saveTransactions = useCallback(async () => {
        setIsLoading(true);
        setError(null); // Limpa erros anteriores
        try {
            saveData(transactions, savings); // Salva
            return true;

        } catch (err: any) {
            setError(err.message || "Erro ao salvar os dados."); // Captura o erro do storage
            return false;

        } finally {
            setIsLoading(false);
        }
    }, [transactions, savings]);

    return { transactions, savings, updateTransactions, updateSavings, isLoading, error, saveTransactions };
}