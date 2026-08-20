# ConectaNegocio — Entrega M1

> Compara, conversa y haz seguimiento sin cambiar de plataforma.

ConectaNegocio es una plataforma web para centralizar el abastecimiento entre pequeños comercios y sus proveedores. Este repositorio contiene la entrega **M1 — Problem Statement + Prototype** del curso Desarrollo de Aplicaciones Web de la Universidad de La Sabana.

## Enlaces de la entrega

- [Prototipo en GitHub Pages](https://josealejandromelom.github.io/M1---Desarrollo-Web---C1/)
- [Repositorio](https://github.com/JoseAlejandroMeloM/M1---Desarrollo-Web---C1)
- [Prototipos y wireframes en Figma](https://www.figma.com/design/i0LHQGczrAGr6AqProBqJV/Proyecto-DSAW?node-id=0-1)
- [Matriz de pantallas y recorrido](./docs/WIREFRAMES.md)

## Problema real

Los administradores de pequeños comercios que compran productos a varios proveedores no cuentan con un espacio centralizado para comparar ofertas equivalentes, conservar la conversación de cada negociación y consultar el avance de sus pedidos y entregas.

El problema fue identificado a partir del caso real de **Sol y Luna**, una papelería de Chía. Su administradora debe contactar a cada proveedor por separado y comparar manualmente variables como precio, referencia, presentación, cantidad mínima, disponibilidad, forma de pago y tiempo de entrega. Una papelería puede manejar pedidos cercanos a 1.500 productos, organizados en lotes y distribuidos entre distintos proveedores.

La información queda repartida entre WhatsApp, llamadas, facturas, notas y una plataforma de ventas que administra el inventario del negocio, pero no permite comparar ni gestionar la información de los distribuidores. Esto consume tiempo, dificulta reconocer referencias parecidas y aumenta el riesgo de perder las condiciones acordadas o desconocer el estado de una entrega.

## Usuarios objetivo

### Comerciante o administrador del negocio

Propietarios y administradores de papelerías u otros pequeños comercios que compran productos recurrentemente a varios proveedores. La administradora de Sol y Luna es el usuario de referencia inicial.

### Proveedor o distribuidor

Empresas que publican ofertas, responden consultas, confirman pedidos y comunican el avance de preparación y entrega a sus clientes comerciales.

## ¿Por qué una aplicación web?

- **Una hoja de cálculo no permite una colaboración comercial completa.** Puede almacenar precios, pero no permite que cada proveedor administre sus ofertas, responda conversaciones y actualice pedidos desde una cuenta con permisos propios.
- **WhatsApp no organiza la información alrededor de la compra.** Las conversaciones quedan mezcladas y no relacionan estructuradamente cada producto, oferta, pedido y entrega.
- **La plataforma de inventario existente no compara distribuidores.** El comercio todavía debe revisar manualmente presentaciones, compras mínimas, precios y tiempos de entrega.
- **Una aplicación exclusivamente móvil limita el trabajo administrativo.** La web funciona en computador, tableta y teléfono, y facilita revisar catálogos y pedidos grandes en una pantalla amplia.
- **Comerciante y proveedor necesitan la misma información actualizada.** La aplicación web centraliza ofertas, conversaciones, pedidos e historial para que ambas partes compartan contexto.

## Propuesta de valor

ConectaNegocio integra tres funciones en un solo recorrido:

1. **Comparación:** alinea precio, presentación, compra mínima, disponibilidad y entrega de diferentes proveedores.
2. **Comunicación:** conserva un chat asociado a una oferta o pedido específico.
3. **Seguimiento:** muestra el avance del pedido y permite registrar entregas parciales o totales.

## Recorrido demostrable de M1

1. El comerciante consulta y filtra ofertas.
2. Selecciona dos o más opciones y abre el comparador.
3. Inicia una conversación contextual con el proveedor elegido.
4. Crea un pedido ficticio sin perder la información acordada.
5. El proveedor consulta el pedido y actualiza su estado.
6. El comerciante revisa la línea de tiempo y confirma la recepción.

El prototipo usa datos simulados y `localStorage`; no crea compras reales ni envía información a un servidor.

## Roles y permisos

| Acción | Comerciante | Proveedor |
|---|:---:|:---:|
| Buscar productos y comparar ofertas | Sí | Consulta limitada |
| Iniciar conversaciones y crear pedidos | Sí | Responde y confirma |
| Confirmar la recepción | Sí | No |
| Crear o editar sus propias ofertas | No | Sí |
| Actualizar preparación, envío y entrega | No | Sí |
| Modificar información de otro proveedor | No | No |

En M1 estos permisos se representan mediante pantallas y controles diferenciados. En M3 deberán verificarse también en el backend.

## Historias de usuario

- Como administrador de un pequeño negocio, quiero comparar ofertas para escoger la mejor combinación de precio, cantidad y entrega.
- Como administradora de una papelería, quiero distinguir referencias y presentaciones similares para pedir el producto correcto.
- Como comerciante, quiero conversar desde una oferta o pedido para conservar el contexto de la negociación.
- Como comerciante, quiero consultar el estado de cada pedido para saber qué está pendiente, en tránsito o entregado.
- Como proveedor, quiero actualizar mis ofertas y pedidos para que mis clientes reciban información vigente.

## Alcance de M1

- Problem statement sustentado en un usuario real.
- Wireframes de las pantallas principales y sus estados.
- Prototipo estático navegable con HTML semántico, CSS y JavaScript.
- Simulación de los tres flujos centrales con datos ficticios.
- Diseño responsive, accesible y publicado en GitHub Pages.

## Fuera del alcance inicial

Inventario integral, punto de venta, facturación electrónica, pagos reales, contabilidad, lectura automática de facturas, predicción de inventario, reportes avanzados y aplicación móvil nativa.

La regla de alcance es: si una función no mejora directamente la comparación, la comunicación o el seguimiento, debe quedar para una versión futura.

## Equipo

| Integrante | Contribuciones |
|---|---|
| **Catalina Vega Romero** | Investigación y validación del problema con el caso real de la papelería Sol y Luna; definición de necesidades del comerciante; revisión de los flujos, contenidos y coherencia de los wireframes. |
| **Jose Alejandro Melo Murcia** | Integración general del proyecto; desarrollo y conexión del prototipo completo en HTML, CSS y JavaScript; comportamiento con `localStorage`; consolidación de los wireframes en Figma; pruebas finales y preparación de la entrega. |
| **Alejandro Caycedo** | Creación de la base inicial del repositorio; apoyo en la definición de la estructura del proyecto, los roles y el recorrido principal entre comerciante y proveedor. |
| **Sebastián Franco Umbacia** | Desarrollo y ajuste de las páginas iniciales y de ofertas; consolidación del planteamiento del problema; organización de enlaces y documentación; actualización del README y preparación del repositorio para GitHub Pages. |

El historial de Git complementa esta distribución y registra los aportes técnicos realizados directamente en el repositorio.

## Tecnologías

- HTML5 semántico.
- CSS responsive organizado por capas, con Grid como sistema principal y Flexbox solo en controles unidimensionales.
- JavaScript moderno sin frameworks.
- `localStorage` para conservar el estado demostrativo.
- Web Crypto para evitar guardar las contraseñas demostrativas en texto plano.
- Figma para wireframes y diseño.
- GitHub y GitHub Pages para colaboración y publicación.

## Estructura del proyecto

```text
.
├── index.html
├── README.md
├── pages/        # Pantallas internas del prototipo
├── css/          # Tokens, base, layouts, componentes y estilos por página
│   └── pages/
├── js/           # Lógica, validación, tema y registro demostrativo
└── docs/         # Documentación secundaria y registro de uso de IA
```

`index.html` y `README.md` permanecen en la raíz. Las rutas son relativas para conservar la compatibilidad con GitHub Pages.

## Registro demostrativo

La landing page incluye un registro local de comerciantes y distribuidores. Los datos se guardan únicamente en la clave `cn-registered-users` de `localStorage`; no se crea una cuenta ni una sesión en un servidor. La preferencia de autenticación de dos factores es simulada y no envía códigos reales.

La contraseña no se almacena directamente: el navegador genera un salt aleatorio y conserva un hash SHA-256 mediante Web Crypto. Esta medida solo evita texto plano dentro del prototipo y no equivale a un sistema de autenticación seguro. **No utilices una contraseña real.**

Mientras no exista correo o nombre de usuario, los duplicados se identifican provisionalmente mediante la combinación normalizada de nombre completo, tipo de usuario y cargo. Dos personas reales podrían compartir esos datos, por lo que una versión de producción necesitaría un identificador único verificado.

## Ejecutar localmente

Los módulos de JavaScript y Web Crypto necesitan un servidor HTTP local. Desde la carpeta del proyecto se puede usar cualquier servidor estático, por ejemplo la extensión Live Server de VS Code. Luego se abre `index.html` desde la dirección que muestre el servidor.

## Datos y privacidad

Sol y Luna es el caso real que fundamenta el problema. Los nombres de perfiles, proveedores, productos, precios, mensajes, pedidos y actividades mostrados dentro del prototipo son ficticios y se utilizan exclusivamente con fines académicos.

## Entrega

- **Hito:** M1 — Problem Statement + Prototype.
- **Fecha límite:** 18 de agosto de 2026, 7:00 a. m. (hora de Colombia).
- **Curso:** Desarrollo de Aplicaciones Web, Universidad de La Sabana.
