// src/hooks/useProjecao.ts
'use client';

import { useState, useEffect, useCallback } from "react";
import { getDataMonths } from "@/lib/storage";
import { TableDataItemTotal } from "@/components/projecao/MonthTable";
import { useImmer } from 'use-immer';

export function useProjecao() {
  const [savings, setSavings] = useState<number>(0);
  const [transactionsMonths, setTransactionsMonths] = useImmer<TableDataItemTotal[][]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

    useEffect(() => {
      const fetchData = async () => {
          setIsLoading(true);
          setError(null);
          try {
              const { savings, recalculatedMonths } = getDataMonths();
              setSavings(savings);
              setTransactionsMonths(recalculatedMonths);

          } catch (err: unknown) {
              if (err instanceof Error) {
                  setError(err.message);
              } else {
                  setError("Erro ao carregar os dados.");
              }
          } finally {
              setIsLoading(false);
          }
      };

      fetchData();
    }, [setTransactionsMonths]);


  const handleInputChange = useCallback(
    (
      monthIndex: number,
      id: string,
      field: keyof TableDataItemTotal,  // Mantém keyof TableDataItemTotal
      value: string | number
    ) => {
      setTransactionsMonths((draft) => {
        const month = draft[monthIndex];
        if (!month) return;

        const transactionIndex = month.findIndex((t) => t.id === id);
        if (transactionIndex === -1) return;

        // Type assertion:  Afirma que o valor é do tipo correto para aquele campo
        if (field === 'dia' || field === 'valor' || field === 'total') {
            month[transactionIndex][field] = Number(value); // Força a conversão para Number
        } else if (field === 'nome') {
            month[transactionIndex][field] = String(value); // Força para string se for 'nome'
        }
        // Removido: removing e id não são atualizados aqui.

        let startingValue =
          monthIndex === 0
            ? savings
            : draft[monthIndex - 1]?.[draft[monthIndex - 1].length - 1]?.total || savings;

        for (let m = monthIndex; m < draft.length; m++) {
          let cumulative =
            m === monthIndex
              ? transactionIndex === 0
                ? startingValue
                : month[transactionIndex - 1].total
              : startingValue;

          for (let i = (m === monthIndex ? transactionIndex : 0); i < draft[m].length; i++) {
            cumulative += Number(draft[m][i].valor);
            draft[m][i].total = cumulative;
          }
          startingValue = draft[m][draft[m].length - 1]?.total || startingValue;
        }
      });
    },
    [setTransactionsMonths, savings]
  );

    const handleDeleteItem = useCallback(
      (monthIndex: number, id: string) => {
        setTransactionsMonths((draft) => {
          const month = draft[monthIndex];
          if (!month) return;

          const transactionIndex = month.findIndex((t) => t.id === id);
          if (transactionIndex === -1) return;

          month[transactionIndex].removing = true;

            setTimeout(() => {
                setTransactionsMonths(draftUpdate => {
                    const updatedMonth = draftUpdate[monthIndex];
                    if(!updatedMonth) return;

                    const updatedTransactionIndex = updatedMonth.findIndex((t) => t.id === id);
                    if(updatedTransactionIndex !== -1) {
                        updatedMonth.splice(updatedTransactionIndex, 1);
                    }

                    let startingValue =
                        monthIndex === 0
                        ? savings
                        : draftUpdate[monthIndex - 1]?.[draftUpdate[monthIndex - 1].length - 1]?.total || savings;

                    for (let m = monthIndex; m < draftUpdate.length; m++) {
                        let cumulative = (m === monthIndex) ? startingValue : startingValue;
                        for (let i = (m === monthIndex ? 0 : 0); i < draftUpdate[m].length; i++) {
                          cumulative += Number(draftUpdate[m][i].valor);
                            draftUpdate[m][i].total = cumulative;
                        }
                        startingValue = draftUpdate[m][draftUpdate[m].length - 1]?.total || startingValue;
                    }
                });

            }, 300);

        });
      },
      [setTransactionsMonths, savings]
    );

  return { transactionsMonths, savings, isLoading, error, handleInputChange, handleDeleteItem };
}