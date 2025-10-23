export const environment = {
  production: true,
  /**
   * Placeholder que el pipeline de producción reemplaza por la URL pública real.
   * En pruebas locales podés modificarlo manualmente si necesitás verificar contra la API productiva.
   */
  // En producción servimos el frontend desde el mismo host que el backend,
  // por eso usamos una URL relativa que apunta al controlador de productos.
  apiUrl: '/api/Product'
};
