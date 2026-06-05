import { Routes, Route } from 'react-router-dom';
import { ScrollToTop } from './components/ScrollToTop';

// Páginas Principais
import { Home } from './pages/Home';
import { SejaAfiliado } from './pages/SejaAfiliado';

// Módulos de Acesso (Unificado)
import { Login } from './pages/Login'; // Você precisa criar esta página de login com CPF
import { AdminAsaas } from './pages/AdminAsaas';
import { ColaboradorDashboard } from './pages/ColaboradorDashboard';
import { EmpresaDashboard } from './pages/EmpresaDashboard';
import { ClienteDashboard } from './pages/ClienteDashboard';

// Funis de Vídeo
import { Play } from './pages/Play';
import { VideoAfiliados } from './pages/VideoAfiliados';

// Conformidade
import { FAQ } from './pages/FAQ';
import { Termos } from './pages/Termos';
import { Privacidade } from './pages/Privacidade';

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        
        {/* Fluxo de Acesso Unificado */}
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminAsaas />} />
        <Route path="/colaborador" element={<ColaboradorDashboard />} />
        <Route path="/empresa" element={<EmpresaDashboard />} />
        <Route path="/cliente" element={<ClienteDashboard />} />
        
        <Route path="/seja-afiliado" element={<SejaAfiliado />} />
        
        {/* Funis */}
        <Route path="/play" element={<Play />} />
        <Route path="/videoafiliados" element={<VideoAfiliados />} />
        
        {/* Conformidade */}
        <Route path="/faq" element={<FAQ />} />
        <Route path="/termos" element={<Termos />} />
        <Route path="/privacidade" element={<Privacidade />} />
      </Routes>
    </>
  );
}