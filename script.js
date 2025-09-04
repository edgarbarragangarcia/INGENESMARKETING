// Configuración de Supabase
let supabase;

// Variables globales
let isLoggedIn = false;
let currentUser = null;

// Inicialización cuando el DOM está listo
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Inicializar Supabase
    initializeSupabase();
    
    // Configurar event listeners
    setupEventListeners();
    
    // Configurar navegación suave
    setupSmoothScrolling();
    
    // Configurar animaciones de scroll
    setupScrollAnimations();
    
    // Configurar header sticky
    setupStickyHeader();
    
    // Verificar estado de autenticación
    checkAuthState();
}

// Configuración de Supabase
function initializeSupabase() {
    if (typeof window.supabase !== 'undefined' && window.SUPABASE_CONFIG) {
        supabase = window.supabase.createClient(
            window.SUPABASE_CONFIG.url,
            window.SUPABASE_CONFIG.anonKey
        );
        console.log('Supabase inicializado correctamente');
    } else {
        console.error('Supabase no está disponible o falta la configuración');
    }
}

// Verificar estado de autenticación
async function checkAuthState() {
    if (!supabase) return;
    
    try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
            handleAuthSuccess(session.user);
        }
    } catch (error) {
        console.error('Error verificando estado de auth:', error);
    }
}

// Manejo de login con email/password
async function handleEmailLogin(email, password) {
    if (!supabase) {
        showErrorMessage('Error: Supabase no está inicializado');
        return;
    }
    
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        });
        
        if (error) {
            throw error;
        }
        
        handleAuthSuccess(data.user);
        
    } catch (error) {
        console.error('Error en login:', error);
        showErrorMessage(error.message || 'Error en el inicio de sesión');
    }
}

// Manejo de registro con email/password
async function handleEmailSignup(email, password) {
    if (!supabase) {
        showErrorMessage('Error: Supabase no está inicializado');
        return;
    }
    
    try {
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password
        });
        
        if (error) {
            throw error;
        }
        
        if (data.user && !data.session) {
            showNotification('Revisa tu email para confirmar tu cuenta', 'success');
        } else {
            handleAuthSuccess(data.user);
        }
        
    } catch (error) {
        console.error('Error en registro:', error);
        showErrorMessage(error.message || 'Error en el registro');
    }
}

// Manejo de login con Google
async function handleGoogleLogin() {
    if (!supabase) {
        showErrorMessage('Error: Supabase no está inicializado');
        return;
    }
    
    try {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin
            }
        });
        
        if (error) {
            throw error;
        }
        
    } catch (error) {
        console.error('Error en login con Google:', error);
        showErrorMessage(error.message || 'Error en el login con Google');
    }
}

// Manejo exitoso de autenticación
function handleAuthSuccess(user) {
    isLoggedIn = true;
    currentUser = {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.full_name || user.email,
        picture: user.user_metadata?.avatar_url || null
    };
    
    // Cerrar modal
    closeModal();
    
    // Mostrar mensaje de bienvenida y redirección
    showNotification('¡Bienvenido! Redirigiendo al dashboard...', 'success');
    
    // Actualizar UI
    updateUIForLoggedInUser();
    
    // Guardar en localStorage (opcional)
    localStorage.setItem('user', JSON.stringify(currentUser));
    localStorage.setItem('isLoggedIn', 'true');
    
    // Redireccionar al dashboard después de 2 segundos
    setTimeout(() => {
        window.location.href = 'dashboard.html';
    }, 2000);
}

// Configurar event listeners
function setupEventListeners() {
    // Botones de login
    const loginBtns = document.querySelectorAll('#loginBtn, #heroLoginBtn, #ctaLoginBtn');
    loginBtns.forEach(btn => {
        btn.addEventListener('click', openLoginModal);
    });
    
    // Modal de login
    const modal = document.getElementById('loginModal');
    const closeBtn = document.querySelector('.close');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
    
    // Cerrar modal al hacer clic fuera
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModal();
        }
    });
    
    // Formulario de login tradicional
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            handleEmailLogin(email, password);
        });
    }
    
    // Botón de Google Sign-In
    const googleBtn = document.querySelector('.g_id_signin');
    if (googleBtn) {
        googleBtn.addEventListener('click', handleGoogleLogin);
    }
    
    // Menú hamburguesa
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }
    
    // Botones de precios
    const pricingBtns = document.querySelectorAll('.btn-pricing');
    pricingBtns.forEach(btn => {
        btn.addEventListener('click', handlePricingClick);
    });
    
    // Botón de demo
    const demoBtn = document.querySelector('.btn-secondary');
    if (demoBtn) {
        demoBtn.addEventListener('click', showDemo);
    }
}

// Abrir modal de login
function openLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Reinicializar Google Sign-In si es necesario
        if (typeof google !== 'undefined' && google.accounts) {
            google.accounts.id.prompt();
        }
    }
}

// Cerrar modal de login
function closeModal() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Manejar login tradicional
function handleTraditionalLogin(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const email = formData.get('email') || event.target.querySelector('input[type="email"]').value;
    const password = formData.get('password') || event.target.querySelector('input[type="password"]').value;
    
    // Validación básica
    if (!email || !password) {
        showErrorMessage('Por favor, completa todos los campos');
        return;
    }
    
    if (!isValidEmail(email)) {
        showErrorMessage('Por favor, ingresa un email válido');
        return;
    }
    
    // Simular login (en producción, esto sería una llamada a la API)
    simulateLogin(email, password);
}

// Simular proceso de login
function simulateLogin(email, password) {
    // Mostrar loading
    const submitBtn = document.querySelector('.btn-form');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Iniciando sesión...';
    submitBtn.disabled = true;
    
    // Simular delay de red
    setTimeout(() => {
        // En un caso real, aquí validarías las credenciales con tu backend
        if (email && password.length >= 6) {
            // Login exitoso
            currentUser = {
                id: Date.now().toString(),
                name: email.split('@')[0],
                email: email,
                picture: null
            };
            
            isLoggedIn = true;
            closeModal();
            showWelcomeMessage(currentUser.name);
            updateUIForLoggedInUser();
            
            // Guardar en localStorage
            localStorage.setItem('user', JSON.stringify(currentUser));
            localStorage.setItem('isLoggedIn', 'true');
        } else {
            showErrorMessage('Credenciales inválidas');
        }
        
        // Restaurar botón
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 1500);
}

// Actualizar UI para usuario logueado
function updateUIForLoggedInUser() {
    const loginBtns = document.querySelectorAll('#loginBtn, #heroLoginBtn, #ctaLoginBtn');
    loginBtns.forEach(btn => {
        btn.innerHTML = `<i class="fas fa-user"></i> ${currentUser.name}`;
        btn.onclick = showUserMenu;
    });
    
    // Cambiar texto de CTAs
    const ctaBtns = document.querySelectorAll('.btn-cta, .btn-primary');
    ctaBtns.forEach(btn => {
        if (btn.textContent.includes('Comenzar')) {
            btn.innerHTML = '<i class="fas fa-rocket"></i> Ir al Dashboard';
            btn.onclick = goToDashboard;
        }
    });
}

// Mostrar menú de usuario
function showUserMenu() {
    // Crear menú desplegable simple
    const existingMenu = document.querySelector('.user-menu');
    if (existingMenu) {
        existingMenu.remove();
        return;
    }
    
    const menu = document.createElement('div');
    menu.className = 'user-menu';
    menu.innerHTML = `
        <div class="user-menu-content">
            <div class="user-info">
                ${currentUser.picture ? `<img src="${currentUser.picture}" alt="Avatar">` : '<i class="fas fa-user-circle"></i>'}
                <div>
                    <div class="user-name">${currentUser.name}</div>
                    <div class="user-email">${currentUser.email}</div>
                </div>
            </div>
            <hr>
            <a href="#" onclick="goToDashboard()"><i class="fas fa-tachometer-alt"></i> Dashboard</a>
            <a href="#" onclick="showProfile()"><i class="fas fa-user"></i> Perfil</a>
            <a href="#" onclick="showSettings()"><i class="fas fa-cog"></i> Configuración</a>
            <hr>
            <a href="#" onclick="logout()" class="logout"><i class="fas fa-sign-out-alt"></i> Cerrar Sesión</a>
        </div>
    `;
    
    // Agregar estilos inline para el menú
    menu.style.cssText = `
        position: absolute;
        top: 100%;
        right: 0;
        background: white;
        border: 1px solid var(--border-color);
        border-radius: var(--border-radius);
        box-shadow: var(--shadow-lg);
        z-index: 1000;
        min-width: 250px;
        margin-top: 10px;
    `;
    
    const loginBtn = document.querySelector('#loginBtn');
    loginBtn.parentElement.style.position = 'relative';
    loginBtn.parentElement.appendChild(menu);
    
    // Cerrar menú al hacer clic fuera
    setTimeout(() => {
        document.addEventListener('click', function closeUserMenu(e) {
            if (!menu.contains(e.target) && !loginBtn.contains(e.target)) {
                menu.remove();
                document.removeEventListener('click', closeUserMenu);
            }
        });
    }, 100);
}

// Funciones de navegación
function goToDashboard() {
    showNotification('Redirigiendo al dashboard...', 'info');
    // Redireccionar al dashboard
    setTimeout(() => {
        window.location.href = 'dashboard.html';
    }, 1000);
}

function showProfile() {
    showNotification('Función de perfil en desarrollo', 'info');
}

function showSettings() {
    showNotification('Función de configuración en desarrollo', 'info');
}

// Cerrar sesión
async function logout() {
    if (!supabase) return;
    
    try {
        const { error } = await supabase.auth.signOut();
        if (error) {
            throw error;
        }
        
        // Limpiar estado
        isLoggedIn = false;
        currentUser = null;
        
        // Limpiar localStorage
        localStorage.removeItem('user');
        localStorage.removeItem('isLoggedIn');
        
        // Restaurar UI
        location.reload();
        
    } catch (error) {
        console.error('Error en logout:', error);
        showErrorMessage('Error al cerrar sesión');
    }
}

// Manejar clics en precios
function handlePricingClick(event) {
    const plan = event.target.closest('.pricing-card').querySelector('h3').textContent;
    
    if (isLoggedIn) {
        showNotification(`Redirigiendo a la suscripción del plan ${plan}...`, 'info');
        // Redirigir a página de suscripción
    } else {
        openLoginModal();
    }
}

// Mostrar demo
function showDemo() {
    showNotification('Demo interactiva próximamente disponible', 'info');
    // Aquí podrías abrir un modal con un video o tour interactivo
}

// Configurar navegación suave
function setupSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Configurar header sticky
function setupStickyHeader() {
    const header = document.querySelector('.header');
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = 'var(--shadow-sm)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = 'none';
        }
        
        // Ocultar/mostrar header en scroll
        if (currentScrollY > lastScrollY && currentScrollY > 200) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollY = currentScrollY;
    });
}

// Configurar animaciones de scroll
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observar elementos animables
    const animatedElements = document.querySelectorAll('.feature-card, .pricing-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Funciones de utilidad
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showWelcomeMessage(name) {
    showNotification(`¡Bienvenido, ${name}! 🎉`, 'success');
}

function showErrorMessage(message) {
    showNotification(message, 'error');
}

function showNotification(message, type = 'info') {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Estilos inline
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: var(--border-radius);
        color: white;
        font-weight: 500;
        z-index: 9999;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 300px;
        box-shadow: var(--shadow-lg);
    `;
    
    // Colores según tipo
    switch (type) {
        case 'success':
            notification.style.background = '#10b981';
            break;
        case 'error':
            notification.style.background = '#ef4444';
            break;
        case 'warning':
            notification.style.background = '#f59e0b';
            break;
        default:
            notification.style.background = '#6366f1';
    }
    
    document.body.appendChild(notification);
    
    // Animar entrada
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remover después de 4 segundos
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

function showGoogleAuthFallback() {
    const googleSignInDiv = document.querySelector('.g_id_signin');
    if (googleSignInDiv) {
        googleSignInDiv.innerHTML = `
            <button class="btn-google-fallback" onclick="handleGoogleLogin()">
                <i class="fab fa-google"></i>
                Continuar con Google
            </button>
        `;
        
        // Agregar estilos para el botón de fallback
        const style = document.createElement('style');
        style.textContent = `
            .btn-google-fallback {
                width: 100%;
                padding: 0.75rem;
                border: 1px solid var(--border-color);
                background: white;
                color: var(--text-primary);
                border-radius: var(--border-radius);
                font-weight: 500;
                cursor: pointer;
                transition: var(--transition);
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 0.5rem;
                margin-bottom: 1rem;
            }
            .btn-google-fallback:hover {
                border-color: var(--primary-color);
                box-shadow: var(--shadow-sm);
            }
            .btn-google-fallback i {
                color: #ea4335;
            }
        `;
        document.head.appendChild(style);
    }
}

// Verificar si hay sesión guardada al cargar
function checkSavedSession() {
    const savedUser = localStorage.getItem('user');
    const savedLoginStatus = localStorage.getItem('isLoggedIn');
    
    if (savedUser && savedLoginStatus === 'true') {
        try {
            currentUser = JSON.parse(savedUser);
            isLoggedIn = true;
            updateUIForLoggedInUser();
        } catch (error) {
            console.error('Error al recuperar sesión guardada:', error);
            localStorage.removeItem('user');
            localStorage.removeItem('isLoggedIn');
        }
    }
}

// Verificar sesión guardada al inicializar
document.addEventListener('DOMContentLoaded', function() {
    checkSavedSession();
});

// Manejar errores globales
window.addEventListener('error', function(event) {
    console.error('Error global:', event.error);
});

// Exportar funciones para uso global
window.handleEmailLogin = handleEmailLogin;
window.handleEmailSignup = handleEmailSignup;
window.handleGoogleLogin = handleGoogleLogin;
window.goToDashboard = goToDashboard;
window.showProfile = showProfile;
window.showSettings = showSettings;
window.logout = logout;