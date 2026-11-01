# Mis Tareas — Evaluación Sumativa Unidad 1

## Integrantes del equipo
- **Mixiu Perez**
- **Sofia Benavente**

---

## 1. Presentación

**Mis Tareas** es una aplicación móvil tipo "lista de tareas" (To-Do List) construida con **Ionic, Angular y TypeScript**. Permite ver, agregar, editar y eliminar tareas, cada una con título y descripción. El proyecto partió de la plantilla `blank` de Ionic con componentes independientes (Standalone), buscando una solución simple, ordenada y fácil de explicar, priorizando el uso correcto de los componentes de Ionic sobre la complejidad técnica.

## 2. Objetivo

Aplicar los contenidos de la Unidad 1: conceptos fundamentales de Ionic, componentes de interfaz, formularios, listas, botones, navegación y separación de responsabilidades en Angular. La idea es que una persona pueda administrar sus tareas sin instrucciones adicionales: el formulario está siempre visible, los botones de editar y eliminar están asociados a cada tarea y los mensajes de confirmación aparecen de forma clara.

## 3. Tecnologías utilizadas

| Tecnología | Uso en el proyecto |
|------------|--------------------|
| **Ionic 9** | Componentes de interfaz móvil (`ion-list`, `ion-input`, `ion-button`, etc.) |
| **Angular 22** | Componentes independientes (Standalone), formularios reactivos, enrutamiento y estado |
| **TypeScript 6** | Tipado estricto de tareas, formularios y servicios |
| **SCSS** | Estilos de la página y variables de tema |
| **Vitest** | Pruebas unitarias del servicio y de la página |
| **Capacitor** | Base del proyecto para una futura compilación móvil (no se usó en esta unidad) |

## 4. Requisitos previos e instalación

Se necesita tener instalado:

- **Node.js** (versión compatible con Angular 22).
- **npm**.
- Opcionalmente, la CLI de Ionic: `npm install -g @ionic/cli`.

Para instalar las dependencias del proyecto:

```bash
npm install
```

Para ejecutar las pruebas de extremo a extremo, se debe instalar el navegador de Playwright:

```bash
npx playwright install chromium
```

## 5. Comandos para ejecutar la aplicación

```bash
# Iniciar el servidor de desarrollo
npm start

# Compilar la aplicación para producción
npm run build

# Ejecutar las pruebas unitarias
npm run test:unit

# Ejecutar las pruebas de extremo a extremo
npm run test:e2e

# Revisar el estilo del código
npm run lint
```

## Comandos útiles

Ejecuta la aplicación con Ionic:

```bash
ionic serve
```

También puedes usar los comandos npm equivalentes:

```bash
# Iniciar el servidor de desarrollo (equivalente a ionic serve)
npm start

# Compilar la aplicación para producción
npm run build

# Ejecutar las pruebas unitarias
npm run test:unit

# Ejecutar las pruebas de extremo a extremo
npm run test:e2e

# Revisar el estilo del código
npm run lint
```

Después de `npm start` o `ionic serve`, la aplicación quedará disponible en `http://localhost:8100`.

## 6. Estructura de archivos

```text
src/
├── app/
│   ├── home/
│   │   ├── home.page.ts       # Estado, formulario y acciones de la pantalla
│   │   ├── home.page.html     # Interfaz con componentes de Ionic
│   │   ├── home.page.scss     # Estilos de la pantalla
│   │   └── home.page.spec.ts  # Pruebas de la página
│   ├── models/
│   │   └── task.model.ts      # Interfaz Task
│   ├── services/
│   │   ├── task.service.ts    # Gestión de tareas en memoria
│   │   └── task.service.spec.ts
│   ├── app.component.ts       # Componente raíz
│   ├── app.component.html
│   └── app.routes.ts          # Ruta principal hacia HomePage
├── theme/
│   └── variables.scss         # Paleta de colores base
├── global.scss                # Estilos globales de Ionic
└── main.ts                    # Arranque de Angular e Ionic
```

La estructura se mantuvo pequeña a propósito: una página, un modelo y un servicio. No se crearon capas que no aportaran valor a esta primera unidad.

## 7. Arquitectura Ionic + Angular

Ionic entrega componentes de interfaz que se comportan como **componentes web** y que Angular utiliza directamente en las plantillas. La aplicación se monta sobre `<ion-app>` y `<ion-router-outlet>`, definidos en `app.component.html`.

El arranque ocurre en `src/main.ts`, donde se registran `provideIonicAngular()` y las rutas de Angular. La ruta principal carga `HomePage` de forma diferida mediante `loadComponent`, lo que mantiene la aplicación ordenada y permite separar la pantalla principal del resto de la configuración.

```ts
export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];
```

La pantalla `HomePage` es un componente independiente (**Standalone**): declara sus propias importaciones (componentes de Ionic y `ReactiveFormsModule`) sin depender de un `NgModule`. Esto es parte de la arquitectura actual de Angular y es la forma en que Ionic genera el proyecto `blank`.

La separación de responsabilidades queda así:

- **Modelo (`Task`)**: define la forma de una tarea.
- **Servicio (`TaskService`)**: concentra las operaciones de agregar, actualizar y eliminar.
- **Página (`HomePage`)**: administra el formulario, el modo edición y la interacción con el usuario.

## 8. Componentes principales utilizados

| Componente | Propósito en la aplicación |
|------------|----------------------------|
| `ion-header`, `ion-toolbar`, `ion-title` | Encabezado de la aplicación con identidad visual y contador de tareas |
| `ion-content` | Área desplazable del contenido |
| `ion-card`, `ion-card-content` | Contenedor del formulario de tareas |
| `ion-input` | Campo para el título |
| `ion-textarea` | Campo para la descripción |
| `ion-button` | Acciones de agregar, guardar, cancelar, editar y eliminar |
| `ion-icon` | Apoyo visual de las acciones principales |
| `ion-list`, `ion-item`, `ion-label` | Listado de tareas con título y descripción |
| `ion-badge` | Contador de tareas registradas |
| `AlertController` | Confirmación antes de eliminar una tarea |

La interfaz adopta una estética de cuaderno: fondo crema, títulos en tipografía serif, acentos verde bosque y terracota, tarjetas que parecen papel y un estado vacío con una hoja. La paleta se define en `variables.scss` y los estilos de la pantalla en `home.page.scss`.

La navegación se resuelve con el enrutador de Angular y `ion-router-outlet`. En esta versión solo existe una pantalla, por lo que no se agregaron pestañas ni menús laterales.

## 9. Patrones de diseño aplicados

### Patrón de servicio

La lógica de las tareas no vive en la página, sino en `TaskService`. Así la pantalla se preocupa de la interfaz y el servicio de los datos.

```ts
addTask(title: string, description: string): void {
  const task: Task = { id: `${Date.now()}-this.nextId++`, title, description };
  this.tasksState.update((tasks) => [task, ...tasks]);
}
```

### Instancia única (Singleton) con inyección de dependencias

El servicio usa `providedIn: 'root'`, por lo que Angular crea una sola instancia y la comparte en toda la aplicación. La página lo obtiene con `inject(TaskService)`.

### Estado reactivo con señales (`signal`)

La lista se guarda en un `signal<Task[]>`. La plantilla se actualiza automáticamente cuando cambia la lista, sin necesidad de suscripciones manuales.

```ts
private readonly tasksState = signal<Task[]>([]);
readonly tasks = this.tasksState.asReadonly();
```

### Formularios reactivos

El formulario se define en TypeScript con `NonNullableFormBuilder`. Esto permite validar los campos y conocer su estado (`invalid`, `touched`) desde la clase, manteniendo la plantilla más limpia.

```ts
readonly taskForm = this.formBuilder.group({
  title: ['', [Validators.required, Validators.pattern(/\S/)]],
  description: ['', [Validators.required, Validators.pattern(/\S/)]],
});
```

### Validación con validadores de Angular

`Validators.required` cubre los campos vacíos y `Validators.pattern(/\S/)` exige al menos un carácter que no sea espacio. La misma regla se aplica a ambos campos y luego los valores se guardan con `trim()`.

### Separación entre contenedor y presentación

`HomePage` actúa como contenedor: maneja el estado y las acciones. Los componentes de Ionic se encargan de la presentación y de la interacción visual. Las alertas se crean mediante `AlertController`. Las confirmaciones de éxito se muestran dentro de la página, para no tapar el listado con una notificación flotante.

## 10. Funcionalidades implementadas

- **Visualizar tareas:** se muestran en una `ion-list`; cada `ion-item` presenta título y descripción. Si la lista está vacía, aparece un estado vacío con un mensaje amigable.
- **Agregar tareas:** el formulario valida que título y descripción no estén vacíos ni compuestos solo por espacios. Al guardar, la tarea se agrega al inicio de la lista y el formulario se limpia.
- **Editar tareas:** el botón de lápiz carga la tarea en el formulario, activa el modo edición y permite guardar o cancelar. La tarea editada conserva su `id`.
- **Eliminar tareas:** el botón de papelera abre una alerta de confirmación. Solo se elimina la tarea seleccionada y se muestra un aviso de confirmación.
- **Respuesta visual:** botón de guardar deshabilitado mientras el formulario es inválido, mensajes de error en los campos, contador de tareas y mensajes de éxito.

Los datos se mantienen **en memoria**. No existe base de datos ni almacenamiento local: el servicio conserva la lista únicamente mientras la aplicación está abierta. Al recargar la página, la lista vuelve a estar vacía, tal como se indicó para esta unidad.

## 11. Instrucciones para probar agregar, editar y eliminar

1. Ejecutar `npm start` y abrir `http://localhost:8100`.
2. **Agregar:** escribir un título y una descripción, y presionar **Agregar tarea**. La tarea debe aparecer inmediatamente y el formulario debe quedarse vacío.
3. **Validación:** intentar guardar con campos vacíos o con solo espacios. El botón permanece deshabilitado y, al tocar los campos, se muestran los mensajes de error.
4. **Editar:** presionar el ícono de lápiz de una tarea. Los datos deben cargarse en el formulario y el encabezado debe indicar el modo edición. Modificar los campos y presionar **Guardar cambios**.
5. **Cancelar edición:** presionar **Cancelar edición** y verificar que el formulario se limpia sin modificar la tarea.
6. **Eliminar:** presionar el ícono de papelera, confirmar en la alerta y verificar que solo desaparece la tarea seleccionada.
7. **Estado vacío:** eliminar todas las tareas y comprobar que aparece el mensaje "Aún no tienes tareas".

## 12. Limitaciones actuales

- Los datos se pierden al recargar la aplicación porque no se utiliza almacenamiento local ni servidor.
- No existen usuarios, autenticación ni sincronización entre dispositivos.
- No se pueden marcar tareas como completadas, ordenarlas ni buscarlas.
- Las pruebas de extremo a extremo (end-to-end) se ejecutan en un navegador, no en un dispositivo móvil real.
- No se generó una compilación nativa para Android o iOS en esta unidad.

## 13. Posibles mejoras para las próximas unidades

- Guardar las tareas con `localStorage` o con Capacitor Preferences.
- Agregar un estado "completada" y un filtro para ver tareas pendientes.
- Incorporar búsqueda, ordenamiento y fechas de vencimiento.
- Separar el formulario y la tarjeta de tarea en componentes reutilizables.
- Ampliar las pruebas de extremo a extremo con Playwright para cubrir más casos.
- Integrar un servidor o una API para persistir los datos.
- Compilar y probar la aplicación en un dispositivo Android o iOS con Capacitor.

## 14. Verificación del proyecto

Durante el desarrollo se ejecutaron las siguientes verificaciones:

```bash
npm run build
npm run test:unit
npm run test:e2e
npm run lint
```

- La compilación de producción finaliza correctamente.
- Las pruebas unitarias cubren el alta, la actualización y la eliminación en `TaskService`, además del comportamiento del formulario y del modo edición en `HomePage`.
- La prueba de extremo a extremo recorre el flujo completo: agregar una tarea, editarla, confirmar su eliminación y volver al estado vacío.
- El lint de Angular, TypeScript y Prettier no reporta errores.

Para revisar la interfaz en distintos tamaños, se puede abrir la aplicación en el navegador y usar las herramientas de desarrollo con vista adaptable (por ejemplo, un ancho de 390 px para celular y 768 px o más para tablet/escritorio).