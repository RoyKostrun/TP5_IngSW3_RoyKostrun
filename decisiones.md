# Decisiones de Testing – TP06

## Frameworks elegidos

| Capa | Framework | Justificación |
| ---- | --------- | ------------- |
| Backend | **pytest** + `fastapi.testclient` + `sqlite` | Integración natural con FastAPI, ejecución rápida usando SQLite en memoria y posibilidad de aislar dependencias mediante fixtures. |
| Backend | `pytest-mock`, `httpx`, `faker` | Soporte para mocks/stubs y generar datos consistentes sin depender de servicios reales. |
| Frontend | **Vitest** + React Testing Library + JSDOM | Vitest es el runner recomendado por Vite y es compatible con la sintaxis Jest; RTL permite testear componentes desde la perspectiva del usuario. |
| Frontend | `vi.mock` + `@testing-library/user-event` | Permite mockear servicios HTTP y simular interacciones reales (clicks, inputs) manteniendo el patrón AAA. |

## Estrategia de Mocking y Aislamiento

### Backend

- **Base de datos**: fixture `db_session` (en `backend/tests/conftest.py`) crea una tabla SQLite nueva para cada test y sobrescribe `get_db` con `app.dependency_overrides`.  
- **Dependencias externas**: no hay llamadas externas en la API, pero se dejó preparado `pytest-mock` para usar `mocker.patch` si se agregan integraciones (por ejemplo, colas o servicios REST).

### Frontend

- **HTTP client**: `vi.mock('../services/api')` devuelve un objeto `api` con métodos `get/post/delete` stubbeados. No se realizan requests reales.  
- **Hook `useTodos`**: los tests controlan las respuestas de `api` (arrays, objetos con `{ data: [...] }`, errores) para cubrir edge cases.  
- **Componentes**: `Home.test.jsx` mockea `useTodos` para aislar la UI del hook y se apoya en `userEvent` para validar interacciones (click en delete, mensajes de loading/empty state).

## Casos cubiertos

### Backend (`pytest`)

- `test_create_todo_persists`, `test_get_todos_returns_list`, `test_delete_todo_existing_item`, `test_delete_todo_missing_item` (CRUD).  
- Validaciones Pydantic (`test_create_todo_requires_title`).  
- Endpoints FastAPI (`test_health_endpoint`, `test_create_and_list_todos`, `test_delete_todo_endpoint`) con `TestClient`.

### Frontend (`Vitest`)

- Hook `useTodos`: estados de loading, normalización de payloads, `addTodo`, `deleteTodo`, manejo de errores.  
- Página `Home`: render de loading, empty state, lista de tareas, botón delete disparando el handler mockeado.  
- Las pruebas siguen patrón AAA explícito y cubren flujos felices + edge cases pedidos en el TP.

## Cobertura de código

- **Backend**: `pytest --cov=app --cov-report=xml --cov-report=term --cov-fail-under=70`. El reporte `coverage.xml` se usa como insumo para quality gates y SonarCloud.  
- **Frontend**: `vitest --run --coverage` (scripts `npm run test:coverage`) con provider V8, reporters `text/html/lcov` y thresholds al 70 % para branches, functions, lines y statements (`vite.config.js`).  
- Los workflows QA/Producción ejecutan primero los tests unitarios y sólo luego generan coverage; si alguno cae por debajo del umbral, el job falla y bloquea el deploy.

## Integración con CI/CD

- Los workflows `frontend-qa.yml`, `backend-qa.yml`, `frontend.yml` y `backend.yml` incluyen jobs `tests` obligatorios que ejecutan los comandos anteriores (`pytest -q` y `npm run test:ci`).  
- `deploy` depende de `tests`, por lo que un fallo interrumpe la publicación tanto en QA como en Producción.  
- Se añadieron variables `DATABASE_URL=sqlite:///./test.db` y cache de dependencias (Node) para acelerar los pipelines.

## Evidencias

1. **Consola local**: capturas (o video) ejecutando `pytest -q` y `npm run test:ci`.  
2. **GitHub Actions**: screenshots compartidos en la consigna donde se observan los jobs “Run Backend Tests / Run Frontend Tests” previos a cada deploy y los resúmenes generados automáticamente.  
3. **Documentación**: el presente archivo + el README detallan los comandos y decisiones técnicas para defender el TP06.

## Próximos pasos sugeridos

- Añadir cobertura mínima requerida (por ejemplo, `--cov-fail-under 85`) si la cátedra lo pide.  
- Extender los tests frontend a componentes adicionales (Header, Sidebar) y pruebas end-to-end con Playwright si se requiere.  
- Automatizar la generación de evidencias (subir reportes de cobertura como artefactos del workflow).
