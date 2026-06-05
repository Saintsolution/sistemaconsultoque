import { HeaderVisual } from '../components/HeaderVisual';
import { Hero } from '../components/Hero';
import { PlanGrid } from '../components/PlanGrid';
import { Benefits } from '../components/Benefits';
import { ClubBenefits } from '../components/ClubBenefits';
import { LegalCompliance } from '../components/LegalCompliance';
import { AffiliateCall } from '../components/AffiliateCall';
import { Footer } from '../components/Footer';

export function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans antialiased">
      <HeaderVisual />
      <Hero />
      
      {/* 
        Ajuste fino: py-12 dá o respiro correto. 
        space-y-12 cria uma cadência lógica entre os blocos.
      */}
      <main className="max-w-5xl mx-auto px-4 py-12 space-y-12">
        
        {/* Seção de Planos - mantendo os dois grids */}
        <section className="space-y-8">
          <PlanGrid title="Planos Pessoais (CPF)" type="personal" />
          <PlanGrid title="Planos Empresariais (CNPJ)" type="business" />
        </section>

        {/* Blocos de Conteúdo e Conversão */}
        <Benefits />
        <ClubBenefits />
        <LegalCompliance />
        <AffiliateCall />
        
      </main>

      <Footer />
    </div>
  );
}