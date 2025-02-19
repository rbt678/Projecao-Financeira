// app/page.tsx

'use client'

import { useCallback, useEffect } from "react"; // Importa useEffect
import Savings from "@/components/home/Savings";
import Table from "@/components/home/Table";
import { useRouter } from 'next/navigation';
import { useTransactions } from "@/hooks/useTransactions"; // Hook personalizado para transações
import LoadingButton from "@/components/shared/LoadingButton"; // Componente para botão com estado de carregamento


export default function Home() {
  const { transactions, savings, updateTransactions, updateSavings, isLoading, error, saveTransactions } = useTransactions(); // Usando o hook personalizado
  const router = useRouter();


  const calcular = useCallback(async () => {
    const success = await saveTransactions();  // Usa o hook
    if (success) {
      router.push("/projecao");
    }
    // Caso saveTransactions retorne false, um erro já foi exibido pelo hook.
  }, [saveTransactions, router]);


  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-4 max-h-[calc(100vh-150px)] overflow-auto p-4">
        <div>
          <Table
            lista={transactions} // Passa os dados carregados como a prop 'lista'
            updateData={updateTransactions}  // Usa o hook
          />
        </div>
        <div className="flex flex-col gap-4">
          <Savings guardado={savings} updateSavings={updateSavings} /> {/* Usa o hook */}
        </div>
      </div>
      <div className="flex justify-center p-4">
          <LoadingButton
              isLoading={isLoading}
              onClick={calcular}
              className="bg-gray-800 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded cursor-pointer disabled:opacity-50"
              disabled={isLoading}
          >
              Calcular
          </LoadingButton>
      </div>
      {error && <div className="text-red-500 text-center">{error}</div>} {/* Exibe o erro, se houver */}
    </div>
  );
}