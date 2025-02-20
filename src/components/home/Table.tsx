// components/home/Table.tsx

import { generateUUID } from '@/lib/uuid-fallback';
import { useCallback, useEffect } from 'react'; // Importa useEffect
import { useImmer } from 'use-immer';

const styles = {
  th: "py-3 px-6 text-center text-sm font-extrabold text-gray-700 uppercase tracking-wider",
  td: "py-4 px-6 text-sm font-medium text-gray-900 whitespace-nowrap",
  tr: "group bg-gray-200 hover:bg-gray-50 transition duration-150 transition-opacity duration-300",
  trRemoving: "opacity-0 transition-opacity duration-300",
  trAdding: "opacity-0",
  tableContainer: "w-fit h-fit bg-gray-100 shadow-md rounded-lg overflow-auto p-3 pt-0 pb-1",
  table: "border-separate border-spacing-y-2",
  thead: "bg-gray-100",
  tbody: "rounded-lg",
  tdRoundedLeft: "rounded-l-lg",
  tdRoundedRight: "rounded-r-lg",
  tdContent: "flex justify-between",
  deleteButton: "scale-125 opacity-0 group-hover:opacity-100 transition duration-200 cursor-pointer hover:scale-150",
  input: "text-center",
  inputDay: "w-16",
  inputName: "w-48",
  inputValue: "w-24",
  numberPositive: "text-green-500",
  numberNegative: "text-red-500",
  buttonContainer: "flex justify-center",
  button: "cursor-pointer transition-transform hover:scale-125",
  aviso: "text-center text-gray-500 text-lg",
}

export interface TableDataItem {
  dia: number;
  nome: string;
  valor: number;
  id: string;
  removing?: boolean;
}

interface TableProps {
  lista?: TableDataItem[];
  updateData: (updatedList: TableDataItem[]) => void;
}

export default function Table({ lista = [], updateData }: TableProps) {
    const [data, setData] = useImmer<TableDataItem[]>([]);

    useEffect(() => {
        setData(lista.map(item => ({ ...item, id: item.id || generateUUID() })));
    }, [lista, setData]);


  const handleInputChange = useCallback((id: string, field: keyof TableDataItem, value: string | number) => {
    setData(draft => {
      const index = draft.findIndex(item => item.id === id);
      if (index !== -1) {
        // Verificações de tipo e conversões explícitas
        if (field === 'dia' || field === 'valor') {
          draft[index][field] = Number(value); // Garante que seja um número
        } else if (field === 'nome') {
          draft[index][field] = String(value); // Garante que seja uma string
        }
        // Outros campos (removing, id) não são modificados aqui
      }
    });

    updateData(data.map(item => {
        if(item.id === id){
            return {...item, [field]: value}
        }
        return item;
    }));
  }, [setData, updateData, data]);


  const handleDeleteItem = useCallback((id: string) => {
      setData(draft => {
        const index = draft.findIndex(item => item.id === id);
        if(index !== -1) {
            draft[index].removing = true;
        }
      });

    setTimeout(() => {
        setData(draft => {
            const index = draft.findIndex(item => item.id === id);
            if (index !== -1) {
              draft.splice(index, 1);
            }
        });
        updateData(data.filter(item => item.id !== id));
    }, 300);
  }, [setData, updateData, data]);

  const addNewItem = useCallback(() => {
    setData(draft => {
        draft.push({ dia: 1, nome: '', valor: 0, id: generateUUID() }); // Use generateUUID()
    });
    updateData([...data, { dia: 1, nome: '', valor: 0, id: generateUUID() }]); // Use generateUUID()
}, [setData, updateData, data]);


  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr>
            <th className={styles.th}>Dia</th>
            <th className={styles.th}>Nome</th>
            <th className={styles.th}>Valor</th>
          </tr>
        </thead>
        <tbody className={styles.tbody}>
          {data.map((item) => (
            <tr className={`${styles.tr} ${item.removing ? styles.trRemoving : ''}`} key={item.id}>
              <td className={`${styles.td} ${styles.tdRoundedLeft}`}>
                <input
                  className={`${styles.input} ${styles.inputDay}`}
                  type="number"
                  min={1}
                  max={31}
                  value={item.dia}
                  onChange={(e) => handleInputChange(item.id, 'dia', Number(e.target.value))}
                />
              </td>
              <td className={styles.td}>
                <input
                  className={`${styles.input} ${styles.inputName}`}
                  type="text"
                  value={item.nome}
                  onChange={(e) => handleInputChange(item.id, 'nome', e.target.value)}
                />
              </td>
              <td className={`${styles.td} ${styles.tdRoundedRight}`}>
                <div className={styles.tdContent}>
                  <input
                    className={`${styles.input} ${styles.inputValue} ${item.valor >= 0 ? styles.numberPositive : styles.numberNegative}`}
                    type="number"
                    step="0.01"
                    value={item.valor}
                    onChange={(e) => handleInputChange(item.id, 'valor', Number(e.target.value))}
                  />
                  <button className={styles.deleteButton} onClick={() => handleDeleteItem(item.id)}>🗑️</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {data.length === 0 && <div className={`${styles.aviso} font-bold`}>Adicione algum dado</div>}
      <div className={styles.buttonContainer}>
        <button className={styles.button} onClick={addNewItem}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        </button>
      </div>
    </div>
  );
}