const FRONT_URL =
  Cypress.env('frontUrl') ||
  'https://gc-front-ingsw3-roy-qa-726155499113.southamerica-east1.run.app'
const API_URL =
  Cypress.env('apiUrl') ||
  'https://gc-back-ingsw3-roy-726155499113.southamerica-east1.run.app'

describe('Pruebas e2e', () => {
  beforeEach(() => {
    cy.wait(30000) // espera 30 segundos para asegurar que el entorno esté listo
    cy.visit(FRONT_URL)
  })

  it('Flujo completo de creación de tarea', () => {
    const taskName = `Cypress create ${Date.now()}`

    cy.intercept('POST', '**/todos').as('createTodo')
    cy.window().then((win) => {
      cy.stub(win, 'prompt').returns(taskName)
    })
    cy.contains('Add Task').click()
    cy.wait('@createTodo').its('response.statusCode').should('eq', 200)
    cy.contains(taskName).should('exist')

    // Limpieza: eliminar la tarea creada para no dejar datos ensuciando el entorno
    cy.contains('h3', taskName)
      .parentsUntil('[data-testid^="task-card"]')
      .parent()
      .find(`button[aria-label="Delete ${taskName}"]`)
      .click()
    cy.contains(taskName).should('not.exist')
  })

  it('Flujo completo de eliminación de tarea', () => {
    const taskName = `Cypress delete ${Date.now()}`

    cy.request('POST', `${API_URL}/todos`, { title: taskName })
      .its('body.id')
      .then((todoId) => {
        cy.intercept('GET', '**/todos').as('getTodos')
        cy.visit(FRONT_URL)
        cy.wait('@getTodos')
        cy.intercept('DELETE', `**/todos/${todoId}`).as('deleteTodo')

        cy.contains('h3', taskName, { timeout: 8000 })
          .should('exist')
          .parentsUntil('[data-testid^="task-card"]')
          .parent()
          .find(`button[aria-label="Delete ${taskName}"]`)
          .click()

        cy.wait('@deleteTodo').its('response.statusCode').should('eq', 200)
        cy.contains(taskName).should('not.exist')
      })
  })
})
