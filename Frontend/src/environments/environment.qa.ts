export const environment = {
  qa: true,
  /**
   * Placeholder que se sobreescribe en el pipeline de QA.
   * De forma local podés apuntarlo manualmente al endpoint público si necesitás pruebas contra la API en la nube.
   */
  // En QA usamos la ruta relativa al backend desplegado en el mismo App Service
  apiUrl: '/api/Product'
};
