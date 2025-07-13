export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-[#002147]">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <h2 className="text-3xl font-semibold mb-2">Página no encontrada</h2>
      <p className="text-lg mb-6">Lo sentimos, la página que buscas no existe.</p>
      <a href="/" className="bg-[#F5B400] text-[#002147] px-4 py-2 rounded font-semibold hover:bg-[#e5a800] transition uppercase text-sm">
        Volver al inicio
      </a>
    </div>
  );
}