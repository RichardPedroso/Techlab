describe('Oficinas TechLab', () => {
  it('filtra oficinas pela trilha Qualidade', () => {
    cy.visit('/');
    cy.get('#trilha').select('Qualidade');
    cy.get('#oficinas article').should('have.length', 1);
    cy.get('#oficinas').should('contain.text', 'Testes de interface com Cypress');
  });

  it('confirma e persiste uma inscrição', () => {
    cy.visit('/');
    cy.get('[data-cy="oficina-1"]').within(() => {
      cy.get('[data-cy="vagas"]').should('have.text', '0 de 2 vagas ocupadas');
      cy.get('input').type('aluno@example.test');
      cy.contains('button', 'Reservar vaga').click();
    });
    cy.get('[role="status"]').should('have.text', 'Inscrição confirmada.');
    cy.reload();
    cy.get('[data-cy="oficina-1"] [data-cy="vagas"]')
      .should('have.text', '1 de 2 vagas ocupadas');
  });
});

describe('Limite de capacidade', () => {
  it('rejeita nova inscrição quando a oficina está lotada', () => {
    cy.visit('/');
    cy.get('[data-cy="oficina-2"]').within(() => {
      cy.get('input').type('primeiro@example.test');
      cy.contains('button', 'Reservar vaga').click();
    });
    cy.get('[role="status"]').should('have.text', 'Inscrição confirmada.');
    cy.get('[data-cy="oficina-2"] [data-cy="vagas"]')
      .should('have.text', '1 de 1 vagas ocupadas');
    cy.get('[data-cy="oficina-2"]').within(() => {
      cy.get('input').type('segundo@example.test');
      cy.contains('button', 'Reservar vaga').click();
    });
    cy.get('[role="status"]').should('have.text', 'Oficina lotada.');
    cy.reload();
    cy.get('[data-cy="oficina-2"] [data-cy="vagas"]')
      .should('have.text', '1 de 1 vagas ocupadas');
  });
});
