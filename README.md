# INGENES Marketing - Dashboard de Marketing Digital

Una aplicación web moderna desarrollada con Next.js para la gestión de organizaciones, buyer personas y productos de marketing digital con integración de Supabase.

## 🚀 Características

- **Dashboard Interactivo**: Panel de control con navegación persistente
- **Gestión de Organizaciones**: Formularios completos para crear y gestionar organizaciones
- **Buyer Personas**: Sistema de creación y administración de buyer personas
- **Gestión de Productos**: Formularios para productos y servicios
- **Autenticación**: Integración con Supabase Auth
- **Diseño Responsivo**: Optimizado para todos los dispositivos
- **Persistencia de Estado**: Navegación que se mantiene al recargar la página

## 📁 Estructura del Proyecto

```
├── src/
│   ├── app/
│   │   ├── globals.css      # Estilos globales
│   │   ├── layout.tsx       # Layout principal
│   │   └── page.tsx         # Página principal
│   ├── components/
│   │   ├── Dashboard.tsx    # Componente principal del dashboard
│   │   ├── OrganizationModal.tsx  # Modal para organizaciones
│   │   └── OrganizationModal.module.css  # Estilos del modal
│   └── lib/
│       └── supabase.ts      # Configuración de Supabase
├── public/                  # Archivos estáticos
├── supabase_schema.sql      # Esquema de base de datos
├── package.json
└── README.md
```

## 🛠️ Configuración

### 1. Instalación

```bash
# Clonar el repositorio
git clone https://github.com/edgarbarragangarcia/INGENESMARKETING.git
cd INGENESMARKETING

# Instalar dependencias
npm install
```

### 2. Configurar Supabase

1. **Crear proyecto en Supabase**:
   - Ve a [Supabase](https://supabase.com/)
   - Crea un nuevo proyecto
   - Espera a que se complete la configuración

2. **Configurar base de datos**:
   - Ejecuta el script `supabase_schema.sql` en el SQL Editor de Supabase
   - Esto creará las tablas necesarias: organizations, buyer_personas, products

3. **Configurar variables de entorno**:
   Crea un archivo `.env.local` en la raíz del proyecto:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
   ```

4. **Configurar autenticación**:
   - Ve a Authentication > Settings en Supabase
   - Configura los proveedores de autenticación que desees
   - Agrega `http://localhost:3000` a las URLs permitidas

### 3. Ejecutar la Aplicación

```bash
# Modo desarrollo
npm run dev

# La aplicación estará disponible en http://localhost:3000
```

## 🎨 Funcionalidades

### Dashboard Principal
- **Navegación por pestañas**: Dashboard, Organizaciones, Buyer Personas, Productos
- **Estado persistente**: La navegación se mantiene al recargar la página
- **Interfaz intuitiva**: Diseño limpio y fácil de usar

### Gestión de Organizaciones
- **Modal con pestañas**: Organización, Buyer Persona, Productos
- **Formulario completo**: Nombre, misión, visión, objetivos estratégicos, logo
- **Validación**: Campos requeridos y validación de datos
- **Integración con Supabase**: Guardado automático en la base de datos

### Buyer Personas
- **Formularios detallados**: Información demográfica, psicográfica y comportamental
- **Vinculación**: Asociación con organizaciones específicas
- **Gestión completa**: Crear, editar y eliminar buyer personas

### Productos
- **Catálogo de productos**: Gestión completa de productos y servicios
- **Información detallada**: Descripción, precios, categorías
- **Organización**: Vinculación con organizaciones y buyer personas

## 🗄️ Base de Datos

El proyecto utiliza las siguientes tablas en Supabase:

- **organizations**: Información de las organizaciones
- **buyer_personas**: Perfiles de buyer personas
- **products**: Catálogo de productos y servicios

Todas las tablas incluyen Row Level Security (RLS) para proteger los datos por usuario.

## 🚀 Despliegue

### Vercel (Recomendado)
```bash
# Instalar Vercel CLI
npm i -g vercel

# Desplegar
vercel
```

### Netlify
1. Conecta tu repositorio de GitHub
2. Configura las variables de entorno
3. Despliega automáticamente

## 🔧 Desarrollo

### Scripts disponibles
```bash
npm run dev      # Servidor de desarrollo
npm run build    # Construir para producción
npm run start    # Servidor de producción
npm run lint     # Linter de código
```

### Tecnologías utilizadas
- **Next.js 15**: Framework de React
- **TypeScript**: Tipado estático
- **Supabase**: Backend como servicio
- **CSS Modules**: Estilos modulares
- **React**: Biblioteca de UI

## 🐛 Solución de Problemas

### Errores comunes

1. **Error de Supabase URL**:
   - Verifica que las variables de entorno estén configuradas correctamente
   - Asegúrate de que `.env.local` esté en la raíz del proyecto

2. **Problemas de autenticación**:
   - Verifica la configuración de Auth en Supabase
   - Asegúrate de que las URLs de redirección estén configuradas

3. **Errores de base de datos**:
   - Ejecuta el script `supabase_schema.sql`
   - Verifica que las políticas RLS estén configuradas

## 📞 Soporte

Para soporte técnico:
1. Revisa la documentación de [Next.js](https://nextjs.org/docs)
2. Consulta la documentación de [Supabase](https://supabase.com/docs)
3. Abre un issue en el repositorio de GitHub

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

---

**Desarrollado con ❤️ para INGENES Marketing**
