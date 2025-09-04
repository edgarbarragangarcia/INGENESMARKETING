'use client';
import { useEffect, useState } from 'react';
import { authService } from '@/lib/supabase';
import {
  MagicIcon,
  CalendarIcon,
  ChartIcon,
  UsersIcon,
  PaletteIcon,
  ShareIcon
} from './Icons';

function LandingPage() {
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Escuchar cambios de autenticación
  useEffect(() => {
    const { data: { subscription } } = authService.onAuthStateChange((user) => {
      if (user) {
        // Si el usuario se autentica exitosamente, guardar datos y redirigir al dashboard
        const userData = JSON.stringify({
          id: user.id,
          email: user.email,
          name: user.user_metadata?.name || 'Usuario',
          role: 'Usuario'
        });
        
        localStorage.setItem('userToken', user.id);
        localStorage.setItem('userData', userData);
        
        // Redirigir al dashboard después del login exitoso
        window.location.hash = 'dashboard';
        
        // Forzar recarga para asegurar que se muestre el dashboard
        setTimeout(() => {
          window.location.reload();
        }, 100);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLoginClick = () => {
    setShowLoginModal(true);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    
    if (email && password) {
      try {
        const { user, error } = await authService.signIn(email, password);
        
        if (error) {
          alert('Error de autenticación: ' + error.message);
          return;
        }
        
        if (user) {
          // Guardar datos del usuario en localStorage
          const userData = JSON.stringify({
            id: user.id,
            email: user.email,
            name: user.user_metadata?.name || 'Usuario',
            role: 'Usuario'
          });
          
          localStorage.setItem('userToken', user.id);
          localStorage.setItem('userData', userData);
          
          // Cerrar modal y ir al dashboard
          setShowLoginModal(false);
          
          // Forzar navegación al dashboard
          window.location.hash = 'dashboard';
          
          // Forzar recarga de la página para asegurar que se muestre el dashboard
          setTimeout(() => {
            window.location.reload();
          }, 100);
        }
      } catch (error) {
        console.error('Error en login:', error);
        alert('Error de conexión. Intenta nuevamente.');
      }
    }
  };

  const handleDashboardAccess = async () => {
    // Verificar si hay una sesión activa en Supabase
    const currentUser = await authService.getCurrentUser();
    
    if (currentUser) {
      // Si hay sesión activa, actualizar localStorage y ir al dashboard
      const userData = JSON.stringify({
        id: currentUser.id,
        email: currentUser.email,
        name: currentUser.user_metadata?.name || 'Usuario',
        role: 'Usuario'
      });
      
      localStorage.setItem('userToken', currentUser.id);
      localStorage.setItem('userData', userData);
      
      // Forzar navegación al dashboard
      window.location.hash = 'dashboard';
      
      // Forzar recarga de la página para asegurar que se muestre el dashboard
      setTimeout(() => {
        window.location.reload();
      }, 100);
    } else {
      // Si no hay sesión, mostrar modal de login
      setShowLoginModal(true);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await authService.signInWithGoogle();
      
      if (error) {
        console.error('Error en Google login:', error);
        alert('Error al iniciar sesión con Google: ' + error.message);
      }
      // El redirect se maneja automáticamente por Supabase
    } catch (error) {
      console.error('Error en Google login:', error);
      alert('Error de conexión. Intenta nuevamente.');
    }
  };

  return (
    <>
      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        :root {
          --primary-color: #6366f1;
          --primary-dark: #4f46e5;
          --secondary-color: #ec4899;
          --accent-color: #06b6d4;
          --text-primary: #1f2937;
          --text-secondary: #6b7280;
          --text-light: #9ca3af;
          --bg-primary: #ffffff;
          --bg-secondary: #f9fafb;
          --bg-dark: #111827;
          --border-color: #e5e7eb;
          --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
          --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
          --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
          --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1);
          --gradient-primary: linear-gradient(135deg, #6366f1 0%, #ec4899 100%);
          --gradient-secondary: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%);
          --border-radius: 12px;
          --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
          color: var(--text-primary);
          background-color: var(--bg-primary);
          overflow-x: hidden;
        }
        
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }
        
        .header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          background: linear-gradient(135deg, 
            rgba(255, 182, 193, 0.3) 0%,
            rgba(173, 216, 230, 0.3) 25%,
            rgba(221, 160, 221, 0.3) 50%,
            rgba(255, 218, 185, 0.3) 75%,
            rgba(240, 248, 255, 0.3) 100%);
          backdrop-filter: blur(15px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
          z-index: 1000;
          transition: var(--transition);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
        }
        
        .navbar {
          padding: 0;
        }
        
        .nav-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 60px;
        }
        
        .nav-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          font-weight: 700;
          color: var(--primary-color);
          text-decoration: none;
        }
        
        .nav-logo i {
          font-size: 24px;
        }
        
        .logo-text {
          display: flex;
          flex-direction: column;
          line-height: 1.2;
        }
        
        .logo-main {
          font-size: 18px;
          font-weight: 800;
          color: var(--primary-color);
        }
        
        .logo-sub {
          font-size: 10px;
          font-weight: 500;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .nav-auth {
          display: flex;
          gap: 1rem;
          align-items: center;
        }
        
        .btn-login {
          background: transparent;
          border: 1px solid var(--border-color);
          color: var(--text-primary);
          padding: 0.5rem 1rem;
          border-radius: var(--border-radius);
          font-weight: 500;
          font-size: 14px;
          cursor: pointer;
          transition: var(--transition);
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .btn-login:hover {
          border-color: var(--primary-color);
          color: var(--primary-color);
        }
        
        .btn-signup {
          background: var(--gradient-primary);
          border: none;
          color: white;
          padding: 0.5rem 1rem;
          border-radius: var(--border-radius);
          font-weight: 500;
          font-size: 14px;
          cursor: pointer;
          transition: var(--transition);
        }
        
        .btn-signup:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-lg);
        }
        
        .hero {
          padding: 120px 0 80px;
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          position: relative;
          overflow: hidden;
        }
        
        .hero-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
        }
        
        .hero-title {
          font-size: 3.5rem;
          font-weight: 800;
          line-height: 1.1;
          margin-bottom: 1.5rem;
          color: var(--text-primary);
        }
        
        .gradient-text {
          background: var(--gradient-primary);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .hero-description {
          font-size: 1.25rem;
          color: var(--text-secondary);
          margin-bottom: 2rem;
          line-height: 1.6;
        }
        
        .hero-buttons {
          display: flex;
          gap: 1rem;
          margin-bottom: 3rem;
        }
        
        .btn-primary {
          background: var(--gradient-primary);
          border: none;
          color: white;
          padding: 1rem 2rem;
          border-radius: var(--border-radius);
          font-weight: 600;
          cursor: pointer;
          transition: var(--transition);
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1.1rem;
        }
        
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-xl);
        }
        
        .btn-secondary {
          background: transparent;
          border: 2px solid var(--primary-color);
          color: var(--primary-color);
          padding: 1rem 2rem;
          border-radius: var(--border-radius);
          font-weight: 600;
          cursor: pointer;
          transition: var(--transition);
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1.1rem;
        }
        
        .btn-secondary:hover {
          background: var(--primary-color);
          color: white;
        }
        
        .hero-stats {
          display: flex;
          gap: 2rem;
        }
        
        .stat {
          text-align: center;
        }
        
        .stat-number {
          display: block;
          font-size: 2rem;
          font-weight: 700;
          color: var(--primary-color);
        }
        
        .stat-label {
          font-size: 0.9rem;
          color: var(--text-secondary);
        }
        
        .hero-mockup {
          position: relative;
          max-width: 500px;
          margin: 0 auto;
        }
        
        .mockup-screen {
          background: white;
          border-radius: 20px;
          padding: 20px;
          box-shadow: var(--shadow-xl);
          border: 1px solid var(--border-color);
          animation: phoneFloat 3s ease-in-out infinite;
          transform-origin: center;
        }
        
        @keyframes phoneFloat {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(1deg); }
        }
        
        .mockup-header {
          display: flex;
          align-items: center;
          margin-bottom: 20px;
        }
        
        .mockup-dots {
          display: flex;
          gap: 8px;
        }
        
        .mockup-dots span {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #ff5f57;
          animation: dotPulse 2s ease-in-out infinite;
        }
        
        .mockup-dots span:nth-child(2) {
          background: #ffbd2e;
          animation-delay: 0.3s;
        }
        
        .mockup-dots span:nth-child(3) {
          background: #28ca42;
          animation-delay: 0.6s;
        }
        
        @keyframes dotPulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.2); opacity: 0.8; }
        }
        
        .mockup-content {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        
        .mockup-card {
          background: #f8fafc;
          border-radius: 12px;
          padding: 15px;
          border: 1px solid #e2e8f0;
          animation: cardSlideUp 4s ease-in-out infinite;
          transform: translateY(0);
        }
        
        .mockup-card:nth-child(2) {
          animation-delay: 2s;
        }
        
        @keyframes cardSlideUp {
          0%, 90%, 100% { transform: translateY(0); opacity: 1; }
          10%, 80% { transform: translateY(-5px); opacity: 0.9; }
          50% { transform: translateY(-15px); opacity: 0.7; }
        }
        
        .card-header {
          font-weight: 600;
          margin-bottom: 10px;
          color: var(--text-primary);
          position: relative;
        }
        
        .card-header::after {
          content: '';
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          width: 20px;
          height: 20px;
          border: 2px solid #4ade80;
          border-top: 2px solid transparent;
          border-radius: 50%;
          animation: uploadSpin 1.5s linear infinite;
          opacity: 0;
        }
        
        .mockup-card:hover .card-header::after {
          opacity: 1;
        }
        
        @keyframes uploadSpin {
          0% { transform: translateY(-50%) rotate(0deg); }
          100% { transform: translateY(-50%) rotate(360deg); }
        }
        
        .card-image {
          width: 100%;
          height: 60px;
          background: linear-gradient(45deg, #667eea, #764ba2);
          border-radius: 8px;
          margin-bottom: 10px;
          position: relative;
          overflow: hidden;
        }
        
        .card-image::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
          animation: imageShimmer 3s ease-in-out infinite;
        }
        
        @keyframes imageShimmer {
          0% { left: -100%; }
          50%, 100% { left: 100%; }
        }
        
        .card-image::after {
          content: '📸';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 24px;
          animation: imageUpload 4s ease-in-out infinite;
        }
        
        @keyframes imageUpload {
          0%, 70%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.7; }
          35% { transform: translate(-50%, -70%) scale(1.2); opacity: 1; }
        }
        
        .card-text {
          height: 8px;
          background: #cbd5e1;
          border-radius: 4px;
          margin-bottom: 5px;
          position: relative;
          overflow: hidden;
        }
        
        .card-text::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          background: linear-gradient(90deg, #3b82f6, #8b5cf6);
          border-radius: 4px;
          animation: textProgress 5s ease-in-out infinite;
        }
        
        @keyframes textProgress {
          0% { width: 0%; }
          50% { width: 100%; }
          100% { width: 100%; }
        }
        
        .card-lines {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .line {
          height: 8px;
          background: #cbd5e1;
          border-radius: 4px;
          position: relative;
          overflow: hidden;
        }
        
        .line::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          background: linear-gradient(90deg, #10b981, #06b6d4);
          border-radius: 4px;
          animation: lineProgress 3s ease-in-out infinite;
        }
        
        .line:nth-child(1)::before { animation-delay: 0s; }
        .line:nth-child(2)::before { animation-delay: 0.5s; }
        .line:nth-child(3)::before { animation-delay: 1s; }
        
        @keyframes lineProgress {
          0% { width: 0%; }
          70% { width: 100%; }
          100% { width: 100%; }
        }
        
        .line.short {
          width: 60%;
        }
        
        .line.short::before {
          animation: lineProgressShort 3s ease-in-out infinite;
        }
        
        @keyframes lineProgressShort {
          0% { width: 0%; }
          70% { width: 100%; }
          100% { width: 100%; }
        }
        
        .mockup-screen:hover {
          animation-play-state: paused;
        }
        
        .mockup-screen:hover .mockup-card {
          animation-play-state: paused;
        }
        
        .features {
          padding: 80px 0;
          background: var(--bg-primary);
        }
        
        .section-header {
          text-align: center;
          margin-bottom: 4rem;
        }
        
        .section-header h2 {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
          color: var(--text-primary);
        }
        
        .section-header p {
          font-size: 1.25rem;
          color: var(--text-secondary);
        }
        
        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }
        
        .feature-card {
          background: white;
          padding: 2rem;
          border-radius: var(--border-radius);
          box-shadow: var(--shadow-md);
          transition: var(--transition);
          text-align: center;
        }
        
        .feature-card:hover {
          transform: translateY(-5px);
          box-shadow: var(--shadow-xl);
        }
        
        .feature-icon {
          width: 60px;
          height: 60px;
          background: var(--gradient-primary);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem;
          color: white;
          font-size: 1.5rem;
        }
        
        .feature-card h3 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 1rem;
          color: var(--text-primary);
        }
        
        .feature-card p {
          color: var(--text-secondary);
          line-height: 1.6;
        }
        
        .pricing {
          padding: 80px 0;
          background: var(--bg-secondary);
        }
        
        .pricing-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          margin-top: 3rem;
        }
        
        .pricing-card {
          background: white;
          border-radius: var(--border-radius);
          padding: 2rem;
          box-shadow: var(--shadow-md);
          transition: var(--transition);
          position: relative;
        }
        
        .pricing-card.featured {
          transform: scale(1.05);
          border: 2px solid var(--primary-color);
        }
        
        .pricing-badge {
          position: absolute;
          top: -10px;
          left: 50%;
          transform: translateX(-50%);
          background: var(--gradient-primary);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.9rem;
          font-weight: 600;
        }
        
        .pricing-header h3 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: var(--text-primary);
        }
        
        .pricing-price {
          font-size: 3rem;
          font-weight: 700;
          color: var(--primary-color);
          margin-bottom: 1rem;
        }
        
        .pricing-price span {
          font-size: 1rem;
          color: var(--text-secondary);
        }
        
        .pricing-features {
          list-style: none;
          margin-bottom: 2rem;
        }
        
        .pricing-features li {
          padding: 0.5rem 0;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .pricing-features li::before {
          content: '✓';
          color: var(--primary-color);
          font-weight: bold;
        }
        
        .cta {
          padding: 80px 0;
          background: var(--gradient-primary);
          color: white;
          text-align: center;
        }
        
        .cta h2 {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
        }
        
        .cta p {
          font-size: 1.25rem;
          margin-bottom: 2rem;
          opacity: 0.9;
        }
        
        .btn-cta {
          background: white;
          color: var(--primary-color);
          border: none;
          padding: 1rem 2rem;
          border-radius: var(--border-radius);
          font-weight: 600;
          cursor: pointer;
          transition: var(--transition);
          font-size: 1.1rem;
        }
        
        .btn-cta:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-xl);
        }
        
        .footer {
          background: var(--bg-dark);
          color: white;
          padding: 3rem 0 1rem;
        }
        
        .footer-content {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
          margin-bottom: 2rem;
        }
        
        .footer-section h3 {
          margin-bottom: 1rem;
          color: white;
        }
        
        .footer-section ul {
          list-style: none;
        }
        
        .footer-section ul li {
          margin-bottom: 0.5rem;
        }
        
        .footer-section ul li a {
          color: var(--text-light);
          text-decoration: none;
          transition: var(--transition);
        }
        
        .footer-section ul li a:hover {
          color: white;
        }
        
        .footer-bottom {
          border-top: 1px solid #374151;
          padding-top: 1rem;
          text-align: center;
          color: var(--text-light);
        }
        
        .modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
        }
        
        .modal-content {
          background: white;
          padding: 2rem;
          border-radius: var(--border-radius);
          width: 90%;
          max-width: 400px;
          position: relative;
        }
        
        .modal-close {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: var(--text-secondary);
        }
        
        .modal h2 {
          margin-bottom: 1.5rem;
          color: var(--text-primary);
        }
        
        .form-group {
          margin-bottom: 1rem;
        }
        
        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          color: var(--text-primary);
          font-weight: 500;
        }
        
        .form-group input {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius);
          font-size: 1rem;
        }
        
        .form-group input:focus {
          outline: none;
          border-color: var(--primary-color);
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        }
        
        .btn-submit {
          width: 100%;
          background: var(--gradient-primary);
          border: none;
          color: white;
          padding: 0.75rem;
          border-radius: var(--border-radius);
          font-weight: 600;
          cursor: pointer;
          transition: var(--transition);
          margin-bottom: 1rem;
        }
        
        .btn-submit:hover {
          transform: translateY(-1px);
          box-shadow: var(--shadow-md);
        }
        
        .divider {
          text-align: center;
          margin: 1rem 0;
          position: relative;
          color: var(--text-secondary);
        }
        
        .divider::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 1px;
          background: var(--border-color);
        }
        
        .divider span {
          background: white;
          padding: 0 1rem;
        }
        
        .btn-google {
          width: 100%;
          background: white;
          border: 1px solid var(--border-color);
          color: var(--text-primary);
          padding: 0.75rem;
          border-radius: var(--border-radius);
          font-weight: 500;
          cursor: pointer;
          transition: var(--transition);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }
        
        .btn-google:hover {
          background: var(--bg-secondary);
        }
        
        @media (max-width: 768px) {
          .hero-container {
            grid-template-columns: 1fr;
            text-align: center;
          }
          
          .hero-title {
            font-size: 2.5rem;
          }
          
          .hero-buttons {
            flex-direction: column;
            align-items: center;
          }
          
          .hero-stats {
            justify-content: center;
          }
          
          .nav-container {
            padding: 0 1rem;
          }
          
          .container {
            padding: 0 1rem;
          }
        }
      `}</style>
      
      <div className="header">
        <nav className="navbar">
          <div className="nav-container">
            <a href="#" className="nav-logo">
              <i className="fas fa-rocket"></i>
              <div className="logo-text">
                <span className="logo-main">INGENES</span>
                <span className="logo-sub">Marketing</span>
              </div>
            </a>
            
            <div className="nav-auth">
              <button className="btn-login" onClick={handleLoginClick}>
                <i className="fas fa-sign-in-alt"></i>
                Iniciar Sesión
              </button>
              <button className="btn-signup" onClick={handleDashboardAccess}>
                Dashboard
              </button>
            </div>
          </div>
        </nav>
      </div>
      
      <main>
        <section className="hero">
          <div className="hero-container">
            <div>
              <h1 className="hero-title">
                Crea contenido <span className="gradient-text">increíble</span> para tus redes sociales
              </h1>
              <p className="hero-description">
                Transforma tus ideas en contenido viral con nuestra plataforma de IA. 
                Diseña, programa y analiza todo desde un solo lugar.
              </p>
              <div className="hero-buttons">
                <button className="btn-primary" onClick={handleDashboardAccess}>
                  <i className="fas fa-play"></i>
                  Comenzar Gratis
                </button>
                <button className="btn-secondary">
                  <i className="fas fa-video"></i>
                  Ver Demo
                </button>
              </div>
              <div className="hero-stats">
                <div className="stat">
                  <span className="stat-number">10K+</span>
                  <span className="stat-label">Usuarios Activos</span>
                </div>
                <div className="stat">
                  <span className="stat-number">50K+</span>
                  <span className="stat-label">Posts Creados</span>
                </div>
                <div className="stat">
                  <span className="stat-number">98%</span>
                  <span className="stat-label">Satisfacción</span>
                </div>
              </div>
            </div>
            
            <div className="hero-mockup">
              <div className="mockup-screen">
                <div className="mockup-header">
                  <div className="mockup-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
                <div className="mockup-content">
                  <div className="mockup-card">
                    <div className="card-header">Creando post para Instagram</div>
                    <div className="card-image"></div>
                    <div className="card-lines">
                      <div className="line"></div>
                      <div className="line short"></div>
                      <div className="line"></div>
                    </div>
                  </div>
                  <div className="mockup-card">
                    <div className="card-header">Análisis de rendimiento</div>
                    <div className="card-text"></div>
                    <div className="card-lines">
                      <div className="line"></div>
                      <div className="line"></div>
                      <div className="line short"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section className="features">
          <div className="container">
            <div className="section-header">
              <h2>Todo lo que necesitas para triunfar</h2>
              <p>Herramientas poderosas diseñadas para creadores de contenido</p>
            </div>
            
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">
                  <MagicIcon />
                </div>
                <h3>IA Generativa</h3>
                <p>Crea contenido único y atractivo con nuestra inteligencia artificial avanzada. Desde textos hasta imágenes, todo automatizado.</p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">
                  <CalendarIcon />
                </div>
                <h3>Programación Inteligente</h3>
                <p>Programa tus publicaciones en el momento perfecto. Nuestro algoritmo encuentra los mejores horarios para tu audiencia.</p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">
                  <ChartIcon />
                </div>
                <h3>Analytics Avanzados</h3>
                <p>Obtén insights profundos sobre el rendimiento de tu contenido. Métricas detalladas y recomendaciones personalizadas.</p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">
                  <UsersIcon />
                </div>
                <h3>Colaboración en Equipo</h3>
                <p>Trabaja con tu equipo de manera eficiente. Roles, permisos y flujos de trabajo colaborativos.</p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">
                  <PaletteIcon />
                </div>
                <h3>Editor Visual</h3>
                <p>Diseña contenido profesional sin conocimientos técnicos. Editor drag & drop con plantillas premium.</p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">
                  <ShareIcon />
                </div>
                <h3>Multi-Plataforma</h3>
                <p>Publica en todas las redes sociales desde un solo lugar. Instagram, Facebook, Twitter, LinkedIn y más.</p>
              </div>
            </div>
          </div>
        </section>
        
        <section className="pricing">
          <div className="container">
            <div className="section-header">
              <h2>Planes que se adaptan a ti</h2>
              <p>Desde creadores individuales hasta grandes empresas</p>
            </div>
            
            <div className="pricing-grid">
              <div className="pricing-card">
                <div className="pricing-header">
                  <h3>Starter</h3>
                  <div className="pricing-price">
                    $9<span>/mes</span>
                  </div>
                </div>
                <ul className="pricing-features">
                  <li>5 cuentas de redes sociales</li>
                  <li>30 posts programados/mes</li>
                  <li>Analytics básicos</li>
                  <li>Plantillas premium</li>
                  <li>Soporte por email</li>
                </ul>
                <button className="btn-primary">Comenzar Prueba</button>
              </div>
              
              <div className="pricing-card featured">
                <div className="pricing-badge">Más Popular</div>
                <div className="pricing-header">
                  <h3>Professional</h3>
                  <div className="pricing-price">
                    $29<span>/mes</span>
                  </div>
                </div>
                <ul className="pricing-features">
                  <li>15 cuentas de redes sociales</li>
                  <li>100 posts programados/mes</li>
                  <li>Analytics avanzados</li>
                  <li>IA generativa ilimitada</li>
                  <li>Colaboración en equipo</li>
                  <li>Soporte prioritario</li>
                </ul>
                <button className="btn-primary">Comenzar Prueba</button>
              </div>
              
              <div className="pricing-card">
                <div className="pricing-header">
                  <h3>Enterprise</h3>
                  <div className="pricing-price">
                    $99<span>/mes</span>
                  </div>
                </div>
                <ul className="pricing-features">
                  <li>Cuentas ilimitadas</li>
                  <li>Posts ilimitados</li>
                  <li>Analytics personalizados</li>
                  <li>API access</li>
                  <li>Manager dedicado</li>
                  <li>Soporte 24/7</li>
                </ul>
                <button className="btn-primary">Contactar Ventas</button>
              </div>
            </div>
          </div>
        </section>
        
        <section className="cta">
          <div className="container">
            <h2>¿Listo para revolucionar tu contenido?</h2>
            <p>Únete a miles de creadores que ya están usando nuestra plataforma</p>
            <button className="btn-cta" onClick={handleDashboardAccess}>
              Comenzar Gratis Ahora
            </button>
          </div>
        </section>
      </main>
      
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>INGENES Marketing</h3>
              <p>La plataforma definitiva para creadores de contenido digital.</p>
            </div>
            
            <div className="footer-section">
              <h3>Producto</h3>
              <ul>
                <li><a href="#">Características</a></li>
                <li><a href="#">Precios</a></li>
                <li><a href="#">API</a></li>
                <li><a href="#">Integraciones</a></li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h3>Recursos</h3>
              <ul>
                <li><a href="#">Blog</a></li>
                <li><a href="#">Guías</a></li>
                <li><a href="#">Webinars</a></li>
                <li><a href="#">Comunidad</a></li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h3>Soporte</h3>
              <ul>
                <li><a href="#">Centro de Ayuda</a></li>
                <li><a href="#">Contacto</a></li>
                <li><a href="#">Estado del Sistema</a></li>
              </ul>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>&copy; 2024 INGENES Marketing. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
      
      {showLoginModal && (
        <div className="modal">
          <div className="modal-content">
            <button className="modal-close" onClick={() => setShowLoginModal(false)}>
              ×
            </button>
            <h2>Iniciar Sesión</h2>
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  placeholder="tu@email.com"
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Contraseña</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  required
                  placeholder="Tu contraseña"
                />
              </div>
              <button type="submit" className="btn-submit">
                Iniciar Sesión
              </button>
            </form>
            
            <div className="divider">
              <span>o</span>
            </div>
            
            <button className="btn-google" onClick={handleGoogleLogin}>
              <i className="fab fa-google"></i>
              Continuar con Google
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default LandingPage;