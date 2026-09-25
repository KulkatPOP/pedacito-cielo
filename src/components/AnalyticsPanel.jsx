import { useEffect, useMemo, useState } from 'react';
import { MEASUREMENT_EVENTS, MEASUREMENT_EVENT_SIGNAL, readMeasurementEvents } from '../utils/measurement.js';

const periods = [
  { value: 1, label: 'Hoy' },
  { value: 7, label: 'Últimos 7 días' },
  { value: 30, label: 'Últimos 30 días' },
];

export default function AnalyticsPanel() {
  const [days, setDays] = useState(7);
  const [events, setEvents] = useState(() => readMeasurementEvents());

  useEffect(() => {
    const refresh = () => setEvents(readMeasurementEvents());
    window.addEventListener(MEASUREMENT_EVENT_SIGNAL, refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener(MEASUREMENT_EVENT_SIGNAL, refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  const report = useMemo(() => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    if (days > 1) start.setDate(start.getDate() - (days - 1));
    const filtered = events.filter(event => event.timestamp >= start.getTime());
    const productCounts = filtered
      .filter(event => event.name === MEASUREMENT_EVENTS.WHATSAPP_CLICK && event.productName)
      .reduce((counts, event) => ({ ...counts, [event.productName]: (counts[event.productName] || 0) + 1 }), {});
    return {
      total: filtered.length,
      whatsapp: filtered.filter(event => event.name === MEASUREMENT_EVENTS.WHATSAPP_CLICK).length,
      chatbot: filtered.filter(event => event.name === MEASUREMENT_EVENTS.CHATBOT_OPEN).length,
      catalog: filtered.filter(event => event.name === MEASUREMENT_EVENTS.CATALOG_CLICK).length,
      products: Object.entries(productCounts).sort((a, b) => b[1] - a[1]),
    };
  }, [days, events]);

  return <div className="analytics-panel">
    <section className="analytics-intro">
      <div><span>Medición privada</span><h2>Interacciones del sitio</h2><p>Estos datos son anónimos y pertenecen únicamente a este navegador. No se registran personas, teléfonos, correos ni identificadores.</p></div>
      <label>Periodo<select value={days} onChange={event => setDays(Number(event.target.value))}>{periods.map(period => <option value={period.value} key={period.value}>{period.label}</option>)}</select></label>
    </section>
    <div className="analytics-metrics">
      <article><span>Total de eventos</span><b>{report.total}</b><small>Interacciones registradas</small></article>
      <article><span>WhatsApp</span><b>{report.whatsapp}</b><small>Clics para contactar</small></article>
      <article><span>Chatbot Cielito</span><b>{report.chatbot}</b><small>Aperturas del asistente</small></article>
      <article><span>Catálogo</span><b>{report.catalog}</b><small>Accesos mediante llamados a la acción</small></article>
    </div>
    <section className="admin-card analytics-products"><div className="card-title"><div><h2>Productos con más interés</h2><p>Se cuentan únicamente los clics reales en “Pedir por WhatsApp”.</p></div></div>
      {report.products.length ? <div className="analytics-ranking">{report.products.map(([name, count], index) => <div key={name}><span>{index + 1}</span><b>{name}</b><strong>{count} {count === 1 ? 'interacción' : 'interacciones'}</strong></div>)}</div> : <div className="empty-state"><b>Aún no hay interacciones con productos en este periodo.</b><p>Los resultados aparecerán cuando se utilicen los botones de pedido desde este navegador.</p></div>}
    </section>
    <p className="analytics-note">Base local de medición · Sin cookies · Sin servicios externos · Sin seguimiento individual</p>
  </div>;
}
