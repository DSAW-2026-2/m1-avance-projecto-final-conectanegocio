# AI Log — Integración M1

## Uso

Se utilizó Codex de OpenAI como apoyo para consolidar los avances de HW3, HW4 y HW5, revisar los requisitos de M1, estructurar la documentación, integrar el prototipo estático y ejecutar comprobaciones de calidad.

## Trabajo realizado con asistencia

- Inventario y comparación de las entregas anteriores.
- Consolidación del problem statement y los enlaces.
- Propuesta del recorrido comerciante–proveedor.
- Integración de las pantallas de ofertas, comparación, chat, pedido, seguimiento y proveedor.
- Revisión de HTML semántico, formularios, navegación por teclado y diseño responsive.
- Pruebas estructurales y funcionales automatizadas sobre datos ficticios.

## Revisión humana necesaria

- Confirmar que los frames de Figma corresponden con todas las pantallas publicadas.
- Revisar redacción, identidad visual y datos del caso real.
- Probar manualmente el sitio publicado en móvil, tableta y escritorio.
- Mantener contribuciones auténticas de los cuatro integrantes del equipo.

## Datos

Sol y Luna es el caso real que fundamenta el problema. Los perfiles, proveedores, productos, precios, mensajes y pedidos utilizados por el prototipo son ficticios.

## Prompt utilizado para la reorganización y el registro local

El siguiente prompt fue suministrado íntegramente para esta actualización:

````text
Actúa como desarrollador frontend especializado en organización de proyectos, HTML semántico, CSS mantenible, accesibilidad y diseño responsive.

Debes reorganizar y refactorizar este proyecto web sin cambiar su contenido, apariencia general ni funcionamiento. Antes de modificar archivos, inspecciona completamente el repositorio, identifica las dependencias entre HTML, CSS y JavaScript, y revisa qué clases, atributos `id`, rutas, módulos y valores de `localStorage` forman parte del comportamiento actual.

OBJETIVO PRINCIPAL

Reorganizar el proyecto para conseguir:

1. Una carpeta por cada tipo principal de archivo.
2. Los archivos principales del proyecto permanecen en la raíz.
3. Todo el CSS debe estar en archivos externos.
4. Todo el JavaScript debe estar en archivos externos.
5. Los HTML deben quedar limpios, semánticos, correctamente indentados y fáciles de leer.
6. La estructura visual debe construirse principalmente con CSS Grid.
7. Flexbox debe utilizarse solamente cuando sea claramente más apropiado para una distribución unidimensional.
8. El proyecto debe conservar exactamente su navegación, funcionalidades, contenido, accesibilidad y comportamiento responsive.
9. El sitio debe continuar funcionando correctamente en GitHub Pages.

ESTRUCTURA DE CARPETAS DESEADA

Utiliza como base esta estructura:

proyecto/
├── index.html
├── README.md
├── pages/
│   ├── chat.html
│   ├── comerciante.html
│   ├── comparador.html
│   ├── ofertas.html
│   ├── pedido.html
│   ├── proveedor.html
│   └── seguimiento.html
├── css/
│   ├── tokens.css
│   ├── reset.css
│   ├── base.css
│   ├── layout.css
│   ├── components.css
│   ├── utilities.css
│   └── pages/
│       ├── home.css
│       ├── comerciante.css
│       ├── ofertas.css
│       ├── comparador.css
│       ├── chat.css
│       ├── pedido.css
│       ├── seguimiento.css
│       └── proveedor.css
├── js/
│   ├── theme-init.js
│   ├── main.js
│   └── validation.js
└── docs/
    ├── AI-LOG.md
    ├── Links.md
    ├── WIREFRAMES.md
    └── figma-link.txt

Considera `index.html` y `README.md` como los archivos principales que deben permanecer en la raíz.

Si durante la inspección encuentras una razón técnica importante para ajustar esta estructura, explica la razón antes de hacerlo. No crees carpetas vacías ni archivos innecesarios.

FASE 1: INSPECCIÓN PREVIA

Antes de editar:

1. Genera una lista completa de archivos.
2. Revisa todos los HTML.
3. Revisa completamente `styles.css`.
4. Revisa completamente `main.js` y `validation.js`.
5. Identifica:
   - Rutas entre páginas.
   - Referencias a CSS y JavaScript.
   - Importaciones entre módulos JavaScript.
   - Selectores JavaScript basados en clases.
   - Selectores JavaScript basados en `id`.
   - Atributos `data-*`.
   - Formularios y sus validaciones.
   - Uso de `localStorage`.
   - Navegación principal.
   - Enlaces externos.
   - Elementos generados dinámicamente.
   - Clases de estado como tema oscuro, elementos ocultos, errores o estados activos.
6. Crea una relación entre cada selector CSS existente y el componente o página al cual pertenece.
7. Identifica reglas CSS duplicadas o demasiado específicas.

No cambies nombres de `id`, atributos `name`, atributos `data-*` ni clases usadas desde JavaScript sin actualizar y verificar todas sus referencias.

FASE 2: REORGANIZACIÓN DE ARCHIVOS

Realiza los siguientes movimientos:

1. Mantén `index.html` en la raíz.
2. Mueve las demás páginas HTML a `pages/`.
3. Mueve los archivos JavaScript a `js/`.
4. Divide el CSS actual y muévelo a `css/`.
5. Mueve la documentación secundaria a `docs/`.
6. Mantén `README.md` en la raíz.
7. Actualiza todas las rutas relativas después de mover los archivos.

No dupliques archivos para conservar rutas antiguas. Debe existir una única versión de cada archivo.

RUTAS QUE DEBEN REVISARSE

Desde `index.html`, las rutas deben seguir este patrón:

- CSS: `css/archivo.css`
- JavaScript: `js/archivo.js`
- Páginas: `pages/nombre.html`
- Documentación: `docs/archivo.md`

Desde los HTML ubicados en `pages/`, las rutas deben seguir este patrón:

- Inicio: `../index.html`
- CSS: `../css/archivo.css`
- CSS específico: `../css/pages/archivo.css`
- JavaScript: `../js/archivo.js`
- Otra página: `nombre.html`
- Documentación: `../docs/archivo.md`

Revisa también las rutas creadas desde JavaScript. Si el código utiliza cadenas como `"index.html"`, `"pedido.html"` o `"seguimiento.html"`, determina desde qué documento se resuelven y actualízalas cuando sea necesario.

Ten especial cuidado con GitHub Pages:

- Usa rutas relativas.
- No uses rutas que comiencen con `/`.
- Respeta exactamente mayúsculas y minúsculas.
- No dependas de rutas absolutas del computador.
- Verifica que todos los enlaces funcionen desde la URL del repositorio.

FASE 3: SIMPLIFICACIÓN DEL HTML

Refactoriza todos los HTML para que sean semánticos y fáciles de leer.

Cada documento debe incluir:

1. `<!doctype html>`.
2. Atributo `lang="es"` en `<html>`.
3. `<meta charset="UTF-8">`.
4. Metaetiqueta viewport.
5. Un `<title>` descriptivo.
6. Enlaces a los CSS externos requeridos.
7. Scripts externos correctamente ubicados.
8. Una estructura clara con:
   - `<header>`
   - `<nav>`
   - `<main>`
   - `<section>`
   - `<article>`
   - `<aside>`
   - `<footer>`
   - `<form>`, cuando corresponda
9. Un único `<h1>` principal por página.
10. Jerarquía lógica de encabezados.
11. Atributos de accesibilidad existentes.

FORMATO DEL HTML

Actualmente existen fragmentos con muchos elementos en una sola línea. Expándelos y aplica indentación consistente de dos espacios.

Ejemplo incorrecto:

<header><div class="container"><nav><ul><li><a href="index.html">Inicio</a></li></ul></nav></div></header>

Ejemplo esperado:

<header class="site-header">
  <div class="container header-layout">
    <nav class="site-nav" aria-label="Navegación principal">
      <ul class="nav-list">
        <li>
          <a href="../index.html">Inicio</a>
        </li>
      </ul>
    </nav>
  </div>
</header>

ELIMINACIÓN DE ESTILOS DEL HTML

No debe quedar:

- Ningún atributo `style=""`.
- Ninguna etiqueta `<style>`.
- Ningún CSS incrustado.
- Ningún atributo HTML usado únicamente para simular presentación.
- Clases como `red`, `big`, `left` o `margin-20` que describan apariencia sin expresar propósito.

Todo el estilo debe vivir en los archivos de `css/`.

SEPARACIÓN DEL JAVASCRIPT

También elimina el JavaScript incrustado en los HTML.

El código actual que inicializa el tema debe trasladarse a:

`js/theme-init.js`

Carga ese archivo desde el `<head>` sin `defer` si es necesario ejecutarlo antes del primer renderizado para evitar el parpadeo entre tema claro y oscuro:

Desde `index.html`:

<script src="js/theme-init.js"></script>

Desde páginas internas:

<script src="../js/theme-init.js"></script>

Carga el módulo principal con una ruta apropiada:

Desde `index.html`:

<script type="module" src="js/main.js"></script>

Desde páginas internas:

<script type="module" src="../js/main.js"></script>

No cambies el comportamiento de `localStorage` ni las claves existentes.

SIMPLIFICACIÓN RESPONSABLE

“Dejar el HTML básico” no significa eliminar contenido ni elementos necesarios.

Puedes:

- Eliminar contenedores redundantes.
- Reemplazar un `<div>` por un elemento semántico cuando sea correcto.
- Mejorar indentación y legibilidad.
- Agrupar contenido relacionado.
- Eliminar clases que no se usan.
- Reducir anidaciones que no tengan función estructural, visual o semántica.

No debes:

- Eliminar controles.
- Eliminar textos.
- Eliminar estados vacíos.
- Eliminar mensajes de validación.
- Eliminar atributos ARIA necesarios.
- Eliminar `id` usados por JavaScript.
- Cambiar el orden funcional del recorrido.
- Reemplazar botones por enlaces o enlaces por botones sin evaluar su función.
- Convertir tablas de datos en grupos de `<div>`.
- Sacrificar accesibilidad para reducir etiquetas.

FASE 4: ARQUITECTURA DEL CSS

Divide el CSS por responsabilidad.

`tokens.css`

Debe contener exclusivamente variables globales:

- Colores.
- Tipografía.
- Espaciado.
- Anchos máximos.
- Bordes.
- Radios.
- Sombras.
- Capas `z-index`.
- Transiciones.
- Puntos de quiebre, si se documentan como referencia.

Ejemplo:

:root {
  --color-primary: #2563eb;
  --color-text: #1f2937;
  --color-surface: #ffffff;
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 2rem;
  --container-width: 75rem;
  --radius-md: 0.5rem;
}

`reset.css`

Debe contener solamente normalización y reinicio básico:

- `box-sizing`.
- Márgenes generales.
- Imágenes responsive.
- Herencia tipográfica de controles.
- Comportamiento básico de tablas y listas.

`base.css`

Debe contener estilos globales de elementos:

- `html`.
- `body`.
- Encabezados.
- Párrafos.
- Enlaces.
- Formularios.
- Tablas.
- Tema claro y oscuro.

Los selectores de etiquetas se permiten aquí cuando representan valores base.

`layout.css`

Debe contener estructuras compartidas:

- `.container`
- `.site-header`
- `.header-layout`
- `.site-footer`
- `.footer-layout`
- `.main-content`
- `.section`
- `.page-hero`
- `.two-column-layout`
- Grillas generales.

`components.css`

Debe contener componentes reutilizables:

- Botones.
- Paneles.
- Tarjetas.
- Navegación.
- Breadcrumbs.
- Métricas.
- Formularios.
- Estados vacíos.
- Avisos.
- Tablas.
- Estados de pedido.
- Toast.
- Timeline.

`utilities.css`

Debe contener solamente utilidades pequeñas y justificadas:

- `.sr-only`
- `.skip-link`
- Estados visuales generales.
- Helpers realmente reutilizables.

No conviertas todas las propiedades en clases utilitarias. El proyecto debe seguir una arquitectura basada en componentes.

`css/pages/*.css`

Cada archivo de página debe contener exclusivamente estilos que no se reutilicen fuera de esa página.

Ejemplos:

- `home.css`: hero y secciones exclusivas de inicio.
- `ofertas.css`: filtros y tabla del catálogo.
- `comparador.css`: grilla de comparación.
- `chat.css`: conversación y formulario de mensajes.
- `pedido.css`: formulario y resumen del pedido.
- `seguimiento.css`: historial y recepción.
- `proveedor.css`: panel específico del proveedor.

Si una regla se usa en dos o más páginas, evalúa moverla a `layout.css` o `components.css`.

ORDEN DE CARGA DEL CSS

Carga primero los estilos globales y al final el archivo específico de la página:

<link rel="stylesheet" href="../css/tokens.css">
<link rel="stylesheet" href="../css/reset.css">
<link rel="stylesheet" href="../css/base.css">
<link rel="stylesheet" href="../css/layout.css">
<link rel="stylesheet" href="../css/components.css">
<link rel="stylesheet" href="../css/utilities.css">
<link rel="stylesheet" href="../css/pages/ofertas.css">

En `index.html`, elimina `../`:

<link rel="stylesheet" href="css/tokens.css">
<link rel="stylesheet" href="css/reset.css">
<link rel="stylesheet" href="css/base.css">
<link rel="stylesheet" href="css/layout.css">
<link rel="stylesheet" href="css/components.css">
<link rel="stylesheet" href="css/utilities.css">
<link rel="stylesheet" href="css/pages/home.css">

No uses `@import` para unir los archivos, salvo que exista una razón técnica documentada. Prefiere enlaces `<link>` porque hacen explícitas las dependencias de cada página.

FASE 5: NOMENCLATURA DE CLASES

Usa clases semánticas basadas en la función del elemento.

Nombres apropiados:

- `.product-card`
- `.product-card__title`
- `.product-card__price`
- `.product-card--selected`
- `.order-summary`
- `.site-navigation`
- `.form-field`
- `.comparison-grid`

Evita nombres puramente visuales:

- `.blue-box`
- `.big-text`
- `.left-column`
- `.margin-top-20`
- `.three-items`

Utiliza una convención inspirada en BEM cuando ayude a entender componentes:

- Bloque: `.product-card`
- Elemento: `.product-card__title`
- Modificador: `.product-card--selected`

No es necesario renombrar todas las clases actuales si ya son claras. Evita una refactorización masiva sin beneficio.

REGLAS PARA LOS SELECTORES

1. Prioriza clases.
2. Usa selectores de etiquetas solamente en `reset.css` y `base.css`.
3. No uses `id` para aplicar estilos.
4. Conserva los `id` como enlaces, relaciones accesibles o puntos de integración con JavaScript.
5. Evita `!important`.
6. Evita selectores profundamente anidados.
7. Evita dependencias rígidas de la estructura HTML.

Evita:

main section div article h2 {
  color: blue;
}

Prefiere:

.product-card__title {
  color: var(--color-primary);
}

FASE 6: CSS GRID COMO SISTEMA PRINCIPAL

CSS Grid debe ser la herramienta principal de layout.

Utiliza Grid para:

- Estructura general de las páginas.
- Encabezado y pie de página.
- Columnas principales.
- Paneles.
- Listados de tarjetas.
- Métricas.
- Formularios.
- Filtros.
- Comparadores.
- Hero principal.
- Distribuciones responsive.
- Alineación de componentes que tengan filas y columnas.

Ejemplos recomendados:

.card-grid {
  display: grid;
  grid-template-columns: repeat(
    auto-fit,
    minmax(min(100%, 16rem), 1fr)
  );
  gap: var(--space-lg);
}

.two-column-layout {
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(18rem, 1fr);
  gap: var(--space-lg);
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-md);
}

.full-field {
  grid-column: 1 / -1;
}

GRID RESPONSIVE

Trabaja con enfoque mobile-first.

La estructura base debe funcionar en una columna:

.two-column-layout {
  display: grid;
  gap: var(--space-md);
}

Después añade columnas en pantallas amplias:

@media (width >= 48rem) {
  .two-column-layout {
    grid-template-columns: minmax(0, 2fr) minmax(16rem, 1fr);
  }
}

Usa preferentemente:

- `repeat()`.
- `minmax()`.
- `auto-fit`.
- `auto-fill`.
- `gap`.
- `grid-column`.
- `place-items`.
- `align-items`.
- `justify-items`.

Evita anchos rígidos que produzcan desplazamiento horizontal.

USO LIMITADO DE FLEXBOX

Flexbox está permitido cuando el componente sea naturalmente unidimensional, por ejemplo:

- Una fila pequeña de botones.
- Un grupo de icono y texto.
- Una navegación horizontal simple.
- Una fila de acciones que no necesite alineación en dos dimensiones.

Antes de usar `display: flex`, verifica si Grid puede expresar la estructura de manera más clara.

No reemplaces Flexbox por Grid de forma artificial cuando Flexbox sea evidentemente la herramienta correcta. El objetivo es priorizar Grid, no prohibir Flexbox completamente.

FASE 7: RESPONSIVE Y ACCESIBILIDAD

Conserva o mejora:

- Enlace “Saltar al contenido”.
- Navegación mediante teclado.
- Estados `:focus-visible`.
- Contraste de color.
- Etiquetas de formularios.
- Mensajes de error con `aria-live`.
- `aria-current`.
- `aria-expanded`.
- `aria-controls`.
- `aria-describedby`.
- Textos ocultos con `.sr-only`.
- Tablas semánticas.
- Estados `hidden`.
- Botones con `type`.
- Enlaces con destinos válidos.

Respeta:

- `prefers-reduced-motion`.
- Tamaños táctiles razonables.
- Texto legible sin depender de zoom.
- Ausencia de desplazamiento horizontal accidental.
- Tema oscuro existente.

No uses JavaScript para resolver distribuciones que puedan hacerse con CSS Grid.

FASE 8: PRESERVACIÓN DEL COMPORTAMIENTO

El resultado debe conservar:

- Cambio de tema.
- Menú móvil.
- Navegación entre todas las páginas.
- Catálogo de ofertas.
- Filtros y ordenamiento.
- Comparación de ofertas.
- Chat contextual.
- Creación de pedidos.
- Validaciones.
- Panel del comerciante.
- Panel del proveedor.
- Seguimiento del pedido.
- Restauración de la demostración.
- Datos guardados en `localStorage`.
- Contenido generado dinámicamente.

No cambies las claves existentes de `localStorage`.

No cambies los datos simulados salvo que sea indispensable para corregir un error real.

No cambies textos, nombres, precios, estados ni contenidos sin autorización.

FASE 9: ACTUALIZACIÓN DE DOCUMENTACIÓN

Después de mover los archivos:

1. Actualiza los enlaces relativos dentro de `README.md`.
2. Actualiza los enlaces de `docs/Links.md`.
3. Actualiza las referencias a `WIREFRAMES.md`.
4. Revisa referencias de documentación entre archivos.
5. Mantén un único enlace de Figma en el README si esa condición ya existe.
6. Conserva la tabla de contribuciones de los cuatro integrantes.
7. Documenta la nueva estructura de carpetas en el README.
8. Actualiza las instrucciones para ejecutar el proyecto localmente si fuera necesario.

FASE 10: LIMPIEZA

Elimina únicamente:

- CSS duplicado.
- Selectores sin uso confirmado.
- Clases sin uso confirmado.
- Contenedores HTML redundantes.
- Archivos antiguos que hayan sido reemplazados completamente.
- Referencias obsoletas después del movimiento.

Antes de eliminar un selector o una clase, búscalo en todos los HTML y JavaScript.

No elimines código solo porque no aparezca directamente en el HTML: puede ser generado dinámicamente por JavaScript.

No dejes:

- Copias del `styles.css` original.
- Archivos temporales.
- Versiones duplicadas.
- Rutas antiguas.
- Comentarios que ya no describan el código.
- Carpetas vacías.

FASE 11: VERIFICACIÓN OBLIGATORIA

Al finalizar, realiza estas comprobaciones:

1. Lista la estructura final.
2. Busca estilos incrustados:

   - No debe existir `style=`.
   - No debe existir `<style>`.

3. Busca JavaScript incrustado:

   - No deben quedar bloques `<script>` con código interno.
   - Los scripts deben usar `src`.

4. Busca rutas antiguas:

   - `href="styles.css"`
   - `src="main.js"`
   - `src="validation.js"`

5. Comprueba que todos los archivos referenciados existan.
6. Comprueba las importaciones JavaScript.
7. Comprueba que no haya errores de sintaxis.
8. Ejecuta el proyecto con un servidor HTTP local.
9. Recorre manualmente todas las páginas.
10. Comprueba navegación en ambos sentidos.
11. Prueba el tema oscuro.
12. Prueba el menú móvil.
13. Prueba filtros y comparación.
14. Prueba chat, pedido y seguimiento.
15. Prueba el panel del proveedor.
16. Prueba formularios inválidos y válidos.
17. Comprueba el diseño en:
    - Pantalla móvil.
    - Tableta.
    - Escritorio.
18. Comprueba que no exista desplazamiento horizontal accidental.
19. Comprueba que los elementos interactivos tengan foco visible.
20. Ejecuta `git diff --check`.
21. Revisa `git diff` para confirmar que no se haya alterado contenido accidentalmente.

CRITERIOS DE ACEPTACIÓN

La tarea solamente se considera terminada si:

- `index.html` y `README.md` permanecen en la raíz.
- Las demás páginas están dentro de `pages/`.
- Todo JavaScript está dentro de `js/`.
- Todo CSS está dentro de `css/`.
- La documentación secundaria está dentro de `docs/`.
- No hay CSS inline ni etiquetas `<style>`.
- No hay JavaScript inline.
- Todos los HTML están correctamente indentados.
- La estructura HTML es semántica.
- Los estilos están organizados por responsabilidades.
- Los selectores CSS se basan principalmente en clases.
- No se utilizan `id` como selectores CSS.
- Grid es el sistema principal de layout.
- Flexbox solo se usa de manera puntual y justificada.
- El diseño sigue siendo responsive.
- El tema oscuro continúa funcionando.
- Todos los enlaces funcionan.
- Todas las funciones JavaScript continúan funcionando.
- GitHub Pages continúa siendo compatible.
- No hay archivos duplicados ni rutas rotas.
- El README conserva un único enlace de Figma.
- El README conserva las contribuciones de los cuatro integrantes.
- `git diff --check` finaliza sin errores.

FORMA DE TRABAJO

Trabaja en fases pequeñas y verificables.

1. Inspecciona.
2. Presenta un resumen breve del estado actual.
3. Define el mapa de movimientos.
4. Reorganiza los archivos.
5. Actualiza rutas.
6. Refactoriza HTML.
7. Divide y organiza CSS.
8. Verifica JavaScript.
9. Actualiza documentación.
10. Ejecuta las pruebas.
11. Presenta el resultado final.

No realices un rediseño visual. No agregues frameworks, dependencias, compiladores ni herramientas externas. Usa exclusivamente HTML, CSS y JavaScript nativo.

ENTREGA FINAL

Al terminar, informa:

1. Qué archivos se movieron.
2. Qué archivos se crearon.
3. Qué archivos se eliminaron.
4. Cómo quedó organizada la arquitectura CSS.
5. Dónde se utilizó CSS Grid.
6. En qué casos se mantuvo Flexbox y por qué.
7. Qué simplificaciones se hicieron en los HTML.
8. Qué rutas se actualizaron.
9. Qué verificaciones se ejecutaron.
10. Si existe algún riesgo o aspecto pendiente.

Incluye la estructura final del proyecto y un resumen conciso de las pruebas.



-------- SIGUIENTE ACTIVIDAD -----------

FASE ADICIONAL: MÓDULO DE REGISTRO LOCAL

Después de completar la reorganización de carpetas, la separación del CSS, la limpieza de los HTML y la actualización de todas las rutas, implementa un módulo demostrativo de registro de usuarios.

Este módulo forma parte de un prototipo académico. No debe presentarse como un sistema real de autenticación ni como un mecanismo seguro para producción.

OBJETIVOS

El módulo debe permitir:

1. Abrir un formulario de registro desde la landing page.
2. Solicitar los datos básicos del usuario.
3. Validar los campos en el navegador.
4. Guardar los usuarios registrados en `localStorage`.
5. Detectar registros duplicados.
6. Mostrar una notificación centrada si el usuario ya existe.
7. Simular la activación de autenticación de dos factores.
8. Conservar accesibilidad, diseño responsive y coherencia visual.
9. Mantener HTML, CSS y JavaScript completamente separados.
10. Utilizar clases para los estilos y CSS Grid para la estructura principal.

LIMITACIONES DEL PROTOTIPO

Este registro será exclusivamente demostrativo:

- No habrá servidor.
- No habrá base de datos.
- No habrá sesiones reales.
- No se enviarán correos electrónicos ni mensajes SMS.
- No se generarán códigos 2FA reales.
- No se debe afirmar que el usuario quedó autenticado.
- Los datos solo existirán en el navegador y dispositivo actuales.
- Borrar los datos del navegador eliminará los usuarios registrados.
- No debe almacenarse la contraseña en texto plano.
- El módulo debe indicar claramente que se trata de una demostración local.

UBICACIÓN DEL BOTÓN

Añade un botón visible en la zona superior izquierda de la landing page `index.html`.

Debe ubicarse dentro del encabezado, cerca de la identidad visual de ConectaNegocio, sin reemplazar ni ocultar el logotipo.

Estructura conceptual:

<header class="site-header">
  <div class="container header-layout">
    <div class="header-identity">
      <a class="brand" href="index.html">
        ...
      </a>

      <button
        class="button button--register"
        id="open-registration"
        type="button"
        aria-haspopup="dialog"
        aria-controls="registration-dialog"
      >
        Registrar usuario
      </button>
    </div>

    ...
  </div>
</header>

Aunque el botón debe aparecer en la zona superior izquierda, no debe afectar negativamente la navegación ni producir desbordamientos en dispositivos móviles.

En pantallas pequeñas, la estructura puede reorganizarse mediante CSS Grid, pero el botón debe seguir apareciendo cerca de la marca y antes de la navegación principal.

No utilices estilos inline para posicionarlo.

COMPORTAMIENTO DEL BOTÓN

Al activar “Registrar usuario”:

1. Abre un cuadro de diálogo de registro.
2. Mueve el foco al título o al primer campo.
3. Impide la interacción accidental con el contenido ubicado detrás.
4. Permite cerrar el diálogo:
   - Con un botón visible.
   - Con la tecla Escape.
   - Después de un registro exitoso.
5. Al cerrarse, devuelve el foco al botón que lo abrió.

Utiliza preferentemente el elemento nativo `<dialog>` si es compatible con la arquitectura actual.

No navegues a otra página para registrar al usuario, salvo que exista una razón técnica importante. El registro debe sentirse como una acción disponible directamente desde la landing page.

FORMULARIO DE REGISTRO

El formulario debe solicitar los siguientes datos:

1. Nombre real del usuario.
2. Tipo de usuario:
   - Comerciante.
   - Distribuidor.
3. Cargo dentro de la empresa.
4. Contraseña.
5. Activación de autenticación de dos factores.

ESTRUCTURA HTML ORIENTATIVA

Implementa una estructura semántica similar a esta, adaptándola al diseño existente:

<dialog
  class="registration-dialog"
  id="registration-dialog"
  aria-labelledby="registration-title"
  aria-describedby="registration-description"
>
  <section class="registration">
    <header class="registration__header">
      <div>
        <p class="eyebrow">Cuenta demostrativa</p>
        <h2 id="registration-title">Registrar usuario</h2>
        <p id="registration-description">
          Este registro se guardará únicamente en este navegador.
        </p>
      </div>

      <button
        class="icon-button registration__close"
        id="close-registration"
        type="button"
        aria-label="Cerrar formulario de registro"
      >
        ×
      </button>
    </header>

    <form id="registration-form" novalidate>
      ...
    </form>
  </section>
</dialog>

La estructura exacta puede variar, pero debe conservar:

- Semántica.
- Accesibilidad.
- Identificadores necesarios para JavaScript.
- Etiquetas visibles.
- Mensajes de ayuda y error.
- Botones con tipos correctos.
- Código correctamente indentado.

CAMPO: NOMBRE REAL

Incluye un campo de texto:

- Etiqueta visible: “Nombre completo”.
- `name="fullName"`.
- `autocomplete="name"`.
- Obligatorio.
- Longitud mínima: 3 caracteres.
- Longitud máxima: 80 caracteres.
- Debe aceptar espacios, tildes, diéresis, apóstrofos y guiones.
- Debe eliminar espacios al inicio y al final.
- Debe convertir espacios consecutivos en un solo espacio.
- No debe aceptar un valor compuesto únicamente por espacios.

Ejemplo:

<label for="registration-full-name">
  Nombre completo
</label>

<input
  id="registration-full-name"
  name="fullName"
  type="text"
  autocomplete="name"
  minlength="3"
  maxlength="80"
  required
  aria-describedby="registration-full-name-error"
>

<small
  class="field-error"
  id="registration-full-name-error"
  data-error-for="fullName"
  aria-live="polite"
></small>

No bloquees nombres reales por utilizar una expresión regular excesivamente restrictiva.

CAMPO: TIPO DE USUARIO

Incluye un selector obligatorio con exactamente estas opciones:

- Seleccione una opción.
- Comerciante.
- Distribuidor.

Ejemplo:

<label for="registration-role">
  Tipo de usuario
</label>

<select
  id="registration-role"
  name="role"
  required
  aria-describedby="registration-role-error"
>
  <option value="">Seleccione una opción</option>
  <option value="merchant">Comerciante</option>
  <option value="distributor">Distribuidor</option>
</select>

El valor almacenado debe ser estable y fácil de procesar. Utiliza identificadores internos como `merchant` y `distributor`, pero muestra las etiquetas en español.

No utilices “proveedor” y “distribuidor” como valores intercambiables dentro de los datos. Para este formulario, el valor solicitado es “Distribuidor”.

CAMPO: CARGO EN LA EMPRESA

Incluye un campo de texto:

- Etiqueta: “Cargo dentro de la empresa”.
- `name="jobTitle"`.
- Obligatorio.
- Longitud mínima: 2 caracteres.
- Longitud máxima: 60 caracteres.
- Elimina espacios exteriores.
- Normaliza espacios consecutivos.

Ejemplos de valores:

- Administrador.
- Propietaria.
- Gerente comercial.
- Asesor de ventas.
- Encargado de distribución.

CAMPO: CONTRASEÑA

Incluye un campo de contraseña:

- Etiqueta: “Contraseña”.
- `type="password"`.
- `name="password"`.
- Obligatorio.
- `autocomplete="new-password"`.
- Longitud mínima: 8 caracteres.
- Longitud máxima razonable: 128 caracteres.
- Debe contener al menos una letra y un número.
- Permite caracteres especiales.
- No elimines espacios internos automáticamente.
- Incluye un botón accesible para mostrar u ocultar la contraseña.
- El botón debe actualizar su etiqueta y `aria-pressed`.

Muestra una ayuda como:

“La contraseña debe contener al menos 8 caracteres, una letra y un número.”

No almacenes la contraseña en texto plano en `localStorage`.

Para este prototipo, procesa la contraseña con Web Crypto antes de guardarla:

1. Genera un `salt` aleatorio por usuario mediante `crypto.getRandomValues`.
2. Combina la contraseña con el `salt`.
3. Calcula un hash con `crypto.subtle.digest("SHA-256", ...)`.
4. Guarda únicamente:
   - El hash.
   - El salt.
5. Nunca guardes el valor original.
6. No imprimas la contraseña en consola.
7. No incluyas la contraseña en notificaciones o mensajes de error.

Aclara mediante un comentario breve que SHA-256 en el navegador no convierte este prototipo en un sistema de autenticación seguro. Un producto real necesitaría backend, HTTPS, una función especializada para contraseñas y controles adicionales.

No agregues un campo de confirmación de contraseña, porque no fue solicitado. Si consideras que es indispensable, no lo agregues silenciosamente: menciónalo como recomendación final.

CAMPO: AUTENTICACIÓN DE DOS FACTORES

Implementa una opción para activar autenticación de dos factores:

- Etiqueta: “Activar autenticación de dos factores”.
- Puede implementarse como checkbox o switch accesible.
- Debe incluir una explicación clara.
- No debe simular el envío real de códigos.
- Guarda únicamente una propiedad booleana.

Ejemplo:

<input
  id="registration-two-factor"
  name="twoFactorEnabled"
  type="checkbox"
  aria-describedby="registration-two-factor-hint"
>

<label for="registration-two-factor">
  Activar autenticación de dos factores
</label>

<small id="registration-two-factor-hint" class="field-hint">
  Función demostrativa: no se enviarán códigos reales.
</small>

Si está activada, el registro guardado debe contener:

`twoFactorEnabled: true`

Si no está activada:

`twoFactorEnabled: false`

No solicites número telefónico, correo electrónico ni aplicación autenticadora, porque esos datos no fueron incluidos en los requisitos actuales.

BOTONES DEL FORMULARIO

Incluye:

1. Botón principal:
   - Texto: “Crear cuenta demostrativa”.
   - `type="submit"`.

2. Botón secundario:
   - Texto: “Cancelar”.
   - `type="button"`.
   - Debe cerrar el diálogo sin guardar datos.

Durante el procesamiento:

- Deshabilita temporalmente el botón principal.
- Muestra un texto como “Registrando…”.
- Evita múltiples envíos simultáneos.
- Restaura el botón si ocurre un error.
- No cierres el diálogo si la validación falla.

ARCHIVOS DEL MÓDULO

Después de ejecutar la reorganización del proyecto, crea como mínimo:

`js/registration.js`

Este archivo debe encargarse de:

- Abrir y cerrar el diálogo.
- Administrar el foco.
- Validar el formulario.
- Normalizar datos.
- Consultar `localStorage`.
- Detectar duplicados.
- Procesar la contraseña.
- Guardar usuarios.
- Mostrar notificaciones.
- Limpiar el formulario tras un registro exitoso.
- Exportar únicamente las funciones que realmente deban ser reutilizadas.

Los estilos compartidos del diálogo, formulario y notificación deben ubicarse en:

`css/components.css`

Los estilos que sean exclusivos del registro de la landing page pueden ubicarse en:

`css/pages/home.css`

No crees un archivo CSS separado si solamente contendría unas pocas reglas que pertenecen claramente a un componente compartido o a la página de inicio.

Integra el módulo desde `js/main.js` mediante una importación como:

import { initializeRegistration } from "./registration.js";

Inicialízalo únicamente si existen los elementos del registro:

initializeRegistration();

La función debe tolerar páginas que no contienen el formulario:

export function initializeRegistration() {
  const form = document.querySelector("#registration-form");

  if (!form) {
    return;
  }

  // Inicialización.
}

No debe producir errores en las demás páginas.

ESTRUCTURA DE DATOS EN LOCALSTORAGE

Utiliza una clave única y explícita:

`cn-registered-users`

Guarda un arreglo JSON.

Cada usuario puede seguir esta estructura:

{
  "id": "UUID generado por crypto.randomUUID()",
  "fullName": "Carolina Pérez",
  "normalizedFullName": "carolina perez",
  "role": "merchant",
  "jobTitle": "Administradora",
  "normalizedJobTitle": "administradora",
  "passwordHash": "...",
  "passwordSalt": "...",
  "twoFactorEnabled": true,
  "createdAt": "fecha ISO"
}

No guardes:

- Contraseña original.
- Campos vacíos innecesarios.
- Elementos DOM.
- Funciones.
- Mensajes internos.
- Información sensible adicional.

La función que lee usuarios debe:

1. Obtener la clave.
2. Manejar el caso en que no exista.
3. Manejar JSON inválido sin detener la aplicación.
4. Verificar que el valor recuperado sea un arreglo.
5. Devolver un arreglo vacío como fallback seguro.

La función que guarda usuarios debe controlar errores como falta de espacio o bloqueo de `localStorage`.

CRITERIO DE USUARIO DUPLICADO

Debido a que todavía no existe correo electrónico, número de documento ni nombre de usuario único, utiliza provisionalmente esta combinación para detectar duplicados:

- Nombre completo normalizado.
- Tipo de usuario.
- Cargo normalizado.

Un registro se considera duplicado cuando coinciden simultáneamente:

`normalizedFullName + role + normalizedJobTitle`

La contraseña y la configuración 2FA no deben formar parte de la comparación.

Normalización requerida:

1. Eliminar espacios exteriores.
2. Convertir varios espacios en uno.
3. Convertir a minúsculas.
4. Eliminar diferencias de tildes mediante normalización Unicode.
5. Mantener intactos los valores originales para mostrarlos.

Ejemplo:

- “José   Pérez”
- “jose perez”
- “ JOSÉ PÉREZ ”

Deben considerarse el mismo nombre normalizado.

Implementa una función independiente y comprobable, por ejemplo:

function normalizeIdentityValue(value) {
  return value
    .trim()
    .replace(/\s+/g, " ")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("es");
}

Aclara en la documentación que este criterio es provisional. Dos personas pueden compartir nombre, rol y cargo. En una versión real se necesitaría un identificador único, preferiblemente correo electrónico verificado o un nombre de usuario.

COMPORTAMIENTO ANTE DUPLICADOS

Cuando el usuario envíe datos que ya existen:

1. No agregues un nuevo registro.
2. No modifiques el registro anterior.
3. No sobrescribas su contraseña.
4. Mantén abierto el formulario.
5. Muestra una notificación centrada.
6. El texto principal debe ser exactamente:

“Este usuario ya está registrado.”

7. Añade, si es necesario, un texto secundario:

“Revisa el nombre, el tipo de usuario y el cargo ingresados.”

8. Mueve el foco a la notificación o anúnciala mediante `role="alert"`.
9. Permite cerrar la notificación.
10. Después de cerrarla, devuelve el foco al campo de nombre o al control que originó el mensaje.

No utilices `alert()` del navegador.

NOTIFICACIÓN CENTRADA

Crea una notificación accesible en el centro de la pantalla.

Puede ser un segundo `<dialog>` o un componente superpuesto accesible. Debe:

- Estar centrada horizontal y verticalmente.
- Ser legible en tema claro y oscuro.
- Aparecer por encima del formulario.
- Tener fondo y contraste suficientes.
- Incluir un botón “Entendido”.
- Usar `role="alertdialog"` o una semántica equivalente.
- Incluir `aria-labelledby`.
- No depender únicamente del color.
- No desaparecer demasiado rápido.
- No desplazar el contenido de la página.
- No usar `alert()`.

Estructura orientativa:

<dialog
  class="notification-dialog"
  id="registration-notification"
  aria-labelledby="registration-notification-title"
>
  <section class="notification-card">
    <h2 id="registration-notification-title">
      Este usuario ya está registrado.
    </h2>

    <p>
      Revisa el nombre, el tipo de usuario y el cargo ingresados.
    </p>

    <button
      class="button button--primary"
      id="close-registration-notification"
      type="button"
    >
      Entendido
    </button>
  </section>
</dialog>

Evita abrir dos diálogos modales nativos simultáneamente si el navegador puede manejarlo incorrectamente. Si utilizas `<dialog>` para ambos elementos, diseña cuidadosamente la secuencia:

1. Mantén el formulario en su estado actual.
2. Presenta la notificación sin perder los datos.
3. Al cerrarla, devuelve el foco al formulario.
4. Comprueba que no queden capas o focos bloqueados.

REGISTRO EXITOSO

Cuando el registro sea válido y no esté duplicado:

1. Procesa la contraseña.
2. Crea el objeto de usuario.
3. Añádelo al arreglo.
4. Guarda el arreglo.
5. Limpia el formulario.
6. Cierra el diálogo.
7. Devuelve el foco al botón de registro.
8. Muestra una notificación de éxito:

“Usuario registrado en este navegador.”

9. Añade como texto secundario:

“Este es un registro demostrativo y no crea una cuenta en un servidor.”

La notificación de éxito puede utilizar el sistema global de toast existente, siempre que sea accesible y claramente visible. La notificación de duplicado sí debe aparecer en el centro de la pantalla, tal como se solicitó.

VALIDACIÓN Y ERRORES

Usa validación HTML como primera capa y JavaScript para mensajes específicos.

Cada campo debe tener:

- Etiqueta visible.
- Mensaje de error relacionado mediante `aria-describedby`.
- Contenedor con `aria-live="polite"`.
- Estado visual de error basado en una clase, no en estilos inline.
- `aria-invalid="true"` solamente cuando tenga un error.
- Eliminación de `aria-invalid` cuando el error se corrija.

Mensajes sugeridos:

Nombre:

- “Ingresa el nombre completo.”
- “El nombre debe contener al menos 3 caracteres.”

Tipo:

- “Selecciona Comerciante o Distribuidor.”

Cargo:

- “Ingresa el cargo dentro de la empresa.”
- “El cargo debe contener al menos 2 caracteres.”

Contraseña:

- “Ingresa una contraseña.”
- “La contraseña debe contener al menos 8 caracteres.”
- “La contraseña debe incluir al menos una letra y un número.”

Al enviar un formulario inválido:

1. Muestra todos los errores relevantes.
2. Mueve el foco al primer campo inválido.
3. No guarde ningún dato.
4. No cierre el formulario.
5. No muestre una notificación de éxito.

CSS DEL REGISTRO

Utiliza clases semánticas:

- `.header-identity`
- `.button--register`
- `.registration-dialog`
- `.registration`
- `.registration__header`
- `.registration__form`
- `.registration__actions`
- `.password-field`
- `.password-field__control`
- `.password-toggle`
- `.two-factor-field`
- `.notification-dialog`
- `.notification-card`

No utilices `id` como selector CSS.

Utiliza CSS Grid como sistema principal:

.header-identity {
  display: grid;
  grid-template-columns: auto auto;
  align-items: center;
  gap: var(--space-md);
}

.registration__form {
  display: grid;
  gap: var(--space-md);
}

.registration__fields {
  display: grid;
  gap: var(--space-md);
}

.registration__actions {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, max-content));
  gap: var(--space-sm);
}

.notification-card {
  display: grid;
  justify-items: center;
  gap: var(--space-md);
  text-align: center;
}

En pantallas amplias, algunos campos pueden ocupar dos columnas:

@media (width >= 40rem) {
  .registration__fields {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .registration__field--full {
    grid-column: 1 / -1;
  }
}

No fuerces dos columnas si afecta la lectura del formulario.

Flexbox puede utilizarse únicamente en controles pequeños si resulta claramente más apropiado, como un icono junto a un texto. La estructura principal del encabezado, formulario y notificación debe usar Grid.

No uses posicionamiento absoluto para construir el layout general. Puede utilizarse puntualmente para un icono dentro de un control si está justificado.

TEMA OSCURO

El módulo debe respetar el sistema actual de tema oscuro.

Añade estilos para:

- Fondo del diálogo.
- Texto.
- Bordes.
- Campos.
- Placeholders.
- Botones.
- Mensajes de error.
- Backdrop.
- Notificaciones.
- Estados hover, focus y disabled.

No crees un segundo sistema de variables. Reutiliza los tokens del proyecto.

RESPONSIVE

Verifica como mínimo:

- 320 px.
- 375 px.
- 768 px.
- 1024 px.
- Pantalla de escritorio amplia.

En móvil:

- El diálogo no debe superar el ancho de la pantalla.
- Debe dejar un margen exterior.
- Debe permitir desplazamiento vertical interno si el contenido no cabe.
- Los controles deben ocupar el ancho disponible.
- Los botones no deben producir desbordamiento.
- El botón de registro debe seguir siendo visible.
- La navegación móvil debe continuar funcionando.

El diálogo puede usar una regla semejante a:

.registration-dialog {
  width: min(100% - 2rem, 42rem);
  max-height: calc(100dvh - 2rem);
  overflow: auto;
}

No copies literalmente esta regla si entra en conflicto con la arquitectura existente; adáptala mediante variables.

ACCESIBILIDAD

Verifica:

1. Apertura mediante teclado.
2. Cierre mediante Escape.
3. Orden lógico de tabulación.
4. Foco inicial correcto.
5. Retorno del foco.
6. Etiquetas visibles.
7. Errores anunciados.
8. Contraste suficiente.
9. Foco visible.
10. Botón de mostrar contraseña con nombre accesible.
11. Estado 2FA comprensible sin depender del diseño.
12. Notificación de duplicado anunciada correctamente.
13. El contenido detrás del diálogo no recibe foco mientras el diálogo está abierto.
14. Respeto por `prefers-reduced-motion`.

No agregues animaciones obligatorias. Si se agrega una transición corta, desactívala cuando el usuario prefiera movimiento reducido.

MANEJO DE ERRORES DE LOCALSTORAGE

El módulo no debe fallar si:

- `localStorage` está bloqueado.
- El JSON guardado está dañado.
- La clave contiene un valor que no es un arreglo.
- `crypto.randomUUID()` no está disponible.
- El procesamiento criptográfico falla.

En caso de error de almacenamiento:

1. No afirmes que el usuario fue registrado.
2. Conserva abierto el formulario.
3. Muestra un mensaje comprensible:

“No fue posible guardar el registro en este navegador.”

4. No muestres detalles técnicos al usuario.
5. Puedes registrar un error técnico mínimo en consola, sin incluir contraseña ni datos sensibles.

Si `crypto.randomUUID()` no está disponible, crea un identificador usando valores aleatorios de `crypto.getRandomValues`. No uses solamente `Date.now()` como identificador.

PRUEBAS OBLIGATORIAS

Prueba como mínimo estos casos:

1. Abrir el formulario.
2. Cerrar con el botón.
3. Cerrar con Escape.
4. Enviar todos los campos vacíos.
5. Nombre demasiado corto.
6. Cargo demasiado corto.
7. Tipo de usuario sin seleccionar.
8. Contraseña menor de 8 caracteres.
9. Contraseña sin número.
10. Contraseña sin letra.
11. Mostrar y ocultar contraseña.
12. Registrar un comerciante sin 2FA.
13. Registrar un distribuidor con 2FA.
14. Comprobar que el registro aparece en `cn-registered-users`.
15. Comprobar que la contraseña original no aparece en `localStorage`.
16. Intentar registrar exactamente el mismo usuario.
17. Repetir el usuario cambiando mayúsculas.
18. Repetir el usuario cambiando tildes.
19. Repetir el usuario agregando espacios.
20. Confirmar que todos esos duplicados muestran:

    “Este usuario ya está registrado.”

21. Confirmar que el duplicado no aumenta el número de usuarios.
22. Registrar dos usuarios con nombres iguales pero roles diferentes.
23. Registrar dos usuarios con nombres iguales y cargos diferentes.
24. Comprobar que esos casos no se marquen como duplicados según el criterio provisional.
25. Recargar la página y verificar persistencia.
26. Probar con JSON inválido en `localStorage`.
27. Probar tema oscuro.
28. Probar navegación móvil.
29. Probar únicamente con teclado.
30. Verificar que las demás páginas no produzcan errores por importar el módulo.
31. Comprobar que no existan estilos ni scripts inline.
32. Ejecutar `git diff --check`.

CRITERIOS DE ACEPTACIÓN

El módulo solamente se considera terminado si:

- Existe un botón “Registrar usuario” en la zona superior izquierda del encabezado de la landing page.
- El botón abre un formulario accesible.
- Se solicitan exactamente los datos requeridos.
- El selector incluye Comerciante y Distribuidor.
- El campo de cargo es obligatorio.
- La contraseña se valida.
- La contraseña no se almacena en texto plano.
- La configuración 2FA se guarda como booleano.
- Los usuarios se guardan en `cn-registered-users`.
- Los duplicados se detectan con datos normalizados.
- Un duplicado no crea ni modifica registros.
- La notificación de duplicado aparece en el centro.
- La notificación contiene exactamente “Este usuario ya está registrado.”
- El registro exitoso muestra una confirmación.
- El formulario es responsive.
- El módulo funciona con teclado.
- El módulo funciona en tema claro y oscuro.
- CSS Grid es el sistema principal de layout.
- Los estilos se basan en clases.
- No existe CSS inline.
- No existe JavaScript inline.
- Las demás funciones del proyecto continúan funcionando.
- GitHub Pages continúa siendo compatible.

DOCUMENTACIÓN FINAL

Añade al README una sección breve que explique:

- Que el registro es demostrativo.
- Que los datos se almacenan en `localStorage`.
- Que no existe una cuenta en un servidor.
- Que 2FA es solamente una preferencia simulada.
- Que la contraseña no se guarda directamente.
- Que no deben utilizarse contraseñas reales en el prototipo.

No incluyas datos de usuarios registrados en el README.

ENTREGA FINAL

Al terminar, informa:

1. Archivos creados.
2. Archivos modificados.
3. Estructura del módulo.
4. Clave utilizada en `localStorage`.
5. Criterio utilizado para detectar duplicados.
6. Forma de protección demostrativa de la contraseña.
7. Comportamiento de 2FA.
8. Pruebas ejecutadas.
9. Limitaciones de seguridad.
10. Posibles mejoras futuras, sin implementarlas.

````
