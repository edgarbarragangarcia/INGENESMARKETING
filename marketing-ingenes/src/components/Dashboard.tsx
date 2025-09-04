'use client';

import React, { useState } from 'react';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavClick = (section: string) => {
    setActiveSection(section);
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="dashboard">
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-logo">
            <i className="fas fa-rocket"></i>
            <div className="logo-text">
              <span className="logo-main">IMC</span>
              <span className="logo-sub">INGENES MARKETING CAMPAIGN</span>
            </div>
          </div>

          <div className={`nav-menu ${isMobileMenuOpen ? 'active' : ''}`}>
            <a 
              href="#dashboard" 
              data-section="dashboard" 
              className={`nav-link ${activeSection === 'dashboard' ? 'active' : ''}`}
              onClick={() => handleNavClick('dashboard')}
            >
              <i className="fas fa-chart-line"></i>
              <span>Dashboard</span>
            </a>
            <a 
              href="#campaigns" 
              data-section="campaigns" 
              className={`nav-link ${activeSection === 'campaigns' ? 'active' : ''}`}
              onClick={() => handleNavClick('campaigns')}
            >
              <i className="fas fa-bullhorn"></i>
              <span>Campañas</span>
            </a>
            <a 
              href="#analytics" 
              data-section="analytics" 
              className={`nav-link ${activeSection === 'analytics' ? 'active' : ''}`}
              onClick={() => handleNavClick('analytics')}
            >
              <i className="fas fa-chart-bar"></i>
              <span>Analíticas</span>
            </a>
            <a 
              href="#patients" 
              data-section="patients" 
              className={`nav-link ${activeSection === 'patients' ? 'active' : ''}`}
              onClick={() => handleNavClick('patients')}
            >
              <i className="fas fa-users"></i>
              <span>Pacientes</span>
            </a>
          </div>

          <div className="header-actions">
            <div className="user-info">
            </div>
          </div>

          <div className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`} onClick={toggleMobileMenu}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </nav>

      <main className="main-content">
        <div className="content-wrapper">
          {activeSection === 'dashboard' && (
            <section id="dashboard" className="content-section active">
              <div className="section-header">
                <h1>Dashboard Principal</h1>
                <p>Resumen general de campañas y métricas</p>
              </div>
              
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">
                    <i className="fas fa-eye"></i>
                  </div>
                  <div className="stat-content">
                    <h3>12,543</h3>
                    <p>Visualizaciones</p>
                    <span className="stat-change positive">+12%</span>
                  </div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-icon">
                    <i className="fas fa-mouse-pointer"></i>
                  </div>
                  <div className="stat-content">
                    <h3>1,234</h3>
                    <p>Clics</p>
                    <span className="stat-change positive">+8%</span>
                  </div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-icon">
                    <i className="fas fa-percentage"></i>
                  </div>
                  <div className="stat-content">
                    <h3>9.8%</h3>
                    <p>CTR</p>
                    <span className="stat-change negative">-2%</span>
                  </div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-icon">
                    <i className="fas fa-dollar-sign"></i>
                  </div>
                  <div className="stat-content">
                    <h3>$45,230</h3>
                    <p>Ingresos</p>
                    <span className="stat-change positive">+15%</span>
                  </div>
                </div>
              </div>
            </section>
          )}

          {activeSection === 'campaigns' && (
            <section id="campaigns" className="content-section active">
              <div className="section-header">
                <h1>Gestión de Campañas</h1>
                <p>Administra y monitorea tus campañas de marketing</p>
              </div>
              <div className="campaigns-content">
                <p>Contenido de campañas en desarrollo...</p>
              </div>
            </section>
          )}

          {activeSection === 'analytics' && (
            <section id="analytics" className="content-section active">
              <div className="section-header">
                <h1>Analíticas Avanzadas</h1>
                <p>Métricas detalladas y reportes de rendimiento</p>
              </div>
              <div className="analytics-content">
                <p>Contenido de analíticas en desarrollo...</p>
              </div>
            </section>
          )}

          {activeSection === 'patients' && (
            <section id="patients" className="content-section active">
              <div className="section-header">
                <h1>Base de Pacientes</h1>
                <p>Gestión y seguimiento de pacientes</p>
              </div>
              <div className="patients-content">
                <p>Contenido de pacientes en desarrollo...</p>
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;