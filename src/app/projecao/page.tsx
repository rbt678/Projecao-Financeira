// app/projecao/page.tsx

'use client'

import { getDataMonths } from "@/lib/dataRequests";
import { TableDataItem } from "@/UI/table";
import { useEffect, useState } from "react";

interface TableDataItemTotal extends TableDataItem {
    total: number;
}

const style = {
    th: "py-3 px-6 text-center text-sm font-extrabold text-gray-700 uppercase tracking-wider",
    td: "py-4 px-6 text-sm font-medium text-gray-900 whitespace-nowrap",
    tr: "group bg-gray-200 hover:bg-gray-50 transition duration-300",
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
    aviso: "text-center text-gray-500 text-lg",
    mes: "py-3 px-6 text-center text-lg font-extrabold text-gray-700 uppercase tracking-wider",
};

/**
 * Recalcula os totais de um mês a partir de um valor inicial.
 */
function recalcMonthFromTransactions(
    transactions: TableDataItemTotal[],
    startingValue: number
): TableDataItemTotal[] {
    let cumulative = startingValue;
    return transactions.map((item) => {
        cumulative += Number(item.valor);
        return { ...item, total: cumulative };
    });
}

/**
 * Recalcula os meses a partir do índice informado,
 * propagando a alteração para os meses seguintes.
 */
function recalcFromMonth(
    monthIndex: number,
    months: TableDataItemTotal[][],
    startingValue: number
): TableDataItemTotal[][] {
    const newMonths = [...months];
    let start = startingValue;
    for (let m = monthIndex; m < newMonths.length; m++) {
        newMonths[m] = recalcMonthFromTransactions(newMonths[m], start);
        start =
            newMonths[m].length > 0
                ? newMonths[m][newMonths[m].length - 1].total
                : start;
    }
    return newMonths;
}

export default function Projecao() {
    const [savings, setSavings] = useState<number>(0);
    const [transactionsMonths, setTransactionsMonths] = useState<
        TableDataItemTotal[][]
    >([]);

    // Inicializa os dados a partir do localStorage
    useEffect(() => {
        const { savings, recalculatedMonths } = getDataMonths();
        setSavings(savings);
        setTransactionsMonths(recalculatedMonths);
    }, []);

    // Retorna o nome do mês com o ano, baseado no índice (0 = mês atual)
    const obterMesString = (n: number): string => {
        const dataAtual = new Date();
        const mesAtual = dataAtual.getMonth();
        const anoAtual = dataAtual.getFullYear();

        let novoMes = mesAtual + n;
        let novoAno = anoAtual;

        if (novoMes > 11) {
            novoAno += Math.floor(novoMes / 12);
            novoMes = novoMes % 12;
        } else if (novoMes < 0) {
            novoAno += Math.ceil(novoMes / 12) - 1;
            novoMes = (novoMes % 12 + 12) % 12;
        }

        const nomesDosMeses = [
            "Janeiro",
            "Fevereiro",
            "Março",
            "Abril",
            "Maio",
            "Junho",
            "Julho",
            "Agosto",
            "Setembro",
            "Outubro",
            "Novembro",
            "Dezembro",
        ];

        return `${nomesDosMeses[novoMes]} de ${novoAno}`;
    };

    /**
     * Atualiza um campo de uma transação em um mês específico e propaga
     * os cálculos para os meses seguintes.
     */
    const handleInputChange = (
        monthIndex: number,
        index: number,
        field: keyof TableDataItem,
        value: string | number
    ) => {
        setTransactionsMonths((prev) => {
            const newMonths = [...prev];
            newMonths[monthIndex] = newMonths[monthIndex].map((transaction, i) =>
                i === index ? { ...transaction, [field]: value } : transaction
            );
            const startingValue =
                monthIndex === 0
                    ? savings
                    : newMonths[monthIndex - 1].length > 0
                        ? newMonths[monthIndex - 1][
                            newMonths[monthIndex - 1].length - 1
                        ].total
                        : savings;
            return recalcFromMonth(monthIndex, newMonths, startingValue);
        });
    };

    /**
     * Remove uma transação de um mês específico e propaga os cálculos.
     */
    const handleDeleteItem = (monthIndex: number, index: number) => {
        setTransactionsMonths((prev) => {
            const newMonths = [...prev];
            newMonths[monthIndex] = newMonths[monthIndex].filter(
                (_, i) => i !== index
            );
            const startingValue =
                monthIndex === 0
                    ? savings
                    : newMonths[monthIndex - 1].length > 0
                        ? newMonths[monthIndex - 1][
                            newMonths[monthIndex - 1].length - 1
                        ].total
                        : savings;
            return recalcFromMonth(monthIndex, newMonths, startingValue);
        });
    };

    return (
        <div>
            {transactionsMonths.length === 0 ? (
                <div className={style.aviso}>Sem transações</div>
            ):(
            <div className="flex flex-col gap-4 items-center overflow-auto">
                {transactionsMonths.map((mes, monthIndex) => (
                    <div className={style.tableContainer} key={monthIndex}>
                        <div className={style.mes}>{obterMesString(monthIndex)}</div>
                        <table className={style.table}>
                            <thead className={style.thead}>
                                <tr>
                                    <th className={style.th}>Dia</th>
                                    <th className={style.th}>Conta</th>
                                    <th className={style.th}>Valor</th>
                                    <th className={style.th}>Total</th>
                                </tr>
                            </thead>
                            <tbody className={style.tbody}>
                                {mes.map((item, index) => (
                                    <tr
                                        className={`
                      ${style.tr} 
                      ${item.removing ? style.trRemoving : ""} 
                      ${item.isNew && !item.removing ? style.trAdding : ""}
                    `}
                                        key={index}
                                    >
                                        <td className={`${style.tdRoundedLeft} ${style.td}`}>
                                            <input
                                                className={`${style.input} ${style.inputDay}`}
                                                type="number"
                                                name="dia"
                                                min={1}
                                                max={31}
                                                value={item.dia}
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        monthIndex,
                                                        index,
                                                        "dia",
                                                        Number(e.target.value)
                                                    )
                                                }
                                            />
                                        </td>
                                        <td className={style.td}>
                                            <input
                                                className={`${style.input} ${style.inputName}`}
                                                type="text"
                                                name="nome"
                                                value={item.nome}
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        monthIndex,
                                                        index,
                                                        "nome",
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </td>
                                        <td className={style.td}>
                                            <div className={style.tdContent}>
                                                <input
                                                    className={`${style.input} ${style.inputValue} ${item.valor >= 0
                                                        ? style.numberPositive
                                                        : style.numberNegative
                                                        }`}
                                                    type="number"
                                                    name="valor"
                                                    step={0.01}
                                                    value={item.valor}
                                                    onChange={(e) =>
                                                        handleInputChange(
                                                            monthIndex,
                                                            index,
                                                            "valor",
                                                            Number(e.target.value)
                                                        )
                                                    }
                                                />
                                                <button
                                                    className={style.deleteButton}
                                                    onClick={() => handleDeleteItem(monthIndex, index)}
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        </td>
                                        <td className={`${style.tdRoundedRight} ${style.td}`}>
                                            <div className={style.tdContent}>
                                                <input
                                                    className={`${style.input} ${style.inputValue} ${item.valor >= 0
                                                        ? style.numberPositive
                                                        : style.numberNegative
                                                        }`}
                                                    type="number"
                                                    name="total"
                                                    value={item.total}
                                                    readOnly
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ))}
            </div>
            )}
        </div>
    );
}
