"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { FileText, Download, Clock, AlertTriangle } from "lucide-react";
import Image from "next/image";

export default function CompartidoPage() {
  const params = useParams();
  const token = params.token as string;
  const [doc, setDoc] = useState<{ nombre: string; url: string } | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [expira, setExpira] = useState("");

  useEffect(() => {
    const fetch = async () => {
      const res = await window.fetch(`/api/compartir?token=${token}`);
      const data = await res.json();
      if (!res.ok) { setError(data.error); }
      else { setDoc(data.documento); setExpira(data.expira_en); }
      setLoading(false);
    };
    fetch();
  }, [token]);

  if (loading) return <div className="min-h-screen bg-burgos-black flex items-center justify-center"><div className="w-8 h-8 border-2 border-burgos-gold/30 border-t-burgos-gold rounded-full animate-spin" /></div>;

  if (error) {
    return (
      <div className="min-h-screen bg-burgos-black flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <AlertTriangle size={48} className="text-amber-400 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-burgos-white mb-2">
            {error === "Link expirado" ? "Este link ha expirado" : error === "Link revocado" ? "Este link fue revocado" : "Link no válido"}
          </h1>
          <p className="text-burgos-gray-400 text-sm">Contactá al abogado que te compartió este documento para obtener un nuevo link.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-burgos-black flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <Image src="/logo-burgos.png" alt="Burgos" width={40} height={40} className="mx-auto rounded-lg mb-3" />
          <p className="text-burgos-gray-600 text-xs">Burgos & Asociados — Documento compartido</p>
        </div>
        <div className="bg-burgos-dark rounded-2xl border border-burgos-gray-800 p-8 text-center">
          <FileText size={40} className="text-burgos-gold mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-burgos-white mb-2">{doc?.nombre}</h2>
          <p className="text-xs text-burgos-gray-600 flex items-center justify-center gap-1 mb-6">
            <Clock size={10} />
            Expira: {new Date(expira).toLocaleDateString()}
          </p>
          <a href={doc?.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-burgos-gold hover:bg-burgos-gold-light text-burgos-black px-6 py-3 rounded-xl font-semibold text-sm transition-all">
            <Download size={16} />
            Descargar documento
          </a>
        </div>
      </div>
    </div>
  );
}
