"use client";

import { Bell, Search, User, Sun, Moon } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";

interface ActividadLog {
  id: string;
  accion: string;
  creado_en: string;
}

function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "ahora";
  if (diffMin < 60) return `hace ${diffMin}m`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `hace ${diffH}h`;
  const diffD = Math.floor(diffH / 24);
  return `hace ${diffD}d`;
}

export function TopBar() {
  const [usuario, setUsuario] = useState<{ nombre: string; rol: string } | null>(null);
  const [tema, setTema] = useState<"dark" | "light">("dark");
  const [showNotif, setShowNotif] = useState(false);
  const [actividad, setActividad] = useState<ActividadLog[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const notifRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from("abogados").select("nombre, rol").eq("user_id", user.id).single();
      if (data) setUsuario(data);
    };
    getUser();

    const saved = localStorage.getItem("burgos-theme");
    if (saved === "light") {
      setTema("light");
      document.documentElement.classList.add("light-mode");
    }

    fetchActividad();
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotif(false);
      }
    };
    if (showNotif) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showNotif]);

  const fetchActividad = async () => {
    const { data } = await supabase
      .from("actividad_log")
      .select("id, accion, creado_en")
      .order("creado_en", { ascending: false })
      .limit(10);

    if (data) {
      setActividad(data);
      // Count entries from last 24h as "unread"
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const count = data.filter(a => new Date(a.creado_en) > oneDayAgo).length;
      setUnreadCount(count);
    }
  };

  const toggleTema = () => {
    const next = tema === "dark" ? "light" : "dark";
    setTema(next);
    localStorage.setItem("burgos-theme", next);
    if (next === "light") {
      document.documentElement.classList.add("light-mode");
    } else {
      document.documentElement.classList.remove("light-mode");
    }
  };

  return (
    <header className="h-14 border-b border-burgos-gray-800 bg-burgos-dark/80 backdrop-blur-lg flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-30">
      {/* Spacer for hamburger on mobile */}
      <div className="w-10 lg:hidden flex-shrink-0" />

      {/* Search - desktop only */}
      <div className="flex-1 max-w-md hidden lg:block">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-burgos-gray-600" />
          <input type="text" placeholder="Buscar expedientes, clientes..." className="w-full pl-9 pr-4 py-2 bg-burgos-dark-2 border border-burgos-gray-800 rounded-xl text-sm text-burgos-white placeholder:text-burgos-gray-600 focus:outline-none focus:border-burgos-gold/30" />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button onClick={toggleTema} className="w-8 h-8 bg-burgos-dark-2 border border-burgos-gray-800 rounded-lg flex items-center justify-center text-burgos-gray-400 hover:text-burgos-gold transition-all" title={tema === "dark" ? "Modo claro" : "Modo oscuro"}>
          {tema === "dark" ? <Sun size={14} /> : <Moon size={14} />}
        </button>

        {/* Notifications bell with dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => { setShowNotif(!showNotif); if (!showNotif) fetchActividad(); }}
            className="relative w-8 h-8 bg-burgos-dark-2 border border-burgos-gray-800 rounded-lg flex items-center justify-center text-burgos-gray-400 hover:text-burgos-gold transition-all"
          >
            <Bell size={14} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {showNotif && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-burgos-dark border border-burgos-gray-800 rounded-xl shadow-2xl shadow-black/40 z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-burgos-gray-800">
                <h3 className="text-xs font-semibold text-burgos-white">Actividad reciente</h3>
              </div>
              <div className="max-h-72 overflow-y-auto">
                {actividad.length === 0 ? (
                  <div className="px-4 py-6 text-center">
                    <p className="text-xs text-burgos-gray-600">Sin actividad reciente</p>
                  </div>
                ) : (
                  actividad.map((item) => (
                    <div key={item.id} className="px-4 py-3 border-b border-burgos-gray-800/50 hover:bg-burgos-dark-2 transition-colors">
                      <p className="text-xs text-burgos-white leading-relaxed">{item.accion}</p>
                      <p className="text-[10px] text-burgos-gray-600 mt-0.5">{timeAgo(item.creado_en)}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 pl-2 border-l border-burgos-gray-800">
          <div className="w-7 h-7 bg-burgos-dark-2 border border-burgos-gray-800 rounded-full flex items-center justify-center">
            <User size={12} className="text-burgos-gray-400" />
          </div>
          <div className="hidden sm:block">
            <p className="text-[11px] font-medium text-burgos-white leading-tight">{usuario?.nombre || "..."}</p>
            <p className="text-[9px] text-burgos-gray-600 capitalize">{usuario?.rol || ""}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
