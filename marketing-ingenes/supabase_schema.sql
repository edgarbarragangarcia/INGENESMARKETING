-- Esquema SQL para Supabase - Sistema de Marketing INGENES
-- Ejecutar en el SQL Editor de Supabase

-- Tabla de Organizaciones
CREATE TABLE IF NOT EXISTS organizations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    mission TEXT,
    vision TEXT,
    strategic_objectives TEXT[],
    logo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

-- Tabla de Buyer Personas
CREATE TABLE IF NOT EXISTS buyer_personas (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    age_range VARCHAR(50),
    gender VARCHAR(50),
    occupation VARCHAR(255),
    income_level VARCHAR(100),
    education_level VARCHAR(100),
    location VARCHAR(255),
    pain_points TEXT[],
    goals TEXT[],
    preferred_channels TEXT[],
    behavior_patterns TEXT,
    motivations TEXT,
    frustrations TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de Productos/Servicios
CREATE TABLE IF NOT EXISTS products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    price DECIMAL(10,2),
    currency VARCHAR(10) DEFAULT 'MXN',

    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de Campañas de Marketing
CREATE TABLE IF NOT EXISTS marketing_campaigns (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    buyer_persona_id UUID REFERENCES buyer_personas(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    campaign_type VARCHAR(100),
    budget DECIMAL(12,2),
    start_date DATE,
    end_date DATE,
    status VARCHAR(50) DEFAULT 'draft',
    objectives TEXT[],
    target_metrics JSONB,
    actual_metrics JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_organizations_created_by ON organizations(created_by);
CREATE INDEX IF NOT EXISTS idx_buyer_personas_org_id ON buyer_personas(organization_id);
CREATE INDEX IF NOT EXISTS idx_products_org_id ON products(organization_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_org_id ON marketing_campaigns(organization_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_product_id ON marketing_campaigns(product_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_persona_id ON marketing_campaigns(buyer_persona_id);

-- Función para actualizar timestamp automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para actualizar updated_at automáticamente
CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_buyer_personas_updated_at BEFORE UPDATE ON buyer_personas
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_campaigns_updated_at BEFORE UPDATE ON marketing_campaigns
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Políticas de seguridad RLS (Row Level Security)
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE buyer_personas ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketing_campaigns ENABLE ROW LEVEL SECURITY;

-- Política para organizaciones - usuarios solo pueden ver/editar sus propias organizaciones
CREATE POLICY "Users can view their own organizations" ON organizations
    FOR SELECT USING (auth.uid() = created_by);

CREATE POLICY "Users can insert their own organizations" ON organizations
    FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own organizations" ON organizations
    FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own organizations" ON organizations
    FOR DELETE USING (auth.uid() = created_by);

-- Política para buyer personas - basada en la organización del usuario
CREATE POLICY "Users can view buyer personas of their organizations" ON buyer_personas
    FOR SELECT USING (
        organization_id IN (
            SELECT id FROM organizations WHERE created_by = auth.uid()
        )
    );

CREATE POLICY "Users can insert buyer personas for their organizations" ON buyer_personas
    FOR INSERT WITH CHECK (
        organization_id IN (
            SELECT id FROM organizations WHERE created_by = auth.uid()
        )
    );

CREATE POLICY "Users can update buyer personas of their organizations" ON buyer_personas
    FOR UPDATE USING (
        organization_id IN (
            SELECT id FROM organizations WHERE created_by = auth.uid()
        )
    );

CREATE POLICY "Users can delete buyer personas of their organizations" ON buyer_personas
    FOR DELETE USING (
        organization_id IN (
            SELECT id FROM organizations WHERE created_by = auth.uid()
        )
    );

-- Política para productos - basada en la organización del usuario
CREATE POLICY "Users can view products of their organizations" ON products
    FOR SELECT USING (
        organization_id IN (
            SELECT id FROM organizations WHERE created_by = auth.uid()
        )
    );

CREATE POLICY "Users can insert products for their organizations" ON products
    FOR INSERT WITH CHECK (
        organization_id IN (
            SELECT id FROM organizations WHERE created_by = auth.uid()
        )
    );

CREATE POLICY "Users can update products of their organizations" ON products
    FOR UPDATE USING (
        organization_id IN (
            SELECT id FROM organizations WHERE created_by = auth.uid()
        )
    );

CREATE POLICY "Users can delete products of their organizations" ON products
    FOR DELETE USING (
        organization_id IN (
            SELECT id FROM organizations WHERE created_by = auth.uid()
        )
    );

-- Política para campañas - basada en la organización del usuario
CREATE POLICY "Users can view campaigns of their organizations" ON marketing_campaigns
    FOR SELECT USING (
        organization_id IN (
            SELECT id FROM organizations WHERE created_by = auth.uid()
        )
    );

CREATE POLICY "Users can insert campaigns for their organizations" ON marketing_campaigns
    FOR INSERT WITH CHECK (
        organization_id IN (
            SELECT id FROM organizations WHERE created_by = auth.uid()
        )
    );

CREATE POLICY "Users can update campaigns of their organizations" ON marketing_campaigns
    FOR UPDATE USING (
        organization_id IN (
            SELECT id FROM organizations WHERE created_by = auth.uid()
        )
    );

CREATE POLICY "Users can delete campaigns of their organizations" ON marketing_campaigns
    FOR DELETE USING (
        organization_id IN (
            SELECT id FROM organizations WHERE created_by = auth.uid()
        )
    );

-- Datos de ejemplo (opcional)
INSERT INTO organizations (name, mission, vision, strategic_objectives, created_by) VALUES
('Hospital General', 
 'Brindar atención médica de calidad y accesible a toda la comunidad',
 'Ser el hospital líder en atención médica integral en la región',
 ARRAY['Mejorar la satisfacción del paciente', 'Implementar tecnología médica avanzada', 'Capacitar continuamente al personal'],
 (SELECT id FROM auth.users LIMIT 1)),
('Clínica San Rafael',
 'Ofrecer servicios médicos especializados con un enfoque humano y profesional',
 'Ser reconocidos como la clínica de referencia en medicina especializada',
 ARRAY['Expandir servicios especializados', 'Mejorar tiempos de atención', 'Fortalecer relaciones con pacientes'],
 (SELECT id FROM auth.users LIMIT 1));