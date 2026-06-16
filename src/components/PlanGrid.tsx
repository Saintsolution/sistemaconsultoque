import { Link } from 'react-router-dom';

interface PlanGridProps {
  title: string;
  type: 'personal' | 'business';
}

export function PlanGrid({ type }: PlanGridProps) {
  const isPersonal = type === 'personal';

  const precoIndividual = isPersonal ? 'R$ 33,00' : 'R$ 30,00';
  const precoFamiliar = isPersonal ? 'R$ 66,00' : 'R$ 60,00';

  const tituloExibicao = isPersonal
    ? 'PLANOS PESSOAIS'
    : 'PLANOS COLETIVOS - ACIMA DE 10 TITULARES';

  const borderColor = isPersonal ? 'border-[#3b82f6]' : 'border-[#22c55e]';
  const buttonColor = isPersonal
    ? 'bg-[#3b82f6] hover:bg-[#2563eb]'
    : 'bg-[#22c55e] hover:bg-[#16a34a]';
  const accentColor = isPersonal ? 'text-[#3b82f6]' : 'text-[#22c55e]';

  return (
    <section className="space-y-6">
      <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight text-center">
        {tituloExibicao}
      </h2>

      <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
        <div className={`bg-white rounded-2xl p-6 border-4 ${borderColor} shadow-sm flex flex-col justify-between text-center`}>
          <div>
            <h3 className="text-lg font-black text-gray-900">Individual</h3>
            <p className="text-xs font-bold uppercase text-gray-500 mt-1 mb-2">
              1 Titular
            </p>

            <div className="my-3">
              <span className="text-4xl font-black text-gray-900">
                {precoIndividual}
              </span>
              <span className="text-gray-400 text-xs font-bold">/mês</span>
            </div>

            <p className="text-[10px] font-bold text-gray-500 mb-6 bg-slate-50 py-2 rounded-lg">
              Inclui Psico, Nutri e Personal
            </p>
          </div>

          <Link
            to={isPersonal ? '/form-individual' : '/form-coletivo'}
            className={`w-full ${buttonColor} text-white font-black py-3 rounded-xl uppercase text-[11px] tracking-wider transition-all text-center`}
          >
            Contratar Individual
          </Link>
        </div>

        <div className={`bg-white rounded-2xl p-6 border-4 ${borderColor} shadow-sm flex flex-col justify-between text-center`}>
          <div>
            <h3 className="text-lg font-black text-gray-900">Familiar</h3>
            <p className="text-xs font-bold uppercase text-gray-500 mt-1 mb-2">
              1 Titular + 3 Dependentes
            </p>

            <div className="my-3">
              <span className={`text-4xl font-black ${accentColor}`}>
                {precoFamiliar}
              </span>
              <span className="text-gray-400 text-xs font-bold">/mês</span>
            </div>

            <p className="text-[10px] font-bold text-gray-500 mb-6 bg-slate-50 py-2 rounded-lg">
              Inclui Psico, Nutri e Personal
            </p>
          </div>

          <Link
            to={isPersonal ? '/form-familiar' : '/form-coletivo'}
            className={`w-full ${buttonColor} text-white font-black py-3 rounded-xl uppercase text-[11px] tracking-wider transition-all text-center`}
          >
            Contratar Familiar
          </Link>
        </div>
      </div>
    </section>
  );
}