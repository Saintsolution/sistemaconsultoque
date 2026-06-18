import { useState } from 'react';
import axios from 'axios';

const WEBHOOK_LOGIN_CLIENTE =
  'https://n8n.saintsolution.com.br/webhook/login-cliente';

const WEBHOOK_GET_DADOS_CLIENTE =
  'https://n8n.saintsolution.com.br/webhook/get-dados-cliente';

const WEBHOOK_EDITA_TITULAR =
  'https://n8n.saintsolution.com.br/webhook/edita-titular';

function dinheiro(valor: any) {
  return Number(valor || 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

function descricaoPlano(cod: string) {
  const mapa: Record<string, string> = {
    p1138: 'Plano Individual Pessoal com Especialidades',
    p1140: 'Plano Familiar Pessoal com Especialidades',
    c1138: 'Plano Individual Coletivo com Especialidades',
    c1140: 'Plano Familiar Coletivo com Especialidades',
  };

  return mapa[cod] || cod || '-';
}

export function ClienteDashboard() {
  const [logado, setLogado] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  const [loginData, setLoginData] = useState({
    assoc_cpf: '',
    assoc_nasc: '',
  });

  const [dados, setDados] = useState<any>(null);

  const [editando, setEditando] = useState<any>(null);
  const [editData, setEditData] = useState({
    tit_nome: '',
    tit_cpf: '',
    tit_nasc: '',
    tit_email: '',
    tit_tel: '',
  });

  async function buscarDados(cpf: string) {
    const response = await axios.post(
      WEBHOOK_GET_DADOS_CLIENTE,
      { assoc_cpf: cpf },
      { timeout: 15000 }
    );

    const payload = Array.isArray(response.data)
      ? response.data[0]
      : response.data;

    setDados(payload);
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErro('');

    try {
      const response = await axios.post(
        WEBHOOK_LOGIN_CLIENTE,
        loginData,
        { timeout: 15000 }
      );

      if (response.data.sucesso !== true) {
        throw new Error('CPF ou nascimento não localizado.');
      }

      localStorage.setItem('assoc_cpf', loginData.assoc_cpf);
      setLogado(true);

      await buscarDados(loginData.assoc_cpf);
    } catch (e) {
      console.error(e);
      setErro('Não foi possível acessar sua área. Confira CPF e nascimento.');
    } finally {
      setLoading(false);
    }
  }

  function abrirEdicao(titular: any) {
    setEditando(titular);

    setEditData({
      tit_nome: titular.tit_nome || '',
      tit_cpf: titular.tit_cpf || '',
      tit_nasc: titular.tit_nasc || '',
      tit_email: titular.tit_email || '',
      tit_tel: titular.tit_tel || '',
    });
  }

  async function salvarTitular() {
    if (!editando) return;

    setLoading(true);
    setErro('');

    try {
      await axios.post(
        WEBHOOK_EDITA_TITULAR,
        {
          num_contrato: editando.num_contrato,
          cod_venda: editando.cod_venda,
          tit_cpf_original: editando.tit_cpf,
          ...editData,
        },
        { timeout: 15000 }
      );

      setDados((prev: any) => ({
        ...prev,
        titulares: prev.titulares.map((t: any) =>
          t.tit_cpf === editando.tit_cpf &&
          t.num_contrato === editando.num_contrato
            ? { ...t, ...editData }
            : t
        ),
      }));

      setEditando(null);
      alert('Titular atualizado com sucesso!');
    } catch (e) {
      console.error(e);
      setErro('Erro ao atualizar titular.');
    } finally {
      setLoading(false);
    }
  }

  if (!logado) {
    return (
      <main className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <section className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-2xl font-black text-blue-900 text-center mb-2">
            Área do Cliente
          </h1>

          <p className="text-center text-gray-500 mb-6">
            Acesse com CPF e data de nascimento do responsável.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="text"
              value={loginData.assoc_cpf}
              onChange={(e) =>
                setLoginData({ ...loginData, assoc_cpf: e.target.value })
              }
              required
              className="w-full border rounded-xl p-3"
              placeholder="CPF do responsável"
            />

            <input
              type="date"
              value={loginData.assoc_nasc}
              onChange={(e) =>
                setLoginData({ ...loginData, assoc_nasc: e.target.value })
              }
              required
              className="w-full border rounded-xl p-3"
            />

            {erro && (
              <div className="bg-red-50 text-red-700 text-sm font-bold p-3 rounded-xl">
                {erro}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-700 hover:bg-blue-800 disabled:opacity-60 text-white font-black py-3 rounded-xl"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        </section>
      </main>
    );
  }

  if (!dados) {
    return (
      <div className="min-h-screen p-20 text-center font-bold">
        Carregando dados do cliente...
      </div>
    );
  }

  const associado = dados.associado || {};
  const vendas = dados.vendas || [];
  const titulares = dados.titulares || [];

  const totalMensal = vendas.reduce(
    (acc: number, v: any) => acc + Number(v.vl_total || 0),
    0
  );

  const totalPago = vendas.reduce(
    (acc: number, v: any) => acc + Number(v.total_pago || 0),
    0
  );

  return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-8">
      <section className="max-w-6xl mx-auto">
        <div className="flex justify-between items-start mb-8">
          <div>
            <p className="text-sm font-bold text-blue-700">
              Área exclusiva do associado
            </p>

            <h1 className="text-3xl font-black text-gray-900">
              Olá, {associado.assoc_nome || 'Associado'}
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              CPF responsável: <strong>{associado.assoc_cpf}</strong>
            </p>
          </div>

          <button
            onClick={() => {
              localStorage.removeItem('assoc_cpf');
              window.location.href = '/';
            }}
            className="text-sm text-red-600 underline"
          >
            Sair
          </button>
        </div>

        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card titulo="Contratos" valor={vendas.length} />
          <Card titulo="Titulares" valor={titulares.length} />
          <Card titulo="Mensalidade atual" valor={dinheiro(totalMensal)} destaque />
          <Card titulo="Total já pago" valor={dinheiro(totalPago)} />
        </div>

        <div className="bg-white border rounded-2xl shadow-sm p-6 mb-8">
          <h2 className="text-xl font-black mb-4">Meus contratos</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-100 text-left">
                  <th className="p-3 border">Contrato</th>
                  <th className="p-3 border">Plano</th>
                  <th className="p-3 border">Individuais</th>
                  <th className="p-3 border">Familiares</th>
                  <th className="p-3 border">Valor</th>
                  <th className="p-3 border">Vencimento</th>
                  <th className="p-3 border">Status</th>
                </tr>
              </thead>

              <tbody>
                {vendas.map((v: any, i: number) => (
                  <tr key={i}>
                    <td className="p-3 border">{v.num_contrato || '-'}</td>
                    <td className="p-3 border">{v.tipo_plano || '-'}</td>
                    <td className="p-3 border">{v.tit_ind || 0}</td>
                    <td className="p-3 border">{v.tit_fam || 0}</td>
                    <td className="p-3 border">{dinheiro(v.vl_total)}</td>
                    <td className="p-3 border">{v.dt_vencimento || '-'}</td>
                    <td className="p-3 border">{v.status_venda || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white border rounded-2xl shadow-sm p-6">
          <h2 className="text-xl font-black mb-4">Titulares vinculados</h2>

          <div className="space-y-4">
            {titulares.map((t: any, i: number) => (
              <div
                key={i}
                className="border border-slate-200 rounded-xl p-4 bg-slate-50"
              >
                <div className="flex justify-between gap-4">
                  <div>
                    <h3 className="font-black text-gray-900">
                      {t.tit_nome}
                    </h3>

                    <p className="text-sm text-gray-500">
                      {descricaoPlano(t.cod_plano)}
                    </p>

                    <p className="text-sm text-gray-500">
                      CPF: {t.tit_cpf} • Nascimento: {t.tit_nasc || '-'}
                    </p>

                    <p className="text-sm text-gray-500">
                      E-mail: {t.tit_email || '-'} • Tel: {t.tit_tel || '-'}
                    </p>

                    <p className="text-sm font-bold mt-1">
                      Status: {t.status_titular || '-'}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => abrirEdicao(t)}
                    className="h-fit bg-blue-700 text-white px-4 py-2 rounded-lg font-bold text-sm"
                  >
                    Editar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {editando && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-lg">
              <h2 className="text-xl font-black mb-4">
                Editar titular
              </h2>

              <div className="space-y-3">
                <input type="text" value={editData.tit_nome} onChange={(e) => setEditData({ ...editData, tit_nome: e.target.value })} className="w-full border rounded-lg p-3" placeholder="Nome" />
                <input type="text" value={editData.tit_cpf} onChange={(e) => setEditData({ ...editData, tit_cpf: e.target.value })} className="w-full border rounded-lg p-3" placeholder="CPF" />
                <input type="date" value={editData.tit_nasc} onChange={(e) => setEditData({ ...editData, tit_nasc: e.target.value })} className="w-full border rounded-lg p-3" />
                <input type="email" value={editData.tit_email} onChange={(e) => setEditData({ ...editData, tit_email: e.target.value })} className="w-full border rounded-lg p-3" placeholder="E-mail" />
                <input type="tel" value={editData.tit_tel} onChange={(e) => setEditData({ ...editData, tit_tel: e.target.value })} className="w-full border rounded-lg p-3" placeholder="Telefone" />

                {erro && (
                  <div className="bg-red-50 text-red-700 text-sm font-bold p-3 rounded-xl">
                    {erro}
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={salvarTitular}
                    disabled={loading}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold disabled:opacity-60"
                  >
                    {loading ? 'Salvando...' : 'Salvar'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditando(null)}
                    className="bg-slate-200 text-slate-700 px-4 py-2 rounded-lg font-bold"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

function Card({ titulo, valor, destaque = false }: any) {
  return (
    <div className="bg-white border rounded-2xl shadow-sm p-5">
      <p className="text-sm text-gray-500">{titulo}</p>
      <p className={`text-2xl font-black mt-2 ${destaque ? 'text-blue-700' : ''}`}>
        {valor}
      </p>
    </div>
  );
}