'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { authService, supabase } from '@/lib/supabase';
import OrganizationModal from './OrganizationModal';


interface Organization {
  id: string;
  name: string;
  mission: string;
  vision: string;
  strategic_objectives: string[];
  logo_url?: string;
  created_by: string;
  created_at: string;
}

interface Product {
  id: string;
  organization_id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  currency: string;
  status: string;
  created_at: string;
}

interface ConceptoCreativo {
  organizacion: string;
  productos: string[];
  brief: string;
}

interface BuyerPersona {
  id?: string | null;
  personaName: string;
  ageRange: string;
  gender: string;
  occupation: string;
  incomeLevel: string;
  educationLevel: string;
  location: string;
  painPoints: string[];
  goals: string[];
  preferredChannels: string[];
  behaviorPatterns: string;
  motivations: string;
  frustrations: string;
  personaAvatar: File | null;
}

interface ProductData {
  id?: string | null;
  productName: string;
  productDescription: string;
  category: string;
  price: string;
  currency: string;
  status: string;
}

interface OrganizationFormData {
  name: string;
  mission: string;
  vision: string;
  strategicObjectives: string[];
  logo: File | null;
  buyerPersonas: BuyerPersona[];
  products: ProductData[];
}

const Dashboard: React.FC = () => {
  const router = useRouter();
  
  // Inicializar activeSection basado en el hash de la URL
  const getInitialSection = () => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '');
      if (hash && ['dashboard', 'organizaciones', 'concepto-creativo', 'pacientes'].includes(hash)) {
        return hash;
      }
      return localStorage.getItem('activeSection') || 'dashboard';
    }
    return 'dashboard';
  };
  
  const [activeSection, setActiveSection] = useState(getInitialSection);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingOrganization, setEditingOrganization] = useState<Organization | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [conceptoCreativo, setConceptoCreativo] = useState<ConceptoCreativo>({
    organizacion: '',
    productos: [],
    brief: ''
  });
  const [organizationPersonas, setOrganizationPersonas] = useState<any[]>([]);
  const [organizationProducts, setOrganizationProducts] = useState<any[]>([]);

  // Función para manejar el envío del modal
  const handleModalSubmit = async (formData: any) => {
    try {
      const user = await authService.getCurrentUser();
      
      if (!user) {
        console.error('Usuario no autenticado');
        return;
      }

      const organizationData = {
        name: formData.organization.name,
        mission: formData.organization.mission,
        vision: formData.organization.vision,
        strategic_objectives: formData.organization.strategicObjectives.filter((obj: string) => obj.trim() !== ''),
        ...(isEditMode ? {} : { created_by: user.id })
      };

      let orgResult;
      
      if (isEditMode && editingOrganization) {
        // Actualizar organización existente
        const { data: updatedOrg, error: orgError } = await supabase
          .from('organizations')
          .update(organizationData)
          .eq('id', editingOrganization.id)
          .select()
          .single();
        
        if (orgError) {
          console.error('Error al actualizar organización:', orgError);
          return;
        }
        
        orgResult = updatedOrg;
      } else {
        // Crear nueva organización
        const { data: newOrg, error: orgError } = await supabase
          .from('organizations')
          .insert([organizationData])
          .select()
          .single();
        
        if (orgError) {
          console.error('Error al crear organización:', orgError);
          return;
        }
        
        orgResult = newOrg;
      }



      // Procesar buyer personas
      if (isEditMode && editingOrganization) {
        // En modo edición, eliminar personas existentes y crear nuevas
        await supabase
          .from('buyer_personas')
          .delete()
          .eq('organization_id', editingOrganization.id);
      }
      
      if (formData.buyerPersonas && formData.buyerPersonas.length > 0) {
        for (const persona of formData.buyerPersonas) {
          if (persona.personaName) {
            const personaData = {
              organization_id: orgResult.id,
              name: persona.personaName,
              age_range: persona.ageRange,
              gender: persona.gender,
              occupation: persona.occupation,
              income_level: persona.incomeLevel,
              education_level: persona.educationLevel,
              location: persona.location,
              pain_points: persona.painPoints.filter((p: string) => p.trim() !== ''),
              goals: persona.goals.filter((g: string) => g.trim() !== ''),
              preferred_channels: persona.preferredChannels.filter((c: string) => c.trim() !== ''),
              behavior_patterns: persona.behaviorPatterns,
              motivations: persona.motivations,
              frustrations: persona.frustrations
            };

            const { error: personaError } = await supabase
              .from('buyer_personas')
              .insert([personaData]);

            if (personaError) {
              console.error('Error al crear buyer persona:', personaError);
            }
          }
        }
      }

      // Procesar productos
      if (isEditMode && editingOrganization) {
        // En modo edición, eliminar productos existentes y crear nuevos
        await supabase
          .from('products')
          .delete()
          .eq('organization_id', editingOrganization.id);
      }
      
      if (formData.products && formData.products.length > 0) {
        for (const product of formData.products) {
          if (product.productName) {
            const productData = {
              organization_id: orgResult.id,
              name: product.productName,
              description: product.productDescription,
              category: product.category,
              price: parseFloat(product.price) || 0,
              currency: product.currency,
              status: product.status
            };

            const { error: productError } = await supabase
              .from('products')
              .insert([productData]);

            if (productError) {
              console.error('Error al crear producto:', productError);
            }
          }
        }
      }

      console.log(isEditMode ? 'Organización actualizada exitosamente:' : 'Organización creada exitosamente:', orgResult);
      
      // Limpiar estados de edición
      setIsEditMode(false);
      setEditingOrganization(null);
      setOrganizationPersonas([]);
      setOrganizationProducts([]);
       // Recargar organizaciones
       loadOrganizations();
       setIsModalOpen(false);
    } catch (error) {
      console.error('Error al procesar el formulario:', error);
    }
  };

  const handleNavClick = (section: string) => {
    setActiveSection(section);
    localStorage.setItem('activeSection', section);
    window.location.hash = section;
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };



  const loadOrganizations = async () => {
    try {
      setLoading(true);
      const user = await authService.getCurrentUser();
      
      if (!user) {
        console.error('Usuario no autenticado');
        return;
      }

      const { data, error } = await supabase
        .from('organizations')
        .select('*')
        .eq('created_by', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error al cargar organizaciones:', error);
        return;
      }

      setOrganizations(data || []);
    } catch (error) {
      console.error('Error al cargar organizaciones:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrganizations();
  }, []);

  const handleEditOrganization = async (organization: Organization) => {
    setEditingOrganization(organization);
    setIsEditMode(true);
    
    // Cargar buyer personas y productos de la organización
    await loadOrganizationRelatedData(organization.id);
    
    // Abrir el modal en modo de edición
    setIsModalOpen(true);
  };

  const loadOrganizationRelatedData = async (organizationId: string) => {
    try {
      // Cargar buyer personas
      const { data: personas, error: personasError } = await supabase
        .from('buyer_personas')
        .select('*')
        .eq('organization_id', organizationId)
        .order('created_at', { ascending: false });

      if (personasError) {
        console.error('Error al cargar buyer personas:', personasError);
      } else {
        setOrganizationPersonas(personas || []);
      }

      // Cargar productos
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('*')
        .eq('organization_id', organizationId)
        .order('created_at', { ascending: false });

      if (productsError) {
        console.error('Error al cargar productos:', productsError);
      } else {
        setOrganizationProducts(products || []);
      }
    } catch (error) {
      console.error('Error al cargar datos relacionados:', error);
    }
  };

  const handleDeleteOrganization = async (organizationId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta organización?')) {
      try {
        const { error } = await supabase
          .from('organizations')
          .delete()
          .eq('id', organizationId);

        if (error) {
          console.error('Error al eliminar organización:', error);
          return;
        }

        await loadOrganizations();
      } catch (error) {
        console.error('Error al eliminar organización:', error);
      }
    }
  };

  const handleOrganizationSubmit = async (data: OrganizationFormData) => {
    try {
      const user = await authService.getCurrentUser();
      
      if (!user) {
        console.error('Usuario no autenticado');
        return;
      }

      const organizationData = {
        name: data.name,
        mission: data.mission,
        vision: data.vision,
        strategic_objectives: data.strategicObjectives.filter((obj: string) => obj.trim() !== ''),
        created_by: user.id
      };

      let organization;
      
      if (editingOrganization) {
        // Actualizar organización existente
        const { data: updatedOrg, error: orgError } = await supabase
          .from('organizations')
          .update(organizationData)
          .eq('id', editingOrganization.id)
          .select()
          .single();

        if (orgError) {
          console.error('Error al actualizar organización:', orgError);
          return;
        }
        organization = updatedOrg;
      } else {
        // Crear nueva organización
        const { data: newOrg, error: orgError } = await supabase
          .from('organizations')
          .insert([organizationData])
          .select()
          .single();

        if (orgError) {
          console.error('Error al crear organización:', orgError);
          return;
        }
        organization = newOrg;
      }

      // Procesar buyer personas
      if (data.buyerPersonas && data.buyerPersonas.length > 0) {
        for (const persona of data.buyerPersonas) {
          if (persona.personaName) {
            const personaData = {
              organization_id: organization.id,
              name: persona.personaName,
              age_range: persona.ageRange,
              gender: persona.gender,
              occupation: persona.occupation,
              income_level: persona.incomeLevel,
              education_level: persona.educationLevel,
              location: persona.location,
              pain_points: persona.painPoints?.filter((point: string) => point.trim() !== '') || [],
              goals: persona.goals?.filter((goal: string) => goal.trim() !== '') || [],
              preferred_channels: persona.preferredChannels?.filter((channel: string) => channel.trim() !== '') || [],
              behavior_patterns: persona.behaviorPatterns,
              motivations: persona.motivations,
              frustrations: persona.frustrations
            };

            if (persona.id) {
              // Actualizar buyer persona existente
              const { error: personaError } = await supabase
                .from('buyer_personas')
                .update(personaData)
                .eq('id', persona.id);

              if (personaError) {
                console.error('Error al actualizar buyer persona:', personaError);
              }
            } else {
              // Crear nueva buyer persona
              const { error: personaError } = await supabase
                .from('buyer_personas')
                .insert([personaData]);

              if (personaError) {
                console.error('Error al crear buyer persona:', personaError);
              }
            }
          }
        }
      }

      // Procesar productos
      if (data.products && data.products.length > 0) {
        for (const product of data.products) {
          if (product.productName) {
            const productData = {
              organization_id: organization.id,
              name: product.productName,
              description: product.productDescription,
              category: product.category,
              price: product.price ? parseFloat(product.price) : null,
              currency: product.currency,
              status: product.status
            };

            if (product.id) {
              // Actualizar producto existente
              const { error: productError } = await supabase
                .from('products')
                .update(productData)
                .eq('id', product.id);

              if (productError) {
                console.error('Error al actualizar producto:', productError);
              }
            } else {
              // Crear nuevo producto
              const { error: productError } = await supabase
                .from('products')
                .insert([productData]);

              if (productError) {
                console.error('Error al crear producto:', productError);
              }
            }
          }
        }
      }

      console.log(editingOrganization ? 'Organización actualizada exitosamente:' : 'Organización creada exitosamente:', organization);
      setEditingOrganization(null);
      setOrganizationPersonas([]);
      setOrganizationProducts([]);
      
      // Recargar la lista de organizaciones
      await loadOrganizations();
      
    } catch (error) {
      console.error('Error al crear organización:', error);
    }
  };

  const loadProducts = async (organizationId: string) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('organization_id', organizationId)
        .eq('status', 'active')
        .order('name', { ascending: true });

      if (error) {
        console.error('Error al cargar productos:', error);
        return;
      }

      setProducts(data || []);
    } catch (error) {
      console.error('Error al cargar productos:', error);
    }
  };

  const handleOrganizacionChange = (organizacionId: string) => {
    setConceptoCreativo(prev => ({
      ...prev,
      organizacion: organizacionId,
      productos: [] // Reset productos cuando cambia la organización
    }));
    
    if (organizacionId) {
      loadProducts(organizacionId);
    } else {
      setProducts([]);
    }
  };

  const handleProductoToggle = (productoId: string) => {
    setConceptoCreativo(prev => ({
      ...prev,
      productos: prev.productos.includes(productoId)
        ? prev.productos.filter(id => id !== productoId)
        : [...prev.productos, productoId]
    }));
  };

  const handleBriefChange = (brief: string) => {
    setConceptoCreativo(prev => ({
      ...prev,
      brief
    }));
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
    // Función para manejar cambios de hash en la URL
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash && ['dashboard', 'organizaciones', 'concepto-creativo', 'pacientes'].includes(hash)) {
        setActiveSection(hash);
        localStorage.setItem('activeSection', hash);
      }
    };

    // Sincronizar el hash inicial con el estado si es necesario
    const currentHash = window.location.hash.replace('#', '');
    if (!currentHash || !['dashboard', 'organizaciones', 'concepto-creativo', 'pacientes'].includes(currentHash)) {
      window.location.hash = activeSection;
    }

    // Escuchar cambios de hash
    window.addEventListener('hashchange', handleHashChange);

    // Cleanup
    return () => {
       window.removeEventListener('hashchange', handleHashChange);
     };
   }, [activeSection]);

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
         
         /* Concepto Creativo Page Styles */
         .concepto-creativo-page {
           animation: fadeIn 0.5s ease-out;
         }
         
         .page-description {
           font-size: 14px;
           color: #64748b;
           margin: 8px 0 0 0;
           font-weight: 400;
         }
         
         .concepto-form {
           display: flex;
           flex-direction: column;
           gap: 32px;
         }
         
         .form-section {
           background: rgba(255, 255, 255, 0.8);
           border-radius: 16px;
           padding: 24px;
           border: 1px solid rgba(59, 130, 246, 0.1);
           box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
         }
         
         .section-title {
           font-size: 18px;
           font-weight: 700;
           color: #1e293b;
           display: flex;
           align-items: center;
           gap: 12px;
           margin: 0 0 20px 0;
         }
         
         .section-title i {
           color: #3b82f6;
           font-size: 16px;
         }
         
         .optional {
           font-size: 12px;
           color: #64748b;
           font-weight: 400;
         }
         
         .organization-selector {
           width: 100%;
         }
         
         .form-select {
           width: 100%;
           padding: 12px 16px;
           border: 2px solid rgba(59, 130, 246, 0.1);
           border-radius: 12px;
           font-size: 14px;
           background: rgba(255, 255, 255, 0.9);
           color: #1e293b;
           transition: all 0.3s ease;
           cursor: pointer;
         }
         
         .form-select:focus {
           outline: none;
           border-color: #3b82f6;
           box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
         }
         
         .products-grid {
           display: grid;
           grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
           gap: 16px;
         }
         
         .product-card {
           background: rgba(255, 255, 255, 0.9);
           border: 2px solid rgba(59, 130, 246, 0.1);
           border-radius: 12px;
           padding: 20px;
           cursor: pointer;
           transition: all 0.3s ease;
           position: relative;
         }
         
         .product-card:hover {
           border-color: #3b82f6;
           box-shadow: 0 8px 24px rgba(59, 130, 246, 0.15);
           transform: translateY(-2px);
         }
         
         .product-card.selected {
           border-color: #3b82f6;
           background: rgba(59, 130, 246, 0.05);
           box-shadow: 0 8px 24px rgba(59, 130, 246, 0.2);
         }
         
         .product-header {
           display: flex;
           justify-content: space-between;
           align-items: flex-start;
           margin-bottom: 12px;
         }
         
         .product-name {
           font-size: 16px;
           font-weight: 600;
           color: #1e293b;
           margin: 0;
           flex: 1;
         }
         
         .product-checkbox {
           margin-left: 12px;
         }
         
         .product-checkbox input[type="checkbox"] {
           width: 18px;
           height: 18px;
           accent-color: #3b82f6;
           cursor: pointer;
         }
         
         .product-description {
           font-size: 14px;
           color: #64748b;
           margin: 0 0 16px 0;
           line-height: 1.5;
         }
         
         .product-details {
           display: flex;
           justify-content: space-between;
           align-items: center;
           gap: 12px;
         }
         
         .product-category {
           padding: 4px 12px;
           background: rgba(59, 130, 246, 0.1);
           color: #3b82f6;
           border-radius: 20px;
           font-size: 12px;
           font-weight: 600;
         }
         
         .product-price {
           font-size: 14px;
           font-weight: 700;
           color: #1e293b;
         }
         
         .no-products {
           text-align: center;
           padding: 40px 20px;
           color: #64748b;
         }
         
         .no-products i {
           font-size: 48px;
           color: #cbd5e1;
           margin-bottom: 16px;
         }
         
         .no-products p {
           margin: 8px 0;
           font-size: 14px;
         }
         
         .brief-container {
           position: relative;
         }
         
         .brief-textarea {
           width: 100%;
           padding: 16px;
           border: 2px solid rgba(59, 130, 246, 0.1);
           border-radius: 12px;
           font-size: 14px;
           background: rgba(255, 255, 255, 0.9);
           color: #1e293b;
           resize: vertical;
           min-height: 120px;
           font-family: inherit;
           line-height: 1.5;
           transition: all 0.3s ease;
         }
         
         .brief-textarea:focus {
           outline: none;
           border-color: #3b82f6;
           box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
         }
         
         .brief-textarea::placeholder {
           color: #94a3b8;
         }
         
         .brief-counter {
           position: absolute;
           bottom: 8px;
           right: 12px;
           font-size: 12px;
           color: #64748b;
           background: rgba(255, 255, 255, 0.9);
           padding: 4px 8px;
           border-radius: 6px;
         }
         
         .concepto-summary {
           background: rgba(59, 130, 246, 0.05);
           border: 1px solid rgba(59, 130, 246, 0.1);
           border-radius: 12px;
           padding: 20px;
         }
         
         .summary-item {
           margin-bottom: 16px;
         }
         
         .summary-item:last-child {
           margin-bottom: 0;
         }
         
         .summary-item strong {
           display: block;
           font-size: 14px;
           font-weight: 600;
           color: #1e293b;
           margin-bottom: 8px;
         }
         
         .summary-item span {
           font-size: 14px;
           color: #475569;
         }
         
         .selected-products {
           display: flex;
           flex-wrap: wrap;
           gap: 8px;
           margin-top: 8px;
         }
         
         .product-tag {
           padding: 6px 12px;
           background: #3b82f6;
           color: white;
           border-radius: 20px;
           font-size: 12px;
           font-weight: 500;
         }
         
         .brief-preview {
           font-size: 14px;
           color: #475569;
           line-height: 1.6;
           margin: 8px 0 0 0;
           padding: 12px;
           background: rgba(255, 255, 255, 0.7);
           border-radius: 8px;
           border-left: 4px solid #3b82f6;
         }
         
         @media (max-width: 768px) {
           .products-grid {
             grid-template-columns: 1fr;
           }
           
           .product-details {
             flex-direction: column;
             align-items: flex-start;
             gap: 8px;
           }
           
           .selected-products {
             flex-direction: column;
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
                href="#concepto-creativo" 
                data-section="concepto-creativo" 
                className={`nav-link ${activeSection === 'concepto-creativo' ? 'active' : ''}`}
                onClick={() => handleNavClick('concepto-creativo')}
              >
                <i className="fas fa-lightbulb"></i>
                <span>Concepto Creativo</span>
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
                  <Image 
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face" 
                    alt="Usuario" 
                    width={40}
                    height={40}
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
                      onClick={() => {
                        setIsEditMode(false);
                        setEditingOrganization(null);
                        setIsModalOpen(true);
                      }}
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
                        {loading ? (
                          <div className="table-row">
                            <div className="table-cell" style={{textAlign: 'center', padding: '40px', gridColumn: '1 / -1'}}>
                              <i className="fas fa-spinner fa-spin" style={{marginRight: '10px'}}></i>
                              Cargando organizaciones...
                            </div>
                          </div>
                        ) : organizations.length === 0 ? (
                          <div className="table-row">
                            <div className="table-cell" style={{textAlign: 'center', padding: '40px', gridColumn: '1 / -1'}}>
                              <i className="fas fa-building" style={{marginRight: '10px', opacity: 0.5}}></i>
                              No hay organizaciones creadas. ¡Crea tu primera organización!
                            </div>
                          </div>
                        ) : (
                          organizations.map((org, index) => (
                            <div key={org.id} className="table-row">
                              <div className="table-cell">
                                <div className="org-info">
                                  <div className="org-avatar">
                                    <i className="fas fa-building"></i>
                                  </div>
                                  <div className="org-details">
                                    <span className="org-name">{org.name}</span>
                                    <span className="org-code">ORG-{String(index + 1).padStart(3, '0')}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="table-cell">
                                <span className="org-type hospital">Organización</span>
                              </div>
                              <div className="table-cell">-</div>
                              <div className="table-cell">-</div>
                              <div className="table-cell">
                                <span className="status active">Activa</span>
                              </div>
                              <div className="table-cell">
                                <div className="action-buttons">
                                  <button 
                                    className="action-btn edit"
                                    onClick={() => handleEditOrganization(org)}
                                    title="Editar organización"
                                  >
                                    <i className="fas fa-edit"></i>
                                  </button>
                                  <button 
                                    className="action-btn delete"
                                    onClick={() => handleDeleteOrganization(org.id)}
                                    title="Eliminar organización"
                                  >
                                    <i className="fas fa-trash"></i>
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeSection === 'concepto-creativo' && (
                <div className="concepto-creativo-page">
                  <div className="page-header">
                    <h1 className="page-title">
                      <i className="fas fa-lightbulb"></i>
                      Concepto Creativo
                    </h1>
                    <p className="page-description">
                      Crea conceptos creativos seleccionando una organización, sus productos y agregando un brief de campaña.
                    </p>
                  </div>
                  
                  <div className="page-content">
                    <div className="concepto-form">
                      {/* Selector de Organización */}
                      <div className="form-section">
                        <h3 className="section-title">
                          <i className="fas fa-building"></i>
                          Seleccionar Organización
                        </h3>
                        <div className="organization-selector">
                          <select 
                            value={conceptoCreativo.organizacion}
                            onChange={(e) => handleOrganizacionChange(e.target.value)}
                            className="form-select"
                          >
                            <option value="">Selecciona una organización...</option>
                            {organizations.map((org) => (
                              <option key={org.id} value={org.id}>
                                {org.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Selector de Productos */}
                      {conceptoCreativo.organizacion && (
                        <div className="form-section">
                          <h3 className="section-title">
                            <i className="fas fa-box"></i>
                            Productos/Servicios
                          </h3>
                          <div className="products-grid">
                            {products.length === 0 ? (
                              <div className="no-products">
                                <i className="fas fa-info-circle"></i>
                                <p>No hay productos disponibles para esta organización.</p>
                                <p>Crea productos desde la sección de Organizaciones.</p>
                              </div>
                            ) : (
                              products.map((product) => (
                                <div 
                                  key={product.id} 
                                  className={`product-card ${
                                    conceptoCreativo.productos.includes(product.id) ? 'selected' : ''
                                  }`}
                                  onClick={() => handleProductoToggle(product.id)}
                                >
                                  <div className="product-header">
                                    <h4 className="product-name">{product.name}</h4>
                                    <div className="product-checkbox">
                                      <input 
                                        type="checkbox" 
                                        checked={conceptoCreativo.productos.includes(product.id)}
                                        onChange={() => handleProductoToggle(product.id)}
                                      />
                                    </div>
                                  </div>
                                  <p className="product-description">{product.description}</p>
                                  <div className="product-details">
                                    <span className="product-category">{product.category}</span>
                                    <span className="product-price">
                                      {product.currency} {product.price?.toLocaleString()}
                                    </span>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      )}

                      {/* Brief de Campaña */}
                      <div className="form-section">
                        <h3 className="section-title">
                          <i className="fas fa-file-alt"></i>
                          Brief de Campaña <span className="optional">(Opcional)</span>
                        </h3>
                        <div className="brief-container">
                          <textarea
                            value={conceptoCreativo.brief}
                            onChange={(e) => handleBriefChange(e.target.value)}
                            placeholder="Describe los objetivos, público objetivo, mensaje clave, tono de comunicación y cualquier información relevante para el concepto creativo..."
                            className="brief-textarea"
                            rows={8}
                          />
                          <div className="brief-counter">
                            {conceptoCreativo.brief.length} caracteres
                          </div>
                        </div>
                      </div>

                      {/* Resumen del Concepto */}
                      {(conceptoCreativo.organizacion || conceptoCreativo.productos.length > 0 || conceptoCreativo.brief) && (
                        <div className="form-section">
                          <h3 className="section-title">
                            <i className="fas fa-eye"></i>
                            Resumen del Concepto
                          </h3>
                          <div className="concepto-summary">
                            {conceptoCreativo.organizacion && (
                              <div className="summary-item">
                                <strong>Organización:</strong>
                                <span>
                                  {organizations.find(org => org.id === conceptoCreativo.organizacion)?.name}
                                </span>
                              </div>
                            )}
                            
                            {conceptoCreativo.productos.length > 0 && (
                              <div className="summary-item">
                                <strong>Productos seleccionados ({conceptoCreativo.productos.length}):</strong>
                                <div className="selected-products">
                                  {conceptoCreativo.productos.map(prodId => {
                                    const product = products.find(p => p.id === prodId);
                                    return product ? (
                                      <span key={prodId} className="product-tag">
                                        {product.name}
                                      </span>
                                    ) : null;
                                  })}
                                </div>
                              </div>
                            )}
                            
                            {conceptoCreativo.brief && (
                              <div className="summary-item">
                                <strong>Brief:</strong>
                                <p className="brief-preview">
                                  {conceptoCreativo.brief.length > 200 
                                    ? `${conceptoCreativo.brief.substring(0, 200)}...` 
                                    : conceptoCreativo.brief
                                  }
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
          </div>
        </main>
      </div>
      
      <OrganizationModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setIsEditMode(false);
          setEditingOrganization(null);
          setOrganizationPersonas([]);
          setOrganizationProducts([]);
        }}
        onSubmit={handleModalSubmit}
        editingOrganization={editingOrganization}
        organizationPersonas={organizationPersonas}
        organizationProducts={organizationProducts}
        isEditMode={isEditMode}
      />

    </>
  );
};



export default Dashboard;