import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-burgos-black border-t border-burgos-gray-800 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Image
              src="/logo-burgos.png"
              alt="Burgos & Asociados"
              width={28}
              height={28}
              className="rounded-sm"
            />
            <span className="text-burgos-white font-semibold text-sm">
              Burgos & Asociados
            </span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6">
            <Link
              href="/newsletter"
              className="text-burgos-gray-400 hover:text-burgos-gold text-xs transition-colors"
            >
              Newsletter
            </Link>
            <a
              href="#equipo"
              className="text-burgos-gray-400 hover:text-burgos-gold text-xs transition-colors"
            >
              Equipo
            </a>
            <a
              href="#areas"
              className="text-burgos-gray-400 hover:text-burgos-gold text-xs transition-colors"
            >
              Áreas
            </a>
            <a
              href="#contacto"
              className="text-burgos-gray-400 hover:text-burgos-gold text-xs transition-colors"
            >
              Contacto
            </a>
          </div>

          {/* Copyright */}
          <p className="text-burgos-gray-600 text-xs">
            © {new Date().getFullYear()} Burgos & Asociados
          </p>
        </div>
      </div>
    </footer>
  );
}
