"use client";

import { House, MessageSquare, GraduationCap, PanelLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";

type NavItem = {
  href: string;
  icon: ReactNode;
  label: string;
};

const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", icon: <House size={20} />, label: "Dashboard" },
  { href: "/series", icon: <GraduationCap size={20} />, label: "Series" },
  { href: "/chat", icon: <MessageSquare size={20} />, label: "Chat" },
];

function NavLink({
  href,
  icon,
  label,
  orientation = "vertical",
}: NavItem & { orientation?: "horizontal" | "vertical" }) {
  const pathname = usePathname();
  const isActive = pathname === href;

  const isHorizontal = orientation === "horizontal";
  const container = isHorizontal
    ? "flex flex-row items-center gap-3 group w-full"
    : "flex flex-col items-center group";
  const iconWrap = `p-2 rounded-lg transition-colors ${
    isActive
      ? "bg-orange-200 text-orange-500"
      : "group-hover:bg-orange-200 group-hover:text-orange-400"
  }`;

  return (
    <Link href={href} className={container}>
      <div className={iconWrap}>{icon}</div>
      <span className={`${isHorizontal ? "text-sm" : "text-xs"}`}>{label}</span>
    </Link>
  );
}

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", onKeyDown);
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  const close = () => setIsOpen(false);

  return (
    <>
      <div className="md:hidden flex justify-between items-center w-full px-4 py-3 border-b border-zinc-200">
        <Image
          src="/ajarinHorizontal.svg"
          alt="Ajarin"
          width={64}
          height={64}
          priority
        />
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Open menu"
          className="p-2 rounded-lg hover:bg-zinc-100"
        >
          <PanelLeft size={20} />
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              key="backdrop"
              className="md:hidden fixed inset-0 bg-black/40 z-40"
              onClick={close}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
            <motion.aside
              key="drawer"
              className="md:hidden fixed top-0 left-0 h-full w-64 bg-white z-50 shadow-lg flex flex-col items-center py-5 gap-10 px-2 border-r-2 border-zinc-200"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <div className="w-full px-4 flex justify-start">
                <Image src="/ajarin.svg" alt="Ajarin" width={32} height={32} />
              </div>

              <div className="flex flex-col gap-2 w-full px-2">
                {NAV_ITEMS.map((item) => (
                  <div key={item.href} onClick={close}>
                    <NavLink {...item} orientation="horizontal" />
                  </div>
                ))}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <aside className="hidden md:flex md:flex-col md:items-center md:py-5 md:gap-10 md:px-2 md:border-r-2 md:border-zinc-200 md:sticky md:top-0 md:h-screen">
        <Image src="/ajarin.svg" alt="Ajarin" width={32} height={32} />

        <div className="flex flex-col gap-8">
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.href} {...item} />
          ))}
        </div>
      </aside>
    </>
  );
}
