'use client';
import { useEffect, useState } from 'react';
import Dashboard from '@/components/Dashboard';

function LandingPage() {
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleLoginClick = () => {
    setShowLoginModal(true);
  };

  const handleDashboardAccess = () => {
    window.location.hash = 'dashboard';
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
          margin-bottom: 1rem;
          color: var(--text-primary);
        }
        
        .price {
          display: flex;
          align-items: baseline;
          margin-bottom: 2rem;
        }
        
        .currency {
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--text-secondary);
        }
        
        .amount {
          font-size: 3rem;
          font-weight: 700;
          color: var(--primary-color);
        }
        
        .period {
          font-size: 1rem;
          color: var(--text-secondary);
          margin-left: 0.5rem;
        }
        
        .pricing-features {
          list-style: none;
          margin-bottom: 2rem;
        }
        
        .pricing-features li {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.75rem;
          color: var(--text-secondary);
        }
        
        .pricing-features i {
          color: #10b981;
        }
        
        .btn-pricing {
          width: 100%;
          padding: 1rem;
          border: 2px solid var(--primary-color);
          background: transparent;
          color: var(--primary-color);
          border-radius: var(--border-radius);
          font-weight: 600;
          cursor: pointer;
          transition: var(--transition);
        }
        
        .btn-pricing.primary {
          background: var(--gradient-primary);
          color: white;
          border: none;
        }
        
        .btn-pricing:hover {
          background: var(--primary-color);
          color: white;
        }
        
        .cta {
          padding: 80px 0;
          background: var(--gradient-primary);
          color: white;
          text-align: center;
        }
        
        .cta-content h2 {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
        }
        
        .cta-content p {
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
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1.1rem;
        }
        
        .btn-cta:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-xl);
        }
        
        .cta-note {
          margin-top: 1rem;
          font-size: 0.9rem;
          opacity: 0.8;
        }
        
        .footer {
          background: var(--bg-dark);
          color: white;
          padding: 60px 0 20px;
        }
        
        .footer-content {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 3rem;
          margin-bottom: 3rem;
        }
        
        .footer-logo {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }
        
        .footer-section h4 {
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: 1rem;
        }
        
        .footer-section ul {
          list-style: none;
        }
        
        .footer-section li {
          margin-bottom: 0.5rem;
        }
        
        .footer-section a {
          color: #9ca3af;
          text-decoration: none;
          transition: var(--transition);
        }
        
        .footer-section a:hover {
          color: white;
        }
        
        .social-links {
          display: flex;
          gap: 1rem;
          margin-top: 1rem;
        }
        
        .social-links a {
          width: 40px;
          height: 40px;
          background: #374151;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          transition: var(--transition);
        }
        
        .social-links a:hover {
          background: var(--primary-color);
        }
        
        .footer-bottom {
          border-top: 1px solid #374151;
          padding-top: 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: #9ca3af;
        }
        
        .footer-links {
          display: flex;
          gap: 2rem;
        }
        
        .footer-links a {
          color: #9ca3af;
          text-decoration: none;
          transition: var(--transition);
        }
        
        .footer-links a:hover {
          color: white;
        }
        
        .modal {
          display: none;
          position: fixed;
          z-index: 2000;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(5px);
        }
        
        .modal.show {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .modal-content {
          background: white;
          border-radius: var(--border-radius);
          padding: 2rem;
          max-width: 400px;
          width: 90%;
          position: relative;
          box-shadow: var(--shadow-xl);
        }
        
        .close {
          position: absolute;
          top: 1rem;
          right: 1rem;
          font-size: 1.5rem;
          cursor: pointer;
          color: var(--text-secondary);
        }
        
        .modal-header {
          text-align: center;
          margin-bottom: 2rem;
        }
        
        .modal-header h2 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: var(--text-primary);
        }
        
        .form-group {
          margin-bottom: 1rem;
        }
        
        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: var(--text-primary);
        }
        
        .form-group input {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius);
          font-size: 1rem;
        }
        
        .form-actions {
          display: flex;
          gap: 1rem;
          margin-bottom: 1rem;
        }
        
        .divider {
          text-align: center;
          margin: 1.5rem 0;
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
          padding: 0.75rem;
          border: 1px solid var(--border-color);
          background: white;
          color: var(--text-primary);
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
          background: #f8fafc;
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
          
          .footer-content {
            grid-template-columns: 1fr;
            text-align: center;
          }
          
          .footer-bottom {
            flex-direction: column;
            gap: 1rem;
          }
        }
      `}</style>
      
      <div>
        {/* Header */}
        <header className="header">
          <nav className="navbar">
            <div className="nav-container">
              <div className="nav-logo">
                <i className="fas fa-rocket"></i>
                <div className="logo-text">
                  <span className="logo-main">IMC</span>
                  <span className="logo-sub">INGENES MARKETING CAMPAIGN</span>
                </div>
              </div>
              <div className="nav-auth">
                <button className="btn-login" onClick={handleLoginClick}>
                  <i className="fas fa-user"></i>
                  Iniciar Sesión
                </button>
                <button className="btn-signup" onClick={handleDashboardAccess}>Acceder al Dashboard</button>
              </div>
            </div>
          </nav>
        </header>

        {/* Hero Section */}
        <section className="hero">
          <div className="hero-container">
            <div className="hero-content">
              <h1 className="hero-title">
                Crea contenido de marketing
                <span className="gradient-text"> extraordinario</span>
                <br />en minutos
              </h1>
              <p className="hero-description">
                La plataforma todo-en-uno que necesitas para crear, gestionar y optimizar tu contenido de marketing digital. Desde posts para redes sociales hasta campañas completas.
              </p>
              <div className="hero-buttons">
                <button className="btn-primary" onClick={handleDashboardAccess}>
                  <i className="fab fa-google"></i>
                  Comenzar con Google
                </button>
                <button className="btn-secondary">
                  <i className="fas fa-play"></i>
                  Ver Demo
                </button>
              </div>
              <div className="hero-stats">
                <div className="stat">
                  <span className="stat-number">10K+</span>
                  <span className="stat-label">Usuarios activos</span>
                </div>
                <div className="stat">
                  <span className="stat-number">500K+</span>
                  <span className="stat-label">Contenidos creados</span>
                </div>
                <div className="stat">
                  <span className="stat-number">98%</span>
                  <span className="stat-label">Satisfacción</span>
                </div>
              </div>
            </div>
            <div className="hero-image">
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
                      <div className="card-header">📱 Post Instagram</div>
                      <div className="card-body">
                        <div className="card-image"></div>
                        <div className="card-text"></div>
                      </div>
                    </div>
                    <div className="mockup-card">
                      <div className="card-header">📧 Email Campaign</div>
                      <div className="card-body">
                        <div className="card-lines">
                          <div className="line"></div>
                          <div className="line short"></div>
                          <div className="line"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="features">
          <div className="container">
            <div className="section-header">
              <h2>Todo lo que necesitas para triunfar</h2>
              <p>Herramientas poderosas diseñadas para marketers modernos</p>
            </div>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="fas fa-magic"></i>
                </div>
                <h3>IA Generativa</h3>
                <p>Crea contenido único y atractivo con nuestra IA avanzada. Desde copys hasta imágenes personalizadas.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="fas fa-calendar-alt"></i>
                </div>
                <h3>Programación Automática</h3>
                <p>Programa tus publicaciones en todas las plataformas sociales desde un solo lugar.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="fas fa-chart-line"></i>
                </div>
                <h3>Analytics Avanzados</h3>
                <p>Mide el rendimiento de tu contenido con métricas detalladas y reportes automáticos.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="fas fa-users"></i>
                </div>
                <h3>Colaboración en Equipo</h3>
                <p>Trabaja en equipo con flujos de aprobación, comentarios y gestión de roles.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="fas fa-palette"></i>
                </div>
                <h3>Editor Visual</h3>
                <p>Diseña contenido profesional con nuestro editor drag & drop intuitivo.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="fas fa-mobile-alt"></i>
                </div>
                <h3>Multi-plataforma</h3>
                <p>Optimiza tu contenido automáticamente para cada red social y formato.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="pricing">
          <div className="container">
            <div className="section-header">
              <h2>Planes que se adaptan a ti</h2>
              <p>Desde freelancers hasta grandes empresas</p>
            </div>
            <div className="pricing-grid">
              <div className="pricing-card">
                <div className="pricing-header">
                  <h3>Starter</h3>
                  <div className="price">
                    <span className="currency">$</span>
                    <span className="amount">19</span>
                    <span className="period">/mes</span>
                  </div>
                </div>
                <ul className="pricing-features">
                  <li><i className="fas fa-check"></i> 50 posts por mes</li>
                  <li><i className="fas fa-check"></i> 3 redes sociales</li>
                  <li><i className="fas fa-check"></i> IA básica</li>
                  <li><i className="fas fa-check"></i> Analytics básicos</li>
                </ul>
                <button className="btn-pricing" onClick={handleDashboardAccess}>Comenzar gratis</button>
              </div>
              <div className="pricing-card featured">
                <div className="pricing-badge">Más popular</div>
                <div className="pricing-header">
                  <h3>Professional</h3>
                  <div className="price">
                    <span className="currency">$</span>
                    <span className="amount">49</span>
                    <span className="period">/mes</span>
                  </div>
                </div>
                <ul className="pricing-features">
                  <li><i className="fas fa-check"></i> Posts ilimitados</li>
                  <li><i className="fas fa-check"></i> Todas las redes sociales</li>
                  <li><i className="fas fa-check"></i> IA avanzada</li>
                  <li><i className="fas fa-check"></i> Analytics completos</li>
                  <li><i className="fas fa-check"></i> Colaboración en equipo</li>
                </ul>
                <button className="btn-pricing primary" onClick={handleDashboardAccess}>Comenzar ahora</button>
              </div>
              <div className="pricing-card">
                <div className="pricing-header">
                  <h3>Enterprise</h3>
                  <div className="price">
                    <span className="currency">$</span>
                    <span className="amount">99</span>
                    <span className="period">/mes</span>
                  </div>
                </div>
                <ul className="pricing-features">
                  <li><i className="fas fa-check"></i> Todo en Professional</li>
                  <li><i className="fas fa-check"></i> API personalizada</li>
                  <li><i className="fas fa-check"></i> Soporte prioritario</li>
                  <li><i className="fas fa-check"></i> Integraciones custom</li>
                  <li><i className="fas fa-check"></i> Manager dedicado</li>
                </ul>
                <button className="btn-pricing" onClick={handleLoginClick}>Contactar ventas</button>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta">
          <div className="container">
            <div className="cta-content">
              <h2>¿Listo para revolucionar tu marketing?</h2>
              <p>Únete a miles de marketers que ya están creando contenido extraordinario</p>
              <button className="btn-cta" onClick={handleDashboardAccess}>
                <i className="fab fa-google"></i>
                Comenzar gratis con Google
              </button>
              <p className="cta-note">No se requiere tarjeta de crédito • Configuración en 2 minutos</p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="footer">
          <div className="container">
            <div className="footer-content">
              <div className="footer-section">
                <div className="footer-logo">
                  <i className="fas fa-rocket"></i>
                  <div className="logo-text">
                    <span className="logo-main">IMC</span>
                    <span className="logo-sub">INGENES MARKETING CAMPAIGN</span>
                  </div>
                </div>
                <p>La plataforma de marketing digital que necesitas para hacer crecer tu negocio.</p>
                <div className="social-links">
                  <a href="#"><i className="fab fa-twitter"></i></a>
                  <a href="#"><i className="fab fa-linkedin"></i></a>
                  <a href="#"><i className="fab fa-instagram"></i></a>
                  <a href="#"><i className="fab fa-youtube"></i></a>
                </div>
              </div>
              <div className="footer-section">
                <h4>Producto</h4>
                <ul>
                  <li><a href="#">Características</a></li>
                  <li><a href="#">Precios</a></li>
                  <li><a href="#">Integraciones</a></li>
                  <li><a href="#">API</a></li>
                </ul>
              </div>
              <div className="footer-section">
                <h4>Recursos</h4>
                <ul>
                  <li><a href="#">Blog</a></li>
                  <li><a href="#">Guías</a></li>
                  <li><a href="#">Webinars</a></li>
                  <li><a href="#">Casos de éxito</a></li>
                </ul>
              </div>
              <div className="footer-section">
                <h4>Soporte</h4>
                <ul>
                  <li><a href="#">Centro de ayuda</a></li>
                  <li><a href="#">Contacto</a></li>
                  <li><a href="#">Estado del servicio</a></li>
                  <li><a href="#">Comunidad</a></li>
                </ul>
              </div>
            </div>
            <div className="footer-bottom">
              <p>&copy; 2024 IMC - INGENES Marketing Campaign. Todos los derechos reservados.</p>
              <div className="footer-links">
                <a href="#">Privacidad</a>
                <a href="#">Términos</a>
                <a href="#">Cookies</a>
              </div>
            </div>
          </div>
        </footer>

        {/* Login Modal */}
        {showLoginModal && (
          <div className="modal show">
            <div className="modal-content">
              <span className="close" onClick={() => setShowLoginModal(false)}>&times;</span>
              <div className="modal-header">
                <h2>Iniciar Sesión</h2>
                <p>Accede a tu cuenta de IMC</p>
              </div>
              <div className="modal-body">
                <div className="supabase-login">
                  <form>
                    <div className="form-group">
                      <label htmlFor="email">Email:</label>
                      <input type="email" id="email" name="email" required />
                    </div>
                    <div className="form-group">
                      <label htmlFor="password">Contraseña:</label>
                      <input type="password" id="password" name="password" required />
                    </div>
                    <div className="form-actions">
                      <button type="submit" className="btn-primary" onClick={handleDashboardAccess}>Iniciar Sesión</button>
                      <button type="button" className="btn-secondary">Registrarse</button>
                    </div>
                  </form>
                  <div className="divider">
                    <span>o continúa con</span>
                  </div>
                  <button className="btn-google" onClick={handleDashboardAccess}>
                    <i className="fab fa-google"></i>
                    Continuar con Google
                  </button>
                </div>
                <p className="modal-footer">
                  ¿No tienes cuenta? <a href="#">Regístrate aquí</a>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default function Home() {
  const [showDashboard, setShowDashboard] = useState(false);

  useEffect(() => {
    const checkHash = () => {
      setShowDashboard(window.location.hash === '#dashboard');
    };

    // Check initial hash
    checkHash();

    // Listen for hash changes
    window.addEventListener('hashchange', checkHash);

    return () => {
      window.removeEventListener('hashchange', checkHash);
    };
  }, []);

  return showDashboard ? <Dashboard /> : <LandingPage />;
}
