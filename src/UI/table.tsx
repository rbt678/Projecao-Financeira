// UI/table.tsx

'use client'

import { useCallback, useState } from 'react';

const style = {
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
    inputDay: "w-8",
    inputName: "w-48",
    inputValue: "w-24",
    numberPositive: "text-green-500",
    numberNegative: "text-red-500",
    buttonContainer: "flex justify-center",
    button: "cursor-pointer transition-transform hover:scale-125",
    aviso: "text-center text-gray-500 text-lg"
}

export interface TableDataItem {
    dia: number;
    nome: string;
    valor: number;
    [key: string]: string | number | boolean; // Allow other string keys with string, number, or boolean values
}

export default function Table({ lista = [], updateData }: { lista?: TableDataItem[], updateData: (updatedList: TableDataItem[])=>void}) {
    const [data, setData] = useState(lista);

    const handleInputChange = useCallback((index: number, name: string, value: number | string) => {
        const prevData = [...data];
        const newData = [...prevData];
        newData[index] = { ...newData[index], [name]: value };
        updateData(newData);
        setData(newData);
    },[updateData, data]);

    const handleDeleteItem = useCallback((index: number) => {
        setData(prevData => {
            const newData = [...prevData];
            newData[index].removing = true;
            return [...newData];
        });
        updateData(data.filter((_, i) => i !== index));
        setTimeout(() => {
            setData(prevData => prevData.filter((_, i) => i !== index));
        }, 300);
    }, [updateData, data]);

    const newData = useCallback(() => {
        setData(prevData => {
            const newItem = { dia: 1, nome: 'nome', valor: 0, isNew: true };
            return [...prevData, newItem];
        });
    
        setTimeout(() => {
            setData(prevData => {
                const newData = prevData.map(item => {
                    if (item.isNew) {
                        return { ...item, isNew: false };
                    }
                    return item;
                });
                return newData;
            });
        }, 10);
    }, []);

    return (
        <div className={`${style.tableContainer}`}>
            <table className={`${style.table}`}>
                <thead className={`${style.thead}`}>
                    <tr>
                        <th className={`${style.th}`}>Dia</th>
                        <th className={`${style.th}`}>Nome</th>
                        <th className={`${style.th}`}>Valor</th>
                    </tr>
                </thead>
                <tbody className={`${style.tbody}`}>
                    {data.map((item, index) => (
                        <tr className={`${style.tr} ${item.removing === true ? style.trRemoving : ''} ${item.isNew === true && !item.removing ? style.trAdding : ''}`} key={index}>
                            <td className={`${style.tdRoundedLeft} ${style.td}`}>
                                <input
                                    className={`${style.input} ${style.inputDay}`}
                                    type="number"
                                    name="dia"
                                    min={1}
                                    max={31}
                                    value={item.dia}
                                    onChange={(e) => handleInputChange(index, 'dia', Number(e.target.value))}
                                />
                            </td>
                            <td className={`${style.td}`}>
                                <input
                                    className={`${style.input} ${style.inputName}`}
                                    type="text"
                                    name="nome"
                                    value={item.nome}
                                    onChange={(e) => handleInputChange(index, 'nome', e.target.value)}
                                />
                            </td>
                            <td className={`${style.tdRoundedRight} ${style.td}`}>
                                <div className={`${style.tdContent}`}>
                                    <input
                                        className={`${style.input} ${style.inputValue} ${item.valor >= 0 ? style.numberPositive : style.numberNegative}`}
                                        type="number"
                                        name="valor"
                                        step={0.01}
                                        value={item.valor}
                                        onChange={(e) => handleInputChange(index, 'valor', Number(e.target.value))}
                                    />
                                    <button className={`${style.deleteButton}`} onClick={() => handleDeleteItem(index)}>🗑️</button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {data.length === 0 && <div className={`${style.aviso} font-bold`}>Adicione algum dado</div>}
            <div className={`${style.buttonContainer}`}>
                <button className={`${style.button}`} onClick={() => newData()}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
