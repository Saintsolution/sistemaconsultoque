import { useState, useEffect } from 'react';
import axios from 'axios';

function formatId(value: any) {
  if (value === null || value === undefined || value === '') return '';
  return String(value).replace(/\D/g, '').padStart(4, '0');
}

function dinheiro(valor: any) {
  return Number(valor || 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

function parseDataBR(data: string) {
  if (!data) return null;
  const [dia, mes, ano] = data.split('/');
  return new Date(Number(ano), Number(mes) - 1, Number(dia));
}

function formatarData(data: Date | null) {
  if (!data) return '-';
  return data.toLocaleDateString('pt-BR');
}

function proximoVencimento(dataVenda: string) {
  const data = parseDataBR(dataVenda);
  if (!data) return '-';

  const hoje = new Date();
  let venc = new Date(data);

  while (venc < hoje) {
    venc.setMonth(venc.getMonth() + 1);
  }

  return formatarData(venc);
}

export function ColaboradorDashboard() {
  const [logado, setLogado] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ cpf: '', senha: '' });
  const [dados, setDados] = useState<any>(null);
  const [aberto, setAberto] = useState<string | null>('vendas');

  useEffect(() => {
    const id = localStorage.getItem('colaborador_id');

    if (id) {
      setLogado(true);
      buscarDados(id);
    }
  }, []);

  const buscarDados = async (id: string) => {
    setLoading(true);

    try {
      const response = await axios.post(
        'https://n8n.saintsolution.com.br/webhook/get-dados-colaborador',
        { id_colab: formatId(id) },
        { timeout: 15000 }
      );

      const payload = Array.isArray(response.data)
        ? response.data[0]
        : response.data;

      setDados(payload);
    } catch (e) {
      console.error(e);
      alert('Erro ao buscar dados do dashboard.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    setLoading(true);

    try {
      const response = await axios.post(
        'https://n8n.saintsolution.com.br/webhook/2f881232-b395-4241-be00-1dbf6573118a',
        formData,
        { timeout: 15000 }
      );

      if (response.data.status === 'sucesso') {
        const idFormatado = formatId(response.data.id);

        localStorage.setItem('colaborador_id', idFormatado);
        localStorage.setItem('colaborador_nome', response.data.nome || '');

        setLogado(true);
        await buscarDados(idFormatado);
      } else {
        alert('CPF ou senha incorretos.');
      }
    } catch (e) {
      console.error(e);
      alert('Erro de conexão.');
    } finally {
      setLoading(false);
    }
  };

  if (!logado) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
        <div className="p-8 bg-white rounded-2xl shadow-xl w-full max-w-sm">
          <h2 className="text-xl font-bold mb-6 text-center">Acesso Consultor</h2>

          <input
            className="w-full p-3 mb-4 border rounded-lg"
            placeholder="CPF"
            value={formData.cpf}
            onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
          />

          <input
            className="w-full p-3 mb-6 border rounded-lg"
            type="password"
            placeholder="Senha"
            value={formData.senha}
            onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
          />

          <button
            className={`w-full p-3 font-bold rounded-lg text-white ${
              loading ? 'bg-gray-400' : 'bg-blue-700'
            }`}
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? 'Validando...' : 'Entrar'}
          </button>
        </div>
      </div>
    );
  }

  if (!dados) {
    return (
      <div className="p-20 text-center font-bold">
        {loading ? 'Carregando seus dados...' : 'Nenhum dado carregado.'}
      </div>
    );
  }

  const idLogado = formatId(dados.idLogado);
  const vendas = dados.vendas || [];
  const beneficiarios = dados.beneficiarios || [];
  const colaboradores = dados.colaboradores || [];

  const vendasPessoais = vendas.filter(
    (v: any) => formatId(v.id_indicador) === idLogado
  );

  const vendasRede = vendas.filter(
    (v: any) => formatId(v.id_indicador) !== idLogado
  );

  const valorTotalVendas = vendas.reduce(
    (acc: number, v: any) => acc + Number(v.valor_mensalidade || 0),
    0
  );

  const valorVendasPessoais = vendasPessoais.reduce(
    (acc: number, v: any) => acc + Number(v.valor_mensalidade || 0),
    0
  );

  const comissaoDireta = vendasPessoais.reduce(
    (acc: number, v: any) => acc + Number(v.valor_mensalidade || 0) * 0.5,
    0
  );

  const comissaoRede = vendasRede.reduce(
    (acc: number, v: any) => acc + Number(v.valor_mensalidade || 0) * 0.05,
    0
  );

  const comissaoTotal = comissaoDireta + comissaoRede;

  const Toggle = ({ id, titulo, children }: any) => (
    <div className="bg-white rounded-xl shadow border border-slate-200 mb-6 overflow-hidden">
      <button
        onClick={() => setAberto(aberto === id ? null : id)}
        className="w-full flex justify-between items-center p-6 text-left"
      >
        <h2 className="text-xl font-bold">{titulo}</h2>
        <span className="text-2xl">{aberto === id ? '−' : '+'}</span>
      </button>

      {aberto === id && <div className="px-6 pb-6">{children}</div>}
    </div>
  );

  return (
    <div className="min-h-screen p-8 bg-slate-50">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-black">
            Olá, {localStorage.getItem('colaborador_nome')}
          </h1>
          <p className="text-sm text-slate-500">ID: {idLogado}</p>
        </div>

        <button
          className="text-sm text-red-600 underline"
          onClick={() => {
            localStorage.clear();
            window.location.reload();
          }}
        >
          Sair
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <Card titulo="Vendas Realizadas" valor={vendas.length} />
        <Card titulo="Beneficiários" valor={beneficiarios.length} />
        <Card titulo="Colaboradores na Rede" valor={colaboradores.length} />
        <Card titulo="Comissão Estimada" valor={dinheiro(comissaoTotal)} destaque />
      </div>

      <Toggle id="vendas" titulo="Vendas realizadas">
        <Tabela
          colunas={['OS', 'Cliente', 'CPF pagador', 'Telefone', 'Plano', 'Vencimento', 'Valor']}
          linhas={vendas.map((v: any) => [
            v.os,
            v.cliente_nome,
            v.cpf,
            v.telefone_cliente,
            v.cod_plano,
            proximoVencimento(v.data),
            dinheiro(v.valor_mensalidade),
          ])}
        />
      </Toggle>

      <Toggle id="beneficiarios" titulo="Beneficiários vinculados">
        <Tabela
          colunas={['Registro', 'Beneficiário', 'CPF Beneficiário', 'CPF Responsável', 'E-mail', 'Telefone', 'Status']}
          linhas={beneficiarios.map((b: any) => [
            b.num_registro,
            b.nome_benef,
            b.cpf_benef,
            b.cpf_responsavel,
            b['e-mail'],
            b.telefone,
            b.status,
          ])}
        />
      </Toggle>

      <Toggle id="rede" titulo="Colaboradores na rede">
        <Tabela
          colunas={['ID', 'Nome', 'E-mail', 'Telefone', 'ID Pai', 'CPF']}
          linhas={colaboradores.map((c: any) => [
            formatId(c.id_indicador),
            c.nome_colab,
            c.email_colab,
            c.telefone_colab,
            formatId(c.id_pai),
            c.cpf,
          ])}
        />
      </Toggle>

      <Toggle id="comissoes" titulo="Comissões e valores">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card titulo="Valor total em vendas" valor={dinheiro(valorTotalVendas)} />
          <Card titulo="Vendas pessoais" valor={dinheiro(valorVendasPessoais)} />
          <Card titulo="Comissão direta" valor={dinheiro(comissaoDireta)} />
          <Card titulo="Comissão da rede" valor={dinheiro(comissaoRede)} />
        </div>

        <Tabela
          colunas={['Cliente', 'ID Indicador', 'Tipo', 'Valor venda', 'Comissão']}
          linhas={vendas.map((v: any) => {
            const propria = formatId(v.id_indicador) === idLogado;
            const valor = Number(v.valor_mensalidade || 0);
            const comissao = propria ? valor * 0.5 : valor * 0.05;

            return [
              v.cliente_nome,
              formatId(v.id_indicador),
              propria ? 'Venda pessoal 50%' : 'Rede 5%',
              dinheiro(valor),
              dinheiro(comissao),
            ];
          })}
        />
      </Toggle>
    </div>
  );
}

function Card({ titulo, valor, destaque = false }: any) {
  return (
    <div className="p-6 bg-white rounded-xl shadow border border-slate-200">
      <p className="text-slate-500 text-sm">{titulo}</p>
      <p className={`text-3xl font-bold mt-2 ${destaque ? 'text-blue-700' : ''}`}>
        {valor}
      </p>
    </div>
  );
}

function Tabela({ colunas, linhas }: any) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-slate-100 text-left">
            {colunas.map((c: string, i: number) => (
              <th key={i} className="p-3 border">
                {c}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {linhas.length > 0 ? (
            linhas.map((linha: any[], i: number) => (
              <tr key={i}>
                {linha.map((celula: any, j: number) => (
                  <td key={j} className="p-3 border">
                    {celula || '-'}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td className="p-3 border text-center" colSpan={colunas.length}>
                Nenhum registro encontrado.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}