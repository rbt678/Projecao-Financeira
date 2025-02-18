'use client'

import { useCallback, useState } from "react";
import Savings from "@/UI/savings";
import Table, { TableDataItem } from "@/UI/table";
import { useRouter } from 'next/navigation';

const listaExemplo = [
  { dia: 1, nome: "Nome A", valor: 100 },
  { dia: 1, nome: "Nome B", valor: 200 },
  { dia: 2, nome: "Nome C", valor: 300 },
  { dia: 2, nome: "Nome D", valor: 400 },
  { dia: 3, nome: "Nome E", valor: 500 },
  { dia: 3, nome: "Nome F", valor: 600 },
];

export default function Home() {
  const [transactions, setTransactions] = useState<TableDataItem[]>(listaExemplo);
  const [savings, setSavings] = useState<number>(2000);
  const router = useRouter()

  const handleUpdateData = useCallback((updatedData: TableDataItem[]) => {
    setTransactions(updatedData);
  }, []);

  const handleUpdateSavings = useCallback((value: number) => {
    setSavings(value);
  }, []);

  const calcular = useCallback(() => {
    localStorage.setItem('dados', JSON.stringify({ transactions, savings }));
    router.push("/projecao");
  }, [transactions, savings]);

  return (
    <div>
      <h1>Coloque as informações</h1>
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
