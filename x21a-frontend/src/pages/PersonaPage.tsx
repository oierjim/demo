import React from 'react';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { useTranslation } from 'react-i18next';
import { DataTableTemplate } from '../components/DataTableTemplate';
import { personaService } from '../services/persona.service';
import type { Persona } from '../services/persona.service';

interface PersonaFilters {
    dni: string;
    nombre: string;
    fechaNacimientoDesde: Date | null;
    fechaNacimientoHasta: Date | null;
}

const DEFAULT_FILTERS: PersonaFilters = { dni: '', nombre: '', fechaNacimientoDesde: null, fechaNacimientoHasta: null };

const PersonaPage: React.FC = () => {
    const { t, i18n } = useTranslation(['common', 'domain', 'pages', 'components']);

    const dateBodyTemplate = (rowData: Persona) => {
        const date = new Date(rowData.fechaNacimiento);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return i18n.language === 'eu' ? `${year}/${month}/${day}` : `${day}/${month}/${year}`;
    };

    const validate = (item: Partial<Persona>) => {
        const errors: Record<string, string> = {};
        if (!item.dni) errors.dni = t('common:messages.required');
        else if (!/^[0-9]{8}[A-Z]$/.test(item.dni)) errors.dni = t('common:messages.invalidFormat');
        
        if (!item.nombre) errors.nombre = t('common:messages.required');
        if (!item.apellido1) errors.apellido1 = t('common:messages.required');
        
        if (!item.email) errors.email = t('common:messages.required');
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(item.email)) errors.email = t('common:messages.invalidFormat');
        
        return errors;
    };

    return (
        <DataTableTemplate<Persona, PersonaFilters>
            title={t('pages:personas.title')}
            entityKey="persona"
            service={personaService}
            initialFilters={DEFAULT_FILTERS}
            newItemDefault={{ dni: '', nombre: '', apellido1: '', apellido2: '', email: '', fechaNacimiento: new Date() }}
            validate={validate}
            filterFields={(filters, setFilters) => (
                <>
                    <div className="col-12 md:col-2">
                        <label className="block mb-2 font-semibold text-slate-600 text-xs uppercase tracking-wider">{t('pages:filters.fechaNacimientoDesde')}</label>
                        <Calendar value={filters.fechaNacimientoDesde} onChange={(e) => setFilters({...filters, fechaNacimientoDesde: e.value as Date})} placeholder={t('components:calendar.placeholder')} showIcon showButtonBar className="w-full" inputClassName="p-inputtext-sm w-full" inputStyle={{ height: '39px' }} dateFormat={i18n.language === 'eu' ? 'yy/mm/dd' : 'dd/mm/yy'} showOnFocus={true} appendTo={() => document.body} />
                    </div>
                    <div className="col-12 md:col-2">
                        <label className="block mb-2 font-semibold text-slate-600 text-xs uppercase tracking-wider">{t('pages:filters.fechaNacimientoHasta')}</label>
                        <Calendar value={filters.fechaNacimientoHasta} onChange={(e) => setFilters({...filters, fechaNacimientoHasta: e.value as Date})} placeholder={t('components:calendar.placeholder')} showIcon showButtonBar className="w-full" inputClassName="p-inputtext-sm w-full" inputStyle={{ height: '39px' }} dateFormat={i18n.language === 'eu' ? 'yy/mm/dd' : 'dd/mm/yy'} showOnFocus={true} appendTo={() => document.body} />
                    </div>
                    <div className="col-12 md:col-2">
                        <label className="block mb-2 font-semibold text-slate-600 text-xs uppercase tracking-wider">{t('domain:persona.dni')}</label>
                        <InputText value={filters.dni} onChange={(e) => setFilters({...filters, dni: e.target.value})} placeholder="12345678X" className="p-inputtext-sm w-full" style={{ height: '39px' }} />
                    </div>
                    <div className="col-12 md:col-3">
                        <label className="block mb-2 font-semibold text-slate-600 text-xs uppercase tracking-wider">{t('domain:persona.nombre')}</label>
                        <InputText value={filters.nombre} onChange={(e) => setFilters({...filters, nombre: e.target.value})} placeholder={t('domain:persona.nombre')} className="p-inputtext-sm w-full" style={{ height: '39px' }} />
                    </div>
                </>
            )}
            dialogFields={(item, setItem, errors, isReadOnly) => (
                <>
                    <div className="formgrid grid">
                        <div className="field col-12 md:col-4">
                            <label htmlFor="dni" className="font-bold block mb-2">{t('domain:persona.dni')}</label>
                            <InputText id="dni" value={item.dni || ''} onChange={(e) => setItem({ ...item, dni: e.target.value })} required autoFocus disabled={isReadOnly} invalid={!!errors.dni} />
                            {errors.dni && <small className="p-error">{errors.dni}</small>}
                        </div>
                        <div className="field col-12 md:col-8">
                            <label htmlFor="nombre" className="font-bold block mb-2">{t('domain:persona.nombre')}</label>
                            <InputText id="nombre" value={item.nombre || ''} onChange={(e) => setItem({ ...item, nombre: e.target.value })} required disabled={isReadOnly} invalid={!!errors.nombre} />
                            {errors.nombre && <small className="p-error">{errors.nombre}</small>}
                        </div>
                    </div>
                    <div className="formgrid grid">
                        <div className="field col-12 md:col-6">
                            <label htmlFor="apellido1" className="font-bold block mb-2">{t('domain:persona.apellido1')}</label>
                            <InputText id="apellido1" value={item.apellido1 || ''} onChange={(e) => setItem({ ...item, apellido1: e.target.value })} required disabled={isReadOnly} invalid={!!errors.apellido1} />
                            {errors.apellido1 && <small className="p-error">{errors.apellido1}</small>}
                        </div>
                        <div className="field col-12 md:col-6">
                            <label htmlFor="apellido2" className="font-bold block mb-2">{t('domain:persona.apellido2')}</label>
                            <InputText id="apellido2" value={item.apellido2 || ''} onChange={(e) => setItem({ ...item, apellido2: e.target.value })} disabled={isReadOnly} />
                        </div>
                    </div>
                    <div className="formgrid grid">
                        <div className="field col-12 md:col-6">
                            <label htmlFor="fechaNac" className="font-bold block mb-2">{t('domain:persona.fechaNacimiento')}</label>
                            <Calendar id="fechaNac" value={item.fechaNacimiento instanceof Date ? item.fechaNacimiento : (item.fechaNacimiento ? new Date(item.fechaNacimiento) : null)} onChange={(e) => setItem({ ...item, fechaNacimiento: e.value as Date })} dateFormat={i18n.language === 'eu' ? 'yy/mm/dd' : 'dd/mm/yy'} placeholder={t('components:calendar.placeholder')} showOnFocus={true} appendTo={() => document.body} disabled={isReadOnly} />
                        </div>
                        <div className="field col-12 md:col-6">
                            <label htmlFor="email" className="font-bold block mb-2">{t('domain:persona.email')}</label>
                            <InputText id="email" value={item.email || ''} onChange={(e) => setItem({ ...item, email: e.target.value })} required disabled={isReadOnly} invalid={!!errors.email} />
                            {errors.email && <small className="p-error">{errors.email}</small>}
                        </div>
                    </div>
                </>
            )}
            dialogWidth="600px"
        >
            <Column selectionMode="multiple" headerStyle={{ width: '3rem', backgroundColor: '#f8fafc' }}></Column>
            <Column field="dni" header={t('domain:persona.dni')} sortable headerStyle={{ backgroundColor: '#f8fafc' }} />
            <Column field="nombre" header={t('domain:persona.nombre')} sortable headerStyle={{ backgroundColor: '#f8fafc' }} />
            <Column field="apellido1" header={t('domain:persona.apellido1')} sortable headerStyle={{ backgroundColor: '#f8fafc' }} />
            <Column field="apellido2" header={t('domain:persona.apellido2')} sortable headerStyle={{ backgroundColor: '#f8fafc' }} />
            <Column field="fechaNacimiento" header={t('domain:persona.fechaNacimiento')} body={dateBodyTemplate} sortable headerStyle={{ backgroundColor: '#f8fafc' }} />
            <Column field="email" header={t('domain:persona.email')} sortable headerStyle={{ backgroundColor: '#f8fafc' }} />
        </DataTableTemplate>
    );
};

export default PersonaPage;
