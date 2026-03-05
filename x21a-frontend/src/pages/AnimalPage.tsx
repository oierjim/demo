import React from 'react';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { InputNumber } from 'primereact/inputnumber';
import { useTranslation } from 'react-i18next';
import { DataTableTemplate } from '../components/DataTableTemplate';
import { animalService } from '../services/animal.service';
import type { Animal } from '../services/animal.service';

interface AnimalFilters {
    nombre: string;
    raza: string;
}

const DEFAULT_FILTERS: AnimalFilters = { nombre: '', raza: '' };

const AnimalPage: React.FC = () => {
    const { t, i18n } = useTranslation(['common', 'domain', 'pages', 'components']);

    const dateBodyTemplate = (rowData: Animal) => {
        const date = new Date(rowData.fechaNacimiento);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return i18n.language === 'eu' ? `${year}/${month}/${day}` : `${day}/${month}/${year}`;
    };

    return (
        <DataTableTemplate<Animal, AnimalFilters>
            title={t('pages:animales.title')}
            entityKey="animales"
            service={animalService}
            initialFilters={DEFAULT_FILTERS}
            newItemDefault={{ nombre: '', raza: '', peso: 0, altura: 0, fechaNacimiento: new Date() }}
            filterFields={(filters, setFilters) => (
                <>
                    <div className="col-12 md:col-2">
                        <label className="block mb-2 font-semibold text-slate-600 text-xs uppercase tracking-wider">{t('domain:animal.nombre')}</label>
                        <InputText value={filters.nombre} onChange={(e) => setFilters({...filters, nombre: e.target.value})} placeholder={t('domain:animal.nombre')} className="p-inputtext-sm w-full" style={{ height: '39px' }} />
                    </div>
                    <div className="col-12 md:col-2">
                        <label className="block mb-2 font-semibold text-slate-600 text-xs uppercase tracking-wider">{t('domain:animal.raza')}</label>
                        <InputText value={filters.raza} onChange={(e) => setFilters({...filters, raza: e.target.value})} placeholder={t('domain:animal.raza')} className="p-inputtext-sm w-full" style={{ height: '39px' }} />
                    </div>
                </>
            )}
            dialogFields={(item, setItem) => (
                <>
                    <div className="field mb-4">
                        <label htmlFor="nombre" className="font-bold block mb-2">{t('domain:animal.nombre')}</label>
                        <InputText id="nombre" value={item.nombre || ''} onChange={(e) => setItem({ ...item, nombre: e.target.value })} required autoFocus className={!item.nombre ? 'p-invalid' : ''} />
                    </div>
                    <div className="field mb-4">
                        <label htmlFor="raza" className="font-bold block mb-2">{t('domain:animal.raza')}</label>
                        <InputText id="raza" value={item.raza || ''} onChange={(e) => setItem({ ...item, raza: e.target.value })} required />
                    </div>
                    <div className="formgrid grid">
                        <div className="field col-12 md:col-6">
                            <label htmlFor="fechaNac" className="font-bold block mb-2">{t('domain:animal.fechaNacimiento')}</label>
                            <Calendar id="fechaNac" value={item.fechaNacimiento instanceof Date ? item.fechaNacimiento : (item.fechaNacimiento ? new Date(item.fechaNacimiento) : null)} onChange={(e) => setItem({ ...item, fechaNacimiento: e.value as Date })} dateFormat={i18n.language === 'eu' ? 'yy/mm/dd' : 'dd/mm/yy'} placeholder={t('components:calendar.placeholder')} showOnFocus={true} appendTo={() => document.body} />
                        </div>
                        <div className="field col-6 md:col-3">
                            <label htmlFor="peso" className="font-bold block mb-2">{t('domain:animal.peso')}</label>
                            <InputNumber id="peso" value={item.peso} onValueChange={(e) => setItem({ ...item, peso: e.value || 0 })} mode="decimal" minFractionDigits={1} maxFractionDigits={2} />
                        </div>
                        <div className="field col-6 md:col-3">
                            <label htmlFor="altura" className="font-bold block mb-2">{t('domain:animal.altura')}</label>
                            <InputNumber id="altura" value={item.altura} onValueChange={(e) => setItem({ ...item, altura: e.value || 0 })} mode="decimal" minFractionDigits={0} maxFractionDigits={1} />
                        </div>
                    </div>
                </>
            )}
            dialogWidth="500px"
        >
            <Column selectionMode="multiple" headerStyle={{ width: '3rem', backgroundColor: '#f8fafc' }}></Column>
            <Column field="nombre" header={t('domain:animal.nombre')} sortable headerStyle={{ backgroundColor: '#f8fafc' }} />
            <Column field="raza" header={t('domain:animal.raza')} sortable headerStyle={{ backgroundColor: '#f8fafc' }} />
            <Column field="fechaNacimiento" header={t('domain:animal.fechaNacimiento')} body={dateBodyTemplate} sortable headerStyle={{ backgroundColor: '#f8fafc' }} />
            <Column field="peso" header={t('domain:animal.peso')} sortable headerStyle={{ backgroundColor: '#f8fafc' }} />
            <Column field="altura" header={t('domain:animal.altura')} sortable headerStyle={{ backgroundColor: '#f8fafc' }} />
        </DataTableTemplate>
    );
};

export default AnimalPage;
