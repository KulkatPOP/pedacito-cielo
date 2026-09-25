const isObject = (value) => value && typeof value === 'object' && !Array.isArray(value);

export function mergeSources({ remote, fallback, defaults = {} }) {
  const merge = (base, source) => {
    if (!isObject(source)) return source == null ? base : source;
    const result = isObject(base) ? { ...base } : {};
    Object.entries(source).forEach(([key, value]) => {
      result[key] = isObject(value) ? merge(result[key], value) : value;
    });
    return result;
  };
  return merge(merge(defaults, fallback), remote);
}

export const productState = (product) => product.estado || (product.disponible === false ? 'agotado' : 'disponible');

export function prepareProducts(products, normalize = (product) => product) {
  if (!Array.isArray(products)) return [];
  return products
    .map((product) => ({ ...normalize(product), estado: productState(product) }))
    .filter((product) => product.estado !== 'oculto')
    .sort((a, b) => {
      if (a.orden == null && b.orden == null) return 0;
      if (a.orden == null) return 1;
      if (b.orden == null) return -1;
      return a.orden - b.orden;
    });
}
