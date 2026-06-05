export function ClienteDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm p-10 border border-gray-200">
        <h1 className="text-3xl font-extrabold text-blue-900 mb-6">
          Olá, Associado!
        </h1>
        <p className="text-gray-600 mb-4">
          Bem-vindo à sua área exclusiva.
        </p>
        <div className="p-6 bg-green-50 rounded-xl border border-green-100 text-green-800">
          <p className="font-semibold">O sistema identificou seu CPF e você está logado com sucesso.</p>
        </div>
      </div>
    </div>
  );
}