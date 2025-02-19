// UI/savings.tsx

import { useCallback, useState } from "react";


const style = {
    container: "w-fit h-fit bg-gray-100 shadow-md rounded-lg overflow-auto p-3 pt-0 pb-1",
    title: "py-3 px-6 text-center text-sm font-extrabold text-gray-700 uppercase tracking-wider",
    numberPositive: "text-green-500",
    numberNegative: "text-red-500"
}

export default function Savings({guardado = 0, updateSavings}: { guardado?: number, updateSavings: (value: number) => void }) {
    const [savings, setSavings] = useState(guardado);

    const handleInputChange = useCallback((value: number) => {
        setSavings(value);
        updateSavings(value);
    }, [updateSavings]);

    return (
        <div className={`${style.container}`}>
            <h1 className={`${style.title}`}>Valor guardado</h1>
            <input
                className={`${savings >= 0 ? style.numberPositive : style.numberNegative}`}
                type="number"
                id="savingsInput"
                value={savings}
                onChange={(e) => handleInputChange(Number(e.target.value))}
                step="0.01"
                required
            />
        </div>
    );
}