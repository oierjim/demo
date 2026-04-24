import React, { useMemo } from 'react';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { Tag } from 'primereact/tag';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { Button } from 'primereact/button';
import { useTranslation } from 'react-i18next';
import { DataTableMaintenance } from '../components/DataTableMaintenance';
import { expedienteService } from '../services/expediente.service';
import { MunicipioEnlazadoSelect } from '../components/MunicipioEnlazadoSelect';
import type { Expediente } from '../services/expediente.service';

interface ExpedienteFilters {
    referencia: string;
    estado: string | null;
    provincia: string | null;
    municipio: string | null;
    fechaAperturaDesde: Date | null;
    fechaAperturaHasta: Date | null;
}

const DEFAULT_FILTERS: ExpedienteFilters = { referencia: '', estado: null, provincia: '01', municipio: null, fechaAperturaDesde: null, fechaAperturaHasta: null };

const ExpedientePage: React.FC = () => {
    const { t, i18n } = useTranslation(['common', 'domain', 'pages', 'components']);

    const getLocalizedLabel = (item?: { descripcionC: string; descripcionE: string }) => {
        if (!item) return '';
        return i18n.language === 'eu' ? item.descripcionE : item.descripcionC;
    };

    const estados = useMemo(() => [
        { label: t('domain:status.open'), value: 'Abierto' },
        { label: t('domain:status.pending'), value: 'Pendiente' },
        { label: t('domain:status.closed'), value: 'Cerrado' },
        { label: t('domain:status.inProcess'), value: 'En Proceso' }
    ], [t]);

    const getId = (val: any) => (val && typeof val === 'object') ? val.id : val;

    const statusBodyTemplate = (rowData: Expediente) => {
        const severityMap: any = { 'Abierto': 'info', 'En Proceso': 'warning', 'Pendiente': 'secondary', 'Cerrado': 'success' };
        const label = estados.find(e => e.value === rowData.estado)?.label || rowData.estado;
        return <Tag value={label} severity={severityMap[rowData.estado]} className="px-3 py-1 font-semibold" style={{ borderRadius: '6px' }} />;
    };

    const dateBodyTemplate = (rowData: Expediente) => {
        const date = new Date(rowData.fechaApertura);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return i18n.language === 'eu' ? `${year}/${month}/${day}` : `${day}/${month}/${year}`;
    };

    const validate = (item: Partial<Expediente>) => {
        const errors: Record<string, string> = {};
        if (!item.referencia) errors.referencia = t('common:messages.required');
        if (!item.solicitante) errors.solicitante = t('common:messages.required');
        return errors;
    };

    return (
        <DataTableMaintenance<Expediente, ExpedienteFilters>
            entityKey="expediente"
            service={expedienteService}
            initialFilters={DEFAULT_FILTERS}
            validate={validate}
        >
            <DataTableMaintenance.Title title={t('pages:maintenance.title')} />

            <DataTableMaintenance.Filters>
                {(filters, setFilters) => (
                    <>
                        <div className="col-12 md:col-2">
                            <label className="block mb-2 font-semibold text-slate-600 text-xs uppercase tracking-wider">{t('pages:filters.fechaAperturaDesde')}</label>
                            <Calendar value={filters.fechaAperturaDesde} onChange={(e) => setFilters(prev => ({...prev, fechaAperturaDesde: e.value as Date}))} placeholder={t('components:calendar.placeholder')} showIcon showButtonBar className="w-full" inputClassName="p-inputtext-sm w-full" inputStyle={{ height: '39px' }} dateFormat={i18n.language === 'eu' ? 'yy/mm/dd' : 'dd/mm/yy'} showOnFocus={true} appendTo={() => document.body} />
                        </div>
                        <div className="col-12 md:col-2">
                            <label className="block mb-2 font-semibold text-slate-600 text-xs uppercase tracking-wider">{t('pages:filters.fechaAperturaHasta')}</label>
                            <Calendar value={filters.fechaAperturaHasta} onChange={(e) => setFilters(prev => ({...prev, fechaAperturaHasta: e.value as Date}))} placeholder={t('components:calendar.placeholder')} showIcon showButtonBar className="w-full" inputClassName="p-inputtext-sm w-full" inputStyle={{ height: '39px' }} dateFormat={i18n.language === 'eu' ? 'yy/mm/dd' : 'dd/mm/yy'} showOnFocus={true} appendTo={() => document.body} />
                        </div>
                        <div className="col-12 md:col-3">
                            <label className="block mb-2 font-semibold text-slate-600 text-xs uppercase tracking-wider">{t('domain:expediente.reference')}</label>
                            <IconField iconPosition="left">
                                <InputIcon className="pi pi-id-card" />
                                <InputText value={filters.referencia} onChange={(e) => setFilters(prev => ({...prev, referencia: e.target.value}))} placeholder="EXP-202X-..." className="p-inputtext-sm w-full" style={{ height: '39px' }} />
                            </IconField>
                        </div>
                        <div className="col-12 md:col-2">
                            <label className="block mb-2 font-semibold text-slate-600 text-xs uppercase tracking-wider">{t('domain:expediente.status')}</label>
                            <Dropdown value={filters.estado} options={estados} optionLabel="label" optionValue="value" onChange={(e) => setFilters(prev => ({...prev, estado: e.value}))} placeholder={t('domain:status.any')} showClear className="p-inputtext-sm w-full" style={{ height: '39px' }} emptyMessage={t('common:messages.noOptions')} appendTo={() => document.body} />
                        </div>
                        <div className="col-12 md:col-4">
                            <MunicipioEnlazadoSelect 
                                provinciaId={filters.provincia || undefined}
                                municipioId={filters.municipio || undefined}
                                onProvinciaChange={(id) => setFilters(prev => ({...prev, provincia: id || null, municipio: null}))}
                                onMunicipioChange={(id) => setFilters(prev => ({...prev, municipio: id || null}))}
                                isFilter={true}
                                containerClass="grid"
                            />
                        </div>
                    </>
                )}
            </DataTableMaintenance.Filters>

            <DataTableMaintenance.Toolbar 
                showExport 
                readOnly={true}
                newItemDefault={{ estado: 'Abierto', referencia: '', solicitante: '', fechaApertura: new Date() }} 
                extraButtons={(selectedItems) => (
                    <>
                        <Button 
                            label={t('pages:expedientes.process')} 
                            icon="pi pi-cog" 
                            severity="warning" 
                            disabled={selectedItems.length === 0} 
                            onClick={() => alert(`${t('pages:expedientes.process')} ${selectedItems.length} ${t('domain:expediente.entity')}`)} 
                        />
                        <Button 
                            label={t('pages:expedientes.print')} 
                            icon="pi pi-print" 
                            severity="secondary" 
                            outlined
                            disabled={selectedItems.length === 0} 
                            onClick={() => alert(`${t('pages:expedientes.print')} ${selectedItems.length} ...`)} 
                        />
                    </>
                )}
            />

            <DataTableMaintenance.Table selectionMode="multiple">
                <Column selectionMode="multiple" headerStyle={{ width: '3rem', backgroundColor: '#f8fafc' }}></Column>
                <Column field="referencia" header={t('domain:expediente.reference')} sortable headerStyle={{ backgroundColor: '#f8fafc' }} />
                <Column field="solicitante" header={t('domain:expediente.applicant')} sortable headerStyle={{ backgroundColor: '#f8fafc' }} />
                <Column field="provincia" header={t('domain:expediente.province')} body={(rowData: Expediente) => getLocalizedLabel(rowData.provincia)} sortable headerStyle={{ backgroundColor: '#f8fafc' }} />
                <Column field="municipio" header={t('domain:expediente.municipality')} body={(rowData: Expediente) => getLocalizedLabel(rowData.municipio)} sortable headerStyle={{ backgroundColor: '#f8fafc' }} />
                <Column field="fechaApertura" header={t('domain:expediente.dateOpen')} body={dateBodyTemplate} sortable headerStyle={{ backgroundColor: '#f8fafc' }} />
                <Column field="estado" header={t('domain:expediente.status')} body={statusBodyTemplate} sortable headerStyle={{ backgroundColor: '#f8fafc' }} />
            </DataTableMaintenance.Table>

            <DataTableMaintenance.Dialog readOnly={true}>
                {(item, setItem, errors, isReadOnly) => (
                    <>
                        <div className="field mb-4">
                            <label htmlFor="referencia" className="font-bold block mb-2">{t('domain:expediente.reference')}</label>
                            <InputText id="referencia" value={item.referencia || ''} onChange={(e) => setItem(prev => ({ ...prev, referencia: e.target.value }))} required autoFocus disabled={isReadOnly} invalid={!!errors.referencia} />
                            {errors.referencia && <small className="p-error">{errors.referencia}</small>}
                        </div>
                        <div className="field mb-4">
                            <label htmlFor="solicitante" className="font-bold block mb-2">{t('domain:expediente.applicant')}</label>
                            <InputText id="solicitante" value={item.solicitante || ''} onChange={(e) => setItem(prev => ({ ...prev, solicitante: e.target.value }))} required disabled={isReadOnly} invalid={!!errors.solicitante} />
                            {errors.solicitante && <small className="p-error">{errors.solicitante}</small>}
                        </div>
                        <div className="formgrid grid">
                            <div className="field col-6">
                                <label htmlFor="fecha" className="font-bold block mb-2">{t('domain:expediente.dateOpen')}</label>
                                <Calendar id="fecha" value={item.fechaApertura instanceof Date ? item.fechaApertura : (item.fechaApertura ? new Date(item.fechaApertura) : null)} onChange={(e) => setItem(prev => ({ ...prev, fechaApertura: e.value as Date }))} dateFormat={i18n.language === 'eu' ? 'yy/mm/dd' : 'dd/mm/yy'} placeholder={t('components:calendar.placeholder')} showOnFocus={true} appendTo={() => document.body} disabled={isReadOnly} />
                            </div>
                            <div className="field col-6">
                                <label htmlFor="fechaCierre" className="font-bold block mb-2">{t('domain:expediente.dateClose')}</label>
                                <Calendar id="fechaCierre" value={item.fechaCierre instanceof Date ? item.fechaCierre : (item.fechaCierre ? new Date(item.fechaCierre) : null)} onChange={(e) => setItem(prev => ({ ...prev, fechaCierre: e.value as Date }))} dateFormat={i18n.language === 'eu' ? 'yy/mm/dd' : 'dd/mm/yy'} placeholder={t('components:calendar.placeholder')} showOnFocus={true} appendTo={() => document.body} disabled={isReadOnly} />
                            </div>
                        </div>
                        
                        <MunicipioEnlazadoSelect 
                            provinciaId={getId(item.provincia)}
                            municipioId={getId(item.municipio)}
                            onProvinciaChange={(id) => setItem(prev => ({ ...prev, provincia: id ? { id } as any : undefined, municipio: undefined }))}
                            onMunicipioChange={(id) => setItem(prev => ({ ...prev, municipio: id ? { id } as any : undefined }))}
                            isReadOnly={isReadOnly}
                        />

                        <div className="field mb-4">
                            <label htmlFor="ultimoTramite" className="font-bold block mb-2">{t('domain:expediente.lastStep')}</label>
                            <InputText id="ultimoTramite" value={item.ultimoTramite || ''} onChange={(e) => setItem(prev => ({ ...prev, ultimoTramite: e.target.value }))} disabled={isReadOnly} />
                        </div>
                        <div className="field">
                            <label htmlFor="estado" className="font-bold block mb-2">{t('domain:expediente.status')}</label>
                            <Dropdown id="estado" value={item.estado} options={estados} optionLabel="label" optionValue="value" onChange={(e) => setItem(prev => ({ ...prev, estado: e.value }))} placeholder={t('common:actions.select')} emptyMessage={t('common:messages.noOptions')} appendTo={() => document.body} disabled={isReadOnly} />
                        </div>
                    </>
                )}
            </DataTableMaintenance.Dialog>
        </DataTableMaintenance>
    );
};

export default ExpedientePage;
