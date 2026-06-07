import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export function InscricaoColaborador() {
  const [refId, setRefId] = useState('0001');
  const [loading, setLoading] = useState(false);
  
  // Estado dos campos do formulário (incluindo a nova senha)
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    cpf: '',
    pix: '',
    senha: '' // Adicionado campo de senha
  });

  useEffect(() => {
    const savedRef = localStorage.getItem('referenciador_id');
    if (savedRef) setRefId(savedRef);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('https://n8n.saintsolution.com.br/webhook/18b5362e-2359-43d1-b14f-436286c2cc0b', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...formData, 
          id_pai: refId, 
          data: new Date().toISOString() 
        })
      });

      if (response.ok) {
        alert("Cadastro enviado com sucesso!");
        // Reseta o formulário incluindo a senha
        setFormData({ nome: '', email: '', telefone: '', cpf: '', pix: '', senha: '' });
      } else {
        alert("Erro ao enviar cadastro. Tente novamente.");
      }
    } catch (error) {
      alert("Falha na conexão.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
        <Link to="/seja-afiliado" className="text-blue-600 font-bold">← Voltar</Link>
        <h1 className="text-2xl font-black mt-6 mb-8">Cadastro de Colaborador</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="nome" value={formData.nome} onChange={handleInputChange} placeholder="Nome Completo" className="w-full p-3 border rounded-xl" required />
          <input name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="E-mail" className="w-full p-3 border rounded-xl" required />
          <input name="telefone" type="tel" value={formData.telefone} onChange={handleInputChange} placeholder="Telefone (DDD + Número)" className="w-full p-3 border rounded-xl" required />
          <input name="cpf" value={formData.cpf} onChange={handleInputChange} placeholder="CPF" className="w-full p-3 border rounded-xl" required />
          <input name="pix" value={formData.pix} onChange={handleInputChange} placeholder="Chave PIX" className="w-full p-3 border rounded-xl" required />
          
          {/* Campo de Senha adicionado */}
          <input 
            name="senha" 
            type="password" 
            value={formData.senha} 
            onChange={handleInputChange} 
            placeholder="Crie uma senha de acesso" 
            className="w-full p-3 border rounded-xl" 
            required 
          />
          
          <button 
            disabled={loading}
            className={`w-full text-white py-4 rounded-xl font-bold ${loading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'}`}
          >
            {loading ? 'Enviando...' : 'Confirmar Inscrição'}
          </button>
        </form>
      </div>
    </div>
  );
}