import { Link } from 'react-router-dom';

export function SejaAfiliado() {
  return (
    <div className="min-h-screen bg-white">

      {/* VOLTAR */}
      <div className="p-6">
        <Link to="/" className="text-blue-600 font-semibold">
          ← Voltar para o site
        </Link>
      </div>

      {/* HERO AFILIADO */}
      <section className="bg-gradient-to-br from-green-600 via-emerald-600 to-green-500 text-white py-24 px-6 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6">
          Seja um parceiro de vendas ConsulToque
        </h1>

        <p className="text-xl md:text-3xl font-semibold max-w-5xl mx-auto mb-6">
          Construa sua renda recorrente com nosso sistema de células
        </p>

        <p className="text-lg md:text-2xl max-w-4xl mx-auto text-green-50">
          Ganhe comissões <strong>recorrentes</strong> todos os meses,
          vendendo um plano popular, acessível e de fácil aceitação.
        </p>

        {/* CTA HERO */}
        <div className="mt-10">
          <Link
            to="/cadastro" // Substitua pela rota do seu novo cadastro
            className="inline-flex items-center justify-center bg-[#22C55E] hover:bg-[#16a34a] text-white px-14 py-6 md:px-20 rounded-full shadow-[0_18px_40px_rgba(0,0,0,0.35)] transition-all duration-300 transform hover:scale-105 active:scale-95 border-b-4 border-green-800 text-xl md:text-2xl font-black"
          >
            Quero me cadastrar agora
          </Link>
        </div>
      </section>

      {/* PROVA / GANHO RECORRENTE */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="flex justify-center">
            <img src="/vendedor.png" alt="Ganhos recorrentes com afiliados" className="w-full max-w-sm rounded-2xl shadow-2xl object-contain" />
          </div>
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-6">
              Comissão recorrente que constrói renda fixa
            </h2>
            <p className="text-lg md:text-xl mb-4">
              Sua Renda Fixa com Comissão Recorrente. <strong>Faça 1 venda por dia</strong> e construa sua base. 
              Lucre até quando estiver de férias. <strong>Liberdade real</strong>.
            </p>
            <p className="text-lg md:text-xl">
              Essa renda vem das <strong>mensalidades recorrentes</strong> pagas pelos clientes da sua célula.
            </p>
          </div>
        </div>
      </section>

      {/* CONTEXTO AZUL COM VÍDEOS */}
      <section className="py-24 px-6 bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500">
        <div className="max-w-6xl mx-auto text-center bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8 md:p-12 text-white shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-8 uppercase">PORQUÊ VENDER TELEMEDICINA?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            <div className="aspect-square w-full bg-black/20 rounded-xl overflow-hidden shadow-lg border border-white/10">
              <iframe src="https://fast.wistia.net/embed/iframe/54eu0gg5vq?videoFoam=true" title="Video 1" allow="autoplay; fullscreen" frameBorder="0" className="w-full h-full"></iframe>
            </div>
            <div className="aspect-[9/16] w-full max-w-[300px] mx-auto bg-black/20 rounded-xl overflow-hidden shadow-2xl border border-white/20">
              <iframe src="https://fast.wistia.net/embed/iframe/c7gl82cath?videoFoam=true" title="Video 2" allow="autoplay; fullscreen" frameBorder="0" className="w-full h-full"></iframe>
            </div>
            <div className="aspect-square w-full bg-black/20 rounded-xl overflow-hidden shadow-lg border border-white/10">
              <iframe src="https://fast.wistia.net/embed/iframe/mxjr8nkqqe?videoFoam=true" title="Video 3" allow="autoplay; fullscreen" frameBorder="0" className="w-full h-full"></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="bg-gradient-to-r from-green-600 to-emerald-600 py-24 px-6 text-center text-white">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-6">
          Comece hoje a construir sua rede de vendas
        </h2>
        <Link
          to="/cadastro"
          className="inline-block bg-white text-green-700 px-16 py-6 rounded-full text-2xl font-black shadow-2xl hover:scale-105 transition-transform"
        >
          Quero me cadastrar agora
        </Link>
      </section>
    </div>
  );
}