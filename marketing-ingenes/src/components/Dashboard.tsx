'use client';

import React, { useState, useEffect } from 'react';
import { authService, supabase } from '@/lib/supabase';
import OrganizationModal from './OrganizationModal';

const Dashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [theme, setTheme] = useState('system');
  const [isOrganizationModalOpen, setIsOrganizationModalOpen] = useState(false);

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

  const handleOrganizationSubmit = async (data: any) => {
    try {
      const user = await authService.getCurrentUser();
      
      if (!user) {
        console.error('Usuario no autenticado');
        return;
      }

      // Crear organización
      const organizationData = {
        name: data.name,
        mission: data.mission,
        vision: data.vision,
        strategic_objectives: data.strategicObjectives.filter((obj: string) => obj.trim() !== ''),
        created_by: user.id
      };

      const { data: organization, error: orgError } = await supabase
        .from('organizations')
        .insert([organizationData])
        .select()
        .single();

      if (orgError) {
        console.error('Error al crear organización:', orgError);
        return;
      }

      // Crear buyer persona si hay datos
      if (data.personaName) {
        const personaData = {
          organization_id: organization.id,
          name: data.personaName,
          age_range: data.ageRange,
          gender: data.gender,
          occupation: data.occupation,
          income_level: data.incomeLevel,
          education_level: data.educationLevel,
          location: data.location,
          pain_points: data.painPoints.filter((point: string) => point.trim() !== ''),
          goals: data.goals.filter((goal: string) => goal.trim() !== ''),
          preferred_channels: data.preferredChannels.filter((channel: string) => channel.trim() !== ''),
          behavior_patterns: data.behaviorPatterns,
          motivations: data.motivations,
          frustrations: data.frustrations
        };

        const { error: personaError } = await supabase
          .from('buyer_personas')
          .insert([personaData]);

        if (personaError) {
          console.error('Error al crear buyer persona:', personaError);
        }
      }

      // Crear producto si hay datos
      if (data.productName) {
        const productData = {
          organization_id: organization.id,
          name: data.productName,
          description: data.productDescription,
          category: data.category,
          price: data.price ? parseFloat(data.price) : null,
          currency: data.currency,

          status: data.status
        };

        const { error: productError } = await supabase
          .from('products')
          .insert([productData]);

        if (productError) {
          console.error('Error al crear producto:', productError);
        }
      }

      console.log('Organización creada exitosamente:', organization);
      setIsOrganizationModalOpen(false);
      
      // Opcional: Recargar la página o actualizar la lista de organizaciones
      window.location.reload();
      
    } catch (error) {
      console.error('Error al crear organización:', error);
    }
  };

  const handleLogout = async () => {
    try {
      // Cerrar sesión en Supabase
      const { error } = await authService.signOut();
      
      if (error) {
        console.error('Error al cerrar sesión:', error);
      }
      
      // Limpiar datos de sesión local
      localStorage.removeItem('userToken');
      localStorage.removeItem('userData');
      sessionStorage.clear();
      
      // Cerrar menú de usuario
      setIsUserMenuOpen(false);
      
      // Redirigir a la página principal
      window.location.hash = '';
      window.location.reload();
    } catch (error) {
      console.error('Error en logout:', error);
      // Aún así limpiar datos locales y redirigir
      localStorage.removeItem('userToken');
      localStorage.removeItem('userData');
      sessionStorage.clear();
      setIsUserMenuOpen(false);
      window.location.hash = '';
      window.location.reload();
    }
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'system';
    setTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  return (
    <>
      <style jsx global>{`
        .dashboard {
          min-height: 100vh;
          background: #f8fafc;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        
        .navbar {
           background: linear-gradient(135deg, 
             rgba(255, 182, 193, 0.3) 0%,
             rgba(173, 216, 230, 0.3) 25%,
             rgba(221, 160, 221, 0.3) 50%,
             rgba(255, 218, 185, 0.3) 75%,
             rgba(240, 248, 255, 0.3) 100%);
           backdrop-filter: blur(15px);
           border-bottom: 1px solid rgba(255, 255, 255, 0.2);
           position: sticky;
           top: 0;
           z-index: 1000;
           box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
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
          color: #1e293b;
        }
        
        .nav-logo i {
          font-size: 24px;
          color: #3b82f6;
        }
        
        .logo-text {
          display: flex;
          flex-direction: column;
          line-height: 1.2;
        }
        
        .logo-main {
          font-size: 18px;
          font-weight: 800;
          color: #1e293b;
        }
        
        .logo-sub {
          font-size: 10px;
          font-weight: 500;
          color: #64748b;
          letter-spacing: 0.5px;
        }
        
        .nav-menu {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .nav-link {
           display: flex;
           align-items: center;
           gap: 6px;
           padding: 8px 12px;
           border-radius: 6px;
           text-decoration: none;
           color: #64748b;
           font-weight: 500;
           font-size: 14px;
           transition: all 0.2s ease;
           cursor: pointer;
         }
        
        .nav-link:hover {
          background: #f1f5f9;
          color: #3b82f6;
        }
        
        .nav-link.active {
          background: #eff6ff;
          color: #3b82f6;
        }
        
        .nav-link i {
           font-size: 14px;
         }
        
        .header-actions {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        
        .user-avatar-container {
          position: relative;
        }
        
        .user-avatar {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 12px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .user-avatar:hover {
          background: #f1f5f9;
        }
        
        .avatar-image {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          object-fit: cover;
        }
        
        .user-info {
          display: flex;
          flex-direction: column;
          line-height: 1.2;
        }
        
        .user-name {
          font-size: 14px;
          font-weight: 600;
          color: #1e293b;
        }
        
        .user-role {
          font-size: 12px;
          color: #64748b;
        }
        
        .dropdown-arrow {
          font-size: 12px;
          color: #64748b;
          transition: transform 0.2s ease;
        }
        
        .dropdown-arrow.open {
          transform: rotate(180deg);
        }
        
        .user-dropdown {
          position: absolute;
          top: 100%;
          right: 0;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          padding: 16px;
          min-width: 200px;
          z-index: 1001;
        }
        
        .dropdown-section h4 {
          font-size: 12px;
          font-weight: 600;
          color: #64748b;
          margin: 0 0 8px 0;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .theme-options {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        
        .theme-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          border: none;
          background: transparent;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          color: #64748b;
          transition: all 0.2s ease;
          text-align: left;
        }
        
        .theme-btn:hover {
          background: #f1f5f9;
          color: #3b82f6;
        }
        
        .theme-btn.active {
          background: #eff6ff;
          color: #3b82f6;
        }
        
        .dropdown-divider {
          height: 1px;
          background: #e2e8f0;
          margin: 12px 0;
        }
        
        .logout-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          border: none;
          background: transparent;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          color: #ef4444;
          transition: all 0.2s ease;
          width: 100%;
          text-align: left;
        }
        
        .logout-btn:hover {
          background: #fef2f2;
        }
        
        .hamburger {
          display: none;
          flex-direction: column;
          cursor: pointer;
          padding: 8px;
        }
        
        .hamburger span {
          width: 20px;
          height: 2px;
          background: #64748b;
          margin: 2px 0;
          transition: 0.3s;
        }
        
        .hamburger.active span:nth-child(1) {
          transform: rotate(-45deg) translate(-4px, 4px);
        }
        
        .hamburger.active span:nth-child(2) {
          opacity: 0;
        }
        
        .hamburger.active span:nth-child(3) {
          transform: rotate(45deg) translate(-4px, -4px);
        }
        
        @media (max-width: 768px) {
          .nav-menu {
            position: fixed;
            top: 70px;
            left: -100%;
            width: 100%;
            height: calc(100vh - 70px);
            background: white;
            flex-direction: column;
            justify-content: flex-start;
            align-items: stretch;
            padding: 20px;
            transition: left 0.3s ease;
            border-top: 1px solid #e2e8f0;
          }
          
          .nav-menu.active {
            left: 0;
          }
          
          .nav-link {
            justify-content: flex-start;
            padding: 16px 20px;
            border-radius: 8px;
            margin-bottom: 8px;
          }
          
          .hamburger {
            display: flex;
          }
          
          .user-info {
             display: none;
           }
         }
         
         /* Dashboard Content Styles */
         .dashboard-content {
           padding: 30px;
           min-height: calc(100vh - 60px);
           background: #ffffff;
           font-size: 12px;
         }
         
         .content-container {
           max-width: 1400px;
           margin: 0 auto;
         }
         
         .modern-dashboard {
           display: grid;
           grid-template-columns: 300px 1fr;
           gap: 30px;
         }
         
         .stats-panel {
           background: #ffffff;
           border-radius: 20px;
           padding: 30px;
           box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
           border: 1px solid #f1f5f9;
         }
         
         .stats-header h2 {
           font-size: 24px;
           font-weight: 700;
           color: #1e293b;
           margin: 0 0 30px 0;
         }
         
         .circular-progress {
           display: flex;
           justify-content: center;
           margin-bottom: 40px;
         }
         
         .progress-ring {
           position: relative;
           display: flex;
           align-items: center;
           justify-content: center;
         }
         
         .progress-ring svg {
           transform: rotate(-90deg);
         }
         
         .progress-bg {
           fill: none;
           stroke: #f1f5f9;
           stroke-width: 8;
         }
         
         .progress-fill {
           fill: none;
           stroke: #3b82f6;
           stroke-width: 8;
           stroke-linecap: round;
           transition: stroke-dashoffset 0.5s ease;
         }
         
         .progress-text {
           position: absolute;
           text-align: center;
           display: flex;
           flex-direction: column;
           align-items: center;
         }
         
         .progress-value {
           font-size: 24px;
           font-weight: 800;
           color: #1e293b;
         }
         
         .progress-label {
           font-size: 12px;
           color: #64748b;
           margin: 4px 0;
         }
         
         .progress-amount {
           font-size: 16px;
           font-weight: 700;
           color: #3b82f6;
         }
         
         .stats-metrics {
           display: flex;
           flex-direction: column;
           gap: 20px;
           margin-bottom: 30px;
         }
         
         .metric-item {
           display: flex;
           justify-content: space-between;
           align-items: center;
           padding: 15px 0;
           border-bottom: 1px solid #f1f5f9;
         }
         
         .metric-item:last-child {
           border-bottom: none;
         }
         
         .metric-label {
           font-size: 14px;
           color: #64748b;
           font-weight: 500;
         }
         
         .metric-value {
           font-size: 18px;
           font-weight: 700;
           color: #1e293b;
         }
         
         .metric-chart {
           width: 60px;
         }
         
         .mini-bars {
           display: flex;
           align-items: end;
           gap: 2px;
           height: 20px;
         }
         
         .mini-bar {
           flex: 1;
           background: #3b82f6;
           border-radius: 1px;
           min-height: 2px;
           opacity: 0.7;
         }
         
         .earnings-summary {
           display: flex;
           flex-direction: column;
           gap: 15px;
         }
         
         .earning-item {
           display: flex;
           justify-content: space-between;
           align-items: center;
           padding: 12px 16px;
           background: #f8fafc;
           border-radius: 12px;
         }
         
         .earning-label {
           font-size: 14px;
           color: #64748b;
         }
         
         .earning-value {
           font-size: 16px;
           font-weight: 700;
           color: #1e293b;
         }
         
         .earning-change {
           font-size: 12px;
           color: #10b981;
           font-weight: 600;
         }
         
         .visualization-area {
           background: #ffffff;
           border-radius: 20px;
           padding: 30px;
           box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
           border: 1px solid #f1f5f9;
           position: relative;
           min-height: 400px;
         }
         
         .viz-header {
           display: flex;
           justify-content: space-between;
           align-items: center;
           margin-bottom: 40px;
         }
         
         .viz-header h1 {
           font-size: 28px;
           font-weight: 700;
           color: #1e293b;
           margin: 0;
         }
         
         .time-controls {
           display: flex;
           gap: 8px;
         }
         
         .time-btn {
           padding: 8px 16px;
           border: 1px solid #e2e8f0;
           background: #ffffff;
           color: #64748b;
           border-radius: 8px;
           font-weight: 500;
           cursor: pointer;
           transition: all 0.2s ease;
         }
         
         .time-btn.active,
         .time-btn:hover {
           background: #3b82f6;
           color: white;
           border-color: #3b82f6;
         }
         
         .bubble-chart {
           position: relative;
           height: 400px;
           margin-bottom: 40px;
         }
         
         .bubble {
           position: absolute;
           border-radius: 50%;
           display: flex;
           flex-direction: column;
           align-items: center;
           justify-content: center;
           cursor: pointer;
           transition: all 0.3s ease;
           animation: bubbleFloat 3s ease-in-out infinite;
         }
         
         .bubble:hover {
           transform: scale(1.1);
           z-index: 10;
         }
         
         .bubble.large {
           width: 120px;
           height: 120px;
           background: linear-gradient(135deg, #3b82f6, #1d4ed8);
           color: white;
         }
         
         .bubble.medium {
           width: 90px;
           height: 90px;
           background: linear-gradient(135deg, #10b981, #059669);
           color: white;
         }
         
         .bubble.small {
           width: 70px;
           height: 70px;
           background: linear-gradient(135deg, #8b5cf6, #7c3aed);
           color: white;
         }
         
         .bubble.tiny {
           width: 50px;
           height: 50px;
           background: linear-gradient(135deg, #f59e0b, #d97706);
           color: white;
         }
         
         .bubble-label {
           font-size: 10px;
           font-weight: 600;
           text-transform: uppercase;
           letter-spacing: 0.5px;
           opacity: 0.9;
         }
         
         .bubble-value {
           font-size: 12px;
           font-weight: 800;
           margin-top: 2px;
         }
         
         .bottom-metrics {
           display: flex;
           justify-content: space-around;
           align-items: center;
           padding-top: 20px;
           border-top: 1px solid #f1f5f9;
         }
         
         .bottom-metric {
           text-align: center;
         }
         
         .metric-number {
           display: block;
           font-size: 24px;
           font-weight: 800;
           color: #1e293b;
           margin-bottom: 4px;
         }
         
         .metric-desc {
           font-size: 12px;
           color: #64748b;
           font-weight: 600;
           letter-spacing: 0.5px;
         }
         
         @keyframes bubbleFloat {
           0%, 100% {
             transform: translateY(0px);
           }
           50% {
             transform: translateY(-10px);
           }
         }
         
         @media (max-width: 768px) {
           .dashboard-content {
             padding: 20px;
           }
           
           .modern-dashboard {
             grid-template-columns: 1fr;
             gap: 20px;
             height: auto;
           }
           
           .stats-panel {
             padding: 20px;
           }
           
           .visualization-area {
             padding: 20px;
           }
           
           .bubble-chart {
             height: 300px;
           }
           
           .bubble {
             transform: scale(0.8);
           }
         }
         
         /* Organizations Page Styles */
         .organizations-page {
           animation: fadeIn 0.5s ease-out;
         }
         
         .page-header {
           display: flex;
           justify-content: space-between;
           align-items: center;
           margin-bottom: 30px;
           padding-bottom: 20px;
           border-bottom: 2px solid rgba(59, 130, 246, 0.1);
         }
         
         .page-title {
           font-size: 22px;
           font-weight: 800;
           color: #1e293b;
           display: flex;
           align-items: center;
           gap: 12px;
           margin: 0;
           background: linear-gradient(135deg, #1e293b, #3b82f6);
           -webkit-background-clip: text;
           -webkit-text-fill-color: transparent;
           background-clip: text;
         }
         
         .page-title i {
           color: #3b82f6;
           -webkit-text-fill-color: #3b82f6;
         }
         
         .btn-primary {
           background: linear-gradient(135deg, #3b82f6, #1d4ed8);
           color: white;
           border: none;
           padding: 12px 24px;
           border-radius: 12px;
           font-weight: 600;
           display: flex;
           align-items: center;
           gap: 8px;
           cursor: pointer;
           transition: all 0.3s ease;
           box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
         }
         
         .btn-primary:hover {
           transform: translateY(-2px);
           box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4);
         }
         
         .page-content {
           background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%);
           backdrop-filter: blur(20px);
           border: 1px solid rgba(255, 255, 255, 0.3);
           border-radius: 20px;
           padding: 24px;
           box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
         }
         
         .search-filters {
           display: flex;
           justify-content: space-between;
           align-items: center;
           margin-bottom: 24px;
           gap: 20px;
         }
         
         .search-box {
           position: relative;
           flex: 1;
           max-width: 400px;
         }
         
         .search-box i {
           position: absolute;
           left: 16px;
           top: 50%;
           transform: translateY(-50%);
           color: #64748b;
           font-size: 14px;
         }
         
         .search-box input {
           width: 100%;
           padding: 12px 16px 12px 48px;
           border: 2px solid rgba(59, 130, 246, 0.1);
           border-radius: 12px;
           font-size: 11px;
           background: rgba(255, 255, 255, 0.8);
           transition: all 0.3s ease;
         }
         
         .search-box input:focus {
           outline: none;
           border-color: #3b82f6;
           box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
         }
         
         .filter-buttons {
           display: flex;
           gap: 8px;
         }
         
         .filter-btn {
           padding: 6px 14px;
           border: 2px solid rgba(59, 130, 246, 0.2);
           background: rgba(255, 255, 255, 0.8);
           color: #64748b;
           border-radius: 8px;
           font-weight: 500;
           cursor: pointer;
           transition: all 0.3s ease;
           font-size: 11px;
         }
         
         .filter-btn.active,
         .filter-btn:hover {
           background: #3b82f6;
           color: white;
           border-color: #3b82f6;
         }
         
         .organizations-table {
           background: rgba(255, 255, 255, 0.6);
           border-radius: 16px;
           overflow: hidden;
           box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
         }
         
         .table-header {
           background: linear-gradient(135deg, #f8fafc, #e2e8f0);
           border-bottom: 2px solid rgba(59, 130, 246, 0.1);
         }
         
         .table-row {
           display: grid;
           grid-template-columns: 2fr 1fr 1.5fr 1fr 1fr 1fr;
           gap: 16px;
           padding: 16px 20px;
           align-items: center;
           transition: all 0.3s ease;
         }
         
         .table-body .table-row:hover {
           background: rgba(59, 130, 246, 0.05);
         }
         
         .table-body .table-row:not(:last-child) {
           border-bottom: 1px solid rgba(226, 232, 240, 0.5);
         }
         
         .table-cell {
           font-size: 11px;
           color: #475569;
         }
         
         .table-header .table-cell {
           font-weight: 700;
           color: #1e293b;
           text-transform: uppercase;
           letter-spacing: 0.5px;
           font-size: 10px;
         }
         
         .org-info {
           display: flex;
           align-items: center;
           gap: 12px;
         }
         
         .org-avatar {
           width: 48px;
           height: 48px;
           border-radius: 12px;
           background: linear-gradient(135deg, #3b82f6, #1d4ed8);
           display: flex;
           align-items: center;
           justify-content: center;
           color: white;
           font-size: 18px;
           box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
         }
         
         .org-details {
           display: flex;
           flex-direction: column;
           gap: 2px;
         }
         
         .org-name {
           font-weight: 600;
           color: #1e293b;
           font-size: 12px;
         }
         
         .org-code {
           font-size: 10px;
           color: #64748b;
           font-weight: 500;
         }
         
         .org-type {
           padding: 3px 10px;
           border-radius: 20px;
           font-size: 10px;
           font-weight: 600;
           text-transform: uppercase;
           letter-spacing: 0.5px;
         }
         
         .org-type.hospital {
           background: rgba(239, 68, 68, 0.1);
           color: #dc2626;
         }
         
         .org-type.clinic {
           background: rgba(16, 185, 129, 0.1);
           color: #059669;
         }
         
         .org-type.center {
           background: rgba(139, 92, 246, 0.1);
           color: #7c3aed;
         }
         
         .status {
           padding: 3px 10px;
           border-radius: 20px;
           font-size: 10px;
           font-weight: 600;
           text-transform: uppercase;
           letter-spacing: 0.5px;
         }
         
         .status.active {
           background: rgba(16, 185, 129, 0.1);
           color: #059669;
         }
         
         .status.inactive {
           background: rgba(156, 163, 175, 0.2);
           color: #6b7280;
         }
         
         .action-buttons {
           display: flex;
           gap: 8px;
         }
         
         .action-btn {
           width: 32px;
           height: 32px;
           border: none;
           border-radius: 8px;
           display: flex;
           align-items: center;
           justify-content: center;
           cursor: pointer;
           transition: all 0.3s ease;
           font-size: 12px;
         }
         
         .action-btn.edit {
           background: rgba(59, 130, 246, 0.1);
           color: #3b82f6;
         }
         
         .action-btn.edit:hover {
           background: #3b82f6;
           color: white;
           transform: scale(1.1);
         }
         
         .action-btn.delete {
           background: rgba(239, 68, 68, 0.1);
           color: #ef4444;
         }
         
         .action-btn.delete:hover {
           background: #ef4444;
           color: white;
           transform: scale(1.1);
         }
         
         @keyframes fadeIn {
           from {
             opacity: 0;
             transform: translateY(20px);
           }
           to {
             opacity: 1;
             transform: translateY(0);
           }
         }
         
         @media (max-width: 768px) {
           .page-header {
             flex-direction: column;
             gap: 16px;
             align-items: flex-start;
           }
           
           .search-filters {
             flex-direction: column;
             gap: 16px;
           }
           
           .search-box {
             max-width: none;
           }
           
           .table-row {
             grid-template-columns: 1fr;
             gap: 8px;
           }
           
           .table-cell {
             display: flex;
             justify-content: space-between;
             align-items: center;
           }
           
           .table-header {
             display: none;
           }
           
           .table-cell::before {
             content: attr(data-label);
             font-weight: 600;
             color: #1e293b;
           }
         }
       `}</style>
      
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
                href="#organizaciones" 
                data-section="organizaciones" 
                className={`nav-link ${activeSection === 'organizaciones' ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('organizaciones');
                }}
              >
                <i className="fas fa-building"></i>
                <span>Organizaciones</span>
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

        {/* Dashboard Content */}
        <main className="dashboard-content">
          <div className="content-container">
            {activeSection === 'dashboard' && (
              <>
                <div className="modern-dashboard">
                  {/* Statistics Panel */}
                  <div className="stats-panel">
                    <div className="stats-header">
                      <h2>Statistics</h2>
                    </div>
                    
                    <div className="circular-progress">
                      <div className="progress-ring">
                        <svg width="120" height="120">
                          <circle cx="60" cy="60" r="50" className="progress-bg"/>
                          <circle cx="60" cy="60" r="50" className="progress-fill" strokeDasharray="314" strokeDashoffset="94"/>
                        </svg>
                        <div className="progress-text">
                          <span className="progress-value">70%</span>
                          <span className="progress-label">Total earning</span>
                          <span className="progress-amount">$12,875</span>
                        </div>
                      </div>
                    </div>

                    <div className="stats-metrics">
                      <div className="metric-item">
                        <span className="metric-label">Pageviews</span>
                        <span className="metric-value">405</span>
                        <div className="metric-chart">
                          <div className="mini-bars">
                            <div className="mini-bar" style={{height: '60%'}}></div>
                            <div className="mini-bar" style={{height: '80%'}}></div>
                            <div className="mini-bar" style={{height: '40%'}}></div>
                            <div className="mini-bar" style={{height: '90%'}}></div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="metric-item">
                        <span className="metric-label">Visitors</span>
                        <span className="metric-value">1,024</span>
                        <div className="metric-chart">
                          <div className="mini-bars">
                            <div className="mini-bar" style={{height: '70%'}}></div>
                            <div className="mini-bar" style={{height: '50%'}}></div>
                            <div className="mini-bar" style={{height: '85%'}}></div>
                            <div className="mini-bar" style={{height: '65%'}}></div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="metric-item">
                        <span className="metric-label">Bounce</span>
                        <span className="metric-value">3.4%</span>
                        <div className="metric-chart">
                          <div className="mini-bars">
                            <div className="mini-bar" style={{height: '30%'}}></div>
                            <div className="mini-bar" style={{height: '45%'}}></div>
                            <div className="mini-bar" style={{height: '25%'}}></div>
                            <div className="mini-bar" style={{height: '35%'}}></div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="metric-item">
                        <span className="metric-label">Revenue</span>
                        <span className="metric-value">$43</span>
                        <div className="metric-chart">
                          <div className="mini-bars">
                            <div className="mini-bar" style={{height: '55%'}}></div>
                            <div className="mini-bar" style={{height: '75%'}}></div>
                            <div className="mini-bar" style={{height: '45%'}}></div>
                            <div className="mini-bar" style={{height: '80%'}}></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="earnings-summary">
                      <div className="earning-item">
                        <span className="earning-label">Total earning</span>
                        <span className="earning-value">$12,875</span>
                        <span className="earning-change">+12%</span>
                      </div>
                      
                      <div className="earning-item">
                        <span className="earning-label">Spending</span>
                        <span className="earning-value">$43,123</span>
                        <span className="earning-change">+8%</span>
                      </div>
                    </div>
                  </div>

                  {/* Main Visualization Area */}
                  <div className="visualization-area">
                    <div className="viz-header">
                      <h1>Data visualization</h1>
                      <div className="time-controls">
                        <button className="time-btn">1H</button>
                        <button className="time-btn">1W</button>
                        <button className="time-btn active">1M</button>
                        <button className="time-btn">1Y</button>
                        <button className="time-btn">ALL</button>
                      </div>
                    </div>

                    <div className="bubble-chart">
                      <div className="bubble large" style={{left: '45%', top: '40%'}} data-value="Investment: $1.2M">
                        <span className="bubble-label">Investment</span>
                        <span className="bubble-value">$1.2M</span>
                      </div>
                      
                      <div className="bubble medium" style={{left: '25%', top: '25%'}} data-value="Revenue: $875K">
                        <span className="bubble-label">Revenue</span>
                        <span className="bubble-value">$875K</span>
                      </div>
                      
                      <div className="bubble small" style={{left: '70%', top: '30%'}} data-value="Profit: $432K">
                        <span className="bubble-label">Profit</span>
                        <span className="bubble-value">$432K</span>
                      </div>
                      
                      <div className="bubble medium" style={{left: '60%', top: '65%'}} data-value="Expenses: $654K">
                        <span className="bubble-label">Expenses</span>
                        <span className="bubble-value">$654K</span>
                      </div>
                      
                      <div className="bubble small" style={{left: '30%', top: '70%'}} data-value="Marketing: $234K">
                        <span className="bubble-label">Marketing</span>
                        <span className="bubble-value">$234K</span>
                      </div>
                      
                      <div className="bubble tiny" style={{left: '15%', top: '50%'}} data-value="R&D: $156K">
                        <span className="bubble-label">R&D</span>
                        <span className="bubble-value">$156K</span>
                      </div>
                      
                      <div className="bubble tiny" style={{left: '80%', top: '55%'}} data-value="Sales: $298K">
                        <span className="bubble-label">Sales</span>
                        <span className="bubble-value">$298K</span>
                      </div>
                      
                      <div className="bubble small" style={{left: '55%', top: '15%'}} data-value="Operations: $387K">
                        <span className="bubble-label">Operations</span>
                        <span className="bubble-value">$387K</span>
                      </div>
                    </div>

                    <div className="bottom-metrics">
                      <div className="bottom-metric">
                        <span className="metric-number">204</span>
                        <span className="metric-desc">TRANSACTIONS</span>
                      </div>
                      
                      <div className="bottom-metric">
                        <span className="metric-number">65,540</span>
                        <span className="metric-desc">UNIQUE USERS</span>
                      </div>
                      
                      <div className="bottom-metric">
                        <span className="metric-number">324</span>
                        <span className="metric-desc">TOTAL SESSIONS</span>
                      </div>
                    </div>
                  </div>
                </div>
             </>
            )}
            {activeSection === 'organizaciones' && (
                <div className="organizations-page">
                  <div className="page-header">
                    <h1 className="page-title">
                      <i className="fas fa-building"></i>
                      Organizaciones
                    </h1>
                    <button 
                      className="btn-primary"
                      onClick={() => setIsOrganizationModalOpen(true)}
                    >
                      <i className="fas fa-plus"></i>
                      Nueva Organización
                    </button>
                  </div>
                  
                  <div className="page-content">
                    <div className="search-filters">
                      <div className="search-box">
                        <i className="fas fa-search"></i>
                        <input type="text" placeholder="Buscar organizaciones..." />
                      </div>
                      <div className="filter-buttons">
                        <button className="filter-btn active">Todas</button>
                        <button className="filter-btn">Activas</button>
                        <button className="filter-btn">Inactivas</button>
                      </div>
                    </div>
                    
                    <div className="organizations-table">
                      <div className="table-header">
                        <div className="table-row">
                          <div className="table-cell">Organización</div>
                          <div className="table-cell">Tipo</div>
                          <div className="table-cell">Ubicación</div>
                          <div className="table-cell">Pacientes</div>
                          <div className="table-cell">Estado</div>
                          <div className="table-cell">Acciones</div>
                        </div>
                      </div>
                      <div className="table-body">
                        <div className="table-row">
                          <div className="table-cell">
                            <div className="org-info">
                              <div className="org-avatar">
                                <i className="fas fa-hospital"></i>
                              </div>
                              <div className="org-details">
                                <span className="org-name">Hospital General</span>
                                <span className="org-code">HG-001</span>
                              </div>
                            </div>
                          </div>
                          <div className="table-cell">
                            <span className="org-type hospital">Hospital</span>
                          </div>
                          <div className="table-cell">Ciudad de México</div>
                          <div className="table-cell">1,247</div>
                          <div className="table-cell">
                            <span className="status active">Activa</span>
                          </div>
                          <div className="table-cell">
                            <div className="action-buttons">
                              <button className="action-btn edit">
                                <i className="fas fa-edit"></i>
                              </button>
                              <button className="action-btn delete">
                                <i className="fas fa-trash"></i>
                              </button>
                            </div>
                          </div>
                        </div>
                        
                        <div className="table-row">
                          <div className="table-cell">
                            <div className="org-info">
                              <div className="org-avatar">
                                <i className="fas fa-clinic-medical"></i>
                              </div>
                              <div className="org-details">
                                <span className="org-name">Clínica San Rafael</span>
                                <span className="org-code">CSR-002</span>
                              </div>
                            </div>
                          </div>
                          <div className="table-cell">
                            <span className="org-type clinic">Clínica</span>
                          </div>
                          <div className="table-cell">Guadalajara</div>
                          <div className="table-cell">543</div>
                          <div className="table-cell">
                            <span className="status active">Activa</span>
                          </div>
                          <div className="table-cell">
                            <div className="action-buttons">
                              <button className="action-btn edit">
                                <i className="fas fa-edit"></i>
                              </button>
                              <button className="action-btn delete">
                                <i className="fas fa-trash"></i>
                              </button>
                            </div>
                          </div>
                        </div>
                        
                        <div className="table-row">
                          <div className="table-cell">
                            <div className="org-info">
                              <div className="org-avatar">
                                <i className="fas fa-user-md"></i>
                              </div>
                              <div className="org-details">
                                <span className="org-name">Centro Médico Monterrey</span>
                                <span className="org-code">CMM-003</span>
                              </div>
                            </div>
                          </div>
                          <div className="table-cell">
                            <span className="org-type center">Centro Médico</span>
                          </div>
                          <div className="table-cell">Monterrey</div>
                          <div className="table-cell">892</div>
                          <div className="table-cell">
                            <span className="status inactive">Inactiva</span>
                          </div>
                          <div className="table-cell">
                            <div className="action-buttons">
                              <button className="action-btn edit">
                                <i className="fas fa-edit"></i>
                              </button>
                              <button className="action-btn delete">
                                <i className="fas fa-trash"></i>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
          </div>
        </main>
      </div>
      
      {/* Modal de Nueva Organización */}
      <OrganizationModal
        isOpen={isOrganizationModalOpen}
        onClose={() => setIsOrganizationModalOpen(false)}
        onSubmit={handleOrganizationSubmit}
      />
    </>
  );
};

export default Dashboard;