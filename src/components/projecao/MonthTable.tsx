// components/projecao/MonthTable.tsx

import { formatCurrency } from '@/lib/formatUtils';

const styles = {
  mes: "py-3 px-6 text-center text-lg font-extrabold text-gray-700 uppercase tracking-wider",
  th: "py-3 text-center text-sm font-extrabold text-gray-700 uppercase tracking-wider",
  td: "py-4 text-sm font-medium text-gray-900 whitespace-normal",
  tr: "group bg-gray-200 hover:bg-gray-50 transition duration-150 transition-opacity duration-300",
  trRemoving: "opacity-0 transition-opacity duration-300",
  trAdding: "opacity-0",
  tableContainer: "bg-gray-100 shadow-md rounded-lg overflow-auto p-3 pt-0 pb-1 w-full max-w-[1000px] flex-grow flex flex-col",
  table: "border-separate border-spacing-y-2 w-full flex-grow",
  thead: "bg-gray-100",
  tbody: "rounded-lg",
  tdRoundedLeft: "rounded-l-lg",
  tdRoundedRight: "rounded-r-lg",
  tdContent: "flex justify-between items-center px-2",
  deleteButton: "scale-125 opacity-0 group-hover:opacity-100 transition duration-200 cursor-pointer hover:scale-150 flex-shrink-0 ml-2",
  input: "text-center",
  inputDay: "w-16",
  inputName: "w-full min-w-[100px]",
  inputValue: "w-24",
  numberPositive: "text-green-500",
  numberNegative: "text-red-500",
  buttonContainer: "flex justify-center mt-2",
  button: "cursor-pointer transition-transform hover:scale-125",
  aviso: "text-center text-gray-500 text-lg py-4",
}

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
  className?: string; // Adicionando propriedade para classes personalizadas
}

export function MonthTable({ 
  month, 
  monthIndex, 
  monthName, 
  onInputChange, 
  onDeleteItem,
  className = "" 
}: MonthTableProps) {
  return (
    <div className={`${styles.tableContainer} ${className}`}>
      <div className={styles.mes}>{monthName}</div>
      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr>
            <th className={`${styles.th} w-20`}>Dia</th>
            <th className={`${styles.th} w-full`}>Conta</th>
            <th className={`${styles.th} w-32`}>Valor</th>
            <th className={`${styles.th} w-32`}>Total</th>
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
              <td className={`${styles.td} flex-grow`}>
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
                <div className={`${styles.tdContent} ${item.total >= 0 ? styles.numberPositive : styles.numberNegative}`}>
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