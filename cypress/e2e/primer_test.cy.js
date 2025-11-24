  describe('Mi primera prueba', () => {
   it('Carga correctamente la página de ejemplo', () => {
     cy.visit('/');
     
     // Verificar que el título contenga "Productos"
     cy.get('h4', { timeout: 10000 }).should('contain', 'Productos');
     
     // Esperar a que desaparezca el loading (la grid solo aparece cuando imgLoadingDisplay === 'none')
     cy.get('.products-grid', { timeout: 30000 }).should('be.visible');
     
     // Ahora sí verificar que hay productos en la página
     cy.get('.product-card', { timeout: 10000 }).should('exist').and('be.visible');
     cy.get('.product-card').should('have.length.at.least', 1);
     
     // Contar productos antes de crear uno nuevo
     cy.get('.product-card').then($cards => {
       const countBefore = $cards.length;
       cy.log(`Productos antes de crear: ${countBefore}`);
       
       // Generar nombre único SOLO con letras (backend rechaza dígitos en nombres)
       const generateRandomLetters = (length) => {
         const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
         let result = '';
         for (let i = 0; i < length; i++) {
           result += letters.charAt(Math.floor(Math.random() * letters.length));
         }
         return result;
       };
       const uniqueName = `Tv Samsung ${generateRandomLetters(4)} ${generateRandomLetters(4)} ${generateRandomLetters(4)}`;
       
       // Ahora crear un nuevo producto
       cy.get('button.btn-corp', { timeout: 10000 }).click();
       cy.get('[name="name"]', { timeout: 10000 }).should('be.visible').type(uniqueName);
       cy.get('[name="stock"]').clear().type('8');
       cy.get('[name="price"]').clear().type('599.99');
       cy.get('button.btn-accent').click();
       
       // Esperar a que desaparezca el modal de confirmación
       cy.get('button.btn-primary').click();
       
       // Esperar a que se cierre el modal completamente (puede tomar tiempo si hay validación)
       cy.wait(2000);
       
       // Verificar que volvimos a la página principal (no quedamos en /addProduct)
       cy.url({ timeout: 10000 }).should('not.include', '/addProduct');
       
       // Después de crear, Angular navega a '/' y recarga la vista
       // Esperamos a que desaparezca el loading nuevamente
       cy.get('.products-grid', { timeout: 30000 }).should('be.visible');
       
       // Verificar que ahora hay más productos
       cy.get('.product-card', { timeout: 10000 }).should('have.length.at.least', countBefore + 1);
       
       // Verificar que el nuevo producto está en la lista
       // Nota: el backend normaliza nombres (Title Case + UPPERCASE última palabra)
       // Buscamos por partes únicas del nombre que sabemos están ahí
       const lastWord = uniqueName.split(' ').pop(); // La última palabra siempre queda UPPERCASE
       cy.contains('.product-card', lastWord, { timeout: 10000, matchCase: false }).should('be.visible').within(() => {
         cy.get('.stock-value').should('contain', '8');
         cy.get('.price-value').should('contain', '599.99');
       });
     });
   })
 })