"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { LogIn, Eye, EyeOff, Scale, PenTool, Check, RotateCcw } from "lucide-react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

interface ClienteSession {
  id: string;
  nombre: string;
  dni: string;
  primer_ingreso: boolean;
  abogado_id: string;
}

export default function PortalPage() {
  const [session, setSession] = useState<ClienteSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("portal-session");
    if (saved) {
      try { setSession(JSON.parse(saved)); } catch { /* invalid session, ignore */ }
    }
    setLoading(false);
  }, []);

  const handleLogin = (s: ClienteSession) => {
    setSession(s);
    localStorage.setItem("portal-session", JSON.stringify(s));
  };

  const handleLogout = () => {
    setSession(null);
    localStorage.removeItem("portal-session");
    localStorage.removeItem("portal-token");
  };

  const handleClaveChanged = () => {
    const updated = { ...session!, primer_ingreso: false };
    setSession(updated);
    localStorage.setItem("portal-session", JSON.stringify(updated));
  };

  if (loading) return null;

  if (!session) return <PortalLogin onLogin={handleLogin} />;
  if (session.primer_ingreso) return <CambiarClave clienteId={session.id} onDone={handleClaveChanged} />;

  return <PortalDashboard session={session} onLogout={handleLogout} />;
}

function PortalLogin({ onLogin }: { onLogin: (s: ClienteSession) => void }) {
  const [dni, setDni] = useState("");
  const [clave, setClave] = useState("");
  const [showClave, setShowClave] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dni: dni.trim(), clave }),
      });

      const data = await res.json();
      if (!res.ok) { setError(data.error); setLoading(false); return; }

      localStorage.setItem("portal-token", data.token);
      onLogin(data.cliente);
    } catch {
      setError("Error de conexión. Intentá de nuevo.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-burgos-black flex items-center justify-center px-4">
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-burgos-gold/[0.02] rounded-full blur-[120px]" />
      </div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <Image src="/logo-burgos.png" alt="Burgos" width={60} height={60} className="mx-auto rounded-lg mb-4" />
          <h1 className="text-2xl font-bold text-burgos-white">Portal de Clientes</h1>
          <p className="text-burgos-gray-400 text-sm mt-1">Accedé con tu DNI y la clave que te dio tu abogado</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-burgos-dark rounded-2xl border border-burgos-gray-800 p-8 space-y-5">
          {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl">{error}</div>}
          <div>
            <label className="text-[10px] uppercase tracking-wider text-burgos-gray-600 font-medium mb-1.5 block">DNI</label>
            <input type="text" required value={dni} onChange={(e) => setDni(e.target.value)} placeholder="12345678" className="w-full px-4 py-3 bg-burgos-black/50 border border-burgos-gray-800 rounded-xl text-burgos-white placeholder:text-burgos-gray-600 focus:outline-none focus:border-burgos-gold/40 text-sm" />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-wider text-burgos-gray-600 font-medium mb-1.5 block">Clave</label>
            <div className="relative">
              <input type={showClave ? "text" : "password"} required value={clave} onChange={(e) => setClave(e.target.value)} placeholder="••••••••" className="w-full px-4 py-3 pr-12 bg-burgos-black/50 border border-burgos-gray-800 rounded-xl text-burgos-white placeholder:text-burgos-gray-600 focus:outline-none focus:border-burgos-gold/40 text-sm" />
              <button type="button" onClick={() => setShowClave(!showClave)} className="absolute right-3 top-1/2 -translate-y-1/2 text-burgos-gray-600">
                {showClave ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <button type="submit" disabled={loading} className="w-full bg-burgos-gold hover:bg-burgos-gold-light disabled:bg-burgos-gold/30 text-burgos-black py-3.5 rounded-xl font-semibold transition-all">
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

function CambiarClave({ clienteId, onDone }: { clienteId: string; onDone: () => void }) {
  const [nueva, setNueva] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (nueva !== confirmar) { alert("Las claves no coinciden"); return; }
    setLoading(true);
    await fetch("/api/portal", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ clienteId, nuevaClave: nueva }) });
    setLoading(false);
    onDone();
  };

  return (
    <div className="min-h-screen bg-burgos-black flex items-center justify-center px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-burgos-white">Cambiar Clave</h1>
          <p className="text-burgos-gray-400 text-sm mt-1">Es tu primer ingreso. Elegí una clave nueva.</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-burgos-dark rounded-2xl border border-burgos-gray-800 p-8 space-y-4">
          <div>
            <label className="text-[10px] uppercase tracking-wider text-burgos-gray-600 font-medium mb-1.5 block">Nueva clave</label>
            <input type="password" required minLength={6} value={nueva} onChange={(e) => setNueva(e.target.value)} className="w-full px-4 py-3 bg-burgos-black/50 border border-burgos-gray-800 rounded-xl text-burgos-white focus:outline-none focus:border-burgos-gold/40 text-sm" />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-wider text-burgos-gray-600 font-medium mb-1.5 block">Confirmar clave</label>
            <input type="password" required minLength={6} value={confirmar} onChange={(e) => setConfirmar(e.target.value)} className="w-full px-4 py-3 bg-burgos-black/50 border border-burgos-gray-800 rounded-xl text-burgos-white focus:outline-none focus:border-burgos-gold/40 text-sm" />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-burgos-gold hover:bg-burgos-gold-light disabled:bg-burgos-gold/30 text-burgos-black py-3 rounded-xl font-semibold transition-all">
            {loading ? "Guardando..." : "Guardar nueva clave"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

function FirmaPad({ onSave }: { onSave: (dataUrl: string) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawing, setDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    if ("touches" in e) {
      return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
    }
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setDrawing(true);
    setHasDrawn(true);
    const ctx = canvasRef.current!.getContext("2d")!;
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!drawing) return;
    e.preventDefault();
    const ctx = canvasRef.current!.getContext("2d")!;
    const pos = getPos(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = "#c9a84c";
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
  };

  const stopDraw = () => setDrawing(false);

  const limpiar = () => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  const guardar = () => {
    const dataUrl = canvasRef.current!.toDataURL("image/png");
    onSave(dataUrl);
  };

  return (
    <div className="space-y-4">
      <div className="border border-burgos-gray-800 rounded-xl overflow-hidden bg-burgos-black/50">
        <canvas
          ref={canvasRef}
          width={500}
          height={200}
          className="w-full h-[200px] cursor-crosshair touch-none"
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={stopDraw}
          onMouseLeave={stopDraw}
          onTouchStart={startDraw}
          onTouchMove={draw}
          onTouchEnd={stopDraw}
        />
      </div>
      <p className="text-[10px] text-burgos-gray-600 text-center">Dibujá tu firma con el mouse o el dedo</p>
      <div className="flex gap-3">
        <button onClick={limpiar} className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-burgos-gray-800 rounded-xl text-sm text-burgos-gray-400 hover:border-burgos-gray-600 transition-all">
          <RotateCcw size={14} /> Limpiar
        </button>
        <button onClick={guardar} disabled={!hasDrawn} className="flex-1 inline-flex items-center justify-center gap-2 bg-burgos-gold hover:bg-burgos-gold-light disabled:bg-burgos-gold/30 text-burgos-black px-4 py-2.5 rounded-xl font-semibold text-sm transition-all">
          <Check size={14} /> Guardar firma
        </button>
      </div>
    </div>
  );
}

function PortalDashboard({ session, onLogout }: { session: ClienteSession; onLogout: () => void }) {
  const [expedientes, setExpedientes] = useState<any[]>([]);
  const [tab, setTab] = useState<"expedientes" | "turnos" | "mensajes" | "firma">("expedientes");
  const [loading, setLoading] = useState(true);
  const [firmaSaved, setFirmaSaved] = useState(false);
  const [firmaLoading, setFirmaLoading] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const loadExpedientes = async () => {
      try {
        const res = await window.fetch(`/api/portal/expedientes?clienteId=${session.id}`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) setExpedientes(data);
        }
      } catch { /* network error, ignore */ }
      setLoading(false);
    };
    loadExpedientes();
  }, [session.id]);

  const handleSaveFirma = async (dataUrl: string) => {
    setFirmaLoading(true);
    try {
      // Convert data URL to blob
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const fileName = `firmas/${session.id}_${Date.now()}.png`;

      const { error } = await supabase.storage
        .from("expedientes-docs")
        .upload(fileName, blob, { contentType: "image/png", upsert: true });

      if (!error) {
        setFirmaSaved(true);
        setTimeout(() => setFirmaSaved(false), 3000);
      } else {
        alert("Error al guardar la firma. Intentá de nuevo.");
      }
    } catch {
      alert("Error de conexión al guardar la firma.");
    }
    setFirmaLoading(false);
  };

  return (
    <div className="min-h-screen bg-burgos-black">
      {/* Header */}
      <header className="border-b border-burgos-gray-800 bg-burgos-dark/80 backdrop-blur-lg sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/logo-burgos.png" alt="Burgos" width={28} height={28} className="rounded-sm" />
            <div>
              <p className="text-sm font-semibold text-burgos-white">{session.nombre}</p>
              <p className="text-[10px] text-burgos-gray-600">DNI: {session.dni}</p>
            </div>
          </div>
          <button onClick={onLogout} className="text-xs text-burgos-gray-400 hover:text-red-400 transition-colors">
            Cerrar sesión
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="max-w-5xl mx-auto px-4 pt-6">
        <div className="flex gap-2 mb-6 flex-wrap">
          {[
            { id: "expedientes" as const, label: "Mis Expedientes" },
            { id: "firma" as const, label: "Firmar Documento" },
            { id: "turnos" as const, label: "Turnos" },
            { id: "mensajes" as const, label: "Mensajes" },
          ].map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} className={`px-4 py-2 rounded-xl text-xs font-medium transition-all border ${tab === t.id ? "bg-burgos-gold/10 text-burgos-gold border-burgos-gold/30" : "text-burgos-gray-400 border-burgos-gray-800 hover:border-burgos-gray-600"}`}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 pb-8">
        {tab === "expedientes" && (
          <>
            {loading ? (
              <div className="text-center py-12"><div className="w-8 h-8 border-2 border-burgos-gold/30 border-t-burgos-gold rounded-full animate-spin mx-auto" /></div>
            ) : expedientes.length === 0 ? (
              <div className="bg-burgos-dark rounded-2xl border border-burgos-gray-800 p-8 text-center">
                <Scale size={40} className="text-burgos-gray-800 mx-auto mb-3" />
                <p className="text-burgos-gray-600 text-sm">No tenés expedientes asignados todavía.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {expedientes.map((exp: any) => (
                  <div key={exp.id} className="bg-burgos-dark rounded-xl border border-burgos-gray-800 hover:border-burgos-gold/20 p-5 transition-colors">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-sm font-semibold text-burgos-white">{exp.caratula}</h3>
                        <div className="flex items-center gap-3 mt-1">
                          {exp.numero && <span className="text-[10px] text-burgos-gray-400 font-mono">N° {exp.numero}</span>}
                          {exp.fuero && <span className="text-[10px] text-burgos-gray-600">{exp.fuero}</span>}
                        </div>
                      </div>
                      <span className={`text-[9px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full ${exp.estado === "activo" ? "bg-green-500/10 text-green-400" : "bg-amber-500/10 text-amber-400"}`}>
                        {exp.estado}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {tab === "firma" && (
          <div className="bg-burgos-dark rounded-2xl border border-burgos-gray-800 p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-4">
              <PenTool size={18} className="text-burgos-gold" />
              <h2 className="text-lg font-bold text-burgos-white">Firmar Documento</h2>
            </div>
            <p className="text-burgos-gray-400 text-sm mb-6">Dibujá tu firma abajo. Se guardará de forma segura y podrá ser utilizada para firmar documentos electrónicamente.</p>

            {firmaSaved && (
              <div className="bg-green-500/10 border border-green-500/20 text-green-400 text-sm px-4 py-3 rounded-xl mb-4 flex items-center gap-2">
                <Check size={16} /> Firma guardada correctamente.
              </div>
            )}

            {firmaLoading ? (
              <div className="text-center py-12">
                <div className="w-8 h-8 border-2 border-burgos-gold/30 border-t-burgos-gold rounded-full animate-spin mx-auto mb-3" />
                <p className="text-burgos-gray-400 text-sm">Guardando firma...</p>
              </div>
            ) : (
              <FirmaPad onSave={handleSaveFirma} />
            )}
          </div>
        )}

        {tab === "turnos" && (
          <div className="bg-burgos-dark rounded-2xl border border-burgos-gray-800 p-8 text-center">
            <p className="text-burgos-gray-400 text-sm">Para solicitar un turno, usá el chat de la página principal o contactá a tu abogado.</p>
            <a href="/#contacto" className="inline-block mt-3 text-sm text-burgos-gold hover:text-burgos-gold-light font-medium">Ir a contacto →</a>
          </div>
        )}

        {tab === "mensajes" && (
          <div className="bg-burgos-dark rounded-2xl border border-burgos-gray-800 p-8 text-center">
            <p className="text-burgos-gray-400 text-sm">La mensajería con tu abogado estará disponible próximamente.</p>
          </div>
        )}
      </div>
    </div>
  );
}
