// UI/navbar.tsx

'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const style = {
  nav: "h-fit sm:h-full w-full sm:w-64 bg-gray-900 text-white shadow-none sm:shadow-lg flex flex-row sm:flex-col justify-center sm:justify-start",
  ul: "mb-2 mt-2 sm:p-4 flex flex-row sm:flex-col",
  li: "sm:mb-4",
  link: "block py-2 px-4 rounded-md hover:bg-gray-800 transition-colors duration-200 font-medium",
  linkActive: "bg-gray-800 font-bold",
};

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className={`${style.nav}`}>
      <ul className={`${style.ul}`}>
        <li className={`${style.li}`}>
          <Link href="/" className={`${style.link} ${pathname==="/" ? style.linkActive : ''}`}>
            Home
          </Link>
        </li>
        <li className={`${style.li}`}>
          <Link href="/projecao" className={`${style.link} ${pathname==="/projecao" ? style.linkActive : ''}`}>
            Projeção
          </Link>
        </li>
      </ul>
    </nav>
  );
}