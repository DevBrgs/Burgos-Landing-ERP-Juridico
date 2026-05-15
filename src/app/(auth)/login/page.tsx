"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { LogIn, Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError("Credenciales incorrectas. Verificá tu email y contraseña.");
      } else {
        router.push("/erp");
        router.refresh();
      }
    } catch {
      setError("Error de conexión. Intentá de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-burgos-black flex items-center justify-center px-4">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-burgos-gold/[0.02] rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Image
            src="/logo-burgos.png"
            alt="Burgos & Asociados"
            width={60}
            height={60}
            className="mx-auto rounded-lg mb-4"
          />
          <h1 className="text-2xl font-bold text-burgos-white">
            Acceso al ERP
          </h1>
          <p className="text-burgos-gray-400 text-sm mt-1">
            Panel interno — Burgos & Asociados
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleLogin}
          className="bg-burgos-dark rounded-2xl border border-burgos-gray-800 p-8 space-y-5"
        >
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          <div>
            <label className="text-[10px] uppercase tracking-wider text-burgos-gray-600 font-medium mb-1.5 block">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-burgos-black/50 border border-burgos-gray-800 rounded-xl text-burgos-white placeholder:text-burgos-gray-600 focus:outline-none focus:border-burgos-gold/40 transition-colors text-sm"
              placeholder="tu@burgos.com.ar"
            />
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-wider text-burgos-gray-600 font-medium mb-1.5 block">
              Contraseña
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pr-12 bg-burgos-black/50 border border-burgos-gray-800 rounded-xl text-burgos-white placeholder:text-burgos-gray-600 focus:outline-none focus:border-burgos-gold/40 transition-colors text-sm"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-burgos-gray-600 hover:text-burgos-gray-400 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 bg-burgos-gold hover:bg-burgos-gold-light disabled:bg-burgos-gold/30 text-burgos-black py-3.5 rounded-xl font-semibold transition-all duration-300 hover:shadow-[0_0_30px_rgba(201,168,76,0.2)]"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-burgos-black/30 border-t-burgos-black rounded-full animate-spin" />
            ) : (
              <>
                Iniciar Sesión
                <LogIn size={18} />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-burgos-gray-600 text-xs mt-6">
          Acceso exclusivo para el equipo del estudio
        </p>
      </motion.div>
    </div>
  );
}
