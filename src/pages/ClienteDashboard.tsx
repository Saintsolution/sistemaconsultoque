import { useState } from 'react';
import axios from 'axios';

const WEBHOOK_LOGIN_CLIENTE = 'https://n8n.saintsolution.com.br/webhook/login-cliente';
const WEBHOOK_EDITA_TITULAR = 'https://n8n.saintsolution.com.br/webhook/edita-titular';

export function ClienteDashboard() {
  const [logado, setLogado] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  
  const [loginData, setLoginData] = useState({ assoc_cpf: '', assoc_nasc: '' });
  const [dados, setDados] = useState<any[]>([]);
  
  const [editando, setEditando] = useState<any>(null);
  const [editData, setEditData] = useState({ tit_nome: '', tit_email: '', tit_tel: '' });

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErro('');
    try {
      const response = await axios.post(WEBHOOK_LOGIN_CLIENTE, {
        assoc_cpf: loginData.assoc_cpf.replace(/\D/g, ''),
        assoc_nasc: loginData.assoc_nasc
      }, { timeout: 15000 });

      // LOG PARA DEBUGAR
      console.log("Resposta recebida:", response.data);

      // Lógica robusta para capturar o array de dados independentemente de como o n8n entrega
      const resposta = Array.isArray(response.data) ? response.data : [response.data];
      const itemEncontrado = resposta.find((i: any) => i.data || i.num_contrato);
      const listaContratos = itemEncontrado?.data || (itemEncontrado?.num_contrato ? resposta : null);

      if (listaContratos && listaContratos.length > 0) {
        setDados(listaContratos);
        setLogado(true);
      } else {
        setErro('CPF ou nascimento não localizado.');
      }
    } catch (e) {
      setErro('Erro de conexão com o sistema.');
    } finally {
      setLoading(false);
    }
  }

  async function salvarTitular() {
    setLoading(true);
    try {
      await axios.post(WEBHOOK_EDITA_TITULAR, {
        num_contrato: editando.num_contrato,
        ...editData
      });
      setDados(dados.map(d => d.num_contrato === editando.num_contrato ? { ...d, ...editData } : d));
      setEditando(null);
      alert('Atualizado com sucesso!');
    } catch (e) {
      alert('Erro ao salvar.');
    } finally {
      setLoading(false);
    }
  }

  if (!logado) {
    return (
      <main className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <section className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-8">
          <a href="/" className="text-blue-600 font-bold mb-4 block underline">← Voltar ao site</a>
          <h1 className="text-2xl font-black text-blue-900 text-center mb-6">Área do Cliente</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="text" placeholder="CPF do responsável" value={loginData.assoc_cpf} onChange={(e) => setLoginData({...loginData, assoc_cpf: e.target.value})} className="w-full border rounded-xl p-3" required />
            <input type="text" placeholder="DD-MM-AAAA" value={loginData.assoc_nasc} onChange={(e) => setLoginData({...loginData, assoc_nasc: e.target.value})} className="w-full border rounded-xl p-3" required />
            {erro && <p className="text-red-600 font-bold text-sm">{erro}</p>}
            <button className="w-full bg-blue-700 text-white font-black py-3 rounded-xl">{loading ? 'Entrando...' : 'Entrar'}</button>
          </form>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between mb-8">
          <h1 className="text-2xl font-black">Minha Central de Gestão</h1>
          <button onClick={() => window.location.reload()} className="text-red-600 underline text-sm">Sair</button>
        </div>
        <div className="grid gap-4">
          {dados.map((d, i) => (
            <div key={i} className="bg-white p-6 rounded-xl border shadow-sm flex justify-between items-center">
              <div>
                <p className="font-black">Contrato: {d.num_contrato} - {d.tit_nome}</p>
                <p className="text-sm text-gray-500">Email: {d.tit_email} | Tel: {d.tit_tel}</p>
                <p className={`font-bold text-xs ${d.status_titular === 'ativo' ? 'text-green-600' : 'text-red-600'}`}>STATUS: {d.status_titular?.toUpperCase()}</p>
              </div>
              <button onClick={() => { setEditando(d); setEditData({ tit_nome: d.tit_nome, tit_email: d.tit_email, tit_tel: d.tit_tel }); }} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold">Editar</button>
            </div>
          ))}
        </div>
      </div>
      {editando && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-2xl w-full max-w-sm space-y-3">
            <h2 className="font-black">Editar Dados</h2>
            <input type="text" value={editData.tit_nome} onChange={(e) => setEditData({...editData, tit_nome: e.target.value})} className="w-full border p-2 rounded" />
            <input type="email" value={editData.tit_email} onChange={(e) => setEditData({...editData, tit_email: e.target.value})} className="w-full border p-2 rounded" />
            <input type="text" value={editData.tit_tel} onChange={(e) => setEditData({...editData, tit_tel: e.target.value})} className="w-full border p-2 rounded" />
            <div className="flex gap-2">
              <button onClick={salvarTitular} className="flex-1 bg-green-600 text-white p-2 rounded">Salvar</button>
              <button onClick={() => setEditando(null)} className="flex-1 bg-gray-200 p-2 rounded">Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}