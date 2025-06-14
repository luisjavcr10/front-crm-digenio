import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/client/hooks/useAuth";
import { ThemeSwitch } from "../ThemeSwitch";
import { GoHomeFill } from "react-icons/go";
import { RiLogoutBoxRFill } from "react-icons/ri";
import { useEffect, useRef } from "react";

export const MenuToggle = ({
  isScrolled,
  isOpen,
  handleOpen
}: Readonly<{
  isOpen: boolean;
  isScrolled: boolean;
  handleOpen: () => void;
}>) => {
  const { user, handleLogout } = useAuth();
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && menuRef.current && !menuRef.current.contains(event.target as Node)) {
        handleOpen();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, handleOpen]);

  const handleLogoutClick = () => {
    handleOpen();
    handleLogout();
    router.push("/");
  }

  if (!isOpen) return null;

  return (
    <div 
      ref={menuRef}
      className={`
        absolute top-full right-4 
        mt-3 py-3 z-30 
        transition-all duration-300
        ${isScrolled?'bg-white text-neutral-2 dark:bg-black dark:text-neutral-4 ':'bg-neutral-4 dark:bg-neutral-1 text-neutral-1 dark:text-neutral-5'}
        rounded-[12px] shadow-toggle 
        text-[12px] `}
    >
      <div className="px-6 pb-2">
        <p className="font-[600]">
          {user.name}
        </p>
        <p className="underline">{user.email}</p>
        <button className="mt-4 cursor-pointer hover:text-primary-1">
          Configuración de la cuenta
        </button>
      </div>
      <div className="px-6 py-2 border-t border-neutral-3 flex justify-between">
        <p>Tema</p>
        <ThemeSwitch />
      </div>
      <div className="px-6 pt-2 border-t border-neutral-3">
        <Link href="/" className="flex justify-between hover:text-primary-1">
          <p>Pagina de inicio</p>
          <GoHomeFill className="w-[15px] h-[15px]" />
        </Link>
        <div onClick={handleLogoutClick} className="flex justify-between cursor-pointer hover:text-primary-1">
          <p>Cerrar sesión</p>
          <RiLogoutBoxRFill className="w-[15px] h-[15px] rounded-2xl" />
        </div>
      </div>
    </div>
  );
};