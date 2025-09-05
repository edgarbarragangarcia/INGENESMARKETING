'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { authService } from '@/lib/supabase';
import {
  CreativeIcon,
  OrganizationIcon,
  ProductIcon,
  PersonaIcon,
  CheckIcon,
  ChartIcon
} from './Icons';
import Image from 'next/image';

interface Organization {
  id: string;
  name: string;
  mission: string;
  vision: string;
  strategic_objectives: string[];
  logo_url?: string;
}

interface Product {
  id: string;
  organization_id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  currency: string;
}

interface BuyerPersona {
  id: string;
  persona_name: string;
  age_range: string;
  gender: string;
  occupation: string;
  income_level: string;
  education_level: string;
  location: string;
  pain_points: string[];
  goals: string[];
  preferred_channels: string[];
  behavior_patterns: string;
  motivations: string;
  frustrations: string;
}

const ConceptoCreativoPage: React.FC = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [buyerPersonas, setBuyerPersonas] = useState<BuyerPersona[]>([]);
  const [selectedOrganization, setSelectedOrganization] = useState<string>('');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [brief, setBrief] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [generatedConcept, setGeneratedConcept] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'create' | 'view'>('create');
  const [createdConcepts, setCreatedConcepts] = useState<Array<{
    id: string;
    title: string;
    organization: string;
    products: string[];
    brief: string;
    concept: string;
    createdAt: Date;
  }>>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    loadInitialData();
    loadCurrentUser();
  }, []);

  const loadCurrentUser = async () => {
    try {
      const user = await authService.getCurrentUser();
      setCurrentUser(user);
    } catch (error) {
      console.error('Error loading current user:', error);
    }
  };

  const handleNavClick = (section: string) => {
    window.location.hash = section;
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = async () => {
    try {
      await authService.signOut();
      window.location.href = '/';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const loadInitialData = async () => {
    try {
      setIsLoading(true);
      const user = await authService.getCurrentUser();
      if (!user) return;

      // Cargar organizaciones
      const { data: orgsData } = await supabase
        .from('organizations')
        .select('*')
        .eq('created_by', user.id);

      if (orgsData) {
        setOrganizations(orgsData);
      }

      // Cargar productos
      const { data: productsData } = await supabase
        .from('products')
        .select('id, organization_id, name, description, category, price, currency');

      if (productsData) {
        setProducts(productsData as Product[]);
      }

      // Cargar buyer personas
      const { data: personasData } = await supabase
        .from('buyer_personas')
        .select('*');

      if (personasData) {
        setBuyerPersonas(personasData);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateConcept = async () => {
    if (!selectedOrganization || selectedProducts.length === 0 || !brief) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }

    setIsGenerating(true);
    try {
      // Simular generación de concepto creativo
      const organization = organizations.find(org => org.id === selectedOrganization);
      const selectedProductsData = products.filter(product => selectedProducts.includes(product.id));
      
      const concept = `
# Concepto Creativo: ${organization?.name}

## Resumen Ejecutivo
Concepto estratégico diseñado para ${organization?.mission}

## Productos Seleccionados
${selectedProductsData.map(product => `- ${product.name}: ${product.description}`).join('\n')}

## Brief del Cliente
${brief}

## Dirección Creativa
Basándonos en el análisis de mercado y perfiles de buyer personas, proponemos:

1. **Mensaje Principal**: Enfocado en los valores de ${organization?.vision}
2. **Tono y Estilo**: Profesional, innovador y cercano
3. **Canales Prioritarios**: Redes sociales, email marketing y contenido web
4. **CTAs Estratégicos**: Orientados a conversión y engagement

## Próximos Pasos
- Validación con stakeholders
- Desarrollo de materiales visuales
- Planificación de campaña
- Métricas y KPIs
      `;

      setGeneratedConcept(concept);
    } catch (error) {
      console.error('Error generating concept:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveConcept = () => {
    if (!generatedConcept) return;
    
    const organization = organizations.find(org => org.id === selectedOrganization);
    const selectedProductsData = products.filter(product => selectedProducts.includes(product.id));
    
    const newConcept = {
      id: Date.now().toString(),
      title: `Concepto Creativo: ${organization?.name || 'Sin título'}`,
      organization: organization?.name || '',
      products: selectedProductsData.map(p => p.name),
      brief,
      concept: generatedConcept,
      createdAt: new Date()
    };
    
    setCreatedConcepts(prev => [newConcept, ...prev]);
    setGeneratedConcept('');
    setBrief('');
    setSelectedProducts([]);
    setSelectedOrganization('');
  };

  const filteredProducts = selectedOrganization 
    ? products.filter(product => product.organization_id === selectedOrganization)
    : products;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando datos...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: linear-gradient(135deg, 
            rgba(255, 182, 193, 0.1) 0%,
            rgba(173, 216, 230, 0.1) 25%,
            rgba(221, 160, 221, 0.1) 50%,
            rgba(255, 218, 185, 0.1) 75%,
            rgba(240, 248, 255, 0.1) 100%);
          min-height: 100vh;
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
          padding: 1rem 0;
          position: sticky;
          top: 0;
          z-index: 100;
        }
        
        .tabbar {
          background: white;
          border-bottom: 1px solid #e5e7eb;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
        }
        
        .tab-button {
          position: relative;
          padding: 1rem 1.5rem;
          font-weight: 500;
          color: #6b7280;
          background: none;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .tab-button:hover {
          color: #374151;
          background-color: #f9fafb;
        }
        
        .tab-button.active {
          color: #6366f1;
          background-color: #f3f4f6;
        }
        
        .tab-button.active::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 2px;
          background-color: #6366f1;
        }
        
        .concept-card {
          background: white;
          border-radius: 0.5rem;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
          padding: 1.5rem;
          margin-bottom: 1rem;
          transition: box-shadow 0.3s ease;
        }
        
        .concept-card:hover {
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        
        .form-container {
          background: rgba(255, 255, 255, 0.9);
          border-radius: 16px;
          padding: 2rem;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .form-label {
          display: block;
          font-weight: 600;
          color: #374151;
          margin-bottom: 0.5rem;
          font-size: 14px;
        }
        
        .form-input {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 14px;
          transition: border-color 0.2s;
          background: white;
        }
        
        .form-input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        
        .form-textarea {
          min-height: 100px;
          resize: vertical;
        }
        
        .btn {
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          text-decoration: none;
          border: none;
          font-size: 14px;
        }
        
        .btn-primary {
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          color: white;
        }
        
        .btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
        }
        
        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }
        
        .btn-secondary {
          background: #6b7280;
          color: white;
        }
        
        .btn-secondary:hover {
          background: #4b5563;
        }
        
        .btn-success {
          background: #10b981;
          color: white;
        }
        
        .btn-success:hover {
          background: #059669;
        }
      `}</style>
      
      <div className="min-h-screen bg-gray-50">
        {/* Navigation Header */}
        <nav className="navbar">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="nav-container">
              <div className="nav-left">
                <div className="nav-brand">
                  <CreativeIcon className="h-8 w-8 text-indigo-600" />
                  <span className="brand-text">Ingenes Marketing</span>
                </div>
                
                <div className="nav-links">
                  <a 
                    href="#dashboard" 
                    className="nav-link"
                    onClick={() => handleNavClick('dashboard')}
                  >
                    Dashboard
                  </a>
                  <a 
                    href="#organizaciones" 
                    className="nav-link"
                    onClick={() => handleNavClick('organizaciones')}
                  >
                    Organizaciones
                  </a>
                  <a 
                    href="#concepto-creativo" 
                    className="nav-link active"
                    onClick={() => handleNavClick('concepto-creativo')}
                  >
                    Concepto Creativo
                  </a>
                </div>
              </div>

              <div className="nav-right">
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
                  </div>
                  
                  {isUserMenuOpen && (
                    <div className="user-dropdown">
                      <button className="logout-btn" onClick={handleLogout}>
                        Cerrar Sesión
                      </button>
                    </div>
                  )}
                </div>

                <div className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`} onClick={toggleMobileMenu}>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Tab Navigation */}
        <div className="tabbar">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex">
              <button
                onClick={() => setActiveTab('create')}
                className={`tab-button ${activeTab === 'create' ? 'active' : ''}`}
              >
                <CreativeIcon className="w-4 h-4" />
                Generar Concepto
              </button>
              <button
                onClick={() => setActiveTab('view')}
                className={`tab-button ${activeTab === 'view' ? 'active' : ''}`}
              >
                <ChartIcon className="w-4 h-4" />
                Conceptos Creados ({createdConcepts.length})
              </button>
            </div>
          </div>
        </div>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Create Tab Content */}
          {activeTab === 'create' && (
            <div className="space-y-6">
              <div className="form-container">
                <h2 className="form-label text-xl font-bold mb-4">Crear Nuevo Concepto Creativo</h2>
                
                <div className="space-y-6">
                  {/* Organization Selection */}
                  <div>
                    <label className="form-label">
                      <OrganizationIcon className="inline-block w-4 h-4 mr-2" />
                      Organización
                    </label>
                    <select
                      value={selectedOrganization}
                      onChange={(e) => setSelectedOrganization(e.target.value)}
                      className="form-input"
                    >
                      <option value="">Selecciona una organización</option>
                      {organizations.map(org => (
                        <option key={org.id} value={org.id}>{org.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Products Selection */}
                  <div>
                    <label className="form-label">
                      <ProductIcon className="inline-block w-4 h-4 mr-2" />
                      Productos
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto">
                      {filteredProducts.map(product => (
                        <label key={product.id} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={selectedProducts.includes(product.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedProducts([...selectedProducts, product.id]);
                              } else {
                                setSelectedProducts(selectedProducts.filter(id => id !== product.id));
                              }
                            }}
                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="text-sm text-gray-700">{product.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Brief */}
                  <div>
                    <label className="form-label">
                      <PersonaIcon className="inline-block w-4 h-4 mr-2" />
                      Brief del Cliente
                    </label>
                    <textarea
                      value={brief}
                      onChange={(e) => setBrief(e.target.value)}
                      rows={4}
                      placeholder="Describe el objetivo del concepto creativo, público objetivo, mensajes clave, restricciones, etc."
                      className="form-input form-textarea"
                    />
                  </div>

                  <button
                    onClick={handleGenerateConcept}
                    disabled={!selectedOrganization || selectedProducts.length === 0 || !brief || isGenerating}
                    className="btn btn-primary w-full"
                  >
                    {isGenerating ? 'Generando...' : 'Generar Concepto'}
                  </button>
                </div>
              </div>

              {/* Generated Concept */}
              {generatedConcept && (
                <div className="form-container">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="form-label text-lg font-bold">Concepto Generado</h3>
                    <div className="flex space-x-2">
                      <button
                        onClick={handleSaveConcept}
                        className="btn btn-success"
                      >
                        Guardar Concepto
                      </button>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(generatedConcept);
                          alert('Concepto copiado al portapapeles');
                        }}
                        className="btn btn-secondary"
                      >
                        Copiar
                      </button>
                    </div>
                  </div>
                  <div className="prose max-w-none">
                    <pre className="whitespace-pre-wrap font-mono text-sm bg-gray-50 p-4 rounded">
                      {generatedConcept}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* View Tab Content */}
          {activeTab === 'view' && (
            <div className="space-y-6">
              <div className="form-container">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="form-label text-xl font-bold">Conceptos Creativos Guardados</h2>
                  <button
                    onClick={() => setActiveTab('create')}
                    className="btn btn-primary"
                  >
                    <CreativeIcon className="inline-block w-4 h-4 mr-2" />
                    Nuevo Concepto
                  </button>
                </div>
                
                {createdConcepts.length === 0 ? (
                  <div className="text-center py-12">
                    <CreativeIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No hay conceptos guardados</h3>
                    <p className="text-gray-600 mb-4">Empieza creando tu primer concepto creativo</p>
                    <button
                      onClick={() => setActiveTab('create')}
                      className="btn btn-primary"
                    >
                      Crear Concepto
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {createdConcepts.map((concept) => (
                      <div key={concept.id} className="concept-card">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{concept.title}</h3>
                          <span className="text-sm text-gray-500">
                            {concept.createdAt.toLocaleDateString()}
                          </span>
                        </div>
                        
                        <div className="mb-3">
                          <p className="text-sm text-gray-600 mb-1">
                            <strong>Organización:</strong> {concept.organization}
                          </p>
                          <p className="text-sm text-gray-600">
                            <strong>Productos:</strong> {concept.products.join(', ')}
                          </p>
                        </div>
                        
                        <div className="mb-3">
                          <h4 className="text-sm font-medium text-gray-900 mb-1">Brief:</h4>
                          <p className="text-sm text-gray-600">{concept.brief}</p>
                        </div>
                        
                        <div className="border-t pt-3">
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Concepto:</h4>
                          <div className="prose prose-sm max-w-none">
                            <pre className="whitespace-pre-wrap font-mono text-xs bg-gray-50 p-3 rounded">
                              {concept.concept}
                            </pre>
                          </div>
                        </div>
                        
                        <div className="mt-4 flex space-x-2">
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(concept.concept);
                              alert('Concepto copiado al portapapeles');
                            }}
                            className="btn btn-secondary text-sm"
                          >
                            Copiar
                          </button>
                          <button
                            onClick={() => {
                              const org = organizations.find(org => org.name === concept.organization);
                              if (org) {
                                setSelectedOrganization(org.id);
                              }
                              setBrief(concept.brief);
                              setGeneratedConcept(concept.concept);
                              setActiveTab('create');
                            }}
                            className="btn btn-primary text-sm"
                          >
                            Editar
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default ConceptoCreativoPage;