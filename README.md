# CreativeFlow - Landing Page de Marketing Digital

Una landing page moderna y responsiva para una aplicación web de creación de contenido de marketing digital con integración de Google OAuth.

## 🚀 Características

- **Diseño Moderno**: Interfaz limpia y atractiva con gradientes y animaciones
- **Totalmente Responsivo**: Optimizado para desktop, tablet y móvil
- **Google OAuth**: Integración completa con Google Sign-In
- **Animaciones Suaves**: Transiciones y efectos visuales atractivos
- **Navegación Intuitiva**: Menú sticky y scroll suave
- **Secciones Completas**: Hero, características, precios, CTA y footer

## 📁 Estructura del Proyecto

```
├── index.html          # Página principal
├── styles.css          # Estilos CSS
├── script.js           # JavaScript y funcionalidad
└── README.md           # Este archivo
```

## 🛠️ Configuración

### 1. Configurar Supabase

Para habilitar la autenticación con Supabase, necesitas:

1. **Crear proyecto en Supabase**:
   - Ve a [Supabase](https://supabase.com/)
   - Crea una nueva cuenta o inicia sesión
   - Crea un nuevo proyecto
   - Espera a que se complete la configuración

2. **Obtener credenciales**:
   - Ve a Settings > API en tu proyecto de Supabase
   - Copia la URL del proyecto y la clave anónima (anon key)

3. **Configurar autenticación**:
   - Ve a Authentication > Settings
   - Configura los proveedores de autenticación que desees usar
   - Para Google OAuth: agrega tu Client ID y Client Secret de Google

4. **Actualizar configuración**:
   Las credenciales ya están configuradas en `config.js`:
   ```javascript
   const SUPABASE_CONFIG = {
       url: 'https://ngegxcpncdrkuatmotdw.supabase.co',
       anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
   };
   ```

5. **Configurar dominio de redirección**:
   - En Authentication > Settings > Site URL
   - Agrega: `http://localhost:8000` para desarrollo
   - Para producción, agrega tu dominio real

### 2. Ejecutar la Aplicación

#### Opción 1: Servidor Local Simple
```bash
# Con Python 3
python -m http.server 8000

# Con Python 2
python -m SimpleHTTPServer 8000

# Con Node.js (si tienes http-server instalado)
npx http-server -p 8000
```

#### Opción 2: Live Server (VS Code)
1. Instala la extensión "Live Server" en VS Code
2. Haz clic derecho en `index.html`
3. Selecciona "Open with Live Server"

#### Opción 3: Abrir directamente
Puedes abrir `index.html` directamente en el navegador, pero algunas funciones de Google OAuth pueden no funcionar correctamente.

## 🎨 Personalización

### Colores y Temas
Los colores principales están definidos como variables CSS en `styles.css`:

```css
:root {
    --primary-color: #6366f1;     /* Color principal */
    --secondary-color: #ec4899;   /* Color secundario */
    --accent-color: #06b6d4;      /* Color de acento */
    /* ... más variables */
}
```

### Contenido
- **Título y descripción**: Edita el contenido en la sección `.hero` de `index.html`
- **Características**: Modifica las tarjetas en la sección `.features`
- **Precios**: Actualiza los planes en la sección `.pricing`
- **Información de contacto**: Cambia los enlaces en el footer

### Imágenes y Logo
- El logo actual usa Font Awesome icons
- Para agregar tu logo, reemplaza el contenido de `.nav-logo` y `.footer-logo`
- Las imágenes del mockup son generadas con CSS (puedes reemplazarlas con imágenes reales)

## 🔧 Funcionalidades

### Autenticación con Supabase
- **Email/Password**: Registro e inicio de sesión tradicional
- **Google OAuth**: Login con cuentas de Google (opcional)
- **Sesión persistente**: Mantiene la sesión del usuario automáticamente
- **Confirmación por email**: Verificación de cuentas nuevas
- **Logout seguro**: Cierre de sesión completo
- **Gestión de estado**: Verificación automática del estado de autenticación
- **Menú de usuario**: Dropdown con opciones de perfil

### Navegación
- **Scroll suave**: Navegación entre secciones
- **Header sticky**: Se oculta/muestra al hacer scroll
- **Menú responsive**: Hamburger menu para móviles

### Interactividad
- **Animaciones de scroll**: Elementos aparecen al hacer scroll
- **Hover effects**: Efectos en botones y tarjetas
- **Modal de login**: Ventana emergente para autenticación
- **Notificaciones**: Sistema de mensajes toast

## 📱 Responsive Design

La landing page está optimizada para:
- **Desktop**: 1200px+
- **Tablet**: 768px - 1199px
- **Mobile**: < 768px

Breakpoints principales:
```css
@media (max-width: 768px) { /* Tablet y móvil */ }
@media (max-width: 480px) { /* Móvil pequeño */ }
```

## 🚀 Despliegue

### GitHub Pages
1. Sube el código a un repositorio de GitHub
2. Ve a Settings > Pages
3. Selecciona la rama main como fuente
4. Tu sitio estará disponible en `https://tu-usuario.github.io/tu-repositorio`

### Netlify
1. Arrastra la carpeta del proyecto a [Netlify Drop](https://app.netlify.com/drop)
2. O conecta tu repositorio de GitHub para despliegue automático

### Vercel
1. Instala Vercel CLI: `npm i -g vercel`
2. En la carpeta del proyecto: `vercel`
3. Sigue las instrucciones

## 🔒 Consideraciones de Seguridad

- **Supabase Auth**: Sistema de autenticación empresarial
- **HTTPS**: Requerido para producción
- **JWT Tokens**: Tokens seguros con expiración automática
- **Row Level Security**: Control granular de acceso a datos
- **Sanitización**: Limpieza automática de inputs
- **Rate Limiting**: Protección contra ataques de fuerza bruta
- **Dominios autorizados**: Configura correctamente los dominios en Supabase
- **Datos sensibles**: Nunca expongas claves privadas en el frontend

## 🐛 Solución de Problemas

### Problemas comunes con Supabase

1. **Error: "Invalid login credentials"**
   - Verifica email y contraseña
   - Asegúrate de que la cuenta esté confirmada

2. **Error: "Email not confirmed"**
   - Revisa tu bandeja de entrada y spam
   - Reenvía el email de confirmación desde Supabase

3. **Error: "Invalid API key"**
   - Verifica las credenciales en `config.js`
   - Asegúrate de usar la clave anónima correcta

4. **Google OAuth no funciona**
   - Configura Google OAuth en Supabase Dashboard
   - Verifica las credenciales de Google Cloud Console
   - Asegúrate de que el dominio esté autorizado

5. **Problemas de CORS**
   - Configura los dominios permitidos en Supabase
   - Para desarrollo local usa `http://localhost:8000`

### Estilos no se cargan
1. Verifica que `styles.css` esté en la misma carpeta que `index.html`
2. Comprueba que no haya errores de sintaxis CSS
3. Limpia la caché del navegador

### JavaScript no funciona
1. Abre las herramientas de desarrollador (F12)
2. Revisa la consola para errores
3. Verifica que `script.js` esté cargando correctamente

## 📞 Soporte

Si necesitas ayuda:
1. Revisa la documentación de [Google Identity](https://developers.google.com/identity/gsi/web)
2. Consulta los issues en GitHub
3. Contacta al equipo de desarrollo

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Puedes usarlo libremente para proyectos personales y comerciales.

---

**¡Disfruta creando contenido extraordinario con CreativeFlow! 🚀**