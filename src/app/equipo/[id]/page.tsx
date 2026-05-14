import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { PerfilAbogado } from "@/components/landing/PerfilAbogado";

export const metadata = {
  title: "Perfil | Burgos & Asociados",
};

export default async function PerfilPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-20">
        <PerfilAbogado id={id} />
      </main>
      <Footer />
    </>
  );
}
