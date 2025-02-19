// app/projecao/page.tsx

"use client";

import { MonthTable } from "@/components/projecao/MonthTable";
import { useProjecao } from "@/hooks/useProjecao";
import { obterMesString } from "@/lib/dateUtils";
import LoadingSpinner from "@/components/shared/LoadingSpinner"; // Componente de loading genérico
import ErrorMessage from "@/components/shared/ErrorMessage";   // Componente de mensagem de erro genérico

export default function Projecao() {
  const { transactionsMonths, savings, isLoading, error, handleInputChange, handleDeleteItem } = useProjecao();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (transactionsMonths.length === 0) {
    return <div className="text-center text-gray-500 text-lg">Sem transações</div>;
  }

  return (
    <div className="flex flex-col gap-4 items-center overflow-auto p-4">
      {transactionsMonths.map((month, monthIndex) => (
        <MonthTable
          key={monthIndex}
          month={month}
          monthIndex={monthIndex}
          monthName={obterMesString(monthIndex)}
          onInputChange={handleInputChange}
          onDeleteItem={handleDeleteItem}
        />
      ))}
    </div>
  );
}