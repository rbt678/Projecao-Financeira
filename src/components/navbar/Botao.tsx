// components/Navbar.tsx

import { FaBars } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { useEffect, useState } from 'react';

export default function Botao({handleToggleClick}: {handleToggleClick: (isOpen: boolean) => void}) {
    const [isOpen, setIsOpen] = useState(false);
    const [isEstadoInicial, setIsEstadoInicial] = useState(false);
    
    const toggleIcon = () => {
        setIsEstadoInicial(true);
        setTimeout(() => {
            setIsOpen(!isOpen);
            setTimeout(() => {
                setIsEstadoInicial(false);
            }, 50);
        }, 300);
    };

    useEffect(() => {
        handleToggleClick(isOpen);
    }, [isOpen, handleToggleClick]);

    return (
        isOpen ?
            <IoClose className={`text-white transition duration-300 ease-in-out ${isEstadoInicial ? "-rotate-180 scale-30 pointer-events-none" : "scale-100"}`} onClick={toggleIcon} size={24} />
            :
            <FaBars className={`text-white transition duration-300 ease-in-out ${isEstadoInicial ? "rotate-180 scale-30 pointer-events-none" : "scale-100"}`} onClick={toggleIcon} size={24} />
    );
}