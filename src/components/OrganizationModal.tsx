'use client';

import React, { useState, useEffect } from 'react';

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

interface OrganizationFormData {
  name: string;
  mission: string;
  vision: string;
  strategicObjectives: string[];
  logo: File | null;
  buyerPersonas: BuyerPersona[];
  products: ProductData[];
}

interface Product {
  id?: string | null;
  productName: string;
  productDescription: string;
  category: string;
  price: string;
  currency: string;
  status: string;
}

interface OrganizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: OrganizationFormData) => void;
  editingOrganization?: Organization | null;
  organizationPersonas?: BuyerPersona[];
  organizationProducts?: Product[];
  isEditMode?: boolean;
}

const OrganizationModal: React.FC<OrganizationModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  editingOrganization, 
  organizationPersonas = [], 
  organizationProducts = [], 
  isEditMode = false 
}) => {
  const [activeTab, setActiveTab] = useState('organization');
  const [loading, setLoading] = useState(false);
  
  // Estados para organización
  const [organizationData, setOrganizationData] = useState({
    name: '',
    mission: '',
    vision: '',
    strategicObjectives: [''],
    logo: null as File | null
  });
  
  // Estados para buyer personas
  const [buyerPersonas, setBuyerPersonas] = useState<BuyerPersona[]>([]);
  const [currentPersona, setCurrentPersona] = useState<BuyerPersona>({
    personaName: '',
    ageRange: '',
    gender: '',
    occupation: '',
    incomeLevel: '',
    educationLevel: '',
    location: '',
    painPoints: [''],
    goals: [''],
    preferredChannels: [''],
    behaviorPatterns: '',
    motivations: '',
    frustrations: '',
    personaAvatar: null
  });
  
  // Estados para productos
  const [products, setProducts] = useState<ProductData[]>([]);
  const [currentProduct, setCurrentProduct] = useState<ProductData>({
    productName: '',
    productDescription: '',
    category: '',
    price: '',
    currency: 'USD',
    status: 'active'
  });

  // useEffect para precargar datos en modo de edición
  useEffect(() => {
    if (isEditMode && editingOrganization) {
      // Precargar datos de organización
      setOrganizationData({
        name: editingOrganization.name,
        mission: editingOrganization.mission,
        vision: editingOrganization.vision,
        strategicObjectives: editingOrganization.strategic_objectives.length > 0 
          ? editingOrganization.strategic_objectives 
          : [''],
        logo: null
      });

      // Precargar buyer personas
      if (organizationPersonas && organizationPersonas.length > 0) {
        const formattedPersonas = organizationPersonas.map(persona => ({
          id: persona.id,
          personaName: persona.personaName || '',
          ageRange: persona.ageRange || '',
          gender: persona.gender || '',
          occupation: persona.occupation || '',
          incomeLevel: persona.incomeLevel || '',
          educationLevel: persona.educationLevel || '',
          location: persona.location || '',
          painPoints: persona.painPoints || [''],
          goals: persona.goals || [''],
          preferredChannels: persona.preferredChannels || [''],
          behaviorPatterns: persona.behaviorPatterns || '',
          motivations: persona.motivations || '',
          frustrations: persona.frustrations || '',
          personaAvatar: null
        }));
        setBuyerPersonas(formattedPersonas);
      }

      // Precargar productos
      if (organizationProducts && organizationProducts.length > 0) {
        const formattedProducts = organizationProducts.map(product => ({
          id: product.id,
          productName: product.productName || '',
          productDescription: product.productDescription || '',
          category: product.category || '',
          price: product.price?.toString() || '',
          currency: product.currency || 'USD',
          status: product.status || 'active'
        }));
        setProducts(formattedProducts);
      }
    } else {
      // Resetear formulario para modo de creación
      setOrganizationData({
        name: '',
        mission: '',
        vision: '',
        strategicObjectives: [''],
        logo: null
      });
      setBuyerPersonas([]);
      setProducts([]);
      setCurrentPersona({
        personaName: '',
        ageRange: '',
        gender: '',
        occupation: '',
        incomeLevel: '',
        educationLevel: '',
        location: '',
        painPoints: [''],
        goals: [''],
        preferredChannels: [''],
        behaviorPatterns: '',
        motivations: '',
        frustrations: '',
        personaAvatar: null
      });
      setCurrentProduct({
        productName: '',
        productDescription: '',
        category: '',
        price: '',
        currency: 'USD',
        status: 'active'
      });
    }
  }, [isEditMode, editingOrganization, organizationPersonas, organizationProducts]);

  if (!isOpen) return null;

  const handleAddObjective = () => {
    setOrganizationData(prev => ({
      ...prev,
      strategicObjectives: [...prev.strategicObjectives, '']
    }));
  };

  const handleRemoveObjective = (index: number) => {
    setOrganizationData(prev => ({
      ...prev,
      strategicObjectives: prev.strategicObjectives.filter((_, i) => i !== index)
    }));
  };

  const handleObjectiveChange = (index: number, value: string) => {
    setOrganizationData(prev => ({
      ...prev,
      strategicObjectives: prev.strategicObjectives.map((obj, i) => i === index ? value : obj)
    }));
  };

  const handleAddPersona = () => {
    if (currentPersona.personaName.trim()) {
      setBuyerPersonas(prev => [...prev, { ...currentPersona }]);
      setCurrentPersona({
        personaName: '',
        ageRange: '',
        gender: '',
        occupation: '',
        incomeLevel: '',
        educationLevel: '',
        location: '',
        painPoints: [''],
        goals: [''],
        preferredChannels: [''],
        behaviorPatterns: '',
        motivations: '',
        frustrations: '',
        personaAvatar: null
      });
    }
  };

  const handleAddProduct = () => {
    if (currentProduct.productName.trim()) {
      setProducts(prev => [...prev, { ...currentProduct }]);
      setCurrentProduct({
        productName: '',
        productDescription: '',
        category: '',
        price: '',
        currency: 'USD',
        status: 'active'
      });
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const formData: OrganizationFormData = {
        name: organizationData.name,
        mission: organizationData.mission,
        vision: organizationData.vision,
        strategicObjectives: organizationData.strategicObjectives,
        logo: organizationData.logo,
        buyerPersonas,
        products
      };
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const addArrayField = (field: string, setter: React.Dispatch<React.SetStateAction<any>>, current: any) => {
    const currentArray = (current[field] as string[]) || [];
    const newArray = [...currentArray, ''];
    setter({ ...current, [field]: newArray });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const removeArrayField = (field: string, index: number, setter: React.Dispatch<React.SetStateAction<any>>, current: any) => {
    const currentArray = (current[field] as string[]) || [];
    const newArray = currentArray.filter((_: string, i: number) => i !== index);
    setter({ ...current, [field]: newArray });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateArrayField = (field: string, index: number, value: string, setter: React.Dispatch<React.SetStateAction<any>>, current: any) => {
    const currentArray = (current[field] as string[]) || [];
    const newArray = currentArray.map((item: string, i: number) => i === index ? value : item);
    setter({ ...current, [field]: newArray });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>{isEditMode ? 'Editar Organización' : 'Nueva Organización'}</h2>
          <button className="close-btn" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <div className="tab-navigation">
          <button 
            className={`tab-btn ${activeTab === 'organization' ? 'active' : ''}`}
            onClick={() => setActiveTab('organization')}
          >
            <i className="fas fa-building"></i>
            Organización
          </button>
          <button 
            className={`tab-btn ${activeTab === 'personas' ? 'active' : ''}`}
            onClick={() => setActiveTab('personas')}
          >
            <i className="fas fa-users"></i>
            Buyer Personas
          </button>
          <button 
            className={`tab-btn ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            <i className="fas fa-box"></i>
            Productos
          </button>
          <button 
            className={`tab-btn ${activeTab === 'loaded-data' ? 'active' : ''}`}
            onClick={() => setActiveTab('loaded-data')}
          >
            <i className="fas fa-database"></i>
            Datos Cargados
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'organization' && (
            <div className="organization-form">
              <div className="form-group">
                <label>Nombre de la Organización *</label>
                <input
                  type="text"
                  value={organizationData.name}
                  onChange={(e) => setOrganizationData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ingresa el nombre de tu organización"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Misión *</label>
                <textarea
                  value={organizationData.mission}
                  onChange={(e) => setOrganizationData(prev => ({ ...prev, mission: e.target.value }))}
                  placeholder="Describe la misión de tu organización"
                  rows={3}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Visión *</label>
                <textarea
                  value={organizationData.vision}
                  onChange={(e) => setOrganizationData(prev => ({ ...prev, vision: e.target.value }))}
                  placeholder="Describe la visión de tu organización"
                  rows={3}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Objetivos Estratégicos</label>
                {organizationData.strategicObjectives.map((objective, index) => (
                  <div key={index} className="objective-input">
                    <input
                      type="text"
                      value={objective}
                      onChange={(e) => handleObjectiveChange(index, e.target.value)}
                      placeholder={`Objetivo ${index + 1}`}
                    />
                    {organizationData.strategicObjectives.length > 1 && (
                      <button 
                        type="button" 
                        className="remove-btn"
                        onClick={() => handleRemoveObjective(index)}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    )}
                  </div>
                ))}
                <button type="button" className="add-btn" onClick={handleAddObjective}>
                  <i className="fas fa-plus"></i> Agregar Objetivo
                </button>
              </div>
              
              <div className="form-group">
                <label>Logo de la Organización</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setOrganizationData(prev => ({ 
                    ...prev, 
                    logo: e.target.files ? e.target.files[0] : null 
                  }))}
                />
              </div>
            </div>
          )}

          {activeTab === 'personas' && (
            <div className="personas-form">
              <div className="form-section">
                <h3>Agregar Nuevo Buyer Persona</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Nombre del Persona *</label>
                    <input
                      type="text"
                      value={currentPersona.personaName}
                      onChange={(e) => setCurrentPersona(prev => ({ ...prev, personaName: e.target.value }))}
                      placeholder="Ej: María Ejecutiva"
                    />
                  </div>
                  <div className="form-group">
                    <label>Rango de Edad</label>
                    <select
                      value={currentPersona.ageRange}
                      onChange={(e) => setCurrentPersona(prev => ({ ...prev, ageRange: e.target.value }))}
                    >
                      <option value="">Seleccionar</option>
                      <option value="18-25">18-25 años</option>
                      <option value="26-35">26-35 años</option>
                      <option value="36-45">36-45 años</option>
                      <option value="46-55">46-55 años</option>
                      <option value="56+">56+ años</option>
                    </select>
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Género</label>
                    <select
                      value={currentPersona.gender}
                      onChange={(e) => setCurrentPersona(prev => ({ ...prev, gender: e.target.value }))}
                    >
                      <option value="">Seleccionar</option>
                      <option value="Femenino">Femenino</option>
                      <option value="Masculino">Masculino</option>
                      <option value="No binario">No binario</option>
                      <option value="Prefiero no decir">Prefiero no decir</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Ocupación</label>
                    <input
                      type="text"
                      value={currentPersona.occupation}
                      onChange={(e) => setCurrentPersona(prev => ({ ...prev, occupation: e.target.value }))}
                      placeholder="Ej: Gerente de Marketing"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Puntos de Dolor</label>
                  {currentPersona.painPoints.map((point, index) => (
                    <div key={index} className="array-input">
                      <input
                        type="text"
                        value={point}
                        onChange={(e) => updateArrayField('painPoints', index, e.target.value, setCurrentPersona, currentPersona)}
                        placeholder={`Punto de dolor ${index + 1}`}
                      />
                      {currentPersona.painPoints.length > 1 && (
                        <button 
                          type="button" 
                          className="remove-btn"
                          onClick={() => removeArrayField('painPoints', index, setCurrentPersona, currentPersona)}
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      )}
                    </div>
                  ))}
                  <button 
                    type="button" 
                    className="add-btn"
                    onClick={() => addArrayField('painPoints', setCurrentPersona, currentPersona)}
                  >
                    <i className="fas fa-plus"></i> Agregar Punto de Dolor
                  </button>
                </div>

                <button type="button" className="btn-primary" onClick={handleAddPersona}>
                  <i className="fas fa-plus"></i> Agregar Persona
                </button>
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div className="products-form">
              <div className="form-section">
                <h3>Agregar Nuevo Producto</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Nombre del Producto *</label>
                    <input
                      type="text"
                      value={currentProduct.productName}
                      onChange={(e) => setCurrentProduct(prev => ({ ...prev, productName: e.target.value }))}
                      placeholder="Nombre del producto"
                    />
                  </div>
                  <div className="form-group">
                    <label>Categoría</label>
                    <input
                      type="text"
                      value={currentProduct.category}
                      onChange={(e) => setCurrentProduct(prev => ({ ...prev, category: e.target.value }))}
                      placeholder="Categoría del producto"
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Descripción</label>
                  <textarea
                    value={currentProduct.productDescription}
                    onChange={(e) => setCurrentProduct(prev => ({ ...prev, productDescription: e.target.value }))}
                    placeholder="Describe el producto"
                    rows={3}
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Precio</label>
                    <input
                      type="number"
                      value={currentProduct.price}
                      onChange={(e) => setCurrentProduct(prev => ({ ...prev, price: e.target.value }))}
                      placeholder="0.00"
                    />
                  </div>
                  <div className="form-group">
                    <label>Moneda</label>
                    <select
                      value={currentProduct.currency}
                      onChange={(e) => setCurrentProduct(prev => ({ ...prev, currency: e.target.value }))}
                    >
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="MXN">MXN</option>
                    </select>
                  </div>
                </div>

                <button type="button" className="btn-primary" onClick={handleAddProduct}>
                  <i className="fas fa-plus"></i> Agregar Producto
                </button>
              </div>
            </div>
          )}

          {activeTab === 'loaded-data' && (
            <div className="loaded-data">
              <div className="data-section">
                <h3>Buyer Personas Cargados ({buyerPersonas.length})</h3>
                {buyerPersonas.length > 0 ? (
                  <div className="data-list">
                    {buyerPersonas.map((persona, index) => (
                      <div key={index} className="data-item">
                        <div className="data-header">
                          <h4>{persona.personaName}</h4>
                          <button 
                            className="remove-btn"
                            onClick={() => setBuyerPersonas(prev => prev.filter((_, i) => i !== index))}
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                        <p><strong>Edad:</strong> {persona.ageRange}</p>
                        <p><strong>Ocupación:</strong> {persona.occupation}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="no-data">No hay buyer personas cargados</p>
                )}
              </div>
              
              <div className="data-section">
                <h3>Productos Cargados ({products.length})</h3>
                {products.length > 0 ? (
                  <div className="data-list">
                    {products.map((product, index) => (
                      <div key={index} className="data-item">
                        <div className="data-header">
                          <h4>{product.productName}</h4>
                          <button 
                            className="remove-btn"
                            onClick={() => setProducts(prev => prev.filter((_, i) => i !== index))}
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                        <p><strong>Categoría:</strong> {product.category}</p>
                        <p><strong>Precio:</strong> {product.price} {product.currency}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="no-data">No hay productos cargados</p>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Cancelar
          </button>
          <button 
            className="btn-primary" 
            onClick={handleSubmit}
            disabled={loading || !organizationData.name.trim()}
          >
            {loading ? 'Guardando...' : 'Crear Organización'}
          </button>
        </div>
      </div>
      
      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        
        .modal-container {
          background: white;
          border-radius: 12px;
          width: 90%;
          max-width: 800px;
          max-height: 90vh;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }
        
        .modal-header {
          padding: 20px;
          border-bottom: 1px solid #e5e7eb;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .modal-header h2 {
          margin: 0;
          color: #1f2937;
        }
        
        .close-btn {
          background: none;
          border: none;
          font-size: 20px;
          cursor: pointer;
          color: #6b7280;
          padding: 5px;
        }
        
        .close-btn:hover {
          color: #374151;
        }
        
        .tab-navigation {
          display: flex;
          border-bottom: 1px solid #e5e7eb;
          background: #f9fafb;
        }
        
        .tab-btn {
          flex: 1;
          padding: 15px 10px;
          border: none;
          background: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          color: #6b7280;
          font-size: 14px;
          transition: all 0.2s;
        }
        
        .tab-btn:hover {
          background: #f3f4f6;
          color: #374151;
        }
        
        .tab-btn.active {
          background: white;
          color: #3b82f6;
          border-bottom: 2px solid #3b82f6;
        }
        
        .tab-content {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
        }
        
        .form-group {
          margin-bottom: 20px;
        }
        
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }
        
        .form-group label {
          display: block;
          margin-bottom: 5px;
          font-weight: 500;
          color: #374151;
        }
        
        .form-group input,
        .form-group textarea,
        .form-group select {
          width: 100%;
          padding: 10px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
        }
        
        .form-group input:focus,
        .form-group textarea:focus,
        .form-group select:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        
        .objective-input,
        .array-input {
          display: flex;
          gap: 10px;
          margin-bottom: 10px;
          align-items: center;
        }
        
        .objective-input input,
        .array-input input {
          flex: 1;
        }
        
        .add-btn,
        .remove-btn {
          padding: 8px 12px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 12px;
          display: flex;
          align-items: center;
          gap: 5px;
        }
        
        .add-btn {
          background: #f3f4f6;
          color: #374151;
        }
        
        .add-btn:hover {
          background: #e5e7eb;
        }
        
        .remove-btn {
          background: #fee2e2;
          color: #dc2626;
          padding: 8px;
        }
        
        .remove-btn:hover {
          background: #fecaca;
        }
        
        .form-section {
          margin-bottom: 30px;
        }
        
        .form-section h3 {
          margin-bottom: 15px;
          color: #1f2937;
          border-bottom: 1px solid #e5e7eb;
          padding-bottom: 10px;
        }
        
        .data-section {
          margin-bottom: 30px;
        }
        
        .data-list {
          display: grid;
          gap: 15px;
        }
        
        .data-item {
          padding: 15px;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          background: #f9fafb;
        }
        
        .data-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }
        
        .data-header h4 {
          margin: 0;
          color: #1f2937;
        }
        
        .data-item p {
          margin: 5px 0;
          color: #6b7280;
          font-size: 14px;
        }
        
        .no-data {
          text-align: center;
          color: #6b7280;
          font-style: italic;
          padding: 20px;
        }
        
        .modal-footer {
          padding: 20px;
          border-top: 1px solid #e5e7eb;
          display: flex;
          justify-content: flex-end;
          gap: 10px;
        }
        
        .btn-primary,
        .btn-secondary {
          padding: 10px 20px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
        }
        
        .btn-primary {
          background: #3b82f6;
          color: white;
        }
        
        .btn-primary:hover:not(:disabled) {
          background: #2563eb;
        }
        
        .btn-primary:disabled {
          background: #9ca3af;
          cursor: not-allowed;
        }
        
        .btn-secondary {
          background: #f3f4f6;
          color: #374151;
        }
        
        .btn-secondary:hover {
          background: #e5e7eb;
        }
        
        @media (max-width: 768px) {
          .modal-container {
            width: 95%;
            max-height: 95vh;
          }
          
          .form-row {
            grid-template-columns: 1fr;
          }
          
          .tab-btn {
            font-size: 12px;
            padding: 12px 8px;
          }
        }
      `}</style>
    </div>
  );
};

export default OrganizationModal;