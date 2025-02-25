// components/Navbar.tsx

'use client'
import Links from './Links';
import { useMediaQuery } from 'react-responsive';
import { useEffect, useState } from 'react';
import Botao from './Botao';


export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: 640 });

  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) {
    return null;
  }

  const handleToggleClick = (isOpen: boolean) => {
    setIsOpen(isOpen);
  }
  
  const nav = (
    <nav className={`min-w-fit bg-gray-900 text-white ${isMobile ? "transform ease-in-out duration-300 fixed top-16 right-0 h-full":""} ${isOpen ? "translate-x-0" : isMobile && "translate-x-full"} `}>
      <ul className={"flex flex-col gap-2 p-4"}>
        <li className={""}>
          <Links href="/" name="Home" />
        </li>
        <li className={""}>
          <Links href="/projecao" name="Projeção" />
        </li>
      </ul>
    </nav>
  )

  if (isMobile) {
    return (
      <div>
        <Botao handleToggleClick = {handleToggleClick}/>
        {/* {isOpen ? nav : null} */}
        {nav}
      </div>
    );
  }else{
    return nav;
  }
}