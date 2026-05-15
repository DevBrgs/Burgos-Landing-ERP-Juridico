"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderOpen,
  Calendar,
  CheckSquare,
  Gavel,
  Users,
  UserPlus,
  UserCog,
  Newspaper,
  Settings,
  LogOut,
  Menu,
  X,
  Sparkles,
  DollarSign,
  BarChart3,
  MessageSquare,
  FilePen,
  Building2,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/erp", label: "Dashboard", icon: LayoutDashboard },
  { href: "/erp/dashboard-director", label: "Métricas", icon: BarChart3 },
  { href: "/erp/expedientes", label: "Expedientes", icon: FolderOpen },
  { href: "/erp/turnos", label: "Turnos", icon: Calendar },
  { href: "/erp/tareas", label: "Tareas", icon: CheckSquare },
  { href: "/erp/audiencias", label: "Audiencias", icon: Gavel },
  { href: "/erp/honorarios", label: "Honorarios", icon: DollarSign },
  { href: "/erp/mensajes", label: "Mensajes", icon: MessageSquare },
  { href: "/erp/ia", label: "Asistente IA", icon: Sparkles },
  { href: "/erp/escritos", label: "Escritos", icon: FilePen },
  { href: "/erp/jurisprudencia", label: "Jurisprudencia", icon: BookOpen },
  { href: "/erp/newsletter", label: "Newsletter", icon: Newspaper },
  { href: "/erp/clientes", label: "Clientes", icon: Users },
  { href: "/erp/abogados", label: "Equipo", icon: UserPlus },
  { href: "/erp/perfil", label: "Mi Perfil", icon: UserCog },
  { href: "/erp/estudios", label: "Estudios", icon: Building2 },
  { href: "/erp/configuracion", label: "Configuración", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [rol, setRol] = useState<string>("asociado");

  useEffect(() => {
    const getRol = async () => {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from("abogados").select("rol").eq("user_id", user.id).single();
      if (data) setRol(data.rol);
    };
    getRol();
  }, []);

  // Filtrar items según rol
  const visibleItems = navItems.filter((item) => {
    if (item.href === "/erp/estudios") return rol === "director";
    return true;
  });

  const isActive = (href: string) => {
    if (href === "/erp") return pathname === "/erp";
    return pathname.startsWith(href);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-burgos-gray-800">
        <Link href="/erp" className="flex items-center gap-3">
          <Image
            src="/logo-burgos.png"
            alt="Burgos"
            width={28}
            height={28}
            className="rounded-sm"
          />
          <div>
            <span className="text-burgos-gold font-bold text-sm">Burgos</span>
            <span className="text-burgos-gray-400 text-xs ml-1">ERP</span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                active
                  ? "bg-burgos-gold/10 text-burgos-gold border border-burgos-gold/20"
                  : "text-burgos-gray-400 hover:text-burgos-white hover:bg-burgos-dark-2"
              )}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-burgos-gray-800">
        <button
          onClick={async () => {
            const { createClient } = await import("@/lib/supabase/client");
            const supabase = createClient();
            await supabase.auth.signOut();
            window.location.href = "/login";
          }}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-burgos-gray-400 hover:text-red-400 hover:bg-red-500/5 transition-all duration-200 w-full"
        >
          <LogOut size={18} />
          Cerrar sesión
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 bg-burgos-dark border-r border-burgos-gray-800 flex-col z-40">
        <SidebarContent />
      </aside>

      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-[1.1rem] left-4 z-[35] w-9 h-9 bg-burgos-dark-2 border border-burgos-gray-800 rounded-xl flex items-center justify-center text-burgos-gray-400"
        aria-label="Abrir menú"
      >
        <Menu size={18} />
      </button>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 bg-black/60 z-40"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="lg:hidden fixed left-0 top-0 bottom-0 w-64 bg-burgos-dark border-r border-burgos-gray-800 z-50">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 text-burgos-gray-400 hover:text-burgos-white"
              aria-label="Cerrar menú"
            >
              <X size={20} />
            </button>
            <SidebarContent />
          </aside>
        </>
      )}
    </>
  );
}
