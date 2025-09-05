'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { authService, supabase } from '@/lib/supabase';
import OrganizationModal from './OrganizationModal';
import {
  LogoIcon,
  DashboardIcon,
  OrganizationIcon,
  CreativeIcon,
  PatientsIcon,
  SearchIcon,
  AddIcon,
  EditIcon,
  DeleteIcon,
  LogoutIcon,
  ChevronDownIcon,
  ProductIcon,
  PersonaIcon,
  AgeIcon,
  OccupationIcon,
  LocationIcon,
  ChartIcon
} from './Icons';


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

interface ProductData {
  id?: string | null;
  productName: string;
  productDescription: string;
  category: string;
  price: string;
  currency: string;
  status: string;
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
  const [organizationPersonas, setOrganizationPersonas] = useState<BuyerPersona[]>([]);
  const [organizationProducts, setOrganizationProducts] = useState<ProductData[]>([]);
  const [conceptoBuyerPersonas, setConceptoBuyerPersonas] = useState<BuyerPersona[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Función para manejar el envío del modal
  const handleModalSubmit = async (formData: OrganizationFormData) => {
    try {
      const user = await authService.getCurrentUser();
      
      if (!user) {
        console.error('Usuario no autenticado');
        return;
      }

      const organizationData = {
        name: formData.name,
        mission: formData.mission,
        vision: formData.vision,
        strategic_objectives: formData.strategicObjectives.filter((obj: string) => obj.trim() !== ''),
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
      console.log('Procesando buyer personas:', formData.buyerPersonas);
      if (isEditMode && editingOrganization) {
        // En modo edición, eliminar personas existentes y crear nuevas
        const { error: deletePersonasError } = await supabase
          .from('buyer_personas')
          .delete()
          .eq('organization_id', editingOrganization.id);
        
        if (deletePersonasError) {
          console.error('Error al eliminar buyer personas existentes:', deletePersonasError);
        }
      }
      
      if (formData.buyerPersonas && formData.buyerPersonas.length > 0) {
        console.log('Insertando', formData.buyerPersonas.length, 'buyer personas');
        for (const persona of formData.buyerPersonas) {
          if (persona.personaName) {
            const personaData = {
              organization_id: orgResult.id,
              name: persona.personaName,
              ageRange: persona.ageRange,
              gender: persona.gender,
              occupation: persona.occupation,
              incomeLevel: persona.incomeLevel,
              educationLevel: persona.educationLevel,
              location: persona.location,
              painPoints: persona.painPoints.filter((p: string) => p.trim() !== ''),
              goals: persona.goals.filter((g: string) => g.trim() !== ''),
              preferredChannels: persona.preferredChannels.filter((c: string) => c.trim() !== ''),
              behaviorPatterns: persona.behaviorPatterns,
              motivations: persona.motivations,
              frustrations: persona.frustrations
            };

            console.log('Insertando buyer persona:', personaData);
            const { data: personaResult, error: personaError } = await supabase
              .from('buyer_personas')
              .insert([personaData])
              .select();

            if (personaError) {
              console.error('Error al crear buyer persona:', personaError);
            } else {
              console.log('Buyer persona creado exitosamente:', personaResult);
            }
          }
        }
      }

      // Procesar productos
      console.log('Procesando productos:', formData.products);
      if (isEditMode && editingOrganization) {
        // En modo edición, eliminar productos existentes y crear nuevos
        const { error: deleteProductsError } = await supabase
          .from('products')
          .delete()
          .eq('organization_id', editingOrganization.id);
        
        if (deleteProductsError) {
          console.error('Error al eliminar productos existentes:', deleteProductsError);
        }
      }
      
      if (formData.products && formData.products.length > 0) {
        console.log('Insertando', formData.products.length, 'productos');
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

            console.log('Insertando producto:', productData);
            const { data: productResult, error: productError } = await supabase
              .from('products')
              .insert([productData])
              .select();

            if (productError) {
              console.error('Error al crear producto:', productError);
            } else {
              console.log('Producto creado exitosamente:', productResult);
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
    loadCurrentUser();
    loadOrganizations();
  }, []);

  const loadCurrentUser = async () => {
    try {
      const user = await authService.getCurrentUser();
      setCurrentUser(user);
    } catch (error) {
      console.error('Error al cargar usuario actual:', error);
    }
  };

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
        const formattedPersonas = (personas || []).map(persona => ({
          id: persona.id,
          personaName: persona.name || '',
          ageRange: persona.age_range || '',
          gender: persona.gender || '',
          occupation: persona.occupation || '',
          incomeLevel: persona.income_level || '',
          educationLevel: persona.education_level || '',
          location: persona.location || '',
          painPoints: persona.pain_points || [],
          goals: persona.goals || [],
          preferredChannels: persona.preferred_channels || [],
          behaviorPatterns: persona.behavior_patterns || '',
          motivations: persona.motivations || '',
          frustrations: persona.frustrations || '',
          personaAvatar: null
        }));
        setOrganizationPersonas(formattedPersonas);
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
        const formattedProducts = (products || []).map(product => ({
          id: product.id,
          productName: product.name || '',
          productDescription: product.description || '',
          category: product.category || '',
          price: product.price?.toString() || '',
          currency: product.currency || 'USD',
          status: product.status || 'active'
        }));
        setOrganizationProducts(formattedProducts);
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

  const loadBuyerPersonas = async (organizationId: string) => {
    try {
      const { data, error } = await supabase
        .from('buyer_personas')
        .select('*')
        .eq('organization_id', organizationId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error al cargar buyer personas:', error);
        return;
      }

      setConceptoBuyerPersonas(data || []);
    } catch (error) {
      console.error('Error al cargar buyer personas:', error);
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
      loadBuyerPersonas(organizacionId);
    } else {
      setProducts([]);
      setConceptoBuyerPersonas([]);
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
         
         .page-header.compact {
           margin-bottom: 20px;
         }
         
         .page-description {
           font-size: 14px;
           color: #64748b;
           margin: 8px 0 0 0;
           font-weight: 400;
         }
         
         /* Estructura compacta */
         .concepto-form-compact {
           display: flex;
           flex-direction: column;
           gap: 20px;
         }
         
         .form-section-compact {
           background: rgba(255, 255, 255, 0.9);
           border-radius: 12px;
           padding: 16px;
           border: 1px solid rgba(59, 130, 246, 0.1);
           box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
         }
         
         .section-title-compact {
           font-size: 16px;
           font-weight: 600;
           color: #1e293b;
           display: flex;
           align-items: center;
           gap: 8px;
           margin: 0 0 12px 0;
         }
         
         .section-title-compact i {
           color: #3b82f6;
           font-size: 14px;
         }
         
         .optional {
           font-size: 11px;
           color: #64748b;
           font-weight: 400;
           margin-left: 8px;
         }
         
         .form-select-compact {
           width: 100%;
           padding: 10px 12px;
           border: 1px solid rgba(59, 130, 246, 0.2);
           border-radius: 8px;
           font-size: 14px;
           background: rgba(255, 255, 255, 0.95);
           color: #1e293b;
           transition: all 0.2s ease;
           cursor: pointer;
         }
         
         .form-select-compact:focus {
           outline: none;
           border-color: #3b82f6;
           box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
         }
         
         /* Layout de dos columnas */
         .two-column-layout {
           display: grid;
           grid-template-columns: 1fr 1fr;
           gap: 20px;
         }
         
         /* Grids compactos */
         .products-grid-compact,
         .personas-grid-compact {
           display: flex;
           flex-direction: column;
           gap: 8px;
           max-height: 300px;
           overflow-y: auto;
         }
         
         .item-card-compact {
           background: rgba(255, 255, 255, 0.95);
           border: 1px solid rgba(59, 130, 246, 0.15);
           border-radius: 8px;
           padding: 12px;
           cursor: pointer;
           transition: all 0.2s ease;
         }
         
         .item-card-compact:hover {
           border-color: #3b82f6;
           box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
           transform: translateY(-1px);
         }
         
         .item-card-compact.selected {
           border-color: #3b82f6;
           background: rgba(59, 130, 246, 0.05);
           box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
         }
         
         .item-header-compact {
           display: flex;
           justify-content: space-between;
           align-items: center;
           margin-bottom: 8px;
         }
         
         .item-name {
           font-size: 14px;
           font-weight: 600;
           color: #1e293b;
           flex: 1;
         }
         
         .item-header-compact input[type="checkbox"] {
           width: 16px;
           height: 16px;
           accent-color: #3b82f6;
           cursor: pointer;
         }
         
         .item-details-compact {
           display: flex;
           justify-content: space-between;
           align-items: center;
           gap: 8px;
         }
         
         .item-category {
           padding: 2px 8px;
           background: rgba(59, 130, 246, 0.1);
           color: #3b82f6;
           border-radius: 12px;
           font-size: 11px;
           font-weight: 600;
         }
         
         .item-price {
           font-size: 12px;
           font-weight: 600;
           color: #1e293b;
         }
         
         /* Estilos específicos para personas */
         .item-card-compact.persona {
           border-left: 3px solid #10b981;
         }
         
         .persona-info-compact {
           display: flex;
           flex-direction: column;
           gap: 4px;
         }
         
         .persona-info-compact span {
           font-size: 12px;
           color: #64748b;
           display: flex;
           align-items: center;
           gap: 6px;
         }
         
         .persona-info-compact i {
           width: 12px;
           color: #10b981;
           font-size: 10px;
         }
         
         .no-items-compact {
           text-align: center;
           padding: 20px;
           color: #64748b;
           font-size: 13px;
           display: flex;
           flex-direction: column;
           align-items: center;
           gap: 8px;
         }
         
         .no-items-compact i {
           font-size: 24px;
           opacity: 0.5;
         }
         
         /* Brief compacto */
         .brief-container-compact {
           position: relative;
         }
         
         .brief-textarea-compact {
           width: 100%;
           padding: 12px;
           border: 1px solid rgba(59, 130, 246, 0.2);
           border-radius: 8px;
           font-size: 14px;
           font-family: inherit;
           resize: vertical;
           min-height: 80px;
           background: rgba(255, 255, 255, 0.95);
         }
         
         .brief-textarea-compact:focus {
           outline: none;
           border-color: #3b82f6;
           box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
         }
         
         .brief-counter-compact {
           position: absolute;
           bottom: 8px;
           right: 12px;
           font-size: 11px;
           color: #64748b;
           background: rgba(255, 255, 255, 0.9);
           padding: 2px 6px;
           border-radius: 4px;
         }
         
         /* Resumen compacto */
         .form-section-compact.summary {
           background: rgba(59, 130, 246, 0.02);
           border: 1px solid rgba(59, 130, 246, 0.2);
         }
         
         .concepto-summary-compact {
           display: flex;
           flex-direction: column;
           gap: 12px;
         }
         
         .summary-row {
           display: flex;
           flex-direction: column;
           gap: 4px;
         }
         
         .summary-row strong {
           font-size: 13px;
           color: #1e293b;
         }
         
         .summary-row span {
           font-size: 14px;
           color: #64748b;
         }
         
         .selected-items {
           display: flex;
           flex-wrap: wrap;
           gap: 6px;
           margin-top: 4px;
         }
         
         .item-tag {
           padding: 4px 8px;
           background: rgba(59, 130, 246, 0.1);
           color: #3b82f6;
           border-radius: 12px;
           font-size: 12px;
           font-weight: 500;
         }
         
         .brief-preview-compact {
           font-size: 13px;
           color: #64748b;
           line-height: 1.4;
           margin: 4px 0 0 0;
           font-style: italic;
         }
         
         /* Responsive para layout compacto */
         @media (max-width: 768px) {
           .two-column-layout {
             grid-template-columns: 1fr;
             gap: 16px;
           }
           
           .concepto-form-compact {
             gap: 16px;
           }
           
           .form-section-compact {
             padding: 12px;
           }
         }
         
         /* Estilos originales para compatibilidad */
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
         
         /* Buyer Personas Styles */
         .personas-grid {
           display: grid;
           grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
           gap: 20px;
         }
         
         .persona-card {
           background: rgba(255, 255, 255, 0.9);
           border: 2px solid rgba(59, 130, 246, 0.1);
           border-radius: 16px;
           padding: 20px;
           transition: all 0.3s ease;
         }
         
         .persona-card:hover {
           border-color: #3b82f6;
           box-shadow: 0 8px 24px rgba(59, 130, 246, 0.15);
           transform: translateY(-2px);
         }
         
         .persona-header {
           margin-bottom: 16px;
         }
         
         .persona-name {
           font-size: 16px;
           font-weight: 600;
           color: #1e293b;
           margin: 0;
         }
         
         .persona-details {
           display: flex;
           flex-direction: column;
           gap: 8px;
         }
         
         .persona-details p {
           margin: 0;
           font-size: 14px;
           color: #64748b;
         }
         
         .persona-details strong {
           color: #1e293b;
         }
         
         .no-personas {
           text-align: center;
           padding: 40px 20px;
           color: #64748b;
         }
         
         .no-personas i {
           font-size: 48px;
           color: #cbd5e1;
           margin-bottom: 16px;
         }
         
         .no-personas p {
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

         /* Marketing Dashboard Styles */
         .marketing-dashboard {
           display: flex;
           flex-direction: column;
           gap: 24px;
           animation: fadeIn 0.5s ease-out;
         }

         .dashboard-header {
           display: flex;
           justify-content: space-between;
           align-items: flex-start;
           padding: 24px;
           background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
           border-radius: 16px;
           border: 1px solid rgba(59, 130, 246, 0.1);
         }

         .header-content {
           flex: 1;
         }

         .dashboard-title {
           font-size: 28px;
           font-weight: 800;
           color: #1e293b;
           display: flex;
           align-items: center;
           gap: 12px;
           margin: 0 0 8px 0;
           background: linear-gradient(135deg, #1e293b, #3b82f6);
           -webkit-background-clip: text;
           -webkit-text-fill-color: transparent;
           background-clip: text;
         }

         .dashboard-subtitle {
           font-size: 16px;
           color: #64748b;
           margin: 0;
           font-weight: 500;
         }

         .dashboard-actions {
           display: flex;
           gap: 12px;
         }

         .action-btn {
           display: flex;
           align-items: center;
           gap: 8px;
           padding: 12px 20px;
           border: none;
           border-radius: 12px;
           font-weight: 600;
           cursor: pointer;
           transition: all 0.3s ease;
           font-size: 14px;
         }

         .action-btn.primary {
           background: linear-gradient(135deg, #3b82f6, #1d4ed8);
           color: white;
           box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
         }

         .action-btn.primary:hover {
           transform: translateY(-2px);
           box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
         }

         .metrics-grid {
           display: grid;
           grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
           gap: 20px;
         }

         .metric-card {
           background: white;
           border-radius: 16px;
           padding: 24px;
           box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
           border: 1px solid #f1f5f9;
           transition: all 0.3s ease;
           position: relative;
           overflow: hidden;
         }

         .metric-card::before {
           content: '';
           position: absolute;
           top: 0;
           left: 0;
           right: 0;
           height: 4px;
           background: linear-gradient(135deg, #3b82f6, #1d4ed8);
         }

         .metric-card.organizations::before {
           background: linear-gradient(135deg, #10b981, #059669);
         }

         .metric-card.products::before {
           background: linear-gradient(135deg, #f59e0b, #d97706);
         }

         .metric-card.concepts::before {
           background: linear-gradient(135deg, #8b5cf6, #7c3aed);
         }

         .metric-card.roi::before {
           background: linear-gradient(135deg, #ef4444, #dc2626);
         }

         .metric-card:hover {
           transform: translateY(-4px);
           box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
         }

         .metric-header {
           display: flex;
           align-items: center;
           gap: 8px;
           margin-bottom: 16px;
         }

         .metric-title {
           font-size: 14px;
           font-weight: 600;
           color: #64748b;
         }

         .metric-content {
           margin-bottom: 12px;
         }

         .metric-number {
           font-size: 32px;
           font-weight: 800;
           color: #1e293b;
           display: block;
           line-height: 1;
         }

         .metric-label {
           font-size: 14px;
           color: #64748b;
           font-weight: 500;
         }

         .metric-trend {
           font-size: 12px;
           font-weight: 600;
           padding: 4px 8px;
           border-radius: 12px;
           display: inline-block;
         }

         .metric-trend.positive {
           background: rgba(16, 185, 129, 0.1);
           color: #10b981;
         }

         .metric-trend.negative {
           background: rgba(239, 68, 68, 0.1);
           color: #ef4444;
         }

         .dashboard-summary {
           display: grid;
           grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
           gap: 24px;
         }

         .summary-card {
           background: white;
           border-radius: 16px;
           padding: 24px;
           box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
           border: 1px solid #f1f5f9;
         }

         .summary-title {
           font-size: 18px;
           font-weight: 700;
           color: #1e293b;
           display: flex;
           align-items: center;
           gap: 8px;
           margin: 0 0 20px 0;
         }

         .summary-list {
           display: flex;
           flex-direction: column;
           gap: 16px;
         }

         .summary-item {
           display: flex;
           align-items: center;
           gap: 12px;
           padding: 12px;
           background: #f8fafc;
           border-radius: 12px;
           transition: all 0.2s ease;
         }

         .summary-item:hover {
           background: #f1f5f9;
         }

         .item-avatar {
           width: 40px;
           height: 40px;
           border-radius: 10px;
           background: linear-gradient(135deg, #3b82f6, #1d4ed8);
           display: flex;
           align-items: center;
           justify-content: center;
           color: white;
           flex-shrink: 0;
         }

         .item-avatar.product {
           background: linear-gradient(135deg, #f59e0b, #d97706);
         }

         .item-info {
           flex: 1;
           display: flex;
           flex-direction: column;
           gap: 2px;
         }

         .item-name {
           font-size: 14px;
           font-weight: 600;
           color: #1e293b;
         }

         .item-meta {
           font-size: 12px;
           color: #64748b;
         }

         .item-status {
           padding: 4px 8px;
           border-radius: 12px;
           font-size: 11px;
           font-weight: 600;
         }

         .item-status.active {
           background: rgba(16, 185, 129, 0.1);
           color: #10b981;
         }

         .item-price {
           font-size: 14px;
           font-weight: 700;
           color: #1e293b;
         }

         .marketing-widgets {
           display: flex;
           flex-direction: column;
           gap: 24px;
         }

         .widget-row {
           display: grid;
           grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
           gap: 24px;
         }

         .widget {
           background: white;
           border-radius: 16px;
           box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
           border: 1px solid #f1f5f9;
           overflow: hidden;
         }

         .widget.full-width {
           grid-column: 1 / -1;
         }

         .widget-header {
           padding: 20px 24px 16px;
           border-bottom: 1px solid #f1f5f9;
           display: flex;
           justify-content: space-between;
           align-items: center;
         }

         .widget-title {
           font-size: 16px;
           font-weight: 700;
           color: #1e293b;
           display: flex;
           align-items: center;
           gap: 8px;
           margin: 0;
         }

         .widget-actions {
           display: flex;
           gap: 8px;
         }

         .widget-btn {
           display: flex;
           align-items: center;
           gap: 6px;
           padding: 6px 12px;
           border: 1px solid #e2e8f0;
           background: white;
           color: #64748b;
           border-radius: 8px;
           font-size: 12px;
           font-weight: 500;
           cursor: pointer;
           transition: all 0.2s ease;
         }

         .widget-btn:hover {
           background: #3b82f6;
           color: white;
           border-color: #3b82f6;
         }

         .widget-content {
           padding: 20px 24px;
         }

         .campaign-list {
           display: flex;
           flex-direction: column;
           gap: 12px;
         }

         .campaign-item {
           display: flex;
           align-items: center;
           gap: 12px;
           padding: 12px;
           background: #f8fafc;
           border-radius: 12px;
           transition: all 0.2s ease;
         }

         .campaign-item:hover {
           background: #f1f5f9;
         }

         .campaign-status {
           width: 8px;
           height: 8px;
           border-radius: 50%;
           flex-shrink: 0;
         }

         .campaign-status.active {
           background: #10b981;
         }

         .campaign-status.paused {
           background: #f59e0b;
         }

         .campaign-status.draft {
           background: #64748b;
         }

         .campaign-info {
           flex: 1;
           display: flex;
           flex-direction: column;
           gap: 2px;
         }

         .campaign-name {
           font-size: 14px;
           font-weight: 600;
           color: #1e293b;
         }

         .campaign-meta {
           font-size: 12px;
           color: #64748b;
         }

         .campaign-metrics {
           text-align: right;
         }

         .time-selector {
           display: flex;
           gap: 8px;
         }

         .time-select {
           padding: 6px 12px;
           border: 1px solid #e2e8f0;
           background: white;
           color: #64748b;
           border-radius: 8px;
           font-size: 12px;
           cursor: pointer;
         }

         .performance-chart {
           display: flex;
           flex-direction: column;
           gap: 16px;
         }

         .chart-bars {
           display: flex;
           align-items: end;
           gap: 12px;
           height: 120px;
           padding: 0 8px;
         }

         .chart-bar {
           flex: 1;
           background: linear-gradient(135deg, #e2e8f0, #cbd5e1);
           border-radius: 4px 4px 0 0;
           position: relative;
           cursor: pointer;
           transition: all 0.3s ease;
           display: flex;
           align-items: end;
           justify-content: center;
           padding-bottom: 8px;
         }

         .chart-bar.active {
           background: linear-gradient(135deg, #3b82f6, #1d4ed8);
         }

         .chart-bar:hover {
           background: linear-gradient(135deg, #3b82f6, #1d4ed8);
         }

         .bar-label {
           font-size: 11px;
           font-weight: 600;
           color: white;
         }

         .chart-legend {
           display: flex;
           gap: 16px;
           justify-content: center;
         }

         .legend-item {
           display: flex;
           align-items: center;
           gap: 6px;
           font-size: 12px;
           color: #64748b;
         }

         .legend-color {
           width: 12px;
           height: 12px;
           border-radius: 2px;
         }

         .legend-color.primary {
           background: linear-gradient(135deg, #3b82f6, #1d4ed8);
         }

         .analytics-tabs {
           display: flex;
           gap: 4px;
         }

         .tab-btn {
           padding: 6px 12px;
           border: none;
           background: transparent;
           color: #64748b;
           border-radius: 8px;
           font-size: 12px;
           font-weight: 500;
           cursor: pointer;
           transition: all 0.2s ease;
         }

         .tab-btn.active,
         .tab-btn:hover {
           background: #3b82f6;
           color: white;
         }

         .analytics-grid {
           display: grid;
           grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
           gap: 20px;
         }

         .analytics-metric {
           display: flex;
           align-items: center;
           gap: 12px;
           padding: 16px;
           background: #f8fafc;
           border-radius: 12px;
         }

         .metric-icon {
           width: 40px;
           height: 40px;
           border-radius: 10px;
           background: linear-gradient(135deg, #3b82f6, #1d4ed8);
           display: flex;
           align-items: center;
           justify-content: center;
           color: white;
           flex-shrink: 0;
         }

         .metric-data {
           display: flex;
           flex-direction: column;
           gap: 2px;
         }

         .metric-change {
           font-size: 11px;
           font-weight: 600;
           padding: 2px 6px;
           border-radius: 8px;
           display: inline-block;
           width: fit-content;
         }

         .metric-change.positive {
           background: rgba(16, 185, 129, 0.1);
           color: #10b981;
         }

         .metric-change.negative {
           background: rgba(239, 68, 68, 0.1);
           color: #ef4444;
         }

         @media (max-width: 768px) {
           .dashboard-header {
             flex-direction: column;
             gap: 16px;
             align-items: stretch;
           }

           .metrics-grid {
             grid-template-columns: 1fr;
           }

           .dashboard-summary {
             grid-template-columns: 1fr;
           }

           .widget-row {
             grid-template-columns: 1fr;
           }

           .analytics-grid {
             grid-template-columns: 1fr;
           }
         }

         /* Modern Dashboard Styles */
         .minimalist-dashboard {
           padding: 30px;
           max-width: 1400px;
           margin: 0 auto;
           height: calc(100vh - 80px);
           overflow: hidden;
           background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
           font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
         }

         .minimalist-header {
           display: flex;
           justify-content: space-between;
           align-items: center;
           margin-bottom: 40px;
           position: relative;
         }

         .minimalist-header::after {
           content: '';
           position: absolute;
           bottom: -15px;
           left: 0;
           right: 0;
           height: 2px;
           background: linear-gradient(90deg, #667eea, #764ba2, #f093fb);
           border-radius: 1px;
         }

         .minimalist-title {
           font-size: 32px;
           font-weight: 800;
           background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
           -webkit-background-clip: text;
           -webkit-text-fill-color: transparent;
           background-clip: text;
           text-shadow: 0 2px 4px rgba(0,0,0,0.1);
         }

         .minimalist-metrics {
           display: grid;
           grid-template-columns: repeat(4, 1fr);
           gap: 15px;
           margin-bottom: 30px;
         }

         .minimalist-metric {
           background: linear-gradient(145deg, #ffffff, #f8fafc);
           padding: 20px 15px;
           border-radius: 16px;
           box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06), 0 1px 4px rgba(0, 0, 0, 0.03);
           text-align: center;
           transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
           border: 1px solid rgba(255, 255, 255, 0.8);
           position: relative;
           overflow: hidden;
           min-height: 120px;
           display: flex;
           flex-direction: column;
           justify-content: center;
           align-items: center;
         }

         .minimalist-metric::before {
           content: '';
           position: absolute;
           top: 0;
           left: -100%;
           width: 100%;
           height: 100%;
           background: linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.1), transparent);
           transition: left 0.6s;
         }

         .minimalist-metric:hover::before {
           left: 100%;
         }

         .minimalist-metric:hover {
           transform: translateY(-4px) scale(1.01);
           box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(102, 126, 234, 0.15);
           border-color: rgba(102, 126, 234, 0.25);
         }

         .minimalist-metric-icon {
           width: 32px;
           height: 32px;
           margin: 0 auto 10px;
           color: #667eea;
           filter: drop-shadow(0 1px 3px rgba(102, 126, 234, 0.2));
         }

         .minimalist-metric-value {
           font-size: 24px;
           font-weight: 800;
           background: linear-gradient(135deg, #1a1a1a 0%, #4a5568 100%);
           -webkit-background-clip: text;
           -webkit-text-fill-color: transparent;
           background-clip: text;
           margin-bottom: 6px;
           text-shadow: 0 1px 2px rgba(0,0,0,0.1);
         }

         .minimalist-metric-label {
           font-size: 12px;
           color: #64748b;
           font-weight: 600;
           letter-spacing: 0.3px;
           text-transform: uppercase;
         }

         .dashboard-grid {
           display: grid;
           grid-template-columns: 1fr 1fr;
           gap: 30px;
         }

         .minimalist-chart,
         .simple-chart {
           background: linear-gradient(145deg, #ffffff, #f8fafc);
           padding: 35px;
           border-radius: 24px;
           box-shadow: 0 12px 40px rgba(0, 0, 0, 0.08), 0 4px 12px rgba(0, 0, 0, 0.04);
           height: 320px;
           border: 1px solid rgba(255, 255, 255, 0.8);
           transition: all 0.3s ease;
           position: relative;
           overflow: hidden;
         }

         .minimalist-chart::before,
         .simple-chart::before,
         .recent-organizations::before {
           content: '';
           position: absolute;
           top: 0;
           left: 0;
           right: 0;
           height: 4px;
           background: linear-gradient(90deg, #667eea, #764ba2, #f093fb);
           border-radius: 24px 24px 0 0;
         }

         .minimalist-chart:hover,
         .simple-chart:hover,
         .recent-organizations:hover {
           transform: translateY(-4px);
           box-shadow: 0 20px 60px rgba(0, 0, 0, 0.12), 0 8px 20px rgba(102, 126, 234, 0.15);
         }

         .recent-organizations {
           background: linear-gradient(145deg, #ffffff, #f8fafc);
           padding: 35px;
           border-radius: 24px;
           box-shadow: 0 12px 40px rgba(0, 0, 0, 0.08), 0 4px 12px rgba(0, 0, 0, 0.04);
           height: 320px;
           border: 1px solid rgba(255, 255, 255, 0.8);
           transition: all 0.3s ease;
           position: relative;
           overflow: hidden;
         }

         .org-list {
           display: flex;
           flex-direction: column;
           gap: 16px;
           height: 200px;
           overflow-y: auto;
           padding-right: 8px;
         }

         .org-list::-webkit-scrollbar {
           width: 6px;
         }

         .org-list::-webkit-scrollbar-track {
           background: #f1f5f9;
           border-radius: 3px;
         }

         .org-list::-webkit-scrollbar-thumb {
           background: linear-gradient(135deg, #667eea, #764ba2);
           border-radius: 3px;
         }

         .org-item {
           display: flex;
           justify-content: space-between;
           align-items: center;
           padding: 16px;
           background: linear-gradient(145deg, #ffffff, #f8fafc);
           border: 1px solid rgba(102, 126, 234, 0.1);
           border-radius: 16px;
           transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
           position: relative;
           overflow: hidden;
         }

         .org-item::before {
           content: '';
           position: absolute;
           top: 0;
           left: -100%;
           width: 100%;
           height: 100%;
           background: linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.05), transparent);
           transition: left 0.5s;
         }

         .org-item:hover::before {
           left: 100%;
         }

         .org-item:hover {
           transform: translateX(4px);
           background: linear-gradient(145deg, #ffffff, #f1f5f9);
           border-color: rgba(102, 126, 234, 0.2);
           box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08), 0 3px 10px rgba(102, 126, 234, 0.1);
         }

         .org-info {
           display: flex;
           align-items: center;
           gap: 16px;
         }

         .org-details {
           display: flex;
           flex-direction: column;
           gap: 4px;
         }

         .org-name {
           font-weight: 700;
           color: #1e293b;
           font-size: 15px;
           letter-spacing: -0.025em;
         }

         .org-code {
           font-size: 13px;
           color: #64748b;
           font-weight: 500;
           opacity: 0.8;
         }

         .org-actions {
           display: flex;
           gap: 10px;
         }

         .action-btn {
           padding: 10px;
           border: none;
           border-radius: 12px;
           cursor: pointer;
           transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
           display: flex;
           align-items: center;
           justify-content: center;
           position: relative;
           overflow: hidden;
         }

         .action-btn::before {
           content: '';
           position: absolute;
           top: 50%;
           left: 50%;
           width: 0;
           height: 0;
           background: rgba(255, 255, 255, 0.3);
           border-radius: 50%;
           transform: translate(-50%, -50%);
           transition: width 0.3s, height 0.3s;
         }

         .action-btn:hover::before {
           width: 100px;
           height: 100px;
         }

         .action-btn.edit {
           background: linear-gradient(135deg, #3b82f6, #1d4ed8);
           color: white;
           box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
         }

         .action-btn.edit:hover {
           transform: translateY(-2px) scale(1.05);
           box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4);
         }

         .action-btn.delete {
           background: linear-gradient(135deg, #ef4444, #dc2626);
           color: white;
           box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
         }

         .action-btn.delete:hover {
           transform: translateY(-2px) scale(1.05);
           box-shadow: 0 8px 20px rgba(239, 68, 68, 0.4);
         }

         .no-organizations {
           display: flex;
           flex-direction: column;
           align-items: center;
           justify-content: center;
           height: 100%;
           color: #64748b;
           gap: 12px;
           font-weight: 500;
         }

         .chart-title {
           font-size: 20px;
           font-weight: 700;
           background: linear-gradient(135deg, #1e293b 0%, #475569 100%);
           -webkit-background-clip: text;
           -webkit-text-fill-color: transparent;
           background-clip: text;
           margin-bottom: 25px;
           text-align: center;
           letter-spacing: -0.025em;
         }

         .bar-chart {
           display: flex;
           align-items: end;
           justify-content: space-between;
           height: 200px;
           gap: 16px;
           padding: 0 10px;
         }

         .bar {
           flex: 1;
           background: linear-gradient(to top, #667eea 0%, #764ba2 50%, #f093fb 100%);
           border-radius: 8px 8px 0 0;
           position: relative;
           transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
           min-height: 30px;
           box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
         }

         .bar::before {
           content: '';
           position: absolute;
           top: 0;
           left: 0;
           right: 0;
           bottom: 0;
           background: linear-gradient(to top, rgba(255,255,255,0.1), rgba(255,255,255,0.3));
           border-radius: 8px 8px 0 0;
           opacity: 0;
           transition: opacity 0.3s ease;
         }

         .bar:hover {
           transform: translateY(-4px) scale(1.02);
           box-shadow: 0 12px 25px rgba(102, 126, 234, 0.3), 0 4px 12px rgba(118, 75, 162, 0.2);
         }

         .bar:hover::before {
           opacity: 1;
         }

         .bar-label {
           position: absolute;
           bottom: -25px;
           left: 50%;
           transform: translateX(-50%);
           font-size: 12px;
           color: #6b7280;
           font-weight: 500;
         }

         .bar-value {
           position: absolute;
           top: -25px;
           left: 50%;
           transform: translateX(-50%);
           font-size: 12px;
           color: #1a1a1a;
           font-weight: 600;
         }

         @media (max-width: 768px) {
           .minimalist-metrics {
             grid-template-columns: repeat(2, 1fr);
             gap: 12px;
           }

           .minimalist-metric {
             min-height: 100px;
             padding: 15px 10px;
           }

           .minimalist-metric-icon {
             width: 28px;
             height: 28px;
             margin: 0 auto 8px;
           }

           .minimalist-metric-value {
             font-size: 20px;
             margin-bottom: 4px;
           }

           .minimalist-metric-label {
             font-size: 11px;
           }

           .minimalist-dashboard {
             padding: 20px;
           }

           .dashboard-grid {
             grid-template-columns: 1fr;
           }

           .minimalist-chart,
           .simple-chart,
           .recent-organizations {
             padding: 20px;
             height: 250px;
           }

           .org-list {
             height: 150px;
           }
         }
       `}</style>
      
      <div className="dashboard">
        <nav className="navbar">
          <div className="nav-container">
            <div className="nav-logo">
              <LogoIcon size={32} />
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
                <DashboardIcon size={16} />
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
                <OrganizationIcon size={16} />
                <span>Organizaciones</span>
              </a>
              <a 
                href="#concepto-creativo" 
                data-section="concepto-creativo" 
                className={`nav-link ${activeSection === 'concepto-creativo' ? 'active' : ''}`}
                onClick={() => handleNavClick('concepto-creativo')}
              >
                <CreativeIcon size={16} />
                <span>Concepto Creativo</span>
              </a>
              <a 
                href="#patients" 
                data-section="patients" 
                className={`nav-link ${activeSection === 'patients' ? 'active' : ''}`}
                onClick={() => handleNavClick('patients')}
              >
                <PatientsIcon size={16} />
                <span>Pacientes</span>
              </a>
            </div>

            <div className="header-actions">
              <div className="user-avatar-container">
                <div className="user-avatar" onClick={toggleUserMenu}>
                  <Image 
                    src={currentUser?.user_metadata?.avatar_url || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"} 
                    alt={currentUser?.user_metadata?.name || "Usuario"} 
                    width={40}
                    height={40}
                    className="avatar-image"
                  />
                  <div className="user-info">
                    <span className="user-name">{currentUser?.user_metadata?.name || "Usuario"}</span>
                    <span className="user-role">{currentUser?.email || "Usuario"}</span>
                  </div>
                  <ChevronDownIcon size={12} className={`dropdown-arrow ${isUserMenuOpen ? 'open' : ''}`} />
                </div>
                
                {isUserMenuOpen && (
                  <div className="user-dropdown">
                    <button className="logout-btn" onClick={handleLogout}>
                      <LogoutIcon size={16} />
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
                <div className="minimalist-dashboard">
                  <div className="minimalist-header">
                    <h1 className="minimalist-title">Dashboard de Marketing</h1>
                  </div>
                  
                  {/* Métricas en Cards */}
                  <div className="minimalist-metrics">
                    <div className="minimalist-metric">
                      <div className="minimalist-metric-icon">
                        <OrganizationIcon size={32} />
                      </div>
                      <div className="minimalist-metric-value">{organizations.length}</div>
                      <div className="minimalist-metric-label">Organizaciones</div>
                    </div>
                    <div className="minimalist-metric">
                      <div className="minimalist-metric-icon">
                        <ProductIcon size={32} />
                      </div>
                      <div className="minimalist-metric-value">{products.length}</div>
                      <div className="minimalist-metric-label">Productos</div>
                    </div>
                    <div className="minimalist-metric">
                      <div className="minimalist-metric-icon">
                        <CreativeIcon size={32} />
                      </div>
                      <div className="minimalist-metric-value">12</div>
                      <div className="minimalist-metric-label">Conceptos</div>
                    </div>
                    <div className="minimalist-metric">
                      <div className="minimalist-metric-icon">
                        <ChartIcon size={32} />
                      </div>
                      <div className="minimalist-metric-value">285%</div>
                      <div className="minimalist-metric-label">ROI</div>
                    </div>
                  </div>

                  {/* Layout de dos columnas */}
                  <div className="dashboard-grid">
                    {/* Gráfica de Barras Simple */}
                    <div className="minimalist-chart">
                      <h3 className="chart-title">Rendimiento Mensual</h3>
                      <div className="bar-chart">
                        <div className="bar" style={{height: '60%'}}>
                          <span className="bar-value">85%</span>
                          <span className="bar-label">Ene</span>
                        </div>
                        <div className="bar" style={{height: '75%'}}>
                          <span className="bar-value">92%</span>
                          <span className="bar-label">Feb</span>
                        </div>
                        <div className="bar" style={{height: '90%'}}>
                          <span className="bar-value">98%</span>
                          <span className="bar-label">Mar</span>
                        </div>
                        <div className="bar active" style={{height: '85%'}}>
                          <span className="bar-value">95%</span>
                          <span className="bar-label">Abr</span>
                        </div>
                        <div className="bar" style={{height: '70%'}}>
                          <span className="bar-value">88%</span>
                          <span className="bar-label">May</span>
                        </div>
                        <div className="bar" style={{height: '80%'}}>
                          <span className="bar-value">93%</span>
                          <span className="bar-label">Jun</span>
                        </div>
                      </div>
                    </div>

                    {/* Organizaciones Recientes */}
                    <div className="recent-organizations">
                      <h3 className="chart-title">Organizaciones Recientes</h3>
                      <div className="org-list">
                        {organizations.slice(0, 4).map((org, index) => (
                          <div key={org.id} className="org-item">
                            <div className="org-info">
                              <OrganizationIcon size={20} />
                              <div className="org-details">
                                <span className="org-name">{org.name}</span>
                                <span className="org-code">ORG-{String(index + 1).padStart(3, '0')}</span>
                              </div>
                            </div>
                            <div className="org-actions">
                              <button 
                                className="action-btn edit"
                                onClick={() => handleEditOrganization(org)}
                                title="Editar organización"
                              >
                                <EditIcon size={16} />
                              </button>
                              <button 
                                className="action-btn delete"
                                onClick={() => handleDeleteOrganization(org.id)}
                                title="Eliminar organización"
                              >
                                <DeleteIcon size={16} />
                              </button>
                            </div>
                          </div>
                        ))}
                        {organizations.length === 0 && (
                          <div className="no-organizations">
                            <OrganizationIcon size={24} />
                            <span>No hay organizaciones</span>
                          </div>
                        )}
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
                      <OrganizationIcon />
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
                      <AddIcon />
                      Nueva Organización
                    </button>
                  </div>
                  
                  <div className="page-content">
                    <div className="search-filters">
                      <div className="search-box">
                        <SearchIcon />
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
                                    <OrganizationIcon />
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
                                    <EditIcon />
                                  </button>
                                  <button 
                                    className="action-btn delete"
                                    onClick={() => handleDeleteOrganization(org.id)}
                                    title="Eliminar organización"
                                  >
                                    <DeleteIcon />
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
                  <div className="page-header compact">
                    <h1 className="page-title">
                      <CreativeIcon />
                      Concepto Creativo
                    </h1>
                    <p className="page-description">
                      Crea conceptos creativos seleccionando una organización, sus productos y agregando un brief de campaña.
                    </p>
                  </div>
                  
                  <div className="page-content">
                    <div className="concepto-form-compact">
                      {/* Selector de Organización - Compacto */}
                      <div className="form-section-compact">
                        <h3 className="section-title-compact">
                          <OrganizationIcon />
                          Organización
                        </h3>
                        <select 
                          value={conceptoCreativo.organizacion}
                          onChange={(e) => handleOrganizacionChange(e.target.value)}
                          className="form-select-compact"
                        >
                          <option value="">Selecciona una organización...</option>
                          {organizations.map((org) => (
                            <option key={org.id} value={org.id}>
                              {org.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Layout de dos columnas para productos y personas */}
                      {conceptoCreativo.organizacion && (
                        <div className="two-column-layout">
                          {/* Columna izquierda - Productos */}
                          <div className="form-section-compact">
                            <h3 className="section-title-compact">
                              <ProductIcon />
                              Productos ({products.length})
                            </h3>
                            <div className="products-grid-compact">
                              {products.length === 0 ? (
                                <div className="no-items-compact">
                                  <ProductIcon />
                                  <span>No hay productos disponibles</span>
                                </div>
                              ) : (
                                products.map((product) => (
                                  <div 
                                    key={product.id} 
                                    className={`item-card-compact ${
                                      conceptoCreativo.productos.includes(product.id) ? 'selected' : ''
                                    }`}
                                    onClick={() => handleProductoToggle(product.id)}
                                  >
                                    <div className="item-header-compact">
                                      <span className="item-name">{product.name}</span>
                                      <input 
                                        type="checkbox" 
                                        checked={conceptoCreativo.productos.includes(product.id)}
                                        onChange={() => handleProductoToggle(product.id)}
                                      />
                                    </div>
                                    <div className="item-details-compact">
                                      <span className="item-category">{product.category}</span>
                                      <span className="item-price">
                                        {product.currency} {product.price?.toLocaleString()}
                                      </span>
                                    </div>
                                  </div>
                                ))
                              )}
                            </div>
                          </div>

                          {/* Columna derecha - Buyer Personas */}
                          <div className="form-section-compact">
                            <h3 className="section-title-compact">
                              <PersonaIcon />
                              Buyer Personas ({conceptoBuyerPersonas.length})
                            </h3>
                            <div className="personas-grid-compact">
                              {conceptoBuyerPersonas.length === 0 ? (
                                <div className="no-items-compact">
                                  <PersonaIcon />
                                  <span>No hay buyer personas disponibles</span>
                                </div>
                              ) : (
                                conceptoBuyerPersonas.map((persona) => (
                                  <div key={persona.id} className="item-card-compact persona">
                                    <div className="item-header-compact">
                                      <span className="item-name">{persona.personaName}</span>
                                    </div>
                                    <div className="persona-info-compact">
                                      <span><AgeIcon /> {persona.ageRange}</span>
                                      <span><OccupationIcon /> {persona.occupation}</span>
                                      <span><LocationIcon /> {persona.location}</span>
                                    </div>
                                  </div>
                                ))
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Brief de Campaña - Compacto */}
                      <div className="form-section-compact">
                        <h3 className="section-title-compact">
                          <i className="fas fa-file-alt"></i>
                          Brief de Campaña
                          <span className="optional">(Opcional)</span>
                        </h3>
                        <div className="brief-container-compact">
                          <textarea
                            value={conceptoCreativo.brief}
                            onChange={(e) => handleBriefChange(e.target.value)}
                            placeholder="Describe los objetivos, público objetivo, mensaje clave y tono de comunicación..."
                            className="brief-textarea-compact"
                            rows={4}
                          />
                          <div className="brief-counter-compact">
                            {conceptoCreativo.brief.length} caracteres
                          </div>
                        </div>
                      </div>

                      {/* Resumen del Concepto - Compacto */}
                      {(conceptoCreativo.organizacion || conceptoCreativo.productos.length > 0 || conceptoCreativo.brief) && (
                        <div className="form-section-compact summary">
                          <h3 className="section-title-compact">
                            <i className="fas fa-eye"></i>
                            Resumen
                          </h3>
                          <div className="concepto-summary-compact">
                            {conceptoCreativo.organizacion && (
                              <div className="summary-row">
                                <strong>Organización:</strong>
                                <span>{organizations.find(org => org.id === conceptoCreativo.organizacion)?.name}</span>
                              </div>
                            )}
                            
                            {conceptoCreativo.productos.length > 0 && (
                              <div className="summary-row">
                                <strong>Productos ({conceptoCreativo.productos.length}):</strong>
                                <div className="selected-items">
                                  {conceptoCreativo.productos.map(prodId => {
                                    const product = products.find(p => p.id === prodId);
                                    return product ? (
                                      <span key={prodId} className="item-tag">
                                        {product.name}
                                      </span>
                                    ) : null;
                                  })}
                                </div>
                              </div>
                            )}
                            
                            {conceptoCreativo.brief && (
                              <div className="summary-row">
                                <strong>Brief:</strong>
                                <p className="brief-preview-compact">
                                  {conceptoCreativo.brief.length > 150 
                                    ? `${conceptoCreativo.brief.substring(0, 150)}...` 
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