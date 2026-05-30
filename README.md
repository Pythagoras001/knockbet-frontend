# Frontend KnockBet

Frontend desarrollado con React, TypeScript y Vite para administrar el sistema de apuestas KnockBet. La aplicacion permite gestionar peleadores, eventos de pelea, apuestas, presupuesto, retornos, facturas y resultados consumiendo la API REST del backend KnockBet.

## Tecnologias

- React 19
- TypeScript
- Vite
- Tailwind CSS
- TanStack React Query
- Axios
- Lucide React
- Motion
- Recharts
- Node.js y npm

## Requisitos Previos

Antes de ejecutar el proyecto, asegurese de tener instalado:

- Node.js 20 o superior
- npm
- Git
- Backend KnockBet ejecutandose en `http://localhost:8080`

El frontend esta configurado para consumir la API desde:

```text
http://localhost:8080/api
```

El backend debe permitir peticiones CORS desde:

```text
http://localhost:3000
```

## Configuracion del Backend

Este proyecto no crea ni administra la base de datos directamente. La base de datos, las tablas, las imagenes subidas y las reglas de negocio se gestionan desde el backend KnockBet.

Antes de iniciar el frontend:

1. Inicie MySQL.
2. Configure y ejecute el backend KnockBet.
3. Verifique que el backend responda en:

```text
http://localhost:8080
```

4. Confirme que los endpoints REST esten disponibles bajo:

```text
http://localhost:8080/api
```

Notas:

- Para los flujos principales de KnockBet, el frontend consume el backend desde `src/api/AxiosClient.ts`.
- La URL base actual esta fija como `http://localhost:8080/api`.
- Si el backend se ejecuta en otro puerto o dominio, cambie `baseURL` en `src/api/AxiosClient.ts`.

## Instalacion y Ejecucion

1. Clone el repositorio:

```bash
git clone <URL_DEL_REPOSITORIO>
cd KnockBet-FrontEnd
```

2. Instale las dependencias:

```bash
npm install
```

3. Verifique que el backend este ejecutandose:

```text
http://localhost:8080
```

4. Ejecute el frontend en modo desarrollo:

```bash
npm run dev
```

5. Abra la aplicacion en el navegador:

```text
http://localhost:3000
```

El script de desarrollo usa Vite con la siguiente configuracion:

```bash
vite --port=3000 --host=0.0.0.0
```

## Comandos Disponibles

| Comando | Descripcion |
| --- | --- |
| `npm install` | Instala las dependencias del proyecto |
| `npm run dev` | Inicia el servidor de desarrollo en el puerto 3000 |
| `npm run build` | Genera la version de produccion en la carpeta `dist/` |
| `npm run preview` | Sirve localmente la version compilada |
| `npm run lint` | Ejecuta TypeScript en modo verificacion sin emitir archivos |

## Compilacion para Produccion

Para generar los archivos finales de produccion:

```bash
npm run build
```

La salida se genera en:

```text
dist/
```

Para previsualizar esa version localmente:

```bash
npm run preview
```

## Flujo General de Ejecucion

1. El usuario abre el panel frontend en `http://localhost:3000`.
2. React renderiza las vistas principales del panel administrativo.
3. TanStack React Query consulta y sincroniza datos con el backend.
4. Axios envia peticiones HTTP a `http://localhost:8080/api`.
5. El backend procesa la logica de negocio y responde con datos o errores.
6. El frontend actualiza las tablas, formularios, modales, graficas y notificaciones.
7. Si el backend devuelve errores de validacion, el frontend puede mostrarlos como mensajes visuales tipo toast.

## Modulos Principales

| Modulo | Descripcion |
| --- | --- |
| Dashboard | Vista general con metricas y accesos rapidos |
| Peleadores | Directorio, registro, edicion y estado de peleadores |
| Eventos | Creacion, control, inicio, cancelacion y finalizacion de peleas |
| Apuestas | Publicacion de apuestas y registro de apuestas de usuario |
| Finanzas | Presupuesto, retornos, facturas y pagos |
| Live Book | Vista de detalle para apuestas asociadas a eventos |

## Estructura del Proyecto

```text
src
+-- api          Clientes HTTP y funciones para consumir el backend
+-- assets       Imagenes y recursos visuales
+-- components   Vistas, modales y componentes de interfaz
+-- hooks        Hooks de React Query para consultas y mutaciones
+-- types        Tipos TypeScript para datos GET y POST
+-- util         Utilidades compartidas
```

## Conexion con el Backend

El cliente Axios se encuentra en:

```text
src/api/AxiosClient.ts
```

Configuracion actual:

```typescript
const baseURL = "http://localhost:8080/api";
```

## Orden Recomendado para Probar

1. Levantar MySQL.
2. Levantar el backend KnockBet en `http://localhost:8080`.
3. Instalar dependencias del frontend con `npm install`.
4. Levantar el frontend con `npm run dev`.
5. Abrir `http://localhost:3000`.
6. Registrar peleadores.
7. Crear eventos de pelea.
8. Publicar apuestas.
9. Registrar apuestas de usuario.
10. Finalizar eventos y revisar retornos, facturas y pagos.
