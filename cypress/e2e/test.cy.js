const FRONT_URL =
  Cypress.env('frontUrl') ||
  'https://gc-front-ingsw3-roy-qa-726155499113.southamerica-east1.run.app'
const API_URL =
  Cypress.env('apiUrl') ||
  'https://gc-back-ingsw3-roy-726155499113.southamerica-east1.run.app'

describe('Pruebas e2e', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/todos').as('getTodos')
    cy.wait(30000) // espera 30 segundos para asegurar que el entorno estA listo
    cy.visit(FRONT_URL)
    cy.wait('@getTodos')
  })

  it('Flujo completo de creaciA3n de tarea', () => {
    const taskName = `Cypress create ${Date.now()}`
    const taskBody = `Body ${Date.now()}`

    cy.intercept('POST', '**/todos').as('createTodo')
    cy.contains('Add Task').click()
    cy.get('[data-testid="create-task-title"]').type(taskName)
    cy.get('[data-testid="create-task-body"]').type(taskBody)
    cy.get('[data-testid="create-task-submit"]').click()
    cy.wait('@createTodo').its('response.statusCode').should('eq', 200)
    cy.contains('h3', taskName).should('exist')
    cy.contains(taskBody).should('exist')

    cy.contains('h3', taskName)
      .closest('[data-testid^="task-card"]')
      .find('button[data-testid^="delete-button"]')
      .click()
    cy.contains(taskName).should('not.exist')
  })

  it('Flujo completo de eliminaciA3n de tarea', () => {
    const taskName = `Cypress delete ${Date.now()}`

    cy.request('POST', `${API_URL}/todos`, {
      title: taskName,
      body: `Eliminar ${Date.now()}`,
    })
      .its('body.id')
      .then((todoId) => {
        cy.intercept('DELETE', `**/todos/${todoId}`).as('deleteTodo')
        cy.visit(FRONT_URL)
        cy.wait('@getTodos')

        cy.contains('h3', taskName, { timeout: 8000 })
          .should('exist')
          .closest('[data-testid^="task-card"]')
          .find(`[data-testid="delete-button-${todoId}"]`)
          .click()

        cy.wait('@deleteTodo').its('response.statusCode').should('eq', 200)
        cy.contains(taskName).should('not.exist')
      })
  })

  it('Flujo completo de ediciA3n de tarea', () => {
    const originalTitle = `Cypress edit ${Date.now()}`
    const updatedTitle = `${originalTitle} actualizado`
    const updatedBody = `Body actualizado ${Date.now()}`

    cy.request('POST', `${API_URL}/todos`, {
      title: originalTitle,
      body: 'Contenido original',
    })
      .its('body.id')
      .then((todoId) => {
        cy.intercept('PUT', `**/todos/${todoId}`).as('updateTodo')
        cy.visit(FRONT_URL)
        cy.wait('@getTodos')

        cy.get(`[data-testid="edit-button-${todoId}"]`).click()
        cy.get(`[data-testid="edit-task-title-${todoId}"]`)
          .clear()
          .type(updatedTitle)
        cy.get(`[data-testid="edit-task-body-${todoId}"]`)
          .clear()
          .type(updatedBody)
        cy.get(`[data-testid="edit-task-save-${todoId}"]`).click()

        cy.wait('@updateTodo').its('response.statusCode').should('eq', 200)
        cy.contains('h3', updatedTitle).should('exist')
        cy.contains(updatedBody).should('exist')

        cy.request('DELETE', `${API_URL}/todos/${todoId}`)
      })
  })
})
