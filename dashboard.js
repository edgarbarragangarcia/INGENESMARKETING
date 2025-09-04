// Dashboard JavaScript
let supabase;
let currentUser = null;

// Initialize Dashboard
document.addEventListener('DOMContentLoaded', async function() {
    // Initialize Supabase
    if (window.SUPABASE_CONFIG) {
        supabase = window.supabase.createClient(
            window.SUPABASE_CONFIG.url,
            window.SUPABASE_CONFIG.anonKey
        );
    }

    // Check authentication
    await checkAuthState();
    
    // Initialize navigation
    initializeNavigation();
    
    // Initialize event listeners
    initializeEventListeners();
    
    // Load dashboard data
    loadDashboardData();
});

// Check Authentication State
async function checkAuthState() {
    try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
            console.error('Error checking auth state:', error);
            redirectToLogin();
            return;
        }
        
        if (!session) {
            // No active session, redirect to login
            redirectToLogin();
            return;
        }
        
        // User is authenticated
        currentUser = session.user;
        updateUserInfo(currentUser);
        
    } catch (error) {
        console.error('Auth check failed:', error);
        redirectToLogin();
    }
}

// Update User Information in Header
function updateUserInfo(user) {
    const userEmailElement = document.getElementById('user-email');
    if (userEmailElement && user) {
        userEmailElement.textContent = user.email || 'Usuario';
    }
}

// Redirect to Login Page
function redirectToLogin() {
    // Clear any stored session data
    localStorage.removeItem('supabase.auth.token');
    
    // Redirect to login page
    window.location.href = 'index.html';
}

// Initialize Navigation
function initializeNavigation() {
    const navItems = document.querySelectorAll('.nav-item a');
    const contentSections = document.querySelectorAll('.content-section');
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all nav items
            document.querySelectorAll('.nav-item').forEach(nav => {
                nav.classList.remove('active');
            });
            
            // Add active class to clicked item
            this.parentElement.classList.add('active');
            
            // Hide all content sections
            contentSections.forEach(section => {
                section.classList.remove('active');
            });
            
            // Show target section
            const targetSection = this.getAttribute('data-section');
            const targetElement = document.getElementById(targetSection + '-section');
            if (targetElement) {
                targetElement.classList.add('active');
            }
            
            // Load section-specific data
            loadSectionData(targetSection);
        });
    });
}

// Initialize Event Listeners
function initializeEventListeners() {
    // Logout button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    
    // New campaign button
    const newCampaignBtn = document.querySelector('.btn-primary');
    if (newCampaignBtn) {
        newCampaignBtn.addEventListener('click', function() {
            showNotification('Funcionalidad de nueva campaña en desarrollo', 'info');
        });
    }
}

// Handle Logout
async function handleLogout() {
    try {
        const { error } = await supabase.auth.signOut();
        
        if (error) {
            console.error('Logout error:', error);
            showNotification('Error al cerrar sesión', 'error');
            return;
        }
        
        // Clear local storage
        localStorage.removeItem('supabase.auth.token');
        
        // Show success message
        showNotification('Sesión cerrada exitosamente', 'success');
        
        // Redirect to login after a short delay
        setTimeout(() => {
            redirectToLogin();
        }, 1000);
        
    } catch (error) {
        console.error('Logout failed:', error);
        showNotification('Error al cerrar sesión', 'error');
    }
}

// Load Dashboard Data
function loadDashboardData() {
    // Simulate loading dashboard statistics
    animateCounters();
    loadRecentActivity();
}

// Load Section-Specific Data
function loadSectionData(section) {
    switch(section) {
        case 'campaigns':
            loadCampaignsData();
            break;
        case 'analytics':
            loadAnalyticsData();
            break;
        case 'patients':
            loadPatientsData();
            break;
        case 'settings':
            loadSettingsData();
            break;
        default:
            loadDashboardData();
    }
}

// Animate Counter Numbers
function animateCounters() {
    const counters = document.querySelectorAll('.stat-content h3');
    
    counters.forEach(counter => {
        const target = parseInt(counter.textContent.replace(/,/g, ''));
        const increment = target / 100;
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                counter.textContent = formatNumber(target);
                clearInterval(timer);
            } else {
                counter.textContent = formatNumber(Math.floor(current));
            }
        }, 20);
    });
}

// Format Number with Commas
function formatNumber(num) {
    if (typeof num === 'string' && num.includes('%')) {
        return num;
    }
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Load Recent Activity
function loadRecentActivity() {
    // This would typically fetch from your backend/Supabase
    const activities = [
        {
            icon: 'fas fa-user-plus',
            text: 'Nuevo registro: María González',
            time: 'Hace 5 minutos'
        },
        {
            icon: 'fas fa-calendar',
            text: 'Cita agendada: Carlos Ruiz',
            time: 'Hace 15 minutos'
        },
        {
            icon: 'fas fa-bullhorn',
            text: 'Campaña "Fertilidad 2024" iniciada',
            time: 'Hace 1 hora'
        }
    ];
    
    updateActivityList(activities);
}

// Update Activity List
function updateActivityList(activities) {
    const activityList = document.querySelector('.activity-list');
    if (!activityList) return;
    
    activityList.innerHTML = activities.map(activity => `
        <div class="activity-item">
            <i class="${activity.icon}"></i>
            <div class="activity-content">
                <p>${activity.text}</p>
                <span>${activity.time}</span>
            </div>
        </div>
    `).join('');
}

// Load Campaigns Data
function loadCampaignsData() {
    showNotification('Cargando datos de campañas...', 'info');
    // Simulate API call
    setTimeout(() => {
        showNotification('Datos de campañas actualizados', 'success');
    }, 1000);
}

// Load Analytics Data
function loadAnalyticsData() {
    showNotification('Cargando analíticas...', 'info');
}

// Load Patients Data
function loadPatientsData() {
    showNotification('Cargando datos de pacientes...', 'info');
}

// Load Settings Data
function loadSettingsData() {
    showNotification('Cargando configuración...', 'info');
}

// Show Notification
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        max-width: 400px;
        animation: slideIn 0.3s ease;
    `;
    
    // Add to document
    document.body.appendChild(notification);
    
    // Add close functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.remove();
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// Get Notification Icon
function getNotificationIcon(type) {
    switch(type) {
        case 'success': return 'check-circle';
        case 'error': return 'exclamation-circle';
        case 'warning': return 'exclamation-triangle';
        default: return 'info-circle';
    }
}

// Get Notification Color
function getNotificationColor(type) {
    switch(type) {
        case 'success': return '#10b981';
        case 'error': return '#ef4444';
        case 'warning': return '#f59e0b';
        default: return '#3b82f6';
    }
}

// Add CSS animation for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        width: 100%;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        padding: 0.25rem;
        margin-left: auto;
        opacity: 0.8;
        transition: opacity 0.3s ease;
    }
    
    .notification-close:hover {
        opacity: 1;
    }
`;
document.head.appendChild(style);

// Export functions for global access
window.dashboardFunctions = {
    checkAuthState,
    handleLogout,
    showNotification,
    redirectToLogin
};