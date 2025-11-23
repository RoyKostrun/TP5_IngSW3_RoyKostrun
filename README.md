# TP06 – Suite de Pruebas (Frontend + Backend)

Aplicación TODO del TP05 extendida con una estrategia de calidad para TP06/TP07: unit tests, coverage, SonarCloud, Cypress e integración CI/CD con quality gates.

- **Backend**: FastAPI + SQLAlchemy + PostgreSQL  
- **Frontend**: React + Vite + styled-components  
- **Infra**: Cloud Run (QA / Producción) + GitHub Actions

## Requisitos

| Componente | Versión recomendada |
| ---------- | ------------------- |
| Python     | 3.11+               |
| Node.js    | 20.x                |
| npm        | 10+                 |
| Docker     | 24+                 |
| gcloud CLI | 465+                |

## Estructura

```
backend/
  app/
  tests/
frontend/
  src/hooks/useTodos.test.jsx
  src/pages/Home/Home.test.jsx
  cypress/e2e/test.cy.js
.github/workflows/
  backend-qa.yml / backend.yml
  frontend-qa.yml / frontend.yml
sonar-project.properties
```

## Ejecución local

### Backend
```bash
cd backend
python -m venv .venv && source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```
El backend carga variables con [python-dotenv](https://pypi.org/project/python-dotenv/):

- `.env.dev` (por defecto) usa SQLite local (`DATABASE_URL=sqlite:///./backend/dev.db`).
- `.env` representa producción (Cloud Run / Postgres) e incluye `APP_ENV=production`.
- Si querés forzar otro archivo, exportá `ENV_FILE=/ruta/a/archivo`.

### Frontend
```bash
cd frontend
npm install
npm run dev
```
El frontend usa variables de entorno de Vite:

- `.env` → valores para build/producción (commitado con la URL de Cloud Run).
- `.env.dev` → valores locales; `npm run dev` carga este archivo gracias al flag `--mode dev`.

Actualiza `VITE_API_URL` en esos archivos si tu backend cambia de URL.

### Docker Compose
```bash
docker compose up --build
```
El stack toma las variables de `.env.dev` (modo desarrollo). Ahí configurás las credenciales del Postgres local
a la vez que mantenés `DATABASE_URL=sqlite:///...` para ejecuciones fuera de Docker. El servicio `backend`
sobre-escribe esa URL dentro del contenedor para apuntar al Postgres (`db`) y el `frontend` se construye con
`VITE_API_URL=http://localhost:8000`, que es la dirección que tu navegador puede resolver cuando accede a
`http://localhost:3000`. Si necesitás otro host/puerto, edita `VITE_API_URL` en `.env.dev` antes de levantar los
contenedores.

## Cómo correr los tests

### Backend
```bash
cd backend
export DATABASE_URL=sqlite:///./test.db
pytest -q
pytest --cov=app --cov-report=xml --cov-report=term --cov-fail-under=70
```

### Frontend
```bash
cd frontend
npm run test:unit
npm run test:coverage
```

### Cypress (integración)
```bash
cd frontend
npm run cy:run
```
Variables útiles:
- `CYPRESS_frontUrl`: URL del frontend a testear (default: QA).
- `CYPRESS_apiUrl`: backend que usa Cypress para crear/eliminar tareas.

## CI/CD y Quality Gates

| Workflow | Rama | Jobs principales | Detalle |
| -------- | ---- | ---------------- | ------- |
| `frontend-qa.yml` | `qa` | `tests → deploy → cypress-e2e → quality-gate → approval` | Unit tests + coverage, despliegue en QA, Cypress sobre QA y aprobación manual para habilitar producción. |
| `backend-qa.yml`  | `qa` | `tests → sonar → deploy → cypress-e2e` | Pytest + coverage ≥70 %, SonarCloud, deploy QA y Cypress E2E. |
| `frontend.yml`    | `main` | `deploy` | Sólo build + deploy (los gates suceden en QA). |
| `backend.yml`     | `main` | `validate-qa → tests → sonar → cypress-e2e → quality-gate → approval → deploy` | Ejecución completa antes de producción y aprobación manual (`production-approval`). |

Quality gates:
- Cobertura mínima 70 % (pytest/vitest con `--cov-fail-under=70`).
- SonarCloud bloquea si hay issues críticos.
- Cypress valida los flujos de creación/eliminación en QA; si falla, el pipeline se detiene.
- Los jobs `approval` requieren confirmación manual antes del deploy productivo.

## Evidencias y documentación

- `decisiones.md`: frameworks elegidos, mocking, cobertura, SonarCloud y escenarios Cypress.
- Capturas de `pytest`, `vitest`, `cypress run` y de la pestaña *Actions* (coverage summary, SonarCloud, Cypress/quality gate).

## Defensa oral

1. Justificar las elecciones técnicas (pytest/TestClient/SQLite, Vitest/RTL, Cypress).  
2. Explicar la estrategia de mocking (dependency_overrides, `vi.mock`, intercepts).  
3. Mostrar cómo los pipelines bloquean despliegues (coverage, Sonar, Cypress, aprobación).  
4. Ejecutar localmente los comandos anteriores y enseñar los reportes generados.
