import { useEffect, useMemo, useState } from 'react';
import { MEASUREMENT_EVENTS, MEASUREMENT_EVENT_SIGNAL, readMeasurementEvents } from '../utils/measurement.js';

const countBy = (events, field) => Object.entries(events.reduce((counts, event) => {
  const value = event[field];
  return value ? { ...counts, [value]: (counts[value] || 0) + 1 } : counts;
}, {})).sort((a, b) => b[1] - a[1]);

export default function CrmPanel() {
  const [events, setEvents] = useState(() => readMeasurementEvents());
  useEffect(() => {
    const refresh = () => setEvents(readMeasurementEvents());
    window.addEventListener(MEASUREMENT_EVENT_SIGNAL, refresh);
    window.addEventListener('storage', refresh);
    return () => { window.removeEventListener(MEASUREMENT_EVENT_SIGNAL, refresh); window.removeEventListener('storage', refresh); };
  }, []);
  const insights = useMemo(() => ({
    products: countBy(events.filter(event => event.name === MEASUREMENT_EVENTS.WHATSAPP_CLICK), 'productName'),
    questions: countBy(events.filter(event => event.name === MEASUREMENT_EVENTS.CHATBOT_QUESTION), 'questionLabel'),
    catalog: events.filter(event => event.name === MEASUREMENT_EVENTS.CATALOG_CLICK).length,
    contact: events.filter(event => event.name === MEASUREMENT_EVENTS.WHATSAPP_CLICK).length,
  }), [events]);
  const hasInsights = insights.products.length || insights.questions.length || insights.catalog || insights.contact;

  return <div className="crm-panel">
    <section className="crm-intro"><div><span>CRM comercial básico</span><h2>Oportunidades e intereses generales</h2><p>Resumen anónimo de señales comerciales registradas en este navegador. No contiene fichas de clientes ni información personal.</p></div><strong>{events.length}<small>señales locales</small></strong></section>
    {!hasInsights ? <section className="admin-card crm-empty"><span>◎</span><h3>Aún no hay suficientes señales comerciales</h3><p>Cuando existan interacciones reales con productos, catálogo o Cielito, aparecerán aquí de forma agregada.</p></section> : <div className="crm-grid">
      <Insight title="Productos con interés" description="Clics para consultar por WhatsApp" items={insights.products}/>
      <Insight title="Consultas frecuentes" description="Opciones seleccionadas en Cielito" items={insights.questions}/>
      <section className="admin-card crm-summary"><div className="card-title"><div><h2>Intereses generales</h2><p>Señales agregadas, sin perfiles individuales.</p></div></div><div><span><b>{insights.catalog}</b> accesos al catálogo</span><span><b>{insights.contact}</b> intenciones de contacto</span></div></section>
    </div>}
    <section className="admin-card crm-future"><div className="card-title"><div><h2>Preparación futura</h2><p>Estructura lista para evaluar integraciones cuando exista autorización y una política de privacidad definida.</p></div></div><div><article><span>◉</span><b>WhatsApp Business</b><small>No conectado</small></article><article><span>✦</span><b>Campañas</b><small>No conectado</small></article><article><span>↻</span><b>Clientes recurrentes</b><small>Sin seguimiento individual</small></article></div></section>
    <p className="analytics-note">Sin datos personales · Sin seguimiento individual · Sin comunicaciones automáticas</p>
  </div>;
}

function Insight({ title, description, items }) {
  return <section className="admin-card crm-insight"><div className="card-title"><div><h2>{title}</h2><p>{description}</p></div></div>{items.length ? <ol>{items.slice(0, 5).map(([label, count]) => <li key={label}><span>{label}</span><b>{count}</b></li>)}</ol> : <div className="empty-state">Sin información disponible todavía.</div>}</section>;
}
