// components/projecao/MonthTable.tsx

import styles from './MonthTable.module.css'; // CSS Modules
import { formatCurrency } from '@/lib/formatUtils';

export interface TableDataItemTotal {
  dia: number;
  nome: string;
  valor: number;
  total: number;
  id: string; // Add ID
  removing?: boolean;
}

interface MonthTableProps {
  month: TableDataItemTotal[];
  monthIndex: number;
  monthName: string;
  onInputChange: (monthIndex: number, id: string, field: keyof TableDataItemTotal, value: string | number) => void;
  onDeleteItem: (monthIndex: number, id: string) => void;
}

export function MonthTable({ month, monthIndex, monthName, onInputChange, onDeleteItem }: MonthTableProps) {
  return (
    <div className={styles.tableContainer}>
      <div className={styles.mes}>{monthName}</div>
      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr>
            <th className={styles.th}>Dia</th>
            <th className={styles.th}>Conta</th>
            <th className={styles.th}>Valor</th>
            <th className={styles.th}>Total</th>
          </tr>
        </thead>
        <tbody className={styles.tbody}>
          {month.map((item) => (
            <tr
              className={`${styles.tr} ${item.removing ? styles.trRemoving : ""}`}
              key={item.id}
            >
              <td className={`${styles.td} ${styles.tdRoundedLeft}`}>
                <input
                  className={`${styles.input} ${styles.inputDay}`}
                  type="number"
                  min={1}
                  max={31}
                  value={item.dia}
                  onChange={(e) =>
                    onInputChange(monthIndex, item.id, "dia", Number(e.target.value))
                  }
                />
              </td>
              <td className={styles.td}>
                <input
                  className={`${styles.input} ${styles.inputName}`}
                  type="text"
                  value={item.nome}
                  onChange={(e) =>
                    onInputChange(monthIndex, item.id, "nome", e.target.value)
                  }
                />
              </td>
              <td className={styles.td}>
                <div className={styles.tdContent}>
                  <input
                    className={`${styles.input} ${styles.inputValue} ${item.valor >= 0
                        ? styles.numberPositive
                        : styles.numberNegative
                      }`}
                    type="number"
                    step={0.01}
                    value={item.valor}
                    onChange={(e) =>
                      onInputChange(monthIndex, item.id, "valor", Number(e.target.value))
                    }
                  />
                  <button
                    className={styles.deleteButton}
                    onClick={() => onDeleteItem(monthIndex, item.id)}
                  >
                    🗑️
                  </button>
                </div>
              </td>
              <td className={`${styles.td} ${styles.tdRoundedRight}`}>
                <div className={styles.tdContent}>
                    {formatCurrency(item.total)}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}