// components/home/Savings.tsx

import { useState, useCallback } from "react";
import styles from './Savings.module.css'; // CSS Modules
import { formatCurrency } from "@/lib/formatUtils";

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