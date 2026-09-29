# Matriz de wireframes y prototipo

## Enlaces

- [Diseño de interfaz](https://www.figma.com/design/i0LHQGczrAGr6AqProBqJV/Proyecto-DSAW?node-id=0-1&t=ZS6t7uOzXtOQ8xty-1)
- [Wireframes con estados](https://www.figma.com/make/3drdhe0Y3KiYPeWRJ75b4X/Wireframe-Ofertas-Estado-Vac%C3%ADo?t=YKTxr7a9hPD7wUPm-1)

## Correspondencia de pantallas

| Flujo | Pantalla | Prototipo | Estados que debe mostrar Figma |
|---|---|---|---|
| Público | Presentación | [`../index.html`](../index.html) | Contenido completo y navegación responsive |
| Comerciante | Panel | [`../pages/comerciante.html`](../pages/comerciante.html) | Resumen con datos, actividad vacía y aviso |
| Comerciante | Ofertas | [`../pages/ofertas.html`](../pages/ofertas.html) | Lista, filtros sin resultados y validación |
| Comerciante | Comparador | [`../pages/comparador.html`](../pages/comparador.html) | Selección vacía, comparación y límite/error |
| Compartido | Chat contextual | [`../pages/chat.html`](../pages/chat.html) | Sin conversación, mensajes y validación |
| Comerciante | Crear pedido | [`../pages/pedido.html`](../pages/pedido.html) | Formulario inicial, resumen y errores |
| Comerciante | Seguimiento | [`../pages/seguimiento.html`](../pages/seguimiento.html) | Sin pedido, línea de tiempo y recepción parcial |
| Proveedor | Panel y pedidos | [`../pages/proveedor.html`](../pages/proveedor.html) | Sin pedidos, pedidos activos y actualización |

## Pantalla anotada recomendada

El **Comparador de ofertas** debe ser la pantalla anotada principal. Las anotaciones deben explicar:

1. Cómo se seleccionan y eliminan ofertas.
2. Qué atributos se normalizan para comparar.
3. Cómo se identifica la mejor condición sin decidir por el usuario.
4. Cómo continúa el recorrido hacia chat o pedido.
5. Cómo cambia la composición en móvil.
6. Qué ocurre con cero, una, dos o más selecciones.
7. Qué elementos garantizan navegación por teclado y comprensión visual.

## Recorrido de demostración

`Inicio → Panel comerciante → Ofertas → Comparador → Chat → Pedido → Seguimiento → Panel proveedor → Actualizar estado → Seguimiento`

Cada frame de Figma debe utilizar la misma identidad visual del prototipo: crema, azul marino, terracota, tarjetas claras, estados semánticos y monograma CN.
