import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useTranslation } from 'react-i18next';

const HomePage: React.FC = () => {
  const { user } = useAuth();
  const { t } = useTranslation();

  return (
    <div>
      <div className="tw-mb-8">
        <h1 className="tw-text-2xl tw-font-bold tw-text-slate-800 tw-mb-2">
          {t('pages:layout.welcome')}
        </h1>
        <p className="tw-text-slate-500 tw-text-sm">
          {t('pages:layout.welcomeSub')}
        </p>
      </div>

      <div className="card">
        <div className="tw-flex tw-items-center tw-gap-4 tw-mb-6">
          <div
            className="tw-w-14 tw-h-14 tw-rounded-full tw-flex tw-items-center tw-justify-center tw-text-white tw-text-xl tw-font-bold"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}
          >
            {user?.name?.[0]}{user?.surname1?.[0]}
          </div>
          <div>
            <h3 className="tw-text-lg tw-font-semibold tw-text-slate-800 tw-mb-0.5">
              {user?.name} {user?.surname1}
            </h3>
            <p className="tw-text-xs tw-text-slate-400 tw-m-0">
              {t('pages:layout.userInfo')}
            </p>
          </div>
        </div>

        <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-4">
          <div className="tw-p-4 tw-bg-slate-50 tw-rounded-lg">
            <div className="tw-flex tw-items-center tw-gap-2 tw-mb-3">
              <i className="pi pi-id-card tw-text-blue-500"></i>
              <span className="tw-text-xs tw-font-semibold tw-text-slate-500 tw-uppercase tw-tracking-wider">
                {t('common:user.name')}
              </span>
            </div>
            <span className="tw-text-sm tw-font-medium tw-text-slate-700">
              {user?.name} {user?.surname1}
            </span>
          </div>

          <div className="tw-p-4 tw-bg-slate-50 tw-rounded-lg">
            <div className="tw-flex tw-items-center tw-gap-2 tw-mb-3">
              <i className="pi pi-shield tw-text-blue-500"></i>
              <span className="tw-text-xs tw-font-semibold tw-text-slate-500 tw-uppercase tw-tracking-wider">
                {t('common:user.roles')}
              </span>
            </div>
            <div className="tw-flex tw-flex-wrap tw-gap-1.5">
              {user?.roles?.map((role, i) => (
                <span
                  key={i}
                  className="tw-px-2 tw-py-0.5 tw-bg-blue-100 tw-text-blue-700 tw-rounded tw-text-xs tw-font-medium"
                >
                  {role}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="tw-text-lg tw-font-semibold tw-text-slate-800 tw-mb-4">
          {t('pages:layout.quickAccess')}
        </h3>
        <div className="tw-grid tw-grid-cols-2 md:tw-grid-cols-3 lg:tw-grid-cols-6 tw-gap-3">
          {[
            { icon: 'pi pi-file', label: t('pages:menu.maintenance_exp'), path: '/expedientes', color: '#3b82f6' },
            { icon: 'pi pi-users', label: t('pages:menu.maintenance_per'), path: '/personas', color: '#8b5cf6' },
            { icon: 'pi pi-paw', label: t('pages:menu.maintenance_ani'), path: '/animales', color: '#10b981' },
            { icon: 'pi pi-book', label: t('pages:menu.maintenance_lib'), path: '/libros', color: '#f59e0b' },
            { icon: 'pi pi-video', label: t('pages:menu.maintenance_ser'), path: '/series', color: '#ef4444' },
            { icon: 'pi pi-ticket', label: t('pages:menu.maintenance_pel'), path: '/peliculas', color: '#ec4899' },
          ].map((item) => (
            <a
              key={item.path}
              href={item.path}
              className="tw-flex tw-flex-col tw-items-center tw-gap-2 tw-p-4 tw-rounded-lg tw-bg-slate-50 hover:tw-bg-slate-100 tw-transition-colors tw-no-underline tw-cursor-pointer"
            >
              <div
                className="tw-w-10 tw-h-10 tw-rounded-lg tw-flex tw-items-center tw-justify-center tw-text-white"
                style={{ background: item.color }}
              >
                <i className={item.icon}></i>
              </div>
              <span className="tw-text-xs tw-font-medium tw-text-slate-600 tw-text-center">
                {item.label}
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
