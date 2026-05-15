"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Newspaper, Plus, X, Eye, Edit, Globe, FileText } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Post {
  id: string;
  titulo: string;
  resumen: string | null;
  categoria: string;
  estado: string;
  imagen_url: string | null;
  publicado_en: string | null;
  creado_en: string;
}

const categorias = ["Novedades Normativas", "Casos de Éxito", "Jurisprudencia", "Eventos", "Guías", "General"];

const estadoStyles: Record<string, string> = {
  borrador: "bg-burgos-gray-600/10 text-burgos-gray-400 border-burgos-gray-600/20",
  publicado: "bg-green-500/10 text-green-400 border-green-500/20",
  archivado: "bg-amber-500/10 text-amber-400 border-amber-500/20",
};

export default function NewsletterERPPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const supabase = createClient();

  const fetchPosts = async () => {
    const { data } = await supabase
      .from("posts")
      .select("*")
      .order("creado_en", { ascending: false });
    if (data) setPosts(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const publicar = async (id: string) => {
    await supabase.from("posts").update({ estado: "publicado", publicado_en: new Date().toISOString() }).eq("id", id);
    fetchPosts();
  };

  const archivar = async (id: string) => {
    await supabase.from("posts").update({ estado: "archivado" }).eq("id", id);
    fetchPosts();
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-burgos-white flex items-center gap-2">
            <Newspaper size={24} className="text-burgos-gold" />
            Newsletter
          </h1>
          <p className="text-burgos-gray-400 text-sm mt-1">
            Publicaciones del estudio · {posts.filter((p) => p.estado === "publicado").length} publicadas
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 bg-burgos-gold hover:bg-burgos-gold-light text-burgos-black px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300"
        >
          <Plus size={16} />
          Nueva Publicación
        </button>
      </motion.div>

      {/* Posts list */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-3">
        {posts.map((post) => (
          <div key={post.id} className="bg-burgos-dark rounded-xl border border-burgos-gray-800 hover:border-burgos-gold/20 p-5 transition-colors">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-[9px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full border ${estadoStyles[post.estado]}`}>
                    {post.estado}
                  </span>
                  <span className="text-[10px] text-burgos-gray-600">{post.categoria}</span>
                </div>
                <h3 className="text-sm font-semibold text-burgos-white mb-1">{post.titulo}</h3>
                {post.resumen && <p className="text-xs text-burgos-gray-400 line-clamp-2">{post.resumen}</p>}
                <p className="text-[10px] text-burgos-gray-600 mt-2">
                  {post.publicado_en ? `Publicado: ${new Date(post.publicado_en).toLocaleDateString()}` : `Creado: ${new Date(post.creado_en).toLocaleDateString()}`}
                </p>
              </div>
              <div className="flex gap-1">
                {post.estado === "borrador" && (
                  <button onClick={() => publicar(post.id)} className="text-[10px] px-3 py-1.5 bg-green-500/10 text-green-400 border border-green-500/20 rounded-lg hover:bg-green-500/20 transition-colors flex items-center gap-1">
                    <Globe size={10} />
                    Publicar
                  </button>
                )}
                {post.estado === "publicado" && (
                  <button onClick={() => archivar(post.id)} className="text-[10px] px-3 py-1.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-lg hover:bg-amber-500/20 transition-colors">
                    Archivar
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </motion.div>

      {loading && (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-2 border-burgos-gold/30 border-t-burgos-gold rounded-full animate-spin mx-auto" />
        </div>
      )}

      {!loading && posts.length === 0 && (
        <div className="text-center py-16">
          <Newspaper size={40} className="text-burgos-gray-800 mx-auto mb-3" />
          <p className="text-burgos-gray-600 text-sm">No hay publicaciones. Creá la primera.</p>
        </div>
      )}

      {showModal && (
        <NuevoPostModal onClose={() => setShowModal(false)} onSuccess={() => { setShowModal(false); fetchPosts(); }} />
      )}
    </div>
  );
}

function NuevoPostModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [form, setForm] = useState({ titulo: "", cuerpo: "", resumen: "", categoria: "General", imagen_url: "" });
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data: abogado } = await supabase.from("abogados").select("id").eq("user_id", user.id).single();
    if (!abogado) return;

    await supabase.from("posts").insert({
      autor_id: abogado.id,
      titulo: form.titulo,
      cuerpo: form.cuerpo,
      resumen: form.resumen || null,
      categoria: form.categoria,
      imagen_url: form.imagen_url || null,
    });

    setLoading(false);
    onSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative bg-burgos-dark rounded-2xl border border-burgos-gray-800 p-6 sm:p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-burgos-white">Nueva Publicación</h2>
          <button onClick={onClose} className="text-burgos-gray-600 hover:text-burgos-white"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[10px] uppercase tracking-wider text-burgos-gray-600 font-medium mb-1.5 block">Título</label>
            <input type="text" required value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} placeholder="Título de la publicación" className="w-full px-4 py-2.5 bg-burgos-black/50 border border-burgos-gray-800 rounded-xl text-burgos-white placeholder:text-burgos-gray-600 focus:outline-none focus:border-burgos-gold/40 text-sm" />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-wider text-burgos-gray-600 font-medium mb-1.5 block">Resumen (aparece en la landing)</label>
            <textarea value={form.resumen} onChange={(e) => setForm({ ...form, resumen: e.target.value })} rows={2} placeholder="Breve descripción..." className="w-full px-4 py-2.5 bg-burgos-black/50 border border-burgos-gray-800 rounded-xl text-burgos-white placeholder:text-burgos-gray-600 focus:outline-none focus:border-burgos-gold/40 text-sm resize-none" />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-wider text-burgos-gray-600 font-medium mb-1.5 block">Contenido</label>
            <textarea required value={form.cuerpo} onChange={(e) => setForm({ ...form, cuerpo: e.target.value })} rows={6} placeholder="Escribí el contenido completo..." className="w-full px-4 py-2.5 bg-burgos-black/50 border border-burgos-gray-800 rounded-xl text-burgos-white placeholder:text-burgos-gray-600 focus:outline-none focus:border-burgos-gold/40 text-sm resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] uppercase tracking-wider text-burgos-gray-600 font-medium mb-1.5 block">Categoría</label>
              <select value={form.categoria} onChange={(e) => setForm({ ...form, categoria: e.target.value })} className="w-full px-3 py-2.5 bg-burgos-black/50 border border-burgos-gray-800 rounded-xl text-burgos-white focus:outline-none focus:border-burgos-gold/40 text-sm appearance-none">
                {categorias.map((c) => <option key={c} value={c} className="bg-burgos-dark">{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-wider text-burgos-gray-600 font-medium mb-1.5 block">URL imagen (opcional)</label>
              <input type="url" value={form.imagen_url} onChange={(e) => setForm({ ...form, imagen_url: e.target.value })} placeholder="https://..." className="w-full px-3 py-2.5 bg-burgos-black/50 border border-burgos-gray-800 rounded-xl text-burgos-white placeholder:text-burgos-gray-600 focus:outline-none focus:border-burgos-gold/40 text-sm" />
            </div>
          </div>
          <button type="submit" disabled={loading} className="w-full bg-burgos-gold hover:bg-burgos-gold-light disabled:bg-burgos-gold/30 text-burgos-black py-3 rounded-xl font-semibold transition-all duration-300">
            {loading ? "Guardando..." : "Guardar como borrador"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
