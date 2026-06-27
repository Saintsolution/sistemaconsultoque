import { useState } from 'react';

const WEBHOOK_URL = 'https://n8n.saintsolution.com.br/webhook/individual-pessoal';

export function FormIndividual() {
  const [mesmoTitular, setMesmoTitular] = useState(true);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState(false);

  const [formData, setFormData] = useState({
    assoc_nome: '',
    assoc_cpf: '',
    assoc_nasc: '',
    assoc_email: '',
    assoc_tel: '',
    tit_nome: '',
    tit_cpf: '',
    tit_nasc: '',
    tit_email: '',
    tit_tel: '',
  });

  function formatarData(data: string) {
    if (!data) return '';
    const [ano, mes, dia] = data.split('-');
    return `${dia}-${mes}-${ano}`;
  }

  function somenteTexto(value: string) {
    return String(value || '').trim();
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErro('');

    const codColab = localStorage.getItem('referenciador_id') || '0001';

    const titular = mesmoTitular
      ? {
          tit_nome: somenteTexto(formData.assoc_nome),
          tit_cpf: somenteTexto(formData.assoc_cpf),
          tit_nasc: formatarData(formData.assoc_nasc),
          tit_email: somenteTexto(formData.assoc_email),
          tit_tel: somenteTexto(formData.assoc_tel),
          cod_plano: 'p1138',
          tipo_plano: '1138',
          status_titular: 'inativo',
        }
      : {
          tit_nome: somenteTexto(formData.tit_nome),
          tit_cpf: somenteTexto(formData.tit_cpf),
          tit_nasc: formatarData(formData.tit_nasc),
          tit_email: somenteTexto(formData.tit_email),
          tit_tel: somenteTexto(formData.tit_tel),
          cod_plano: 'p1138',
          tipo_plano: '1138',
          status_titular: 'inativo',
        };

    const totalTitulares = 1;

    const payload = {
      origem: 'site_consultoque',
      origem_form: 'individual',
      cod_colab: codColab,
      cod_plano: 'p1138',
      tipo_plano: '1138',

      assoc_nome: somenteTexto(formData.assoc_nome),
      assoc_cpf: somenteTexto(formData.assoc_cpf),
      assoc_nasc: formatarData(formData.assoc_nasc),
      assoc_email: somenteTexto(formData.assoc_email),
      assoc_tel: somenteTexto(formData.assoc_tel),

      tit_ind: totalTitulares,
      tit_fam: 0,
      tit_total: totalTitulares,

      vl_ind: 33 * totalTitulares,
      vl_fam: 0,
      vl_total: 33 * totalTitulares,

      status_venda: 'pendente',
      titulares: [titular],
    };

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Erro ao enviar cadastro.');

      setSucesso(true);
    } catch (error) {
      console.error(error);
      setErro('Não foi possível realizar o cadastro. Tente novamente.');
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-xl mx-auto mb-4">
        <button type="button" onClick={() => window.location.href = '/'} className="text-sm font-bold text-blue-600 hover:text-blue-800">
          ← Voltar e revisar os planos
        </button>
      </div>

      <section className="max-w-xl mx-auto bg-white rounded-3xl shadow-lg p-6 md:p-8">
        {sucesso ? (
          <div className="text-center py-12">
            <h2 className="text-3xl font-black text-green-600 mb-4">Cadastro realizado!</h2>
            <p className="text-lg text-gray-700">Verifique seu e-mail, enviamos o link para acessar o pagamento da sua mensalidade.</p>
          </div>
        ) : (
          <>
            <h1 className="text-2xl md:text-3xl font-black text-gray-900 text-center">Plano Individual</h1>
            <p className="text-center text-gray-500 mt-2 mb-8">1 titular • Teleconsulta 24h por R$ 33,00 mensais.</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <h2 className="text-lg font-black text-gray-900">Associado responsável pelo pagamento</h2>

              <input type="text" name="assoc_nome" value={formData.assoc_nome} onChange={handleChange} required className="w-full border border-gray-300 rounded-xl px-4 py-3" placeholder="Nome completo do responsável" />
              <input type="text" name="assoc_cpf" value={formData.assoc_cpf} onChange={handleChange} required className="w-full border border-gray-300 rounded-xl px-4 py-3" placeholder="CPF do responsável" />

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Data de nascimento</label>
                <input type="date" name="assoc_nasc" value={formData.assoc_nasc} onChange={handleChange} required className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white text-gray-900" />
              </div>

              <input type="email" name="assoc_email" value={formData.assoc_email} onChange={handleChange} required className="w-full border border-gray-300 rounded-xl px-4 py-3" placeholder="E-mail do responsável" />
              <input type="tel" name="assoc_tel" value={formData.assoc_tel} onChange={handleChange} required className="w-full border border-gray-300 rounded-xl px-4 py-3" placeholder="Telefone / WhatsApp do responsável" />

              <label className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-xl p-4 cursor-pointer">
                <input type="checkbox" checked={mesmoTitular} onChange={(e) => setMesmoTitular(e.target.checked)} className="mt-1" />
                <span className="text-sm font-semibold text-blue-900">O titular do plano é o próprio associado.</span>
              </label>

              {!mesmoTitular && (
                <div className="space-y-5 border-t pt-5">
                  <h2 className="text-lg font-black text-gray-900">Dados do titular</h2>

                  <input type="text" name="tit_nome" value={formData.tit_nome} onChange={handleChange} required={!mesmoTitular} className="w-full border border-gray-300 rounded-xl px-4 py-3" placeholder="Nome completo do titular" />
                  <input type="text" name="tit_cpf" value={formData.tit_cpf} onChange={handleChange} required={!mesmoTitular} className="w-full border border-gray-300 rounded-xl px-4 py-3" placeholder="CPF do titular" />

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Data de nascimento do titular</label>
                    <input type="date" name="tit_nasc" value={formData.tit_nasc} onChange={handleChange} required={!mesmoTitular} className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white text-gray-900" />
                  </div>

                  <input type="email" name="tit_email" value={formData.tit_email} onChange={handleChange} required={!mesmoTitular} className="w-full border border-gray-300 rounded-xl px-4 py-3" placeholder="E-mail do titular" />
                  <input type="tel" name="tit_tel" value={formData.tit_tel} onChange={handleChange} required={!mesmoTitular} className="w-full border border-gray-300 rounded-xl px-4 py-3" placeholder="Telefone / WhatsApp do titular" />
                </div>
              )}

              {erro && <div className="bg-red-50 text-red-700 text-sm font-semibold px-4 py-3 rounded-xl">{erro}</div>}

              <button type="submit" disabled={loading} className="w-full bg-[#22C55E] hover:bg-[#16a34a] disabled:opacity-60 text-white font-black py-4 rounded-2xl uppercase tracking-wide transition-all">
                {loading ? 'Processando...' : 'Enviar cadastro'}
              </button>
            </form>
          </>
        )}
      </section>
    </main>
  );
}