  describe('Mi primera prueba', () => {
   it('Carga correctamente la página de ejemplo', () => {
     cy.visit('https://productosweb-fpcnfsbsg8gscbat.brazilsouth-01.azurewebsites.net/') // Colocar la url local o de Azure de nuestro front
     cy.get('h4').should('contain', 'Productos') // Verifica que el título contenga "Productos"
     cy.get('button.btn-corp').click();
     cy.get('[name="name"]').click();
     cy.get('[name="name"]').type('TV Samsung - Ultra HD');
     cy.get('[name="stock"]').click();
     cy.get('[name="stock"]').clear();
     cy.get('[name="stock"]').type('8');
     cy.get('[name="price"]').click();
     cy.get('[name="price"]').clear();
     cy.get('[name="price"]').type('599.99');
     cy.get('button.btn-accent').click();
     cy.get('button.btn-primary').click();
     
     // Esperar a que aparezcan las cards con el producto creado
     cy.wait(2000);
     cy.get('.product-card', { timeout: 10000 }).should('exist').and('be.visible');
     
     // Buscar el producto por precio o stock ya que el nombre puede tener transformaciones
     cy.get('.product-card').should('have.length.at.least', 1);
     cy.get('.product-card').last().within(() => {
       cy.get('.product-name').should('be.visible');
       cy.get('.stock-value').should('contain', '8');
       cy.get('.price-value').should('contain', '599.99');
     });
   })
 })
