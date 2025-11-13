# TP06 – Suite de Pruebas (Frontend + Backend)

Aplicación TODO desarrollada en el TP05 y extendida en el TP06 con una estrategia de testing completa y gates en CI/CD.

- **Backend**: FastAPI + SQLAlchemy + PostgreSQL.
- **Frontend**: React + Vite + styled-components.
- **Infra**: Cloud Run (QA/Producción) + GitHub Actions.

## Requisitos Previos

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
  tests/                 # pytest
frontend/
  src/hooks/useTodos.test.jsx
  src/pages/Home/Home.test.jsx
.github/workflows/       # QA + Production con jobs de tests
```

## Cómo ejecutar la app localmente

### Backend
```bash
cd backend
python -m venv .venv && source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
export DATABASE_URL=sqlite:///./local.db            # PowerShell: $env:DATABASE_URL='sqlite:///./local.db'
uvicorn app.main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Con Docker Compose
```bash
docker compose up --build
```

## Cómo correr los tests (localmente)

**Prerrequisitos**
1. Instalar dependencias (`pip install -r backend/requirements.txt`, `npm install`).
2. Usar Python 3.11 y Node 20 (igual que en CI).
3. Definir `DATABASE_URL=sqlite:///./test.db` antes de ejecutar pytest.

### Backend
```bash
cd backend
export DATABASE_URL=sqlite:///./test.db
pytest -q                                # pruebas unitarias
pytest --cov=app --cov-report=xml \
       --cov-report=term --cov-fail-under=70   # coverage
```

Reproducir el pipeline dentro de un contenedor:
```bash
docker compose run --rm backend bash -lc "export DATABASE_URL=sqlite:///./test.db && pytest -q"
docker compose run --rm backend bash -lc "export DATABASE_URL=sqlite:///./test.db && pytest --cov=app --cov-report=xml --cov-report=term --cov-fail-under=70"
```

### Frontend
```bash
cd frontend
npm run test:unit                    # pruebas unitarias
npm run test:coverage                # coverage (genera coverage/lcov.info)
```

Opcional en contenedor:
```bash
docker run --rm -it -v ${PWD}/frontend:/app -w /app node:20 bash -lc "npm ci && npm run test:unit"
docker run --rm -it -v ${PWD}/frontend:/app -w /app node:20 bash -lc "npm ci && npm run test:coverage"
```

## CI/CD

| Workflow | Rama | Jobs | Descripción |
| -------- | ---- | ---- | ----------- |
| `frontend-qa.yml` | `qa` | `tests` → `deploy` | Ejecuta unit tests + coverage (se publica en el summary) y sube el lcov para Sonar. |
| `backend-qa.yml`  | `qa` | `tests` → `sonar` → `deploy` | Pytest + coverage + análisis SonarCloud (quality gate). |
| `frontend.yml`    | `main` | `validate-qa`, `tests`, `sonar`, `deploy` | Igual que QA pero contra main. |
| `backend.yml`     | `main` | `validate-qa`, `tests`, `sonar`, `deploy` | Sólo se despliega si el quality gate pasa. |

Los jobs de `sonar` usan los reportes de coverage subidos como artefactos y validan el **quality gate** en SonarCloud. Si los tests o Sonar fallan, `deploy` no se ejecuta.

## Evidencias solicitadas

- Capturas de ejecución local de `pytest` y `npm run test:ci`.
- Capturas de GitHub Actions donde se observan los jobs “Run Backend/Frontend Tests” antes del despliegue (ver imágenes adjuntas en la carpeta de evidencias o la pestaña *Actions*).
- `decisiones.md` documenta frameworks, mocks, casos cubiertos y referencias a las capturas.


## Defensa oral

1. Explicar la elección de frameworks (pytest + TestClient + SQLite / Vitest + RTL).  
2. Mostrar cómo se mockean dependencias (`dependency_overrides` en FastAPI, `vi.mock` del cliente HTTP).  
3. Enseñar cómo los pipelines bloquean el deploy si un test cae.  
4. Respaldar con los comandos anteriores y capturas de Actions.
