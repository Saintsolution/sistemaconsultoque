import { useState } from 'react';

const WEBHOOK_URL = 'https://n8n.saintsolution.com.br/webhook/coletivo-empresarial';

type Titular = {
  tipo: 'individual' | 'familiar';
  tit_nome: string;
  tit_cpf: string;
  tit_nasc: string;
  tit_email: string;
  tit_tel: string;
};

export function FormColetivo() {
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  const [qtdInd, setQtdInd] = useState(0);
  const [qtdFam, setQtdFam] = useState(0);

  const [formData, setFormData] = useState({
    assoc_nome: '',
    assoc_cpf: '',
    assoc_nasc: '',
    assoc_email: '',
    assoc_tel: '',
    empresa_nome: '',
    empresa_cnpj: '',
  });

  const [titulares, setTitulares] = useState<Titular[]>([]);

  const totalTitulares = qtdInd + qtdFam;
  const precoInd = totalTitulares >= 10 ? 30 : 33;
  const precoFam = totalTitulares >= 10 ? 60 : 66;
  const vlTotal = qtdInd * precoInd + qtdFam * precoFam;

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function atualizarQuantidades(novoInd: number, novoFam: number) {
    setQtdInd(novoInd);
    setQtdFam(novoFam);

    const novosTitulares: Titular[] = [];

    for (let i = 0; i < novoInd; i++) {
      novosTitulares.push({
        tipo: 'individual',
        tit_nome: titulares[i]?.tit_nome || '',
        tit_cpf: titulares[i]?.tit_cpf || '',
        tit_nasc: titulares[i]?.tit_nasc || '',
        tit_email: titulares[i]?.tit_email || '',
        tit_tel: titulares[i]?.tit_tel || '',
      });
    }

    for (let i = 0; i < novoFam; i++) {
      const indexAntigo = novoInd + i;

      novosTitulares.push({
        tipo: 'familiar',
        tit_nome: titulares[indexAntigo]?.tit_nome || '',
        tit_cpf: titulares[indexAntigo]?.tit_cpf || '',
        tit_nasc: titulares[indexAntigo]?.tit_nasc || '',
        tit_email: titulares[indexAntigo]?.tit_email || '',
        tit_tel: titulares[indexAntigo]?.tit_tel || '',
      });
    }

    setTitulares(novosTitulares);
  }

  function handleTitularChange(index: number, campo: keyof Titular, valor: string) {
    setTitulares((prev) =>
      prev.map((titular, i) =>
        i === index ? { ...titular, [campo]: valor } : titular
      )
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErro('');

    if (totalTitulares === 0) {
      setErro('Informe pelo menos 1 titular.');
      setLoading(false);
      return;
    }

    const codColab = localStorage.getItem('referenciador_id') || '0001';

    const titularesPayload = titulares.map((titular) => ({
      tit_nome: titular.tit_nome,
      tit_cpf: titular.tit_cpf,
      tit_nasc: titular.tit_nasc,
      tit_email: titular.tit_email,
      tit_tel: titular.tit_tel,
      cod_plano: titular.tipo === 'individual' ? 'c1138' : 'c1140',
      tipo_plano: titular.tipo === 'individual' ? '1138' : '1140',
      tipo_titular: titular.tipo,
      status_titular: 'inativo',
    }));

    const payload = {
      origem: 'site_consultoque',
      origem_form: 'coletivo',

      cod_colab: codColab,

      cod_plano: 'coletivo',
      tipo_plano: 'coletivo',

      assoc_nome: formData.assoc_nome,
      assoc_cpf: formData.assoc_cpf,
      assoc_nasc: formData.assoc_nasc,
      assoc_email: formData.assoc_email,
      assoc_tel: formData.assoc_tel,

      empresa_nome: formData.empresa_nome,
      empresa_cnpj: formData.empresa_cnpj,

      tit_ind: qtdInd,
      tit_fam: qtdFam,
      tit_total: totalTitulares,

      vl_ind: precoInd,
      vl_fam: precoFam,
      vl_total: vlTotal,

      status_venda: 'pendente',

      titulares: titularesPayload,
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
      <div className="max-w-3xl mx-auto mb-4">
        <button
          type="button"
          onClick={() => window.location.href = '/'}
          className="text-sm font-bold text-blue-600 hover:text-blue-800"
        >
          ← Voltar e revisar os planos
        </button>
      </div>

      <section className="max-w-3xl mx-auto bg-white rounded-3xl shadow-lg p-6 md:p-8">
        <h1 className="text-2xl md:text-3xl font-black text-gray-900 text-center">
          Plano Coletivo
        </h1>

        <p className="text-center text-gray-500 mt-2 mb-8">
          A partir de 10 titulares, valores reduzidos: R$ 30 individual e R$ 60 familiar.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
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

          <div className="grid md:grid-cols-2 gap-4 border-t pt-6">
            <input
              type="number"
              min="0"
              value={qtdInd}
              onChange={(e) => atualizarQuantidades(Number(e.target.value), qtdFam)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3"
              placeholder="Titulares individuais"
            />

            <input
              type="number"
              min="0"
              value={qtdFam}
              onChange={(e) => atualizarQuantidades(qtdInd, Number(e.target.value))}
              className="w-full border border-gray-300 rounded-xl px-4 py-3"
              placeholder="Titulares familiares"
            />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
            <p className="font-bold text-blue-900">Total de titulares: {totalTitulares}</p>
            <p className="text-sm text-blue-800">Individual: {qtdInd} × R$ {precoInd},00</p>
            <p className="text-sm text-blue-800">Familiar: {qtdFam} × R$ {precoFam},00</p>
            <p className="text-xl font-black text-blue-900 mt-2">
              Total mensal: R$ {vlTotal.toFixed(2).replace('.', ',')}
            </p>
          </div>

          {titulares.map((titular, index) => (
            <div key={index} className="border rounded-2xl p-4 space-y-3 bg-slate-50">
              <h3 className="font-black">
                Titular {index + 1} — {titular.tipo === 'individual' ? 'Individual' : 'Familiar'}
              </h3>

              <input type="text" value={titular.tit_nome} onChange={(e) => handleTitularChange(index, 'tit_nome', e.target.value)} required className="w-full border rounded-xl px-4 py-3" placeholder="Nome completo" />
              <input type="text" value={titular.tit_cpf} onChange={(e) => handleTitularChange(index, 'tit_cpf', e.target.value)} required className="w-full border rounded-xl px-4 py-3" placeholder="CPF" />
              <input type="date" value={titular.tit_nasc} onChange={(e) => handleTitularChange(index, 'tit_nasc', e.target.value)} required className="w-full border rounded-xl px-4 py-3" />
              <input type="email" value={titular.tit_email} onChange={(e) => handleTitularChange(index, 'tit_email', e.target.value)} required className="w-full border rounded-xl px-4 py-3" placeholder="E-mail" />
              <input type="tel" value={titular.tit_tel} onChange={(e) => handleTitularChange(index, 'tit_tel', e.target.value)} required className="w-full border rounded-xl px-4 py-3" placeholder="Telefone / WhatsApp" />
            </div>
          ))}

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