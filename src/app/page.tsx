'use client';
import { useEffect, useState } from 'react';
import LandingPage from '@/components/LandingPage';
import DashboardPage from '@/components/DashboardPage';
import CreateOrganizationPage from '@/components/CreateOrganizationPage';
import { authService } from '@/lib/supabase';

export default function Home() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Verificar si hay un usuario autenticado
        const currentUser = await authService.getCurrentUser();
        
        // Verificar el hash de la URL
        const hash = window.location.hash;
        const validDashboardHashes = ['#dashboard', '#organizaciones', '#concepto-creativo', '#pacientes'];
        const isDashboardRoute = validDashboardHashes.some(validHash => hash === validHash || hash.startsWith(validHash));
        
        // Verificar si es la ruta de crear organización
        const isCreateOrgRoute = hash === '#create-organization' || window.location.pathname === '/create-organization';
        
        if (isCreateOrgRoute && currentUser) {
          setCurrentPage('create-organization');
        } else if (isDashboardRoute && currentUser) {
          setCurrentPage('dashboard');
          // Limpiar parámetros de autenticación de la URL si existen
          if (hash.includes('#access_token=') || hash.includes('&')) {
            window.history.replaceState(null, '', window.location.pathname + '#dashboard');
          }
        } else if ((isDashboardRoute || isCreateOrgRoute) && !currentUser) {
          // Si intenta acceder al dashboard o crear organización sin estar autenticado, redirigir al landing
          window.history.replaceState(null, '', window.location.pathname);
          setCurrentPage('landing');
        } else {
          // Por defecto mostrar landing page
          setCurrentPage('landing');
        }
      } catch (error) {
        console.error('Error al inicializar la aplicación:', error);
        setCurrentPage('landing');
      } finally {
        setIsLoading(false);
      }
    };

    const checkHash = () => {
      const hash = window.location.hash;
      const validDashboardHashes = ['#dashboard', '#organizaciones', '#concepto-creativo', '#pacientes'];
      const isDashboardRoute = validDashboardHashes.some(validHash => hash === validHash || hash.startsWith(validHash));
      const isCreateOrgRoute = hash === '#create-organization' || window.location.pathname === '/create-organization';
      
      if (isCreateOrgRoute) {
        // Verificar autenticación para crear organización
        authService.getCurrentUser().then(currentUser => {
          if (currentUser) {
            setCurrentPage('create-organization');
          } else {
            // Redirigir al landing si no está autenticado
            window.history.replaceState(null, '', window.location.pathname);
            setCurrentPage('landing');
          }
        });
      } else if (isDashboardRoute) {
        // Verificar autenticación para dashboard
        authService.getCurrentUser().then(currentUser => {
          if (currentUser) {
            setCurrentPage('dashboard');
          } else {
            // Redirigir al landing si no está autenticado
            window.history.replaceState(null, '', window.location.pathname);
            setCurrentPage('landing');
          }
        });
      } else {
        // Mostrar landing page por defecto
        setCurrentPage('landing');
      }
      
      // Limpiar parámetros de autenticación de la URL
      if (isDashboardRoute && (hash.includes('#access_token=') || hash.includes('&'))) {
        window.history.replaceState(null, '', window.location.pathname + '#dashboard');
      }
    };

    // Inicializar la aplicación
    initializeApp();

    // Escuchar cambios en el hash
    window.addEventListener('hashchange', checkHash);

    return () => {
      window.removeEventListener('hashchange', checkHash);
    };
  }, []);

  // Mostrar pantalla de carga
  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        <div style={{
          textAlign: 'center',
          color: '#64748b'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid #e2e8f0',
            borderTop: '3px solid #6366f1',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }}></div>
          <p>Cargando...</p>
          <style jsx>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  // Renderizar la página correspondiente
  switch (currentPage) {
    case 'dashboard':
      return <DashboardPage />;
    case 'create-organization':
      return <CreateOrganizationPage />;
    default:
      return <LandingPage />;
  }
}
