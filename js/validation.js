const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function localDate(value) {
  if (!value) return null;
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function startOfToday() {
  const today = new Date();
  return new Date(today.getFullYear(), today.getMonth(), today.getDate());
}

export function validateOrder(values) {
  const errors = {};
  const quantity = Number(values.quantity);
  const date = localDate(values.deliveryDate);

  if (!values.offerId) errors.offerId = "Selecciona una oferta.";
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 500) {
    errors.quantity = "Ingresa una cantidad entera entre 1 y 500.";
  }
  if (!date || date <= startOfToday()) {
    errors.deliveryDate = "Selecciona una fecha posterior a hoy.";
  }
  if (!values.address.trim() || values.address.trim().length < 10) {
    errors.address = "Escribe una dirección de al menos 10 caracteres.";
  }
  if (!emailPattern.test(values.email.trim())) {
    errors.email = "Escribe un correo válido.";
  }
  if (!values.terms) errors.terms = "Confirma el carácter demostrativo del pedido.";
  return errors;
}

export function validateMessage(value) {
  const message = value.trim();
  if (message.length < 2) return "Escribe un mensaje antes de enviarlo.";
  if (message.length > 280) return "El mensaje no puede superar 280 caracteres.";
  return "";
}

export function validateOffer(values) {
  const errors = {};
  if (values.product.trim().length < 3) errors.product = "Escribe un producto válido.";
  if (!Number.isFinite(Number(values.price)) || Number(values.price) < 1) errors.price = "Ingresa un precio mayor que cero.";
  if (!Number.isInteger(Number(values.minimum)) || Number(values.minimum) < 1) errors.minimum = "Ingresa una compra mínima válida.";
  return errors;
}
