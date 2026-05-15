"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { BarChart3, PieChart, TrendingUp, Users, FolderOpen, DollarSign, AlertTriangle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import dynamic from "next/dynamic";

const Chart = dynamic(() => import("@/components/erp/Charts"), { ssr: false });

export default function DashboardDirectorPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [autorizado, setAutorizado] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const fetch = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: abogado } = await supabase.from("abogados").select("rol").eq("user_id", user.id).single();
      if (abogado?.rol !== "director") { setLoading(false); return; }
      setAutorizado(true);

      // Fetch all stats
      const [expRes, abogadosRes, clientesRes, honorariosRes, tareasRes] = await Promise.all([
        supabase.from("expedientes").select("id, estado, abogado_id, fuero"),
        supabase.from("abogados").select("id, nombre, activo").eq("activo", true),
        supabase.from("clientes").select("id", { count: "exact", head: true }),
        supabase.from("honorarios").select("monto, estado"),
        supabase.from("tareas").select("id, estado, asignado_a"),
      ]);

      // Expedientes por abogado
      const expPorAbogado: Record<string, number> = {};
      expRes.data?.forEach((e: any) => {
        const nombre = abogadosRes.data?.find((a: any) => a.id === e.abogado_id)?.nombre || "Sin asignar";
        expPorAbogado[nombre] = (expPorAbogado[nombre] || 0) + 1;
      });

      // Expedientes por fuero
      const expPorFuero: Record<string, number> = {};
      expRes.data?.forEach((e: any) => {
        const fuero = e.fuero || "Sin fuero";
        expPorFuero[fuero] = (expPorFuero[fuero] || 0) + 1;
      });

      // Honorarios
      const totalCobrado = honorariosRes.data?.filter((h: any) => h.estado === "cobrado").reduce((s: number, h: any) => s + Number(h.monto), 0) || 0;
      const totalPendiente = honorariosRes.data?.filter((h: any) => h.estado === "pendiente" || h.estado === "en_mora").reduce((s: number, h: any) => s + Number(h.monto), 0) || 0;

      setData({
        totalExpedientes: expRes.data?.length || 0,
        expedientesActivos: expRes.data?.filter((e: any) => e.estado === "activo").length || 0,
        totalAbogados: abogadosRes.data?.length || 0,
        totalClientes: clientesRes.count || 0,
        totalCobrado,
        totalPendiente,
        expPorAbogado: Object.entries(expPorAbogado).map(([name, value]) => ({ name, value })),
        expPorFuero: Object.entries(expPorFuero).map(([name, value]) => ({ name, value })),
        tareasPendientes: tareasRes.data?.filter((t: any) => t.estado === "pendiente").length || 0,
      });
      setLoading(false);
    };
    fetch();
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-burgos-gold/30 border-t-burgos-gold rounded-full animate-spin" /></div>;
  if (!autorizado) return <div className="text-center py-16"><p className="text-burgos-gray-600">Acceso restringido al director del estudio.</p></div>;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-burgos-white flex items-center gap-2">
          <BarChart3 size={24} className="text-burgos-gold" />
          Dashboard de Dirección
        </h1>
        <p className="text-burgos-gray-400 text-sm mt-1">Métricas globales del estudio</p>
      </motion.div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Expedientes", value: data.totalExpedientes, sub: `${data.expedientesActivos} activos`, icon: FolderOpen, color: "text-blue-400" },
          { label: "Abogados", value: data.totalAbogados, sub: "activos", icon: Users, color: "text-green-400" },
          { label: "Cobrado", value: `$${(data.totalCobrado / 1000).toFixed(0)}k`, sub: "total", icon: DollarSign, color: "text-burgos-gold" },
          { label: "Pendiente", value: `$${(data.totalPendiente / 1000).toFixed(0)}k`, sub: "por cobrar", icon: AlertTriangle, color: "text-amber-400" },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-burgos-dark rounded-2xl border border-burgos-gray-800 p-5">
            <stat.icon size={18} className={`${stat.color} mb-2`} />
            <p className="text-2xl font-bold text-burgos-white">{stat.value}</p>
            <p className="text-xs text-burgos-gray-400">{stat.label}</p>
            <p className="text-[10px] text-burgos-gray-600">{stat.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-burgos-dark rounded-2xl border border-burgos-gray-800 p-6">
          <h2 className="text-sm font-semibold text-burgos-white mb-4">Expedientes por Abogado</h2>
          <Chart type="bar" data={data.expPorAbogado} />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-burgos-dark rounded-2xl border border-burgos-gray-800 p-6">
          <h2 className="text-sm font-semibold text-burgos-white mb-4">Distribución por Fuero</h2>
          <Chart type="pie" data={data.expPorFuero} />
        </motion.div>
      </div>
    </div>
  );
}
