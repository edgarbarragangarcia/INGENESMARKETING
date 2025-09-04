import React, { useState } from 'react';
import styles from './OrganizationModal.module.css';

interface OrganizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const OrganizationModal: React.FC<OrganizationModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [activeTab, setActiveTab] = useState('organization');
  const [formData, setFormData] = useState({
    // Organización
    name: '',
    mission: '',
    vision: '',
    strategicObjectives: [''],
    logo: null as File | null,
    
    // Buyer Persona
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
    personaAvatar: null as File | null,
    
    // Productos
    productName: '',
    productDescription: '',
    category: '',
    price: '',
    currency: 'MXN',
    targetAudience: [''],
    keyBenefits: [''],
    features: [''],
    competitiveAdvantages: [''],
    productImage: null as File | null,
    status: 'active'
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (field: string, index: number, value: string) => {
    setFormData(prev => {
      const currentArray = prev[field as keyof typeof prev] as string[];
      return {
        ...prev,
        [field]: currentArray.map((item: string, i: number) => 
          i === index ? value : item
        )
      };
    });
  };

  const addArrayItem = (field: string) => {
    setFormData(prev => {
      const currentArray = prev[field as keyof typeof prev] as string[];
      return {
        ...prev,
        [field]: [...currentArray, '']
      };
    });
  };

  const removeArrayItem = (field: string, index: number) => {
    setFormData(prev => {
      const currentArray = prev[field as keyof typeof prev] as string[];
      return {
        ...prev,
        [field]: currentArray.filter((_: any, i: number) => i !== index)
      };
    });
  };

  const handleFileChange = (field: string, file: File | null) => {
    setFormData(prev => ({ ...prev, [field]: file }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.organizationModal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>
            <i className="fas fa-building"></i>
            Nueva Organización
          </h2>
          <button className={styles.closeBtn} onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className={styles.modalTabs}>
          <button 
            className={`${styles.tabBtn} ${activeTab === 'organization' ? styles.active : ''}`}
            onClick={() => setActiveTab('organization')}
          >
            <i className="fas fa-building"></i>
            Organización
          </button>
          <button 
            className={`${styles.tabBtn} ${activeTab === 'persona' ? styles.active : ''}`}
            onClick={() => setActiveTab('persona')}
          >
            <i className="fas fa-user-tie"></i>
            Buyer Persona
          </button>
          <button 
            className={`${styles.tabBtn} ${activeTab === 'products' ? styles.active : ''}`}
            onClick={() => setActiveTab('products')}
          >
            <i className="fas fa-box"></i>
            Productos
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.modalForm}>
          <div className={styles.tabContent}>
            {/* Pestaña Organización */}
            {activeTab === 'organization' && (
              <div className={styles.tabPanel}>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="name">
                      <i className="fas fa-building"></i>
                      Nombre de la Organización *
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Ej: Hospital General"
                      required
                    />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="mission">
                      <i className="fas fa-bullseye"></i>
                      Misión
                    </label>
                    <textarea
                      id="mission"
                      value={formData.mission}
                      onChange={(e) => handleInputChange('mission', e.target.value)}
                      placeholder="Describe la misión de tu organización..."
                      rows={3}
                    />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="vision">
                      <i className="fas fa-eye"></i>
                      Visión
                    </label>
                    <textarea
                      id="vision"
                      value={formData.vision}
                      onChange={(e) => handleInputChange('vision', e.target.value)}
                      placeholder="Describe la visión de tu organización..."
                      rows={3}
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label>
                    <i className="fas fa-list-ul"></i>
                    Objetivos Estratégicos
                  </label>
                  {formData.strategicObjectives.map((objective, index) => (
                    <div key={index} className={styles.arrayInput}>
                      <input
                        type="text"
                        value={objective}
                        onChange={(e) => handleArrayChange('strategicObjectives', index, e.target.value)}
                        placeholder={`Objetivo ${index + 1}`}
                      />
                      {formData.strategicObjectives.length > 1 && (
                        <button
                          type="button"
                          className={styles.removeBtn}
                          onClick={() => removeArrayItem('strategicObjectives', index)}
                        >
                          <i className="fas fa-minus"></i>
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    className={styles.addBtn}
                    onClick={() => addArrayItem('strategicObjectives')}
                  >
                    <i className="fas fa-plus"></i>
                    Agregar Objetivo
                  </button>
                </div>

                <div className="form-group">
                  <label htmlFor="logo">
                    <i className="fas fa-image"></i>
                    Logo de la Organización
                  </label>
                  <div className={styles.fileInput}>
                    <input
                      type="file"
                      id="logo"
                      accept="image/*"
                      onChange={(e) => handleFileChange('logo', e.target.files?.[0] || null)}
                    />
                    <label htmlFor="logo" className={styles.fileLabel}>
                      <i className="fas fa-cloud-upload-alt"></i>
                      {formData.logo ? formData.logo.name : 'Seleccionar archivo'}
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Pestaña Buyer Persona */}
            {activeTab === 'persona' && (
              <div className="tab-panel">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="personaName">
                      <i className="fas fa-user"></i>
                      Nombre del Buyer Persona *
                    </label>
                    <input
                      type="text"
                      id="personaName"
                      value={formData.personaName}
                      onChange={(e) => handleInputChange('personaName', e.target.value)}
                      placeholder="Ej: María González - Paciente Frecuente"
                      required
                    />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={`${styles.formGroup} ${styles.half}`}>
                    <label htmlFor="ageRange">
                      <i className="fas fa-calendar"></i>
                      Rango de Edad
                    </label>
                    <select
                      id="ageRange"
                      value={formData.ageRange}
                      onChange={(e) => handleInputChange('ageRange', e.target.value)}
                    >
                      <option value="">Seleccionar...</option>
                      <option value="18-25">18-25 años</option>
                      <option value="26-35">26-35 años</option>
                      <option value="36-45">36-45 años</option>
                      <option value="46-55">46-55 años</option>
                      <option value="56-65">56-65 años</option>
                      <option value="65+">65+ años</option>
                    </select>
                  </div>
                  <div className={`${styles.formGroup} ${styles.half}`}>
                    <label htmlFor="gender">
                      <i className="fas fa-venus-mars"></i>
                      Género
                    </label>
                    <select
                      id="gender"
                      value={formData.gender}
                      onChange={(e) => handleInputChange('gender', e.target.value)}
                    >
                      <option value="">Seleccionar...</option>
                      <option value="Femenino">Femenino</option>
                      <option value="Masculino">Masculino</option>
                      <option value="No binario">No binario</option>
                      <option value="Prefiero no decir">Prefiero no decir</option>
                    </select>
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={`${styles.formGroup} ${styles.half}`}>
                    <label htmlFor="occupation">
                      <i className="fas fa-briefcase"></i>
                      Ocupación
                    </label>
                    <input
                      type="text"
                      id="occupation"
                      value={formData.occupation}
                      onChange={(e) => handleInputChange('occupation', e.target.value)}
                      placeholder="Ej: Ejecutiva de ventas"
                    />
                  </div>
                  <div className={`${styles.formGroup} ${styles.half}`}>
                    <label htmlFor="incomeLevel">
                      <i className="fas fa-dollar-sign"></i>
                      Nivel de Ingresos
                    </label>
                    <select
                      id="incomeLevel"
                      value={formData.incomeLevel}
                      onChange={(e) => handleInputChange('incomeLevel', e.target.value)}
                    >
                      <option value="">Seleccionar...</option>
                      <option value="Bajo">Bajo (&lt; $15,000 MXN)</option>
                      <option value="Medio-Bajo">Medio-Bajo ($15,000 - $30,000 MXN)</option>
                      <option value="Medio">Medio ($30,000 - $50,000 MXN)</option>
                      <option value="Medio-Alto">Medio-Alto ($50,000 - $80,000 MXN)</option>
                      <option value="Alto">Alto (&gt; $80,000 MXN)</option>
                    </select>
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={`${styles.formGroup} ${styles.half}`}>
                    <label htmlFor="educationLevel">
                      <i className="fas fa-graduation-cap"></i>
                      Nivel Educativo
                    </label>
                    <select
                      id="educationLevel"
                      value={formData.educationLevel}
                      onChange={(e) => handleInputChange('educationLevel', e.target.value)}
                    >
                      <option value="">Seleccionar...</option>
                      <option value="Primaria">Primaria</option>
                      <option value="Secundaria">Secundaria</option>
                      <option value="Preparatoria">Preparatoria</option>
                      <option value="Licenciatura">Licenciatura</option>
                      <option value="Posgrado">Posgrado</option>
                    </select>
                  </div>
                  <div className={`${styles.formGroup} ${styles.half}`}>
                    <label htmlFor="location">
                      <i className="fas fa-map-marker-alt"></i>
                      Ubicación
                    </label>
                    <input
                      type="text"
                      id="location"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      placeholder="Ej: Ciudad de México"
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label>
                    <i className="fas fa-exclamation-triangle"></i>
                    Puntos de Dolor
                  </label>
                  {formData.painPoints.map((pain, index) => (
                    <div key={index} className={styles.arrayInput}>
                      <input
                         type="text"
                         value={pain}
                         onChange={(e) => handleArrayChange('painPoints', index, e.target.value)}
                         placeholder={`Punto de dolor ${index + 1}`}
                       />
                      {formData.painPoints.length > 1 && (
                        <button
                          type="button"
                          className={styles.removeBtn}
                          onClick={() => removeArrayItem('painPoints', index)}
                        >
                          <i className="fas fa-minus"></i>
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    className={styles.addBtn}
                    onClick={() => addArrayItem('painPoints')}
                  >
                    <i className="fas fa-plus"></i>
                    Agregar Punto de Dolor
                  </button>
                </div>

                <div className="form-group">
                  <label>
                    <i className="fas fa-target"></i>
                    Objetivos
                  </label>
                  {formData.goals.map((goal, index) => (
                    <div key={index} className="array-input">
                      <input
                        type="text"
                        value={goal}
                        onChange={(e) => handleArrayChange('goals', index, e.target.value)}
                        placeholder={`Objetivo ${index + 1}`}
                      />
                      {formData.goals.length > 1 && (
                        <button
                          type="button"
                          className="remove-btn"
                          onClick={() => removeArrayItem('goals', index)}
                        >
                          <i className="fas fa-minus"></i>
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    className="add-btn"
                    onClick={() => addArrayItem('goals')}
                  >
                    <i className="fas fa-plus"></i>
                    Agregar Objetivo
                  </button>
                </div>

                <div className="form-group">
                  <label>
                    <i className="fas fa-share-alt"></i>
                    Canales Preferidos
                  </label>
                  {formData.preferredChannels.map((channel, index) => (
                    <div key={index} className="array-input">
                      <select
                        value={channel}
                        onChange={(e) => handleArrayChange('preferredChannels', index, e.target.value)}
                      >
                        <option value="">Seleccionar canal...</option>
                        <option value="Facebook">Facebook</option>
                        <option value="Instagram">Instagram</option>
                        <option value="WhatsApp">WhatsApp</option>
                        <option value="Email">Email</option>
                        <option value="Teléfono">Teléfono</option>
                        <option value="Presencial">Presencial</option>
                        <option value="Sitio Web">Sitio Web</option>
                        <option value="YouTube">YouTube</option>
                        <option value="TikTok">TikTok</option>
                      </select>
                      {formData.preferredChannels.length > 1 && (
                        <button
                          type="button"
                          className="remove-btn"
                          onClick={() => removeArrayItem('preferredChannels', index)}
                        >
                          <i className="fas fa-minus"></i>
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    className="add-btn"
                    onClick={() => addArrayItem('preferredChannels')}
                  >
                    <i className="fas fa-plus"></i>
                    Agregar Canal
                  </button>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="behaviorPatterns">
                      <i className="fas fa-chart-line"></i>
                      Patrones de Comportamiento
                    </label>
                    <textarea
                      id="behaviorPatterns"
                      value={formData.behaviorPatterns}
                      onChange={(e) => handleInputChange('behaviorPatterns', e.target.value)}
                      placeholder="Describe los patrones de comportamiento..."
                      rows={3}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group half">
                    <label htmlFor="motivations">
                      <i className="fas fa-heart"></i>
                      Motivaciones
                    </label>
                    <textarea
                      id="motivations"
                      value={formData.motivations}
                      onChange={(e) => handleInputChange('motivations', e.target.value)}
                      placeholder="¿Qué los motiva?"
                      rows={3}
                    />
                  </div>
                  <div className="form-group half">
                    <label htmlFor="frustrations">
                      <i className="fas fa-frown"></i>
                      Frustraciones
                    </label>
                    <textarea
                      id="frustrations"
                      value={formData.frustrations}
                      onChange={(e) => handleInputChange('frustrations', e.target.value)}
                      placeholder="¿Qué los frustra?"
                      rows={3}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="personaAvatar">
                    <i className="fas fa-user-circle"></i>
                    Avatar del Buyer Persona
                  </label>
                  <div className="file-input">
                    <input
                      type="file"
                      id="personaAvatar"
                      accept="image/*"
                      onChange={(e) => handleFileChange('personaAvatar', e.target.files?.[0] || null)}
                    />
                    <label htmlFor="personaAvatar" className="file-label">
                      <i className="fas fa-cloud-upload-alt"></i>
                      {formData.personaAvatar ? formData.personaAvatar.name : 'Seleccionar avatar'}
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Pestaña Productos */}
            {activeTab === 'products' && (
              <div className="tab-panel">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="productName">
                      <i className="fas fa-box"></i>
                      Nombre del Producto/Servicio *
                    </label>
                    <input
                      type="text"
                      id="productName"
                      value={formData.productName}
                      onChange={(e) => handleInputChange('productName', e.target.value)}
                      placeholder="Ej: Consulta Médica General"
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="productDescription">
                      <i className="fas fa-align-left"></i>
                      Descripción
                    </label>
                    <textarea
                      id="productDescription"
                      value={formData.productDescription}
                      onChange={(e) => handleInputChange('productDescription', e.target.value)}
                      placeholder="Describe el producto o servicio..."
                      rows={3}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group half">
                    <label htmlFor="category">
                      <i className="fas fa-tags"></i>
                      Categoría
                    </label>
                    <select
                      id="category"
                      value={formData.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                    >
                      <option value="">Seleccionar...</option>
                      <option value="Consultas">Consultas</option>
                      <option value="Cirugías">Cirugías</option>
                      <option value="Diagnósticos">Diagnósticos</option>
                      <option value="Tratamientos">Tratamientos</option>
                      <option value="Emergencias">Emergencias</option>
                      <option value="Preventivos">Preventivos</option>
                      <option value="Especialidades">Especialidades</option>
                    </select>
                  </div>
                  <div className="form-group half">
                    <label htmlFor="status">
                      <i className="fas fa-toggle-on"></i>
                      Estado
                    </label>
                    <select
                      id="status"
                      value={formData.status}
                      onChange={(e) => handleInputChange('status', e.target.value)}
                    >
                      <option value="active">Activo</option>
                      <option value="inactive">Inactivo</option>
                      <option value="draft">Borrador</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group half">
                    <label htmlFor="price">
                      <i className="fas fa-dollar-sign"></i>
                      Precio
                    </label>
                    <input
                      type="number"
                      id="price"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                    />
                  </div>
                  <div className="form-group half">
                    <label htmlFor="currency">
                      <i className="fas fa-coins"></i>
                      Moneda
                    </label>
                    <select
                      id="currency"
                      value={formData.currency}
                      onChange={(e) => handleInputChange('currency', e.target.value)}
                    >
                      <option value="MXN">MXN - Peso Mexicano</option>
                      <option value="USD">USD - Dólar Americano</option>
                      <option value="EUR">EUR - Euro</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>
                    <i className="fas fa-users"></i>
                    Audiencia Objetivo
                  </label>
                  {formData.targetAudience.map((audience, index) => (
                    <div key={index} className="array-input">
                      <input
                        type="text"
                        value={audience}
                        onChange={(e) => handleArrayChange('targetAudience', index, e.target.value)}
                        placeholder={`Audiencia ${index + 1}`}
                      />
                      {formData.targetAudience.length > 1 && (
                        <button
                          type="button"
                          className="remove-btn"
                          onClick={() => removeArrayItem('targetAudience', index)}
                        >
                          <i className="fas fa-minus"></i>
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    className="add-btn"
                    onClick={() => addArrayItem('targetAudience')}
                  >
                    <i className="fas fa-plus"></i>
                    Agregar Audiencia
                  </button>
                </div>

                <div className="form-group">
                  <label>
                    <i className="fas fa-star"></i>
                    Beneficios Clave
                  </label>
                  {formData.keyBenefits.map((benefit, index) => (
                    <div key={index} className="array-input">
                      <input
                        type="text"
                        value={benefit}
                        onChange={(e) => handleArrayChange('keyBenefits', index, e.target.value)}
                        placeholder={`Beneficio ${index + 1}`}
                      />
                      {formData.keyBenefits.length > 1 && (
                        <button
                          type="button"
                          className="remove-btn"
                          onClick={() => removeArrayItem('keyBenefits', index)}
                        >
                          <i className="fas fa-minus"></i>
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    className="add-btn"
                    onClick={() => addArrayItem('keyBenefits')}
                  >
                    <i className="fas fa-plus"></i>
                    Agregar Beneficio
                  </button>
                </div>

                <div className="form-group">
                  <label>
                    <i className="fas fa-list"></i>
                    Características
                  </label>
                  {formData.features.map((feature, index) => (
                    <div key={index} className="array-input">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => handleArrayChange('features', index, e.target.value)}
                        placeholder={`Característica ${index + 1}`}
                      />
                      {formData.features.length > 1 && (
                        <button
                          type="button"
                          className="remove-btn"
                          onClick={() => removeArrayItem('features', index)}
                        >
                          <i className="fas fa-minus"></i>
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    className="add-btn"
                    onClick={() => addArrayItem('features')}
                  >
                    <i className="fas fa-plus"></i>
                    Agregar Característica
                  </button>
                </div>

                <div className="form-group">
                  <label>
                    <i className="fas fa-trophy"></i>
                    Ventajas Competitivas
                  </label>
                  {formData.competitiveAdvantages.map((advantage, index) => (
                    <div key={index} className="array-input">
                      <input
                        type="text"
                        value={advantage}
                        onChange={(e) => handleArrayChange('competitiveAdvantages', index, e.target.value)}
                        placeholder={`Ventaja ${index + 1}`}
                      />
                      {formData.competitiveAdvantages.length > 1 && (
                        <button
                          type="button"
                          className="remove-btn"
                          onClick={() => removeArrayItem('competitiveAdvantages', index)}
                        >
                          <i className="fas fa-minus"></i>
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    className="add-btn"
                    onClick={() => addArrayItem('competitiveAdvantages')}
                  >
                    <i className="fas fa-plus"></i>
                    Agregar Ventaja
                  </button>
                </div>

                <div className="form-group">
                  <label htmlFor="productImage">
                    <i className="fas fa-image"></i>
                    Imagen del Producto
                  </label>
                  <div className="file-input">
                    <input
                      type="file"
                      id="productImage"
                      accept="image/*"
                      onChange={(e) => handleFileChange('productImage', e.target.files?.[0] || null)}
                    />
                    <label htmlFor="productImage" className="file-label">
                      <i className="fas fa-cloud-upload-alt"></i>
                      {formData.productImage ? formData.productImage.name : 'Seleccionar imagen'}
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className={styles.modalActions}>
            <button type="button" className={styles.btnSecondary} onClick={onClose}>
              <i className="fas fa-times"></i>
              Cancelar
            </button>
            <button type="submit" className={styles.btnPrimary}>
              <i className="fas fa-save"></i>
              Guardar Organización
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrganizationModal;