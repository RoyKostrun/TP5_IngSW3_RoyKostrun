# TP06 – Suite de Pruebas (Frontend + Backend)

Aplicación TODO desarrollada en el TP05 y extendida para el TP06/TP07 con una estrategia de calidad completa (unit tests, coverage, SonarCloud, Cypress y CI/CD con quality gates).

- **Backend**: FastAPI + SQLAlchemy + PostgreSQL.
- **Frontend**: React + Vite + styled-components.
- **Infra**: Cloud Run (QA / Producción) + GitHub Actions.

## Requisitos

| Componente | Versión recomendada |
| ---------- | ------------------- |
| Python     | 3.11+               |
| Node.js    | 20.x                |
| npm        | 10+                 |
| Docker     | 24+                 |
| gcloud CLI | 465+                |

## Estructura relevante

```
backend/
  app/           # Código FastAPI
  tests/         # pytest + cobertura
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
python -m venv .venv && source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
export DATABASE_URL=sqlite:///./local.db           # PowerShell: $env:DATABASE_URL='sqlite:///./local.db'
uvicorn app.main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Docker Compose
```bash
docker compose up --build
```

## Cómo correr los tests

### Backend
```bash
cd backend
export DATABASE_URL=sqlite:///./test.db
pytest -q                                   # unit tests
pytest --cov=app --cov-report=xml \
       --cov-report=term --cov-fail-under=70
```

### Frontend (unitarios + coverage)
```bash
cd frontend
npm run test:unit
npm run test:coverage
```

### Pruebas de integración (Cypress)
```bash
cd frontend
npm run cy:run
```
Variables útiles:
- `CYPRESS_frontUrl`: URL del frontend bajo prueba (por defecto, QA).
- `CYPRESS_apiUrl`: endpoint del backend que los tests usan para crear/eliminar tareas.

## CI/CD y Quality Gates

| Workflow | Rama | Jobs principales | Detalle |
| -------- | ---- | ---------------- | ------- |
| `frontend-qa.yml` | `qa` | `tests → deploy` | Unit tests + coverage (artefactos para Sonar). |
| `backend-qa.yml`  | `qa` | `tests → sonar → deploy → cypress-e2e` | Pytest + coverage ≥70%, SonarCloud, deploy QA y Cypress E2E sobre QA. |
| `frontend.yml`    | `main` | `validate-qa → tests → sonar → deploy` | Repite validaciones sobre main. |
| `backend.yml`     | `main` | `validate-qa → tests → sonar → cypress-e2e → quality-gate → approval → deploy` | Antes del deploy productivo se ejecutan unit tests, coverage, SonarCloud y Cypress. Luego se pide aprobación manual (`environment: production-approval`). |

Quality gates:
- **Cobertura**: los comandos pytest/vitest usan `--cov-fail-under=70`.
- **SonarCloud**: falla si el quality gate detecta issues críticos.
- **Cypress**: corre sobre el entorno QA; si la integración front-back falla, no se avanza.
- **Aprobación manual**: el job `approval` obliga a revisar el pipeline sólo cuando todas las verificaciones pasaron.

## Evidencias y documentación

- `decisiones.md` documenta frameworks, mocks, coverage, SonarCloud y los escenarios de Cypress (creación y eliminación de tareas + manejo de errores).  
- Capturas de ejecución local y de GitHub Actions (coverage summary, SonarCloud, Cypress) se adjuntan en la carpeta de evidencias o pueden tomarse desde la pestaña *Actions*.

## Defensa oral

1. Justificar la elección de frameworks (pytest + TestClient + SQLite, Vitest + RTL, Cypress).  
2. Explicar cómo se mockean dependencias (override `get_db`, `vi.mock`, intercepts de Cypress).  
3. Mostrar los quality gates en GitHub Actions / SonarCloud y cómo bloquean despliegues.  
4. Ejecutar los comandos locales (pytest, vitest, cypress) y mostrar los reportes generados.
