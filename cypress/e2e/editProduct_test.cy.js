describe('editProductTest', () => {
  it('Edita correctamente un producto', () => {
    // 🌐 Visita la URL del front (usá la de Azure o la local)
    cy.visit('https://productosweb-fpcnfsbsg8gscbat.brazilsouth-01.azurewebsites.net/');

    cy.get('tr:nth-child(2) td:nth-child(5) button.btn i.fa').click();

    cy.get('[name="name"]').should('be.visible').should('not.be.disabled');
    cy.get('[name="stock"]').should('be.visible').should('not.be.disabled');

    cy.wait(500);

    cy.get('[name="name"]').type('{selectall}{backspace}');
    cy.wait(200);
    cy.get('[name="name"]').should('have.value', '');
    cy.get('[name="name"]').type('Pan Integral Modificado');

    cy.get('[name="stock"]').type('{selectall}{backspace}');
    cy.wait(200);
    cy.get('[name="stock"]').should('have.value', '');
    cy.get('[name="stock"]').type('56');

    cy.get('button.btn-accent').click();
    cy.get('button.btn-primary').click();

    cy.get('tr:nth-child(2) td:nth-child(2)')
      .should('contain.text', 'Pan Integral MODIFICADO');
  });
});