// src/hooks/useProjecao.ts
'use client'; // Adiciona a diretiva 'use client'

// Hook personalizado para a lógica da página de projeção

import { useState, useEffect, useCallback } from "react";
import { getDataMonths, saveData } from "@/lib/storage";
import { TableDataItemTotal } from "@/components/projecao/MonthTable";
import { useImmer } from 'use-immer';

export function useProjecao() {
  const [savings, setSavings] = useState<number>(0);
    const [transactionsMonths, setTransactionsMonths] = useImmer<TableDataItemTotal[][]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


    // Inicializa os dados
    useEffect(() => {
      const fetchData = async () => {
          setIsLoading(true);
          setError(null);
          try {
              const { savings, recalculatedMonths } = getDataMonths();
              setSavings(savings);
              setTransactionsMonths(recalculatedMonths);

          } catch (err: any) {
              setError(err.message || "Erro ao carregar dados.");
          } finally {
              setIsLoading(false);
          }
      };

      fetchData();
    }, [setTransactionsMonths]);


  const handleInputChange = useCallback(
    (monthIndex: number, id: string, field: keyof TableDataItemTotal, value: string | number) => {

        setTransactionsMonths(draft => {
            const month = draft[monthIndex];
            if(month){
                const transactionIndex = month.findIndex(t => t.id === id);
                if(transactionIndex !== -1) {
                    month[transactionIndex][field] = value;

                    // Recalcula a partir do mês alterado
                    let startingValue = monthIndex === 0 ? savings : (draft[monthIndex - 1]?.[draft[monthIndex - 1].length - 1]?.total || savings);

                    for (let m = monthIndex; m < draft.length; m++) {
                        let cumulative = m === monthIndex? (transactionIndex === 0? startingValue : month[transactionIndex-1].total) : startingValue; // Pega o total anterior correto
                        for(let i = (m === monthIndex? transactionIndex : 0); i < draft[m].length; i++){
                            cumulative += Number(draft[m][i].valor);
                            draft[m][i].total = cumulative;
                        }
                        // Atualiza o startingValue para o próximo mês
                        startingValue = draft[m][draft[m].length - 1]?.total || startingValue;
                    }
                }
            }
        });

    },
    [setTransactionsMonths, savings]
  );

  const handleDeleteItem = useCallback(
      (monthIndex: number, id: string) => {

          setTransactionsMonths(draft => {
              const month = draft[monthIndex];
              if (month) {
                  const transactionIndex = month.findIndex(t => t.id === id);
                  if (transactionIndex !== -1) {
                      month[transactionIndex].removing = true;

                      setTimeout(() => {
                        setTransactionsMonths(draft2 => {
                            const month2 = draft2[monthIndex];
                            const transactionIndex2 = month2.findIndex(t => t.id === id);
                            month2.splice(transactionIndex2, 1);

                              // Recalcula a partir do mês alterado
                            let startingValue = monthIndex === 0 ? savings : (draft2[monthIndex - 1]?.[draft2[monthIndex - 1].length - 1]?.total || savings);

                            for (let m = monthIndex; m < draft2.length; m++) {
                                let cumulative = m === monthIndex ? startingValue : startingValue;
                                for (let i = (m === monthIndex ? 0 : 0); i < draft2[m].length; i++) {  // Começa do 0, pois o item já foi removido
                                  cumulative += Number(draft2[m][i].valor);
                                    draft2[m][i].total = cumulative;
                                }
                                startingValue = draft2[m][draft2[m].length - 1]?.total || startingValue;

                            }
                        })
                      }, 300)
                  }
              }
          });
      },
      [setTransactionsMonths, savings]
  );

  return { transactionsMonths, savings, isLoading, error, handleInputChange, handleDeleteItem };
}