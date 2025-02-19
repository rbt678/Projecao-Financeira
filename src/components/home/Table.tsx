// components/home/Table.tsx

import { useCallback } from 'react';
import styles from './Table.module.css'; // CSS Modules
import { useImmer } from 'use-immer'; // Para imutabilidade
import { formatCurrency } from '@/lib/formatUtils';

export interface TableDataItem {
  dia: number;
  nome: string;
  valor: number;
  id: string; // Adiciona um ID único
  removing?: boolean;
  isNew?: boolean;
}

interface TableProps {
  lista?: TableDataItem[];
  updateData: (updatedList: TableDataItem[]) => void;
}

export default function Table({ lista = [], updateData }: TableProps) {
    const [data, setData] = useImmer<TableDataItem[]>(lista.map(item => ({...item, id: item.id || crypto.randomUUID() }))); // Adiciona ID se não existir


  const handleInputChange = useCallback((id: string, field: keyof TableDataItem, value: string | number) => {
    setData(draft => {
      const index = draft.findIndex(item => item.id === id);
      if (index !== -1) {
        draft[index][field] = value;
      }
    });
    updateData(data); //Isso talvez possa ser removido já que useImmer atualiza o valor, mas deixei aqui por via das dúvidas
  }, [setData, updateData, data]);

  const handleDeleteItem = useCallback((id: string) => {
      setData(draft => {
        const index = draft.findIndex(item => item.id === id);
        if(index !== -1) {
            draft[index].removing = true; // Marca para remoção
        }
      });

    setTimeout(() => {
        setData(draft => {
            const index = draft.findIndex(item => item.id === id);
            if (index !== -1) {
              draft.splice(index, 1); // Remove de fato
            }
        });
        updateData(data.filter(item => item.id !== id));
    }, 300); // Mantém o timeout para a animação
  }, [setData, updateData, data]);

  const addNewItem = useCallback(() => {
      setData(draft => {
          draft.push({ dia: 1, nome: '', valor: 0, id: crypto.randomUUID(), isNew: true });
      });

      setTimeout(() => {
          setData(draft => {
            const lastIndex = draft.length -1;
            if(draft[lastIndex]){
                draft[lastIndex].isNew = false;
            }
          })
      }, 10);
  }, [setData]);


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
            <tr className={`${styles.tr} ${item.removing ? styles.trRemoving : ''} ${item.isNew && !item.removing ? styles.trAdding : ''}`} key={item.id}>
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