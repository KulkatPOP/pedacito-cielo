import test from 'node:test';
import assert from 'node:assert/strict';
import { mergeSources, prepareProducts, productState } from '../src/utils/dataPriority.js';

test('Supabase tiene prioridad sobre fallback y valores por defecto', () => {
  const result = mergeSources({
    remote: { nombre: 'Remoto', redes: { instagram: '' }, items: [] },
    fallback: { nombre: 'Local', redes: { instagram: 'local', facebook: 'facebook' }, items: ['local'] },
    defaults: { nombre: 'Default', redes: { tiktok: 'default' } },
  });
  assert.equal(result.nombre, 'Remoto');
  assert.deepEqual(result.items, []);
  assert.deepEqual(result.redes, { tiktok: 'default', instagram: '', facebook: 'facebook' });
});

test('el fallback completa campos ausentes sin sobrescribir contenido remoto', () => {
  const result = mergeSources({ remote: { hero: { titulo: 'Título remoto' } }, fallback: { hero: { titulo: 'Local', texto: 'Respaldo' } } });
  assert.deepEqual(result.hero, { titulo: 'Título remoto', texto: 'Respaldo' });
});

test('un bloque remoto nulo activa el fallback en lugar de romper la vista', () => {
  assert.deepEqual(mergeSources({ remote: null, fallback: { titulo: 'Respaldo' } }), { titulo: 'Respaldo' });
});

test('los estados históricos permanecen compatibles', () => {
  assert.equal(productState({ disponible: true }), 'disponible');
  assert.equal(productState({ disponible: false }), 'agotado');
  assert.equal(productState({ estado: 'oculto', disponible: true }), 'oculto');
});

test('productos ocultos se excluyen y el orden configurado se respeta', () => {
  const products = prepareProducts([
    { id: 1, nombre: 'Sin orden', disponible: true },
    { id: 2, nombre: 'Segundo', estado: 'disponible', orden: 2 },
    { id: 3, nombre: 'Oculto', estado: 'oculto', orden: 0 },
    { id: 4, nombre: 'Primero', estado: 'agotado', orden: 1 },
  ]);
  assert.deepEqual(products.map(product => product.id), [4, 2, 1]);
});

test('un catálogo remoto vacío sigue siendo una fuente válida', () => {
  assert.deepEqual(prepareProducts([]), []);
});
