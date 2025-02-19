// components/home/Savings.tsx

import { useState, useCallback } from "react";
import { formatCurrency } from "@/lib/formatUtils";

const styles = {
  container: "w-fit h-fit bg-gray-100 shadow-md rounded-lg overflow-auto p-3 pt-0 pb-1",
  title: "py-3 px-6 text-center text-sm font-extrabold text-gray-700 uppercase tracking-wider",
  numberPositive: "text-green-500",
  numberNegative: "text-red-500",
  input: "text-center w-24",
  displayValue: "text-center mt-2",
}

interface SavingsProps {
  guardado?: number;
  updateSavings: (value: number) => void;
}

export default function Savings({ guardado = 0, updateSavings }: SavingsProps) {
  const [savings, setSavings] = useState(guardado);

  const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    setSavings(value);
    updateSavings(value);
  }, [updateSavings]);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Valor guardado</h1>
      <input
        className={`${styles.input} ${savings >= 0 ? styles.numberPositive : styles.numberNegative}`}
        type="number"
        value={savings}
        onChange={handleInputChange}
        step="0.01"
        required
      />
      <div className={styles.displayValue}>{formatCurrency(savings)}</div>
    </div>
  );
}