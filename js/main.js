import { validateMessage, validateOffer, validateOrder } from "./validation.js";
import { initializeRegistration } from "./registration.js";

const KEYS = {
  offers: "cn-demo-offers",
  selected: "cn-demo-selected",
  messages: "cn-demo-messages",
  order: "cn-demo-order",
  contextOffer: "cn-demo-context-offer",
  theme: "cn-theme"
};

const defaultOffers = [
  { id: 1, product: "Cuaderno argollado 100 hojas", detail: "Cuadriculado · Carta", category: "cuadernos", provider: "Distribuciones Andina", city: "Bogotá", price: 12500, minimum: 12, deliveryDays: 2, payment: "Contraentrega", availability: "available" },
  { id: 2, product: "Cuaderno argollado 100 hojas", detail: "Cuadriculado · Carta", category: "cuadernos", provider: "Suministros Nova", city: "Chía", price: 11900, minimum: 24, deliveryDays: 4, payment: "Transferencia", availability: "available" },
  { id: 3, product: "Cuaderno argollado 100 hojas", detail: "Cuadriculado · Carta", category: "cuadernos", provider: "Comercializadora Prisma", city: "Cajicá", price: 13200, minimum: 6, deliveryDays: 1, payment: "Nequi o efectivo", availability: "limited" },
  { id: 4, product: "Resma de papel carta 75 g", detail: "500 hojas · Blanco", category: "papeleria", provider: "Papeles del Centro", city: "Chía", price: 18400, minimum: 5, deliveryDays: 1, payment: "Transferencia", availability: "available" },
  { id: 5, product: "Bolígrafo tinta negra", detail: "Punta fina · Caja x 12", category: "escritura", provider: "Suministros Nova", city: "Bogotá", price: 11400, minimum: 2, deliveryDays: 3, payment: "Crédito 15 días", availability: "limited" },
  { id: 6, product: "Carpeta legajadora oficio", detail: "Cartón · Gancho plástico", category: "archivo", provider: "Archivo & Papel SAS", city: "Cajicá", price: 2800, minimum: 10, deliveryDays: 2, payment: "Contraentrega", availability: "available" },
  { id: 7, product: "Marcador borrable surtido", detail: "Paquete x 4 colores", category: "escritura", provider: "Comercializadora Prisma", city: "Bogotá", price: 8900, minimum: 6, deliveryDays: 4, payment: "Transferencia", availability: "available" },
  { id: 8, product: "Caja de archivo X200", detail: "Cartón kraft · 20 unidades", category: "archivo", provider: "Archivo & Papel SAS", city: "Cajicá", price: 56000, minimum: 1, deliveryDays: 5, payment: "Crédito 30 días", availability: "available" }
];

const defaultMessages = [
  { id: 1, from: "merchant", author: "Carolina Mejía", text: "Hola, necesito 24 cuadernos para la próxima semana. ¿La oferta sigue disponible?", time: "8:42 a. m." },
  { id: 2, from: "provider", author: "Distribuciones Andina", text: "Sí, tenemos disponibilidad. Podemos despachar mañana y entregar en dos días.", time: "8:51 a. m." }
];

const defaultOrder = {
  id: "CN-1048",
  offerId: 1,
  quantity: 24,
  deliveryDate: "2026-08-21",
  address: "Carrera 9 # 12-34, Chía",
  email: "carolina@papelerialasabana.co",
  notes: "Entregar en el local antes de las 4 p. m.",
  status: "En preparación",
  received: 0,
  createdAt: "17 ago 2026 · 8:58 p. m.",
  timeline: [
    { status: "Solicitado", actor: "Carolina Mejía", time: "17 ago · 8:58 p. m.", note: "Pedido creado desde la oferta seleccionada." },
    { status: "Confirmado", actor: "Distribuciones Andina", time: "17 ago · 9:04 p. m.", note: "Disponibilidad y fecha confirmadas." },
    { status: "En preparación", actor: "Distribuciones Andina", time: "17 ago · 9:12 p. m.", note: "Productos separados para despacho." }
  ]
};

function read(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : structuredClone(fallback);
  } catch {
    return structuredClone(fallback);
  }
}

function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function escapeHTML(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function currency(value) {
  return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(value);
}

function findOffer(id) {
  return read(KEYS.offers, defaultOffers).find((offer) => offer.id === Number(id));
}

function formatStatus(status) {
  return status.toLowerCase().replaceAll(" ", "-").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function showToast(message) {
  const toast = document.querySelector("#global-toast");
  if (!toast) return;
  toast.textContent = message;
  toast.hidden = false;
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => { toast.hidden = true; }, 3500);
}

function setFieldError(form, name, message) {
  const field = form.elements[name];
  const error = form.querySelector(`[data-error-for="${name}"]`);
  if (field) {
    field.classList.toggle("is-invalid", Boolean(message));
    field.setAttribute("aria-invalid", String(Boolean(message)));
  }
  if (error) error.textContent = message || "";
}

function initGlobalUI() {
  const root = document.documentElement;
  const themeToggle = document.querySelector("#theme-toggle");
  const mobileToggle = document.querySelector("#mobile-nav-toggle");
  const nav = document.querySelector("#site-nav");

  if (!root.dataset.themeReady) {
    const savedTheme = localStorage.getItem(KEYS.theme);
    const dark = savedTheme === "dark" || (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches);
    root.classList.toggle("dark", dark);
    root.dataset.themeReady = "true";
  }

  const updateThemeLabel = () => {
    if (!themeToggle) return;
    const dark = root.classList.contains("dark");
    themeToggle.setAttribute("aria-pressed", String(dark));
    themeToggle.querySelector("span").textContent = dark ? "Modo claro" : "Modo oscuro";
    themeToggle.setAttribute("aria-label", dark ? "Activar modo claro" : "Activar modo oscuro");
  };

  const updateMobileMenu = (open) => {
    if (!mobileToggle) return;
    mobileToggle.setAttribute("aria-expanded", String(open));
    mobileToggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    mobileToggle.textContent = open ? "×" : "☰";
  };

  themeToggle?.addEventListener("click", () => {
    root.classList.toggle("dark");
    localStorage.setItem(KEYS.theme, root.classList.contains("dark") ? "dark" : "light");
    updateThemeLabel();
  });
  updateThemeLabel();

  mobileToggle?.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    updateMobileMenu(open);
  });

  nav?.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
    nav.classList.remove("is-open");
    updateMobileMenu(false);
  }));

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      nav?.classList.remove("is-open");
      updateMobileMenu(false);
    }
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
      const search = document.querySelector("#offer-search");
      if (search) {
        event.preventDefault();
        search.focus();
        search.select();
      }
    }
  });

  document.querySelectorAll("[data-reset-demo]").forEach((button) => button.addEventListener("click", () => {
    Object.values(KEYS).filter((key) => key.startsWith("cn-demo")).forEach((key) => localStorage.removeItem(key));
    showToast("Datos de demostración restaurados.");
    window.setTimeout(() => window.location.reload(), 450);
  }));
}

function initMerchantDashboard() {
  const offers = read(KEYS.offers, defaultOffers);
  const selected = read(KEYS.selected, [1, 2, 3]);
  const order = read(KEYS.order, defaultOrder);
  document.querySelector("#metric-offers").textContent = offers.length;
  document.querySelector("#metric-selected").textContent = selected.length;
  document.querySelector("#metric-order").textContent = order?.status || "Sin pedido";
  document.querySelector("#dashboard-order-id").textContent = order?.id || "—";
  document.querySelector("#dashboard-order-status").textContent = order?.status || "Crea tu primer pedido";
}

function offerRow(offer, selected) {
  const checked = selected.includes(offer.id);
  return `<tr>
    <td><input class="offer-check" type="checkbox" value="${offer.id}" ${checked ? "checked" : ""} aria-label="Seleccionar oferta de ${escapeHTML(offer.provider)}"></td>
    <td><span class="product-cell"><strong>${escapeHTML(offer.product)}</strong><small>${escapeHTML(offer.detail)}</small></span></td>
    <td><span class="product-cell"><strong>${escapeHTML(offer.provider)}</strong><small>${escapeHTML(offer.city)}</small></span></td>
    <td><strong>${currency(offer.price)}</strong></td>
    <td>${offer.minimum} ud.</td>
    <td>${offer.deliveryDays} ${offer.deliveryDays === 1 ? "día" : "días"}</td>
    <td><span class="status ${offer.availability}">${offer.availability === "available" ? "Disponible" : "Cupo limitado"}</span></td>
    <td><a class="table-link" href="chat.html" data-chat-offer="${offer.id}">Consultar</a></td>
  </tr>`;
}

function initOffers() {
  const tbody = document.querySelector("#offers-body");
  const search = document.querySelector("#offer-search");
  const category = document.querySelector("#category-filter");
  const availability = document.querySelector("#availability-filter");
  const sort = document.querySelector("#sort-filter");
  const result = document.querySelector("#result-summary");
  const empty = document.querySelector("#offers-empty");
  const compareLink = document.querySelector("#compare-link");
  let selected = read(KEYS.selected, [1, 2, 3]);

  const normalize = (value) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const updateCompare = () => {
    write(KEYS.selected, selected);
    compareLink.querySelector("span").textContent = selected.length;
    compareLink.classList.toggle("is-disabled", selected.length < 2);
    compareLink.setAttribute("aria-disabled", String(selected.length < 2));
  };

  const render = () => {
    const term = normalize(search.value.trim());
    let list = read(KEYS.offers, defaultOffers).filter((offer) => {
      const haystack = normalize(`${offer.product} ${offer.detail} ${offer.provider} ${offer.city}`);
      return (!term || haystack.includes(term)) && (category.value === "all" || offer.category === category.value) && (availability.value === "all" || offer.availability === availability.value);
    });
    if (sort.value === "price") list.sort((a, b) => a.price - b.price);
    if (sort.value === "delivery") list.sort((a, b) => a.deliveryDays - b.deliveryDays);
    tbody.innerHTML = list.map((offer) => offerRow(offer, selected)).join("");
    result.textContent = `${list.length} ${list.length === 1 ? "oferta encontrada" : "ofertas encontradas"}`;
    empty.hidden = list.length !== 0;
    document.querySelector("#offers-table-wrap").hidden = list.length === 0;

    tbody.querySelectorAll(".offer-check").forEach((checkbox) => checkbox.addEventListener("change", () => {
      const id = Number(checkbox.value);
      if (checkbox.checked && selected.length >= 3) {
        checkbox.checked = false;
        showToast("Puedes comparar máximo tres ofertas a la vez.");
        return;
      }
      selected = checkbox.checked ? [...selected, id] : selected.filter((value) => value !== id);
      updateCompare();
    }));
    tbody.querySelectorAll("[data-chat-offer]").forEach((link) => link.addEventListener("click", () => {
      localStorage.setItem(KEYS.contextOffer, link.dataset.chatOffer);
    }));
  };

  [search, category, availability, sort].forEach((control) => control.addEventListener(control === search ? "input" : "change", render));
  document.querySelector("#clear-filters").addEventListener("click", () => {
    search.value = "";
    category.value = "all";
    availability.value = "all";
    sort.value = "recommended";
    render();
    search.focus();
  });
  compareLink.addEventListener("click", (event) => {
    if (selected.length < 2) {
      event.preventDefault();
      showToast("Selecciona al menos dos ofertas para comparar.");
    }
  });
  updateCompare();
  render();
}

function initComparator() {
  const selectedIds = read(KEYS.selected, [1, 2, 3]);
  const offers = read(KEYS.offers, defaultOffers).filter((offer) => selectedIds.includes(offer.id));
  const grid = document.querySelector("#comparison-grid");
  const table = document.querySelector("#comparison-table-body");
  const empty = document.querySelector("#comparison-empty");
  const content = document.querySelector("#comparison-content");

  if (offers.length < 2) {
    empty.hidden = false;
    content.hidden = true;
    return;
  }

  grid.innerHTML = offers.map((offer, index) => `<article class="compare-card ${index === 0 ? "featured" : ""}">
    <p class="eyebrow">Opción ${index + 1}</p>
    <h2>${escapeHTML(offer.provider)}</h2>
    <p>${escapeHTML(offer.city)} · ${escapeHTML(offer.payment)}</p>
    <strong class="compare-price">${currency(offer.price)}</strong>
    <p>${escapeHTML(offer.product)}</p>
    <div class="button-row">
      <a class="button secondary" href="chat.html" data-choose-offer="${offer.id}">Conversar</a>
      <a class="button primary" href="pedido.html" data-choose-offer="${offer.id}">Elegir</a>
    </div>
  </article>`).join("");

  const rows = [
    ["Precio unitario", ...offers.map((offer) => currency(offer.price))],
    ["Compra mínima", ...offers.map((offer) => `${offer.minimum} unidades`)],
    ["Entrega", ...offers.map((offer) => `${offer.deliveryDays} ${offer.deliveryDays === 1 ? "día" : "días"}`)],
    ["Forma de pago", ...offers.map((offer) => offer.payment)],
    ["Disponibilidad", ...offers.map((offer) => offer.availability === "available" ? "Disponible" : "Cupo limitado")]
  ];
  document.querySelector("#comparison-table-head").innerHTML = `<th scope="col">Criterio</th>${offers.map((_, index) => `<th scope="col">Opción ${index + 1}</th>`).join("")}`;
  table.innerHTML = rows.map((row) => `<tr>${row.map((cell, index) => index === 0 ? `<th scope="row">${escapeHTML(cell)}</th>` : `<td>${escapeHTML(cell)}</td>`).join("")}</tr>`).join("");
  document.querySelectorAll("[data-choose-offer]").forEach((link) => link.addEventListener("click", () => {
    localStorage.setItem(KEYS.contextOffer, link.dataset.chooseOffer);
  }));
  document.querySelector("#clear-comparison").addEventListener("click", () => {
    write(KEYS.selected, []);
    window.location.reload();
  });
}

function initChat() {
  const offerId = Number(localStorage.getItem(KEYS.contextOffer) || read(KEYS.selected, [1])[0] || 1);
  const offer = findOffer(offerId) || defaultOffers[0];
  const messages = read(KEYS.messages, defaultMessages);
  const list = document.querySelector("#message-list");
  const form = document.querySelector("#message-form");
  const input = form.elements.message;

  document.querySelector("#chat-provider").textContent = offer.provider;
  document.querySelector("#chat-product").textContent = offer.product;
  document.querySelector("#chat-offer-price").textContent = currency(offer.price);
  document.querySelector("#chat-order-link").addEventListener("click", () => localStorage.setItem(KEYS.contextOffer, String(offer.id)));

  const render = () => {
    list.innerHTML = messages.map((message) => `<li class="message ${message.from}">
      <span class="message-author">${escapeHTML(message.author)}</span>
      <p>${escapeHTML(message.text)}</p><time>${escapeHTML(message.time)}</time>
    </li>`).join("");
    list.scrollTop = list.scrollHeight;
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const error = validateMessage(input.value);
    setFieldError(form, "message", error);
    if (error) return input.focus();
    messages.push({ id: Date.now(), from: "merchant", author: "Carolina Mejía", text: input.value.trim(), time: "Ahora" });
    write(KEYS.messages, messages);
    input.value = "";
    render();
    showToast("Mensaje guardado en la conversación demostrativa.");
  });
  render();
}

function initOrder() {
  const form = document.querySelector("#order-form");
  const select = form.elements.offerId;
  const offers = read(KEYS.offers, defaultOffers);
  const contextId = Number(localStorage.getItem(KEYS.contextOffer) || read(KEYS.selected, [1])[0] || 1);
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minimumDate = tomorrow.toISOString().split("T")[0];
  form.elements.deliveryDate.min = minimumDate;
  form.elements.deliveryDate.value = minimumDate;
  select.innerHTML = `<option value="">Selecciona una oferta</option>${offers.map((offer) => `<option value="${offer.id}" ${offer.id === contextId ? "selected" : ""}>${escapeHTML(offer.product)} · ${escapeHTML(offer.provider)}</option>`).join("")}`;

  const updateSummary = () => {
    const offer = findOffer(select.value);
    const quantity = Number(form.elements.quantity.value || 0);
    document.querySelector("#order-provider").textContent = offer?.provider || "—";
    document.querySelector("#order-unit-price").textContent = offer ? currency(offer.price) : "—";
    document.querySelector("#order-total").textContent = offer && quantity ? currency(offer.price * quantity) : "—";
  };
  [select, form.elements.quantity].forEach((control) => control.addEventListener("input", updateSummary));

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(form));
    values.terms = form.elements.terms.checked;
    const errors = validateOrder(values);
    ["offerId", "quantity", "deliveryDate", "address", "email", "terms"].forEach((name) => setFieldError(form, name, errors[name]));
    const firstError = form.querySelector(".is-invalid");
    if (firstError) return firstError.focus();
    const now = new Date();
    const order = {
      id: `CN-${String(now.getTime()).slice(-4)}`,
      offerId: Number(values.offerId),
      quantity: Number(values.quantity),
      deliveryDate: values.deliveryDate,
      address: values.address.trim(),
      email: values.email.trim(),
      notes: values.notes.trim(),
      status: "Solicitado",
      received: 0,
      createdAt: "Ahora",
      timeline: [{ status: "Solicitado", actor: "Carolina Mejía", time: "Ahora", note: "Pedido creado desde la oferta seleccionada." }]
    };
    write(KEYS.order, order);
    window.location.href = "seguimiento.html";
  });
  updateSummary();
}

function renderTimeline(order) {
  return order.timeline.map((item, index) => `<li class="timeline-item ${index === order.timeline.length - 1 ? "current" : ""}">
    <span class="timeline-dot" aria-hidden="true"></span>
    <div><strong>${escapeHTML(item.status)}</strong><p>${escapeHTML(item.note)}</p><small>${escapeHTML(item.actor)} · ${escapeHTML(item.time)}</small></div>
  </li>`).join("");
}

function initTracking() {
  const order = read(KEYS.order, defaultOrder);
  const empty = document.querySelector("#tracking-empty");
  const content = document.querySelector("#tracking-content");
  if (!order) {
    empty.hidden = false;
    content.hidden = true;
    return;
  }
  const offer = findOffer(order.offerId);
  document.querySelector("#tracking-id").textContent = order.id;
  document.querySelector("#tracking-status").textContent = order.status;
  document.querySelector("#tracking-status").className = `status large ${formatStatus(order.status)}`;
  document.querySelector("#tracking-provider").textContent = offer.provider;
  document.querySelector("#tracking-product").textContent = offer.product;
  document.querySelector("#tracking-quantity").textContent = `${order.quantity} unidades`;
  document.querySelector("#tracking-date").textContent = order.deliveryDate;
  document.querySelector("#tracking-timeline").innerHTML = renderTimeline(order);
  const receiveForm = document.querySelector("#receive-form");
  receiveForm.elements.received.max = order.quantity;
  receiveForm.elements.received.value = order.received || order.quantity;
  const receiveAllowed = ["Entregado", "Entrega parcial"].includes(order.status);
  receiveForm.elements.received.disabled = !receiveAllowed;
  receiveForm.querySelector("button[type='submit']").disabled = !receiveAllowed;
  document.querySelector("#receive-hint").textContent = receiveAllowed
    ? "Confirma todas las unidades o registra una entrega parcial."
    : order.status === "Recibido"
      ? "La recepción completa ya fue confirmada."
      : "Disponible cuando el proveedor registre la entrega.";
  receiveForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const received = Number(receiveForm.elements.received.value);
    if (!Number.isInteger(received) || received < 1 || received > order.quantity) {
      return setFieldError(receiveForm, "received", `Ingresa un valor entre 1 y ${order.quantity}.`);
    }
    setFieldError(receiveForm, "received", "");
    order.received = received;
    order.status = received === order.quantity ? "Recibido" : "Entrega parcial";
    order.timeline.push({ status: order.status, actor: "Carolina Mejía", time: "Ahora", note: received === order.quantity ? "Recepción completa confirmada por el comercio." : `${received} de ${order.quantity} unidades confirmadas.` });
    write(KEYS.order, order);
    showToast("Recepción registrada en el historial.");
    window.setTimeout(() => window.location.reload(), 450);
  });
}

function initProvider() {
  const order = read(KEYS.order, defaultOrder);
  const orderCard = document.querySelector("#provider-order");
  const empty = document.querySelector("#provider-empty");
  if (!order) {
    orderCard.hidden = true;
    empty.hidden = false;
  } else {
    const offer = findOffer(order.offerId);
    document.querySelector("#provider-order-id").textContent = order.id;
    document.querySelector("#provider-order-product").textContent = offer.product;
    document.querySelector("#provider-order-quantity").textContent = `${order.quantity} unidades`;
    document.querySelector("#provider-order-status").textContent = order.status;
    const sequence = ["Solicitado", "Confirmado", "En preparación", "Enviado", "En camino", "Entregado"];
    const button = document.querySelector("#advance-order");
    const current = sequence.indexOf(order.status);
    if (current === -1 || current === sequence.length - 1) {
      button.disabled = true;
      button.textContent = order.status === "Entregado" ? "Entrega registrada" : "Sin acción disponible";
    } else {
      const next = sequence[current + 1];
      button.textContent = `Cambiar a “${next}”`;
      button.addEventListener("click", () => {
        order.status = next;
        order.timeline.push({ status: next, actor: offer.provider, time: "Ahora", note: `El proveedor actualizó el pedido a “${next}”.` });
        write(KEYS.order, order);
        showToast("Estado actualizado y visible para el comerciante.");
        window.setTimeout(() => window.location.reload(), 450);
      });
    }
  }

  const offerForm = document.querySelector("#provider-offer-form");
  offerForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(offerForm));
    const errors = validateOffer(values);
    ["product", "price", "minimum"].forEach((name) => setFieldError(offerForm, name, errors[name]));
    const firstError = offerForm.querySelector(".is-invalid");
    if (firstError) return firstError.focus();
    const offers = read(KEYS.offers, defaultOffers);
    offers.push({ id: Date.now(), product: values.product.trim(), detail: "Oferta creada en la demostración", category: "papeleria", provider: "Distribuciones Andina", city: "Bogotá", price: Number(values.price), minimum: Number(values.minimum), deliveryDays: 2, payment: "Transferencia", availability: "available" });
    write(KEYS.offers, offers);
    offerForm.reset();
    document.querySelector("#provider-offer-count").textContent = offers.filter((offer) => offer.provider === "Distribuciones Andina").length;
    showToast("Oferta ficticia publicada.");
  });
  const offers = read(KEYS.offers, defaultOffers);
  document.querySelector("#provider-offer-count").textContent = offers.filter((offer) => offer.provider === "Distribuciones Andina").length;
}

initGlobalUI();
initializeRegistration();

const page = document.body.dataset.page;
if (page === "comerciante") initMerchantDashboard();
if (page === "ofertas") initOffers();
if (page === "comparador") initComparator();
if (page === "chat") initChat();
if (page === "pedido") initOrder();
if (page === "seguimiento") initTracking();
if (page === "proveedor") initProvider();
