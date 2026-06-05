interface PlanGridProps {
  title: string;
  type: 'personal' | 'business';
}

export function PlanGrid({ title, type }: PlanGridProps) {
  const isPersonal = type === 'personal';
  
  const precoIndividual = isPersonal ? "R$ 33,00" : "R$ 30,00";
  const precoFamiliar = isPersonal ? "R$ 66,00" : "R$ 60,00";
  
  const borderColor = isPersonal ? 'border-[#3b82f6]' : 'border-[#22c55e]';
  const buttonColor = isPersonal ? 'bg-[#3b82f6] hover:bg-[#2563eb]' : 'bg-[#22c55e] hover:bg-[#16a34a]';
  const accentColor = isPersonal ? 'text-[#3b82f6]' : 'text-[#22c55e]';

  return (
    <section className="space-y-6">
      <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight text-center">{title}</h2>
      
      <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
        {/* Card Individual */}
        <div className={`bg-white rounded-2xl p-6 border-4 ${borderColor} shadow-sm flex flex-col justify-between text-center`}>
          <div>
            <h3 className="text-lg font-black text-gray-900">Individual</h3>
            <div className="my-3">
              <span className="text-4xl font-black text-gray-900">{precoIndividual}</span>
              <span className="text-gray-400 text-xs font-bold">/mês</span>
            </div>
            {/* Gatilho de Valor - Psico, Nutri e Personal */}
            <p className="text-[10px] font-bold text-gray-500 mb-6 bg-slate-50 py-2 rounded-lg">
              Inclui Psico, Nutri e Personal
            </p>
          </div>
          <button className={`w-full ${buttonColor} text-white font-black py-3 rounded-xl uppercase text-[11px] tracking-wider transition-all`}>
            Contratar Individual
          </button>
        </div>

        {/* Card Familiar */}
        <div className={`bg-white rounded-2xl p-6 border-4 ${borderColor} shadow-sm flex flex-col justify-between text-center`}>
          <div>
            <h3 className="text-lg font-black text-gray-900">Familiar</h3>
            <div className="my-3">
              <span className={`text-4xl font-black ${accentColor}`}>{precoFamiliar}</span>
              <span className="text-gray-400 text-xs font-bold">/mês</span>
            </div>
            {/* Gatilho de Valor - Psico, Nutri e Personal */}
            <p className="text-[10px] font-bold text-gray-500 mb-6 bg-slate-50 py-2 rounded-lg">
              Inclui Psico, Nutri e Personal
            </p>
          </div>
          <button className={`w-full ${buttonColor} text-white font-black py-3 rounded-xl uppercase text-[11px] tracking-wider transition-all`}>
            Contratar Familiar
          </button>
        </div>
      </div>
    </section>
  );
}