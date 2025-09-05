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

  useEffect(() => {
    loadInitialData();
  }, []);

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
        
        .nav-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        
        .nav-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          font-weight: 700;
          color: #3b82f6;
          text-decoration: none;
        }
        
        .logo-text {
          display: flex;
          flex-direction: column;
          line-height: 1.2;
        }
        
        .logo-main {
          font-size: 18px;
          font-weight: 800;
          color: #3b82f6;
        }
        
        .logo-sub {
          font-size: 10px;
          font-weight: 500;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem 20px;
        }
        
        .page-header {
          text-align: center;
          margin-bottom: 3rem;
        }
        
        .page-title {
          font-size: 2.5rem;
          font-weight: 800;
          color: #1e293b;
          margin-bottom: 0.5rem;
          background: linear-gradient(135deg, #1e293b, #3b82f6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .page-description {
          font-size: 1.1rem;
          color: #64748b;
          max-width: 600px;
          margin: 0 auto;
        }
        
        .form-container {
          background: rgba(255, 255, 255, 0.8);
          border-radius: 16px;
          padding: 2rem;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .form-section {
          margin-bottom: 2rem;
        }
        
        .section-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .form-group {
          margin-bottom: 1.5rem;
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
        
        .sidebar-card {
          background: rgba(255, 255, 255, 0.8);
          border-radius: 16px;
          padding: 1.5rem;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          margin-bottom: 1rem;
        }
        
        .sidebar-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .persona-item {
          background: rgba(248, 250, 252, 0.8);
          border-radius: 8px;
          padding: 0.75rem;
          margin-bottom: 0.5rem;
        }
        
        .persona-name {
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 0.25rem;
        }
        
        .persona-details {
          color: #64748b;
          font-size: 0.875rem;
        }
        
        @media (max-width: 768px) {
          .container {
            padding: 1rem 10px;
          }
          
          .form-container {
            padding: 1.5rem;
          }
          
          .page-title {
            font-size: 2rem;
          }
        }
      `}</style>

      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-logo">
            <CreativeIcon className="h-6 w-6" />
            <div className="logo-text">
              <div className="logo-main">INGENES</div>
              <div className="logo-sub">Marketing</div>
            </div>
          </div>
        </div>
      </nav>

      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Generador de Conceptos Creativos</h1>
          <p className="page-description">
            Crea estrategias de marketing personalizadas para tus productos
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulario */}
          <div className="lg:col-span-2">
            <div className="form-container">
              <div className="form-section">
                <h2 className="section-title">
                  <CreativeIcon className="h-5 w-5" />
                  Configurar Concepto Creativo
                </h2>

                {/* Organización */}
                <div className="form-group">
                  <label className="form-label">
                    <OrganizationIcon className="inline h-4 w-4 mr-1" />
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

                {/* Productos */}
                <div className="form-group">
                  <label className="form-label">
                    <ProductIcon className="inline h-4 w-4 mr-1" />
                    Productos
                  </label>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {filteredProducts.map(product => (
                      <label key={product.id} className="flex items-center">
                        <input
                          type="checkbox"
                          value={product.id}
                          checked={selectedProducts.includes(product.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedProducts([...selectedProducts, product.id]);
                            } else {
                              setSelectedProducts(selectedProducts.filter(id => id !== product.id));
                            }
                          }}
                          className="mr-2 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{product.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Brief */}
                <div className="form-group">
                  <label className="form-label">
                    <PersonaIcon className="inline h-4 w-4 mr-1" />
                    Brief del Cliente
                  </label>
                  <textarea
                    value={brief}
                    onChange={(e) => setBrief(e.target.value)}
                    rows={4}
                    placeholder="Describe los objetivos, público objetivo, mensajes clave, y cualquier requerimiento específico..."
                    className="form-input form-textarea"
                  />
                </div>

                {/* Botón Generar */}
                <button
                  onClick={handleGenerateConcept}
                  disabled={isGenerating || !selectedOrganization || selectedProducts.length === 0 || !brief}
                  className="btn btn-primary w-full"
                >
                  {isGenerating ? 'Generando...' : 'Generar Concepto Creativo'}
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Resumen */}
            <div className="sidebar-card">
              <h3 className="sidebar-title">
                <ChartIcon className="h-5 w-5" />
                Resumen de Selección
              </h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-600">Organización:</span>
                  <span className="ml-2 font-medium">
                    {organizations.find(org => org.id === selectedOrganization)?.name || 'No seleccionada'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Productos:</span>
                  <span className="ml-2 font-medium">{selectedProducts.length}</span>
                </div>
                <div>
                  <span className="text-gray-600">Brief:</span>
                  <span className="ml-2 font-medium">{brief ? 'Completado' : 'Pendiente'}</span>
                </div>
              </div>
            </div>

            {/* Buyer Personas */}
            <div className="sidebar-card">
              <h3 className="sidebar-title">
                <PersonaIcon className="h-5 w-5" />
                Buyer Personas Disponibles
              </h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {buyerPersonas.map(persona => (
                  <div key={persona.id} className="persona-item">
                    <div className="persona-name">{persona.persona_name}</div>
                    <div className="persona-details">{persona.age_range} • {persona.occupation}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Resultado */}
        {generatedConcept && (
          <div className="mt-8">
            <div className="form-container">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  <CheckIcon className="inline h-5 w-5 mr-2 text-green-500" />
                  Concepto Creativo Generado
                </h2>
                <button
                  onClick={() => {
                    const blob = new Blob([generatedConcept], { type: 'text/markdown' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'concepto-creativo.md';
                    a.click();
                  }}
                  className="btn btn-primary"
                >
                  Descargar
                </button>
              </div>
              <div className="prose max-w-none">
                <pre className="whitespace-pre-wrap text-sm bg-gray-50 p-4 rounded">
                  {generatedConcept}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ConceptoCreativoPage;