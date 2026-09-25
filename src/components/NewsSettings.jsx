export default function NewsSettings({ config, setConfig, onSave, onNotify, busy }) {
  const content = config.contenido_pagina || {};
  const items = content.novedades?.items || [];
  const setItems = (next) => setConfig(current => ({
    ...current,
    contenido_pagina: {
      ...(current.contenido_pagina || {}),
      novedades: { ...(current.contenido_pagina?.novedades || {}), items: next },
    },
  }));
  const update = (index, key, value) => setItems(items.map((item, itemIndex) => itemIndex === index ? { ...item, [key]: value } : item));
  const add = () => setItems([...items, { titulo: '', texto: '', activo: false }]);
  const remove = (index) => { setItems(items.filter((_, itemIndex) => itemIndex !== index)); onNotify('Novedad eliminada del editor. Guarda para publicar el cambio.'); };
  const submit = (event) => {
    if (items.some(item => !item.titulo?.trim() || !item.texto?.trim())) { event.preventDefault(); return onNotify('Cada novedad debe tener título y descripción','error'); }
    return onSave(event);
  };

  return <div className="news-settings"><section className="cms-section-intro"><span>Contenido comercial</span><h2>Novedades</h2><p>Prepara publicaciones reales y decide cuáles aparecen en la página pública.</p></section><section className="admin-card"><div className="card-title"><div><h2>Publicaciones preparadas</h2><p>No se publica ningún contenido automáticamente.</p></div><button type="button" onClick={add}>＋ Nueva novedad</button></div><form onSubmit={submit}>{items.length ? <div className="news-admin-list">{items.map((item,index)=><article key={index}><label>Título<input value={item.titulo||''} onChange={event=>update(index,'titulo',event.target.value)}/></label><label>Descripción<textarea value={item.texto||''} onChange={event=>update(index,'texto',event.target.value)}/></label><label className="check"><input type="checkbox" checked={item.activo!==false} onChange={event=>update(index,'activo',event.target.checked)}/> Activa y visible</label><button type="button" onClick={()=>remove(index)}>Eliminar</button></article>)}</div>:<div className="empty-state"><b>No hay novedades creadas.</b><p>Agrega contenido solamente cuando exista información real para publicar.</p></div>}<button className="cms-primary" disabled={busy}>{busy?'Guardando…':'Guardar novedades'}</button></form></section></div>;
}
