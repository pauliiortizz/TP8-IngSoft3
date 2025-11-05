  describe('Mi primera prueba', () => {
   it('Carga correctamente la página de ejemplo', () => {
     cy.visit('https://productosweb-fpcnfsbsg8gscbat.brazilsouth-01.azurewebsites.net/') // Colocar la url local o de Azure de nuestro front
     cy.get('h4').should('contain', 'Productos') // Verifica que el título contenga "EmployeeCrudAngular"
     cy.get('button.btn-corp').click();
     cy.get('[name="name"]').click();
     cy.get('[name="name"]').type('servilleta');
     cy.get('[name="stock"]').click();
     cy.get('[name="stock"]').clear();
     cy.get('[name="stock"]').type('8');
     cy.get('button.btn-accent').click();
     cy.get('button.btn-primary').click();
   })
 })
