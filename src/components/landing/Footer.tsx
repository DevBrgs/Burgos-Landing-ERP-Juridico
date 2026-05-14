import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-burgos-navy border-t border-burgos-navy-light py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Image
              src="/logo-burgos.png"
              alt="Burgos & Asociados"
              width={28}
              height={28}
              className="rounded-sm"
            />
            <span className="text-white/80 font-semibold">
              Burgos & Asociados
            </span>
          </div>
          <p className="text-white/40 text-sm">
            © {new Date().getFullYear()} Burgos & Asociados. Todos los derechos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
