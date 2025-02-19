// app/page.tsx

'use client'

import { useCallback, useState } from "react";
import Savings from "@/UI/savings";
import Table, { TableDataItem } from "@/UI/table";
import { useRouter } from 'next/navigation';
import { getData, saveData } from "@/lib/dataRequests";


export default function Home() {
  const listaLocal = getData();
  const [transactions, setTransactions] = useState<TableDataItem[]>(listaLocal.transactions);
  const [savings, setSavings] = useState<number>(listaLocal.savings);
  const router = useRouter()

  const handleUpdateData = useCallback((updatedData: TableDataItem[]) => {
    setTransactions(updatedData);
  }, []);

  const handleUpdateSavings = useCallback((value: number) => {
    setSavings(value);
  }, []);

  const calcular = useCallback(() => {
    saveData(transactions, savings);
    router.push("/projecao");
  }, [transactions, savings, router]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-4 max-h-[calc(100vh-150px)] overflow-auto">
        <div>
          <Table lista={transactions} updateData={handleUpdateData} />
        </div>
        <div className="flex flex-col gap-4">
          <Savings guardado={savings} updateSavings={handleUpdateSavings} />
        </div>
      </div>
      <div className="flex justify-center p-4">
        <button className="bg-gray-800 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded cursor-pointer" onClick={calcular}>Calcular</button>
      </div>
    </div>
  );
}
