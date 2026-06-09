import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ScrollToTop } from './components/ScrollToTop';

// Páginas Principais
import { Home } from './pages/Home';
import Formulario from './pages/Formulario';
import { SejaAfiliado } from './pages/SejaAfiliado';
import { InscricaoColaborador } from './pages/InscricaoColaborador';
import { Login } from './pages/Login';
import { AdminAsaas } from './pages/AdminAsaas';
import { ColaboradorDashboard } from './pages/ColaboradorDashboard';
import { EmpresaDashboard } from './pages/EmpresaDashboard';
import { ClienteDashboard } from './pages/ClienteDashboard';
import { Play } from './pages/Play';
import { VideoAfiliados } from './pages/VideoAfiliados';
import { FAQ } from './pages/FAQ';
import { Termos } from './pages/Termos';
import { Privacidade } from './pages/Privacidade';

export default function App() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const refParam = params.get('ref');
    const path = window.location.pathname.substring(1);

    const rotasExistentes = [
      'login',
      'admin',
      'seja-afiliado',
      'play',
      'faq',
      'termos',
      'privacidade',
      'colaborador',
      'empresa',
      'cliente',
      'inscricao',
      'inscricao-colaborador',
      'videoafiliados',
    ];

    const isRefPath = path && !isNaN(Number(path)) && !rotasExistentes.includes(path);
    const finalRef = refParam || (isRefPath ? path : null);

    if (finalRef) {
      const refFormatado = finalRef.padStart(4, '0');
      localStorage.setItem('referenciador_id', refFormatado);

      if (isRefPath) {
        window.history.replaceState({}, '', '/');
      }
    }
  }, []);

  return (
    <>
      <ScrollToTop />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/inscricao" element={<Formulario />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminAsaas />} />
        <Route path="/colaborador" element={<ColaboradorDashboard />} />
        <Route path="/empresa" element={<EmpresaDashboard />} />
        <Route path="/cliente" element={<ClienteDashboard />} />
        <Route path="/seja-afiliado" element={<SejaAfiliado />} />
        <Route path="/inscricao-colaborador" element={<InscricaoColaborador />} />
        <Route path="/play" element={<Play />} />
        <Route path="/videoafiliados" element={<VideoAfiliados />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/termos" element={<Termos />} />
        <Route path="/privacidade" element={<Privacidade />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </>
  );
}