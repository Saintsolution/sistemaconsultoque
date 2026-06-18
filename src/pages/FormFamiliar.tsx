import { useState } from 'react';

const WEBHOOK_URL = 'https://n8n.saintsolution.com.br/webhook/familiar-pessoal';

export function FormFamiliar() {
  const [mesmoTitular, setMesmoTitular] = useState(true);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  const [formData, setFormData] = useState({
    assoc_nome: '',
    assoc_cpf: '',
    assoc_nasc: '',
    assoc_email: '',
    assoc_tel: '',
    empresa_nome: '',
    empresa_cnpj: '',
    tit_nome: '',
    tit_cpf: '',
    tit_nasc: '',
    tit_email: '',
    tit_tel: '',
  });

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
          tit_nome: formData.assoc_nome,
          tit_cpf: formData.assoc_cpf,
          tit_nasc: formData.assoc_nasc,
          tit_email: formData.assoc_email,
          tit_tel: formData.assoc_tel,
          cod_plano: 'p1140',
          tipo_plano: '1140',
          status_titular: 'inativo',
        }
      : {
          tit_nome: formData.tit_nome,
          tit_cpf: formData.tit_cpf,
          tit_nasc: formData.tit_nasc,
          tit_email: formData.tit_email,
          tit_tel: formData.tit_tel,
          cod_plano: 'p1140',
          tipo_plano: '1140',
          status_titular: 'inativo',
        };

    const payload = {
      origem: 'site_consultoque',
      origem_form: 'familiar',
      cod_colab: codColab,
      cod_plano: 'p1140',
      tipo_plano: '1140',

      assoc_nome: formData.assoc_nome,
      assoc_cpf: formData.assoc_cpf,
      assoc_nasc: formData.assoc_nasc,
      assoc_email: formData.assoc_email,
      assoc_tel: formData.assoc_tel,

      empresa_nome: formData.empresa_nome,
      empresa_cnpj: formData.empresa_cnpj,

      tit_ind: 0,
      tit_fam: 1,
      vl_ind: 0,
      vl_fam: 66,
      vl_total: 66,

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

      const data = await response.json();

      const paymentUrl =
        data.paymentUrl ||
        data.invoiceUrl ||
        data.bankSlipUrl ||
        data.url;

      if (!paymentUrl) {
        throw new Error('O link de pagamento não foi retornado.');
      }

      window.location.href = paymentUrl;
    } catch (error) {
      console.error(error);
      setErro('Não foi possível iniciar o pagamento. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-xl mx-auto mb-4">
        <button
          type="button"
          onClick={() => window.location.href = '/'}
          className="text-sm font-bold text-blue-600 hover:text-blue-800"
        >
          ← Voltar e revisar os planos
        </button>
      </div>

      <section className="max-w-xl mx-auto bg-white rounded-3xl shadow-lg p-6 md:p-8">
        <h1 className="text-2xl md:text-3xl font-black text-gray-900 text-center">
          Plano Familiar
        </h1>

        <p className="text-center text-gray-500 mt-2 mb-8">
          1 titular + 3 dependentes • Teleconsulta 24h por R$ 66,00 mensais.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <h2 className="text-lg font-black text-gray-900">
            Associado responsável pelo pagamento
          </h2>

          <input type="text" name="assoc_nome" value={formData.assoc_nome} onChange={handleChange} required className="w-full border border-gray-300 rounded-xl px-4 py-3" placeholder="Nome completo do responsável" />
          <input type="text" name="assoc_cpf" value={formData.assoc_cpf} onChange={handleChange} required className="w-full border border-gray-300 rounded-xl px-4 py-3" placeholder="CPF do responsável" />
          <input type="date" name="assoc_nasc" value={formData.assoc_nasc} onChange={handleChange} required className="w-full border border-gray-300 rounded-xl px-4 py-3" />
          <input type="email" name="assoc_email" value={formData.assoc_email} onChange={handleChange} required className="w-full border border-gray-300 rounded-xl px-4 py-3" placeholder="E-mail do responsável" />
          <input type="tel" name="assoc_tel" value={formData.assoc_tel} onChange={handleChange} required className="w-full border border-gray-300 rounded-xl px-4 py-3" placeholder="Telefone / WhatsApp do responsável" />

          <input type="text" name="empresa_nome" value={formData.empresa_nome} onChange={handleChange} className="w-full border border-gray-300 rounded-xl px-4 py-3" placeholder="Empresa (opcional)" />
          <input type="text" name="empresa_cnpj" value={formData.empresa_cnpj} onChange={handleChange} className="w-full border border-gray-300 rounded-xl px-4 py-3" placeholder="CNPJ (opcional)" />

          <label className="flex items-start gap-3 bg-green-50 border border-green-200 rounded-xl p-4 cursor-pointer">
            <input
              type="checkbox"
              checked={mesmoTitular}
              onChange={(e) => setMesmoTitular(e.target.checked)}
              className="mt-1"
            />
            <span className="text-sm font-semibold text-green-900">
              O titular do plano familiar é o próprio associado responsável pelo pagamento.
            </span>
          </label>

          {!mesmoTitular && (
            <div className="space-y-5 border-t pt-5">
              <h2 className="text-lg font-black text-gray-900">
                Dados do titular do plano familiar
              </h2>

              <input type="text" name="tit_nome" value={formData.tit_nome} onChange={handleChange} required={!mesmoTitular} className="w-full border border-gray-300 rounded-xl px-4 py-3" placeholder="Nome completo do titular" />
              <input type="text" name="tit_cpf" value={formData.tit_cpf} onChange={handleChange} required={!mesmoTitular} className="w-full border border-gray-300 rounded-xl px-4 py-3" placeholder="CPF do titular" />
              <input type="date" name="tit_nasc" value={formData.tit_nasc} onChange={handleChange} required={!mesmoTitular} className="w-full border border-gray-300 rounded-xl px-4 py-3" />
              <input type="email" name="tit_email" value={formData.tit_email} onChange={handleChange} required={!mesmoTitular} className="w-full border border-gray-300 rounded-xl px-4 py-3" placeholder="E-mail do titular" />
              <input type="tel" name="tit_tel" value={formData.tit_tel} onChange={handleChange} required={!mesmoTitular} className="w-full border border-gray-300 rounded-xl px-4 py-3" placeholder="Telefone / WhatsApp do titular" />
            </div>
          )}

          {erro && (
            <div className="bg-red-50 text-red-700 text-sm font-semibold px-4 py-3 rounded-xl">
              {erro}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#22C55E] hover:bg-[#16a34a] disabled:opacity-60 text-white font-black py-4 rounded-2xl uppercase tracking-wide transition-all"
          >
            {loading ? 'Gerando pagamento...' : 'Ir para pagamento'}
          </button>
        </form>
      </section>
    </main>
  );
}