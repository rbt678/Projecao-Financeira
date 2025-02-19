// components/Navbar.tsx
// Manter como antes, apenas removendo os estilos inline e usando CSS Modules

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Navbar.module.css'; // Importa o arquivo CSS Module

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