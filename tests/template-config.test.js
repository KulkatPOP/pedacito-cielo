import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const business = JSON.parse(await readFile(new URL('../data/negocio.json', import.meta.url), 'utf8'));

test('la configuración local contiene los datos mínimos de una plantilla', () => {
  assert.ok(business.nombre);
  assert.ok(business.nombreCorto);
  assert.ok(business.sigla);
  assert.ok(business.whatsapp);
  assert.ok(business.direccion);
  assert.ok(business.horarios?.semana);
  assert.ok(business.horarios?.domingo);
  assert.ok(business.redes && typeof business.redes === 'object');
});

test('el branding local define los cuatro colores y campos de imagen', () => {
  for (const field of ['color_principal', 'color_secundario', 'color_fondo', 'color_destacado']) {
    assert.match(business[field], /^#[0-9a-f]{6}$/i);
  }
  assert.equal(typeof business.logo, 'string');
  assert.equal(typeof business.imagen_portada, 'string');
});
