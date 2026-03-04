import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Menubar } from 'primereact/menubar';
import { Avatar } from 'primereact/avatar';
import { Dropdown } from 'primereact/dropdown';
import { useTranslation } from 'react-i18next';
import type { MenuItem } from 'primereact/menuitem';

import api from '../api';

const MainLayout: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();

  const languages = [
    { label: 'Castellano', value: 'es' },
    { label: 'Euskera', value: 'eu' }
  ];

  const changeLanguage = async (lang: string) => {
    // Sincronizar con el backend de Spring
    try {
      await api.get(`/sessionInfo/locale?lang=${lang}`);
      // Forzar recarga total para asegurar que todo (React + Spring) se sincronice
      window.location.reload();
    } catch (error) {
      console.error("Error sincronizando idioma con el backend", error);
    }
  };

  const languageValueTemplate = (option: any, props: any) => {
    if (option) {
      return (
        <div className="flex align-items-center">
          <i className="pi pi-globe mr-2 text-primary" style={{ fontSize: '0.9rem' }}></i>
          <span>{option.label}</span>
        </div>
      );
    }
    return props.placeholder;
  };

  const languageOptionTemplate = (option: any) => {
    return (
      <div className="flex align-items-center">
        <i className="pi pi-globe mr-2 text-primary" style={{ fontSize: '0.9rem' }}></i>
        <span>{option.label}</span>
      </div>
    );
  };

  const items: MenuItem[] = [
    {
      label: t('pages:menu.home'),
      icon: 'pi pi-home',
      command: () => navigate('/'),
      className: location.pathname === '/' ? 'p-menuitem-active' : ''
    },
    {
      label: t('pages:menu.management'),
      icon: 'pi pi-briefcase',
      items: [
        {
          label: t('pages:menu.maintenance'),
          icon: 'pi pi-list',
          items: [
            {
              label: t('pages:menu.maintenance_exp'),
              icon: 'pi pi-file',
              command: () => navigate('/expedientes')
            },
            {
              label: t('pages:menu.maintenance_per'),
              icon: 'pi pi-users',
              command: () => navigate('/personas')
            },
            {
              label: t('pages:menu.maintenance_ani'),
              icon: 'pi pi-paw',
              command: () => navigate('/animales')
            }
          ]
        },
        {
          label: t('pages:menu.reports'),
          icon: 'pi pi-chart-bar',
          disabled: true
        }
      ]
    },
    {
      label: t('pages:menu.settings'),
      icon: 'pi pi-cog',
      disabled: true
    }
  ];

  const start = (
    <div className="logo-section">
      <i className="pi pi-prime text-3xl"></i>
      <span>{t('pages:layout.appName')}</span>
    </div>
  );

  const end = (
    <div className="flex align-items-center gap-3">
      <Dropdown 
        value={i18n.language} 
        options={languages} 
        onChange={(e) => changeLanguage(e.value)} 
        valueTemplate={languageValueTemplate}
        itemTemplate={languageOptionTemplate}
        className="p-inputtext-sm border-round-xl border-1 border-slate-200 bg-white" 
        style={{ width: '160px' }}
      />
      <div className="user-badge shadow-1">
        <i className="pi pi-user text-primary"></i>
        <span>{user?.name} {user?.surname1}</span>
        <Avatar label={user?.name?.[0]} shape="circle" style={{ backgroundColor: '#3b82f6', color: '#ffffff' }} />
      </div>
    </div>
  );

  return (
    <div className="app-container">
      <header className="app-header shadow-2">
        <Menubar model={items} start={start} end={end} style={{ border: 'none', background: 'transparent' }} />
      </header>
      
      <main className="main-content">
        <Outlet />
      </main>

      <footer className="app-footer">
        <div className="mb-2 font-semibold">UDA Framework v2026</div>
        <div className="opacity-70">&copy; {new Date().getFullYear()} {t('pages:layout.footer')}</div>
      </footer>
    </div>
  );
};

export default MainLayout;
