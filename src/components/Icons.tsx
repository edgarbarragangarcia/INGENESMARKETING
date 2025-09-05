import React from 'react';

interface IconProps {
  size?: number;
  color?: string;
  className?: string;
}

// Iconos de navegación principales
export const DashboardIcon: React.FC<IconProps> = ({ size = 20, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <defs>
      <linearGradient id="dashboardGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3b82f6" />
        <stop offset="100%" stopColor="#1d4ed8" />
      </linearGradient>
    </defs>
    <rect x="3" y="3" width="7" height="7" rx="2" fill="url(#dashboardGradient)" />
    <rect x="14" y="3" width="7" height="7" rx="2" fill="url(#dashboardGradient)" />
    <rect x="3" y="14" width="7" height="7" rx="2" fill="url(#dashboardGradient)" />
    <rect x="14" y="14" width="7" height="7" rx="2" fill="url(#dashboardGradient)" />
  </svg>
);

export const OrganizationIcon: React.FC<IconProps> = ({ size = 20, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <defs>
      <linearGradient id="orgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#10b981" />
        <stop offset="100%" stopColor="#059669" />
      </linearGradient>
    </defs>
    <path d="M3 21h18V9l-9-7-9 7v12z" fill="url(#orgGradient)" />
    <rect x="9" y="13" width="6" height="8" fill="white" rx="1" />
    <rect x="5" y="11" width="3" height="3" fill="white" rx="0.5" />
    <rect x="16" y="11" width="3" height="3" fill="white" rx="0.5" />
    <rect x="5" y="15" width="3" height="3" fill="white" rx="0.5" />
    <rect x="16" y="15" width="3" height="3" fill="white" rx="0.5" />
  </svg>
);

export const CreativeIcon: React.FC<IconProps> = ({ size = 20, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <defs>
      <linearGradient id="creativeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f59e0b" />
        <stop offset="100%" stopColor="#d97706" />
      </linearGradient>
    </defs>
    <circle cx="12" cy="12" r="9" fill="url(#creativeGradient)" />
    <path d="M12 7v5l3 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="12" cy="12" r="2" fill="white" />
  </svg>
);

export const PatientsIcon: React.FC<IconProps> = ({ size = 20, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <defs>
      <linearGradient id="patientsGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#8b5cf6" />
        <stop offset="100%" stopColor="#7c3aed" />
      </linearGradient>
    </defs>
    <circle cx="9" cy="7" r="4" fill="url(#patientsGradient)" />
    <path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" fill="url(#patientsGradient)" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="url(#patientsGradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M21 21v-2a4 4 0 0 0-3-3.85" stroke="url(#patientsGradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Iconos de acciones
export const AddIcon: React.FC<IconProps> = ({ size = 20, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <defs>
      <linearGradient id="addGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#06d6a0" />
        <stop offset="100%" stopColor="#048a81" />
      </linearGradient>
    </defs>
    <circle cx="12" cy="12" r="10" fill="url(#addGradient)" />
    <path d="M12 8v8M8 12h8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const EditIcon: React.FC<IconProps> = ({ size = 20, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <defs>
      <linearGradient id="editGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3b82f6" />
        <stop offset="100%" stopColor="#1e40af" />
      </linearGradient>
    </defs>
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="url(#editGradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" fill="url(#editGradient)" />
  </svg>
);

export const DeleteIcon: React.FC<IconProps> = ({ size = 20, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <defs>
      <linearGradient id="deleteGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ef4444" />
        <stop offset="100%" stopColor="#dc2626" />
      </linearGradient>
    </defs>
    <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14z" stroke="url(#deleteGradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10 11v6M14 11v6" stroke="url(#deleteGradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const SearchIcon: React.FC<IconProps> = ({ size = 20, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <defs>
      <linearGradient id="searchGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#64748b" />
        <stop offset="100%" stopColor="#475569" />
      </linearGradient>
    </defs>
    <circle cx="11" cy="11" r="8" stroke="url(#searchGradient)" strokeWidth="2" />
    <path d="m21 21-4.35-4.35" stroke="url(#searchGradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Iconos de productos y personas
export const ProductIcon: React.FC<IconProps> = ({ size = 20, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <defs>
      <linearGradient id="productGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f97316" />
        <stop offset="100%" stopColor="#ea580c" />
      </linearGradient>
    </defs>
    <rect x="3" y="3" width="18" height="18" rx="3" fill="url(#productGradient)" />
    <circle cx="9" cy="9" r="2" fill="white" />
    <path d="M21 15l-3.086-3.086a2 2 0 0 0-2.828 0L6 21" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PersonaIcon: React.FC<IconProps> = ({ size = 20, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <defs>
      <linearGradient id="personaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ec4899" />
        <stop offset="100%" stopColor="#db2777" />
      </linearGradient>
    </defs>
    <circle cx="12" cy="8" r="5" fill="url(#personaGradient)" />
    <path d="M20 21a8 8 0 1 0-16 0" fill="url(#personaGradient)" />
    <circle cx="12" cy="8" r="2" fill="white" />
  </svg>
);

export const AgeIcon: React.FC<IconProps> = ({ size = 16, color = 'currentColor', className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="12" r="10" stroke="#64748b" strokeWidth="2" />
    <path d="M12 6v6l4 2" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const LocationIcon: React.FC<IconProps> = ({ size = 16, color = 'currentColor', className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="#64748b" strokeWidth="2" />
    <circle cx="12" cy="10" r="3" stroke="#64748b" strokeWidth="2" />
  </svg>
);

export const OccupationIcon: React.FC<IconProps> = ({ size = 16, color = 'currentColor', className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" stroke="#64748b" strokeWidth="2" />
    <line x1="8" y1="21" x2="16" y2="21" stroke="#64748b" strokeWidth="2" />
    <line x1="12" y1="17" x2="12" y2="21" stroke="#64748b" strokeWidth="2" />
  </svg>
);

// Iconos de estado y utilidad
export const LogoutIcon: React.FC<IconProps> = ({ size = 20, color = 'currentColor', className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <defs>
      <linearGradient id="logoutGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ef4444" />
        <stop offset="100%" stopColor="#dc2626" />
      </linearGradient>
    </defs>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="url(#logoutGradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <polyline points="16,17 21,12 16,7" stroke="url(#logoutGradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <line x1="21" y1="12" x2="9" y2="12" stroke="url(#logoutGradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const ChevronDownIcon: React.FC<IconProps> = ({ size = 16, color = 'currentColor', className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <polyline points="6,9 12,15 18,9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const CheckIcon: React.FC<IconProps> = ({ size = 20, color = 'currentColor', className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <defs>
      <linearGradient id="checkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#10b981" />
        <stop offset="100%" stopColor="#059669" />
      </linearGradient>
    </defs>
    <circle cx="12" cy="12" r="10" fill="url(#checkGradient)" />
    <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Icono del logo principal
export const LogoIcon: React.FC<IconProps> = ({ size = 32, color = 'currentColor', className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
    <defs>
      <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3b82f6" />
        <stop offset="50%" stopColor="#8b5cf6" />
        <stop offset="100%" stopColor="#ec4899" />
      </linearGradient>
    </defs>
    <rect width="32" height="32" rx="8" fill="url(#logoGradient)" />
    <path d="M8 12h16M8 16h16M8 20h12" stroke="white" strokeWidth="2" strokeLinecap="round" />
    <circle cx="24" cy="20" r="2" fill="white" />
  </svg>
);

// Iconos de características (para landing page)
export const MagicIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <defs>
      <linearGradient id="magicGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f59e0b" />
        <stop offset="100%" stopColor="#d97706" />
      </linearGradient>
    </defs>
    <path d="M15 4V2m0 20v-2m-4-9l-2.5-2.5M6.5 6.5L9 9m0 6l-2.5 2.5M6.5 17.5L9 15m6 0l2.5 2.5M17.5 17.5L15 15m0-6l2.5-2.5M17.5 6.5L15 9" stroke="url(#magicGradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="12" cy="12" r="3" fill="url(#magicGradient)" />
  </svg>
);

export const CalendarIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <defs>
      <linearGradient id="calendarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3b82f6" />
        <stop offset="100%" stopColor="#1e40af" />
      </linearGradient>
    </defs>
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" fill="url(#calendarGradient)" />
    <line x1="16" y1="2" x2="16" y2="6" stroke="white" strokeWidth="2" strokeLinecap="round" />
    <line x1="8" y1="2" x2="8" y2="6" stroke="white" strokeWidth="2" strokeLinecap="round" />
    <line x1="3" y1="10" x2="21" y2="10" stroke="white" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const ChartIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <defs>
      <linearGradient id="chartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#10b981" />
        <stop offset="100%" stopColor="#059669" />
      </linearGradient>
    </defs>
    <polyline points="22,6 12,16 2,6" stroke="url(#chartGradient)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M16 6h6v6M22 2l-7 7-4-4-5 5" stroke="url(#chartGradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const UsersIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <defs>
      <linearGradient id="usersGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#8b5cf6" />
        <stop offset="100%" stopColor="#7c3aed" />
      </linearGradient>
    </defs>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" fill="url(#usersGradient)" />
    <circle cx="9" cy="7" r="4" fill="url(#usersGradient)" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="url(#usersGradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PaletteIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <defs>
      <linearGradient id="paletteGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ec4899" />
        <stop offset="100%" stopColor="#db2777" />
      </linearGradient>
    </defs>
    <circle cx="13.5" cy="6.5" r=".5" fill="white" />
    <circle cx="17.5" cy="10.5" r=".5" fill="white" />
    <circle cx="8.5" cy="7.5" r=".5" fill="white" />
    <circle cx="6.5" cy="12.5" r=".5" fill="white" />
    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" fill="url(#paletteGradient)" />
  </svg>
);

export const ShareIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <defs>
      <linearGradient id="shareGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#06d6a0" />
        <stop offset="100%" stopColor="#048a81" />
      </linearGradient>
    </defs>
    <circle cx="18" cy="5" r="3" fill="url(#shareGradient)" />
    <circle cx="6" cy="12" r="3" fill="url(#shareGradient)" />
    <circle cx="18" cy="19" r="3" fill="url(#shareGradient)" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" stroke="url(#shareGradient)" strokeWidth="2" />
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" stroke="url(#shareGradient)" strokeWidth="2" />
  </svg>
);