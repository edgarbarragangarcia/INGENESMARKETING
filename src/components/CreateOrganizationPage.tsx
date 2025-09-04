'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService, supabase } from '@/lib/supabase';

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

function CreateOrganizationPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<OrganizationFormData>({
    name: '',
    mission: '',
    vision: '',
    strategicObjectives: [''],
    logo: null,
    buyerPersonas: [],
    products: []
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = await authService.getCurrentUser();
      
      if (!user) {
        alert('Usuario no autenticado');
        return;
      }

      const organizationData = {
        name: formData.name,
        mission: formData.mission,
        vision: formData.vision,
        strategic_objectives: formData.strategicObjectives.filter(obj => obj.trim() !== ''),
        created_by: user.id
      };

      const { data: organization, error } = await supabase
        .from('organizations')
        .insert([organizationData])
        .select()
        .single();

      if (error) {
        console.error('Error al crear organización:', error);
        alert('Error al crear la organización');
        return;
      }

      alert('Organización creada exitosamente');
      router.push('/#organizaciones');
      
    } catch (error) {
      console.error('Error:', error);
      alert('Error al crear la organización');
    } finally {
      setLoading(false);
    }
  };

  const addObjective = () => {
    setFormData(prev => ({
      ...prev,
      strategicObjectives: [...prev.strategicObjectives, '']
    }));
  };

  const removeObjective = (index: number) => {
    setFormData(prev => ({
      ...prev,
      strategicObjectives: prev.strategicObjectives.filter((_, i) => i !== index)
    }));
  };

  const updateObjective = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      strategicObjectives: prev.strategicObjectives.map((obj, i) => i === index ? value : obj)
    }));
  };

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
          color: #3b82f6;
        }
        
        .logo-sub {
          font-size: 10px;
          font-weight: 500;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .nav-actions {
          display: flex;
          gap: 1rem;
          align-items: center;
        }
        
        .btn {
          padding: 0.5rem 1rem;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          text-decoration: none;
          border: none;
          font-size: 14px;
        }
        
        .btn-secondary {
          background: transparent;
          color: #64748b;
          border: 1px solid #e2e8f0;
        }
        
        .btn-secondary:hover {
          background: #f1f5f9;
          color: #475569;
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
        
        .container {
          max-width: 800px;
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
        
        .section-title i {
          color: #3b82f6;
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
        
        .objectives-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        
        .objective-item {
          display: flex;
          gap: 0.5rem;
          align-items: center;
        }
        
        .objective-input {
          flex: 1;
        }
        
        .btn-remove {
          background: #ef4444;
          color: white;
          border: none;
          padding: 8px 12px;
          border-radius: 6px;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        
        .btn-remove:hover {
          background: #dc2626;
        }
        
        .btn-add {
          background: #10b981;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
          transition: background-color 0.2s;
          margin-top: 0.5rem;
        }
        
        .btn-add:hover {
          background: #059669;
        }
        
        .form-actions {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 1px solid #e5e7eb;
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
          
          .form-actions {
            flex-direction: column;
          }
          
          .nav-container {
            padding: 0 10px;
          }
        }
      `}</style>
      
      <nav className="navbar">
        <div className="nav-container">
          <a href="/" className="nav-logo">
            <i className="fas fa-rocket"></i>
            <div className="logo-text">
              <span className="logo-main">INGENES</span>
              <span className="logo-sub">Marketing</span>
            </div>
          </a>
          
          <div className="nav-actions">
            <button 
              className="btn btn-secondary"
              onClick={() => router.push('/#organizaciones')}
            >
              <i className="fas fa-arrow-left"></i>
              Volver
            </button>
          </div>
        </div>
      </nav>
      
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Nueva Organización</h1>
          <p className="page-description">
            Crea una nueva organización para gestionar tus campañas de marketing y productos.
          </p>
        </div>
        
        <div className="form-container">
          <form onSubmit={handleSubmit}>
            <div className="form-section">
              <h3 className="section-title">
                <i className="fas fa-building"></i>
                Información Básica
              </h3>
              
              <div className="form-group">
                <label className="form-label">Nombre de la Organización *</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ej: INGENES Instituto de Fertilidad"
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Misión *</label>
                <textarea
                  className="form-input form-textarea"
                  value={formData.mission}
                  onChange={(e) => setFormData(prev => ({ ...prev, mission: e.target.value }))}
                  placeholder="Describe la misión de tu organización..."
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Visión *</label>
                <textarea
                  className="form-input form-textarea"
                  value={formData.vision}
                  onChange={(e) => setFormData(prev => ({ ...prev, vision: e.target.value }))}
                  placeholder="Describe la visión de tu organización..."
                  required
                />
              </div>
            </div>
            
            <div className="form-section">
              <h3 className="section-title">
                <i className="fas fa-target"></i>
                Objetivos Estratégicos
              </h3>
              
              <div className="objectives-list">
                {formData.strategicObjectives.map((objective, index) => (
                  <div key={index} className="objective-item">
                    <input
                      type="text"
                      className="form-input objective-input"
                      value={objective}
                      onChange={(e) => updateObjective(index, e.target.value)}
                      placeholder={`Objetivo ${index + 1}`}
                    />
                    {formData.strategicObjectives.length > 1 && (
                      <button
                        type="button"
                        className="btn-remove"
                        onClick={() => removeObjective(index)}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    )}
                  </div>
                ))}
              </div>
              
              <button
                type="button"
                className="btn-add"
                onClick={addObjective}
              >
                <i className="fas fa-plus"></i>
                Agregar Objetivo
              </button>
            </div>
            
            <div className="form-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => router.push('/#organizaciones')}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    Creando...
                  </>
                ) : (
                  <>
                    <i className="fas fa-save"></i>
                    Crear Organización
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default CreateOrganizationPage;