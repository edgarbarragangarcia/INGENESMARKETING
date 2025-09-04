'use client';

import React, { useState, useEffect } from 'react';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [theme, setTheme] = useState('system');

  const handleNavClick = (section: string) => {
    setActiveSection(section);
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
  };

  const applyTheme = (selectedTheme: string) => {
    const root = document.documentElement;
    if (selectedTheme === 'dark') {
      root.setAttribute('data-theme', 'dark');
    } else if (selectedTheme === 'light') {
      root.setAttribute('data-theme', 'light');
    } else {
      // System theme
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    }
  };

  const handleLogout = () => {
    // Limpiar datos de sesión
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
    sessionStorage.clear();
    
    // Cerrar el menú
    setIsUserMenuOpen(false);
    
    // Redirigir a la landing page removiendo el hash
    window.location.hash = '';
    window.location.reload();
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'system';
    setTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

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
            <div className="user-avatar-container">
              <div className="user-avatar" onClick={toggleUserMenu}>
                <img 
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face" 
                  alt="Usuario" 
                  className="avatar-image"
                />
                <div className="user-info">
                  <span className="user-name">Edgar Barragán</span>
                  <span className="user-role">Administrador</span>
                </div>
                <i className={`fas fa-chevron-down dropdown-arrow ${isUserMenuOpen ? 'open' : ''}`}></i>
              </div>
              
              {isUserMenuOpen && (
                <div className="user-dropdown">
                  <div className="dropdown-section">
                    <h4>Tema</h4>
                    <div className="theme-options">
                      <button 
                        className={`theme-btn ${theme === 'light' ? 'active' : ''}`}
                        onClick={() => handleThemeChange('light')}
                      >
                        <i className="fas fa-sun"></i>
                        Claro
                      </button>
                      <button 
                        className={`theme-btn ${theme === 'dark' ? 'active' : ''}`}
                        onClick={() => handleThemeChange('dark')}
                      >
                        <i className="fas fa-moon"></i>
                        Oscuro
                      </button>
                      <button 
                        className={`theme-btn ${theme === 'system' ? 'active' : ''}`}
                        onClick={() => handleThemeChange('system')}
                      >
                        <i className="fas fa-desktop"></i>
                        Sistema
                      </button>
                    </div>
                  </div>
                  <div className="dropdown-divider"></div>
                  <button className="logout-btn" onClick={handleLogout}>
                    <i className="fas fa-sign-out-alt"></i>
                    Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`} onClick={toggleMobileMenu}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </nav>



    </div>
  );
};

export default Dashboard;