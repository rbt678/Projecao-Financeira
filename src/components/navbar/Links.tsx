import Link from "next/link";
import { usePathname } from "next/navigation";

const styles = {
    link: "",
    linkActive: "bg-gray-800 font-bold",
}

export default function Links({href, name} : {href: string, name: string}) {
    const pathname = usePathname();
    
    return (
    <Link href={href} className={`block py-2 px-4 rounded-md hover:bg-gray-800 transition-colors duration-200 font-medium ${styles.link} ${pathname === href ? styles.linkActive : ''}`}>
        {name}
    </Link>
    );
}