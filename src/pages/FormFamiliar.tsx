import { useState } from 'react';

const WEBHOOK_URL = 'https://n8n.saintsolution.com.br/webhook/venda-familiar-asaas';

export function FormFamiliar() {
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    email: '',
    telefone: '',
  });

  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErro('');

    const payload = {
      origem: 'site_consultoque',
      tipo_formulario: 'familiar',
      tipo_plano: 'fam_esp_pes',
      cod_plano: '1140',
      valor: 66,
      tit_ind: 0,
      tit_fam: 1,

      assoc_nome: formData.nome,
      assoc_cpf: formData.cpf,
      assoc_email: formData.email,
      assoc_tel: formData.telefone,

      tit_nome: formData.nome,
      tit_cpf: formData.cpf,
      tit_email: formData.email,
      tit_tel: formData.telefone,

      cod_colab: localStorage.getItem('cod_colab') || '0001',
      status_venda: 'pendente_pagamento',
    };

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Erro ao enviar cadastro.');
      }

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
      <section className="max-w-xl mx-auto bg-white rounded-3xl shadow-lg p-6 md:p-8">
        <h1 className="text-2xl md:text-3xl font-black text-gray-900 text-center">
          Plano Familiar
        </h1>

        <p className="text-center text-gray-500 mt-2 mb-8">
          Teleconsulta 24h para titular e dependentes por R$ 66,00 mensais.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Nome completo do titular
            </label>
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Digite o nome completo"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              CPF do titular
            </label>
            <input
              type="text"
              name="cpf"
              value={formData.cpf}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
              placeholder="000.000.000-00"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              E-mail
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
              placeholder="seuemail@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Telefone / WhatsApp
            </label>
            <input
              type="tel"
              name="telefone"
              value={formData.telefone}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
              placeholder="(00) 00000-0000"
            />
          </div>

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