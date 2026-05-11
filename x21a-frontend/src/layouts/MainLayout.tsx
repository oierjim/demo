import { Avatar } from "primereact/avatar";
import { Dropdown } from "primereact/dropdown";
import React from "react";
import { useTranslation } from "react-i18next";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

import api from "../api";

const MainLayout: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();

  const languages = [
    { label: "Castellano", value: "es" },
    { label: "Euskera", value: "eu" },
  ];

  const changeLanguage = async (lang: string) => {
    try {
      await api.get(`/sessionInfo/locale?lang=${lang}`);
      window.location.reload();
    } catch (error) {
      console.error("Error sincronizando idioma con el backend", error);
    }
  };

  const isActive = (paths: string[]) =>
    paths.some((p) => location.pathname === p);

  return (
    <div className="tw-flex tw-flex-col tw-min-h-screen">
      {/* ===== TOP HEADER - Logos ===== */}
      <header className="ejie-top-header">
        <div className="ejie-top-header-inner">
          <div className="ejie-logo"></div>
          <a
            href="https://www.euskadi.eus"
            target="_blank"
            rel="noopener noreferrer"
            className="ejie-header-link"
          >
            <img
              src="/images/euskadieus_logo.gif"
              alt="Euskadi Eus"
              className="ejie-euskadi-logo"
            />
          </a>
        </div>
      </header>

      {/* ===== NAVIGATION BAR ===== */}
      <nav className="ejie-nav">
        <div className="ejie-nav-inner">
          <div className="ejie-nav-left">
            <a className="ejie-nav-brand" onClick={() => navigate("/")}>
              <i className="pi pi-home"></i>
              Uda
            </a>

            {/* Navigation items with dropdowns */}
            <div className="ejie-nav-item">
              <button
                className={`ejie-nav-link ${isActive(["/expedientes", "/personas", "/animales", "/libros", "/series", "/peliculas"]) ? "active" : ""}`}
              >
                <i className="pi pi-briefcase"></i>
                {t("pages:menu.management")}
                <i className="pi pi-chevron-down"></i>
              </button>
              <div className="ejie-dropdown">
                <div className="ejie-dropdown-item">
                  <span className="ejie-dropdown-link">
                    <i className="pi pi-list"></i>
                    {t("pages:menu.maintenance")}
                    <i className="pi pi-chevron-right"></i>
                  </span>
                  <div className="ejie-dropdown">
                    <button
                      className="ejie-dropdown-link"
                      onClick={() => navigate("/expedientes")}
                    >
                      <i className="pi pi-file"></i>
                      {t("pages:menu.maintenance_exp")}
                    </button>
                    <button
                      className="ejie-dropdown-link"
                      onClick={() => navigate("/personas")}
                    >
                      <i className="pi pi-users"></i>
                      {t("pages:menu.maintenance_per")}
                    </button>
                    <button
                      className="ejie-dropdown-link"
                      onClick={() => navigate("/animales")}
                    >
                      <i className="pi pi-paw"></i>
                      {t("pages:menu.maintenance_ani")}
                    </button>
                    <button
                      className="ejie-dropdown-link"
                      onClick={() => navigate("/libros")}
                    >
                      <i className="pi pi-book"></i>
                      {t("pages:menu.maintenance_lib")}
                    </button>
                    <button
                      className="ejie-dropdown-link"
                      onClick={() => navigate("/series")}
                    >
                      <i className="pi pi-video"></i>
                      {t("pages:menu.maintenance_ser")}
                    </button>
                    <button
                      className="ejie-dropdown-link"
                      onClick={() => navigate("/peliculas")}
                    >
                      <i className="pi pi-ticket"></i>
                      {t("pages:menu.maintenance_pel")}
                    </button>
                  </div>
                </div>
                <div className="ejie-dropdown-divider"></div>
                <button
                  className="ejie-dropdown-link"
                  disabled
                  style={{ opacity: 0.5 }}
                >
                  <i className="pi pi-chart-bar"></i>
                  {t("pages:menu.reports")}
                </button>
              </div>
            </div>

            <div className="ejie-nav-item">
              <button
                className="ejie-nav-link"
                disabled
                style={{ opacity: 0.5 }}
              >
                <i className="pi pi-cog"></i>
                {t("pages:menu.settings")}
              </button>
            </div>
          </div>

          <div className="ejie-nav-right">
            <div className="ejie-lang-dropdown">
              <Dropdown
                value={i18n.language}
                options={languages}
                onChange={(e) => changeLanguage(e.value)}
                style={{ width: "130px" }}
              />
            </div>

            <a
              href="https://github.com/UDA-EJIE"
              target="_blank"
              rel="noopener noreferrer"
              className="ejie-nav-tool"
              title="GitHub"
            >
              <i className="pi pi-github"></i>
            </a>

            <div className="ejie-nav-user">
              <i className="pi pi-user"></i>
              <span className="tw-hidden md:tw-inline">
                {user?.name} {user?.surname1}
              </span>
              <Avatar
                label={user?.name?.[0]}
                shape="circle"
                style={{
                  backgroundColor: "rgba(255,255,255,0.2)",
                  color: "#ffffff",
                  fontWeight: 600,
                }}
              />
            </div>
          </div>
        </div>
      </nav>

      {/* ===== CONTENT ===== */}
      <main className="main-content">
        <Outlet />
      </main>

      {/* ===== FOOTER ===== */}
      <footer className="ejie-footer">
        <div className="ejie-footer-top">
          <a href="#" className="ejie-footer-link">
            {t("pages:layout.legalNotice")}
          </a>
          <span className="ejie-footer-copyright">
            &copy; {new Date().getFullYear()} &middot;{" "}
            {t("pages:layout.footer")}
          </span>
        </div>
        <div className="ejie-footer-images">
          <img
            className="ejie-footer-bg"
            src="/images/web01-2014_oina_logo_atzekoa.gif"
            alt=""
          />
          <img
            className="ejie-footer-claim"
            src="/images/web01-2014_claim_pertsona_helburu_es.gif"
            alt="Pertsona helburu"
          />
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
