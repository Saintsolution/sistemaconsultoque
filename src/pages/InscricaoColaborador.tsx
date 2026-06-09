import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export function InscricaoColaborador() {
  const [refId, setRefId] = useState('0001');
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    nome_colab: '',
    email_colab: '',
    tel_colab: '',
    cpf_colab: '',
    pix_colab: '',
    senha_login: '',
  });

  useEffect(() => {
    const savedRef = localStorage.getItem('referenciador_id');
    if (savedRef) {
      setRefId(savedRef.padStart(4, '0'));
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      cod_pai: refId || '0001',
      nome_colab: formData.nome_colab,
      email_colab: formData.email_colab,
      tel_colab: formData.tel_colab,
      cpf_colab: formData.cpf_colab,
      pix_colab: formData.pix_colab,
      senha_login: formData.senha_login,
      dt_cad: new Date().toLocaleDateString('pt-BR'),
    };

    console.log('Payload colaborador:', payload);

    try {
      const response = await fetch('https://n8n.saintsolution.com.br/webhook/insertcolab', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert('Cadastro enviado com sucesso!');

        setFormData({
          nome_colab: '',
          email_colab: '',
          tel_colab: '',
          cpf_colab: '',
          pix_colab: '',
          senha_login: '',
        });
      } else {
        alert('Erro ao enviar cadastro. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao cadastrar colaborador:', error);
      alert('Falha na conexão.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
        <Link to="/seja-afiliado" className="text-blue-600 font-bold">
          ← Voltar
        </Link>

        <h1 className="text-2xl font-black mt-6 mb-2">
          Cadastro de Colaborador
        </h1>

      

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="nome_colab"
            value={formData.nome_colab}
            onChange={handleInputChange}
            placeholder="Nome completo"
            className="w-full p-3 border rounded-xl"
            required
          />

          <input
            name="email_colab"
            type="email"
            value={formData.email_colab}
            onChange={handleInputChange}
            placeholder="E-mail"
            className="w-full p-3 border rounded-xl"
            required
          />

          <input
            name="tel_colab"
            type="tel"
            value={formData.tel_colab}
            onChange={handleInputChange}
            placeholder="Telefone (DDD + número)"
            className="w-full p-3 border rounded-xl"
            required
          />

          <input
            name="cpf_colab"
            value={formData.cpf_colab}
            onChange={handleInputChange}
            placeholder="CPF"
            className="w-full p-3 border rounded-xl"
            required
          />

          <input
            name="pix_colab"
            value={formData.pix_colab}
            onChange={handleInputChange}
            placeholder="Chave PIX"
            className="w-full p-3 border rounded-xl"
            required
          />

          <input
            name="senha_login"
            type="password"
            value={formData.senha_login}
            onChange={handleInputChange}
            placeholder="Crie uma senha de acesso"
            className="w-full p-3 border rounded-xl"
            required
          />

          <button
            disabled={loading}
            className={`w-full text-white py-4 rounded-xl font-bold ${
              loading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {loading ? 'Enviando...' : 'Confirmar Inscrição'}
          </button>
        </form>
      </div>
    </div>
  );
}