import { useMemo, useState } from 'react';

const baseCategories = ['Panadería', 'Pastelería', 'Tortas', 'Desayunos'];
const galleryFields = [
  ['galeria_productos', 'Productos venezolanos', 'venezolanos'],
  ['galeria_local', 'Fotos del local', 'local'],
  ['galeria_promociones', 'Imágenes promocionales', 'promociones'],
];

const parseList = (value = '') => {
  if (Array.isArray(value)) return value;
  try { const parsed = JSON.parse(value); if (Array.isArray(parsed)) return parsed; } catch { /* texto separado por comas */ }
  return String(value).split(',').map((item) => item.trim()).filter(Boolean);
};

export default function IdentitySettings({ config, setConfig, categories, products = [], answers, setAnswers, onSave, onSaveAnswers, onAddCategory, onToggleFeatured, onUploadMain, onUploadGallery, busy }) {
  const [newCategory, setNewCategory] = useState('');
  const featured = useMemo(() => parseList(config.categorias_destacadas), [config.categorias_destacadas]);
  const update = (key, value) => setConfig((current) => ({ ...current, [key]: value }));
  const setFeatured = (items) => update('categorias_destacadas', items.join(','));

  async function addCategory(event) {
    event.preventDefault();
    const name = newCategory.trim();
    if (!name || featured.some((item) => item.toLowerCase() === name.toLowerCase())) return;
    try {
      await onAddCategory(name);
      setFeatured([...featured, name]);
      setNewCategory('');
    } catch { /* el panel principal ya muestra el error */ }
  }

  return <div className="identity-page">
    <div className="identity-hero">
      <div><span>Identidad de marca</span><h2>🇻🇪 Identidad del negocio</h2><p>Gestiona la esencia venezolana, la narrativa y los recursos visuales que aparecen en la página pública.</p></div>
      <div className="identity-status"><i/> Conectado con la página</div>
    </div>

    <section className="admin-card identity-card">
      <div className="card-title"><div><h2>Esencia venezolana</h2><p>Define cómo se presenta la propuesta cultural de Pedacito de Cielo.</p></div></div>
      <form className="cms-form" onSubmit={onSave}>
        <Field label="Nombre de la propuesta" value={config.propuesta_nombre} onChange={(value) => update('propuesta_nombre', value)}/>
        <Field label="Frase principal" value={config.frase_marca} onChange={(value) => update('frase_marca', value)}/>
        <Field label="Slogan" value={config.slogan} onChange={(value) => update('slogan', value)}/>
        <Field wide textarea label="Descripción cultural" value={config.descripcion_cultural} onChange={(value) => update('descripcion_cultural', value)}/>
        <Field wide textarea label="Historia real del negocio" value={config.historia} onChange={(value) => update('historia', value)}/>
        <Field wide textarea label="Historia y conexión venezolana" value={config.historia_venezolana} onChange={(value) => update('historia_venezolana', value)}/>
        <Field wide textarea label="Mensaje de bienvenida" value={config.mensaje_bienvenida} onChange={(value) => update('mensaje_bienvenida', value)}/>
        <button className="cms-primary wide" disabled={busy}>{busy ? 'Guardando…' : 'Guardar esencia venezolana'}</button>
      </form>
    </section>

    <section className="admin-card identity-card">
      <div className="card-title"><div><h2>Categorías venezolanas</h2><p>Destaca familias de productos sin eliminar ni modificar las categorías existentes.</p></div></div>
      <div className="base-category-row"><small>Categorías actuales protegidas</small><div>{baseCategories.map((name) => <span key={name}>{name}</span>)}</div></div>
      <div className="identity-category-list">{featured.map((name) => <span key={name}>🇻🇪 {name}<button aria-label={`Quitar ${name} de destacados`} onClick={() => setFeatured(featured.filter((item) => item !== name))}>×</button></span>)}</div>
      <form className="category-add" onSubmit={addCategory}><input value={newCategory} onChange={(event) => setNewCategory(event.target.value)} placeholder="Ej.: Dulces venezolanos"/><button className="cms-primary" disabled={busy}>Agregar categoría</button></form>
      <p className="field-help">Las categorías agregadas también quedan disponibles en el formulario de productos. Quitarlas de esta lista solo deja de destacarlas.</p>
      <button className="cms-primary" onClick={onSave} disabled={busy}>Guardar categorías destacadas</button>
    </section>

    <section className="admin-card identity-card">
      <div className="card-title"><div><h2>Productos venezolanos destacados</h2><p>Selecciona qué productos aparecen en las tarjetas principales de la página.</p></div></div>
      <div className="featured-product-picker">{products.map((product) => <label key={product.id}><img src={product.imagen || '/images/productos/venezolanos/arepa.jpg'} alt=""/><span><b>{product.nombre}</b><small>{product.categorias?.nombre || 'Sin categoría'}</small></span><input type="checkbox" checked={Boolean(product.destacado)} onChange={() => onToggleFeatured(product)}/></label>)}</div>
    </section>

    <section className="admin-card identity-card">
      <div className="card-title"><div><h2>Galería venezolana</h2><p>Sube imágenes con el mismo almacenamiento seguro usado por productos y promociones.</p></div></div>
      <div className="identity-gallery-grid">
        <Gallery title="Imagen principal del negocio" images={config.imagen_portada ? [config.imagen_portada] : []} onUpload={(file) => onUploadMain(file, 'configuracion', 'imagen_portada')}/>
        {galleryFields.map(([key, title, folder]) => <Gallery key={key} title={title} images={parseList(config[key])} onUpload={(file) => onUploadGallery(file, folder, key)} onRemove={(url) => update(key, JSON.stringify(parseList(config[key]).filter((item) => item !== url)))}/>)}
      </div>
      <button className="cms-primary" onClick={onSave} disabled={busy}>Guardar galería</button>
    </section>

    <section className="admin-card identity-card">
      <div className="card-title"><div><h2>Apariencia</h2><p>Una paleta gastronómica premium, con acentos venezolanos equilibrados.</p></div></div>
      <form className="cms-form color-form" onSubmit={onSave}>
        <ColorField label="Color principal" value={config.color_principal} onChange={(value) => update('color_principal', value)}/>
        <ColorField label="Color secundario" value={config.color_secundario} onChange={(value) => update('color_secundario', value)}/>
        <ColorField label="Color de fondo" value={config.color_fondo} onChange={(value) => update('color_fondo', value)}/>
        <ColorField label="Color de destacados" value={config.color_destacado} onChange={(value) => update('color_destacado', value)}/>
        <div className="palette-preview wide">{['color_principal','color_secundario','color_fondo','color_destacado'].map((key) => <span key={key} style={{ background: config[key] }}/>)}</div>
        <button className="cms-primary wide" disabled={busy}>Guardar apariencia</button>
      </form>
    </section>

    <section className="admin-card identity-card">
      <div className="card-title"><div><h2>Chatbot administrable</h2><p>Configura el saludo y las respuestas rápidas del asistente.</p></div></div>
      <form className="cms-form" onSubmit={onSave}>
        <Field label="Nombre del asistente" value={config.chatbot_nombre} onChange={(value) => update('chatbot_nombre', value)}/>
        <Field label="Mensaje inicial" value={config.chatbot_mensaje} onChange={(value) => update('chatbot_mensaje', value)}/>
        <button className="cms-primary wide" disabled={busy}>Guardar asistente</button>
      </form>
      <div className="chat-editor identity-chat">{answers.map((answer, index) => <label key={answer.id || answer.clave}><span>{answer.clave.replaceAll('_', ' ')}</span><textarea value={answer.respuesta} onChange={(event) => setAnswers(answers.map((item, itemIndex) => itemIndex === index ? { ...item, respuesta: event.target.value } : item))}/></label>)}</div>
      <button className="cms-primary" onClick={onSaveAnswers}>Guardar preguntas rápidas</button>
    </section>
  </div>;
}

function Field({ label, value = '', onChange, textarea = false, wide = false }) { const Tag = textarea ? 'textarea' : 'input'; return <label className={wide ? 'wide' : ''}>{label}<Tag value={value || ''} onChange={(event) => onChange(event.target.value)}/></label>; }
function ColorField({ label, value = '#000000', onChange }) { return <label className="color-field">{label}<span><input type="color" value={value || '#000000'} onChange={(event) => onChange(event.target.value)}/><input value={value || ''} onChange={(event) => onChange(event.target.value)}/></span></label>; }
function Gallery({ title, images, onUpload, onRemove }) { return <article className="identity-gallery"><h3>{title}</h3><label className="gallery-upload">＋ Agregar imagen<input type="file" accept="image/*" onChange={(event) => event.target.files[0] && onUpload(event.target.files[0])}/></label><div>{images.map((url) => <figure key={url}><img src={url} alt={title}/>{onRemove && <button aria-label={`Quitar imagen de ${title}`} onClick={() => onRemove(url)}>×</button>}</figure>)}</div>{!images.length && <p>Sin imágenes todavía.</p>}</article>; }
