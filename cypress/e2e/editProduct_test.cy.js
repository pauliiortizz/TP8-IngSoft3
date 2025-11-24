describe('editProductTest', () => {
  it('Edita correctamente un producto', () => {
    // 🌐 Visita la URL del front (usa baseUrl de la config)
    cy.visit('/');

    // Esperar a que desaparezca el loading primero
    cy.get('.products-grid', { timeout: 30000 }).should('be.visible');
    
    // Ahora sí esperar a que los productos carguen
    cy.get('.product-card', { timeout: 10000 }).should('have.length.at.least', 1);

    // Hacer clic en el botón Editar del primer producto
    cy.get('.product-card').first().find('.btn-edit').click();

    // Verificar que los campos sean visibles y editables
    cy.get('[name="name"]').should('be.visible').should('not.be.disabled');
    cy.get('[name="stock"]').should('be.visible').should('not.be.disabled');
    cy.get('[name="price"]').should('be.visible').should('not.be.disabled');

    cy.wait(500);

    // Editar el nombre
    cy.get('[name="name"]').clear();
    cy.wait(200);
    cy.get('[name="name"]').should('have.value', '');
    cy.get('[name="name"]').type('Pan Integral Modificado');

    // Editar el stock
    cy.get('[name="stock"]').clear();
    cy.wait(200);
    cy.get('[name="stock"]').should('have.value', '');
    cy.get('[name="stock"]').type('56');

    // Editar el precio
    cy.get('[name="price"]').clear();
    cy.wait(200);
    cy.get('[name="price"]').should('have.value', '');
    cy.get('[name="price"]').type('99.50');

    // Guardar cambios
    cy.get('button.btn-accent').click();
    cy.get('button.btn-primary').click();

    // Verificar que el producto se actualizó en la lista de cards (case-insensitive)
    cy.wait(1000); // Esperar a que se actualice la lista
    cy.get('.product-card').first().find('.product-name')
      .invoke('text')
      .should('match', /Pan Integral Modificado/i);
    cy.get('.product-card').first().find('.stock-value')
      .should('contain.text', '56');
    cy.get('.product-card').first().find('.price-value')
      .invoke('text')
      .should('match', /99\.50/);
  });
});