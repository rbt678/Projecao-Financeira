// components/Navbar.tsx
// Manter como antes, apenas removendo os estilos inline e usando CSS Modules

'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const styles = {
  nav: "h-fit sm:h-full w-full sm:w-64 bg-gray-900 text-white shadow-none sm:shadow-lg flex flex-row sm:flex-col justify-center sm:justify-start",
  ul: "mb-2 mt-2 sm:p-4 flex flex-row sm:flex-col",
  li: "sm:mb-4",
  link: "block py-2 px-4 rounded-md hover:bg-gray-800 transition-colors duration-200 font-medium",
  linkActive: "bg-gray-800 font-bold",
}

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className={styles.nav}>
      <ul className={styles.ul}>
        <li className={styles.li}>
          <Link href="/" className={`${styles.link} ${pathname === "/" ? styles.linkActive : ''}`}>
            Home
          </Link>
        </li>
        <li className={styles.li}>
          <Link href="/projecao" className={`${styles.link} ${pathname === "/projecao" ? styles.linkActive : ''}`}>
            Projeção
          </Link>
        </li>
      </ul>
    </nav>
  );
}