# Farmart IPS — Frontend

Aplicación web desarrollada con React y Vite para interactuar con los servicios de la API REST de Farmart IPS.

## Tecnologías

- React
- Vite
- TypeScript
- Axios
- Docker y Docker Compose

## Requisitos previos

- Docker Desktop con Docker Compose.
- Git.
- Backend de Farmart IPS configurado y disponible.

## Ejecución del proyecto

Clonar el repositorio:

```bash
git clone <URL_DEL_REPOSITORIO>
cd frontend-farmart
```

Crear el archivo de variables de entorno a partir de la plantilla, si el repositorio incluye `.env.example`, y configurar la URL de la API.

Ejemplo:

```env
VITE_API_URL=http://localhost:8000
```

El nombre de la variable debe coincidir con el utilizado en el código del frontend. En Vite, las variables `VITE_*` se incorporan al código durante la compilación; no deben contener secretos.

Construir e iniciar el frontend:

```bash
docker compose up --build -d
```

Verificar el estado del contenedor:

```bash
docker compose ps
```

## Acceso a la aplicación

- Frontend local: `http://localhost:5173`
- Backend local: `http://localhost:8000`

Estas direcciones corresponden a la configuración local esperada y deben ajustarse si los puertos publicados en Docker Compose son diferentes.

## Integración con el backend

El frontend consume la API REST del backend para realizar las operaciones de la aplicación. La URL base se configura mediante variables de entorno y las solicitudes se centralizan en los módulos de comunicación con la API.

La autenticación y el control de acceso a las vistas deben respetar las respuestas y los permisos definidos por el backend.

## Decisiones de diseño y trade-offs

1. **React como biblioteca de interfaz:** permite crear componentes reutilizables y organizar la interfaz por funcionalidades; a cambio, requiere definir una estructura de componentes y gestionar su estado.
2. **Vite como herramienta de desarrollo y compilación:** proporciona un flujo de desarrollo rápido; las variables de entorno deben configurarse correctamente para cada entorno de compilación.
3. **Consumo de una API REST independiente:** desacopla la interfaz de la lógica de negocio y permite cambiar el backend sin reconstruir toda la arquitectura; requiere gestionar errores de red, autenticación y compatibilidad de endpoints.
4. **Docker Compose:** facilita ejecutar el frontend en un entorno reproducible, aunque la configuración local debe adaptarse al entorno de producción.

## Supuestos

- El backend está disponible en la URL configurada para la API.
- Los usuarios y roles se gestionan mediante los servicios del backend.
- Los datos de prueba son ficticios y no incluyen información real de pacientes ni de la IPS.

## Fuera del alcance

- Publicación automatizada mediante CI/CD, mientras no esté implementada.
- Configuración de un dominio público y certificados TLS de producción.
- Gestión de infraestructura de alta disponibilidad y escalamiento automático.