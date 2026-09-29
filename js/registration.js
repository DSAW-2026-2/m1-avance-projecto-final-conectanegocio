const REGISTRATION_KEY = "cn-registered-users";

function normalizeDisplayValue(value) {
  return value.trim().replace(/\s+/g, " ");
}

function normalizeIdentityValue(value) {
  return normalizeDisplayValue(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("es");
}

function readUsers() {
  try {
    const stored = localStorage.getItem(REGISTRATION_KEY);
    if (!stored) return [];
    const users = JSON.parse(stored);
    return Array.isArray(users) ? users : [];
  } catch {
    return [];
  }
}

function writeUsers(users) {
  localStorage.setItem(REGISTRATION_KEY, JSON.stringify(users));
}

function bytesToBase64(bytes) {
  return btoa(String.fromCharCode(...bytes));
}

async function hashPassword(password) {
  if (!globalThis.crypto?.subtle || !globalThis.crypto?.getRandomValues) {
    throw new Error("Web Crypto no está disponible.");
  }

  const saltBytes = crypto.getRandomValues(new Uint8Array(16));
  const salt = bytesToBase64(saltBytes);
  const encoded = new TextEncoder().encode(`${salt}:${password}`);
  const digest = await crypto.subtle.digest("SHA-256", encoded);

  // Este hash solo evita texto plano en la demostración; no sustituye un backend
  // con HTTPS y una función especializada para almacenar contraseñas.
  return {
    passwordHash: bytesToBase64(new Uint8Array(digest)),
    passwordSalt: salt
  };
}

function createUserId() {
  if (typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  if (!crypto.getRandomValues) {
    throw new Error("No hay un generador aleatorio disponible.");
  }

  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function setFieldError(form, name, message) {
  const field = form.elements[name];
  const error = form.querySelector(`[data-error-for="${name}"]`);

  if (field) {
    field.classList.toggle("is-invalid", Boolean(message));
    if (message) {
      field.setAttribute("aria-invalid", "true");
    } else {
      field.removeAttribute("aria-invalid");
    }
  }

  if (error) error.textContent = message;
}

function validateRegistration(values) {
  const errors = {};
  const fullName = normalizeDisplayValue(values.fullName);
  const jobTitle = normalizeDisplayValue(values.jobTitle);

  if (!fullName) {
    errors.fullName = "Ingresa el nombre completo.";
  } else if (fullName.length < 3) {
    errors.fullName = "El nombre debe contener al menos 3 caracteres.";
  }

  if (!values.role) {
    errors.role = "Selecciona Comerciante o Distribuidor.";
  }

  if (!jobTitle) {
    errors.jobTitle = "Ingresa el cargo dentro de la empresa.";
  } else if (jobTitle.length < 2) {
    errors.jobTitle = "El cargo debe contener al menos 2 caracteres.";
  }

  if (!values.password) {
    errors.password = "Ingresa una contraseña.";
  } else if (values.password.length < 8) {
    errors.password = "La contraseña debe contener al menos 8 caracteres.";
  } else if (!/[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]/.test(values.password) || !/\d/.test(values.password)) {
    errors.password = "La contraseña debe incluir al menos una letra y un número.";
  }

  return errors;
}

function showToast(message) {
  const toast = document.querySelector("#global-toast");
  if (!toast) return;
  toast.textContent = message;
  toast.hidden = false;
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => {
    toast.hidden = true;
  }, 6000);
}

export function initializeRegistration() {
  const form = document.querySelector("#registration-form");
  if (!form) return;

  const openButton = document.querySelector("#open-registration");
  const dialog = document.querySelector("#registration-dialog");
  const closeButton = document.querySelector("#close-registration");
  const cancelButton = document.querySelector("#cancel-registration");
  const passwordToggle = document.querySelector("#registration-password-toggle");
  const notification = document.querySelector("#registration-notification");
  const notificationTitle = document.querySelector("#registration-notification-title");
  const notificationText = document.querySelector("#registration-notification-text");
  const notificationClose = document.querySelector("#close-registration-notification");
  const registrationContent = dialog.querySelector(".registration");
  const submitButton = form.querySelector("button[type='submit']");
  const fullNameField = form.elements.fullName;
  const fieldNames = ["fullName", "role", "jobTitle", "password"];

  if (
    !openButton
    || !dialog
    || !closeButton
    || !cancelButton
    || !passwordToggle
    || !notification
    || !notificationTitle
    || !notificationText
    || !notificationClose
    || !registrationContent
    || !submitButton
  ) return;

  const closeNotification = () => {
    notification.hidden = true;
    registrationContent.removeAttribute("inert");
    fullNameField.focus();
  };

  const showNotification = (title, text) => {
    notificationTitle.textContent = title;
    notificationText.textContent = text;
    registrationContent.setAttribute("inert", "");
    notification.hidden = false;
    notificationClose.focus();
  };

  const closeDialog = () => {
    if (dialog.open) dialog.close();
  };

  openButton.addEventListener("click", () => {
    dialog.showModal();
    fullNameField.focus();
  });

  closeButton.addEventListener("click", closeDialog);
  cancelButton.addEventListener("click", closeDialog);
  notificationClose.addEventListener("click", closeNotification);

  dialog.addEventListener("cancel", (event) => {
    if (!notification.hidden) {
      event.preventDefault();
      closeNotification();
    }
  });

  dialog.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    event.preventDefault();
    if (!notification.hidden) {
      closeNotification();
    } else {
      closeDialog();
    }
  });

  dialog.addEventListener("close", () => {
    notification.hidden = true;
    registrationContent.removeAttribute("inert");
    openButton.focus();
  });

  passwordToggle.addEventListener("click", () => {
    const passwordField = form.elements.password;
    const showing = passwordField.type === "text";
    passwordField.type = showing ? "password" : "text";
    passwordToggle.setAttribute("aria-pressed", String(!showing));
    passwordToggle.textContent = showing ? "Mostrar" : "Ocultar";
    passwordToggle.setAttribute("aria-label", showing ? "Mostrar contraseña" : "Ocultar contraseña");
  });

  fieldNames.forEach((name) => {
    const field = form.elements[name];
    field.addEventListener(field.tagName === "SELECT" ? "change" : "input", () => {
      setFieldError(form, name, "");
    });
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const values = {
      fullName: String(formData.get("fullName") || ""),
      role: String(formData.get("role") || ""),
      jobTitle: String(formData.get("jobTitle") || ""),
      password: String(formData.get("password") || ""),
      twoFactorEnabled: form.elements.twoFactorEnabled.checked
    };
    const errors = validateRegistration(values);

    fieldNames.forEach((name) => setFieldError(form, name, errors[name] || ""));
    const firstInvalid = form.querySelector(".is-invalid");
    if (firstInvalid) {
      firstInvalid.focus();
      return;
    }

    const fullName = normalizeDisplayValue(values.fullName);
    const jobTitle = normalizeDisplayValue(values.jobTitle);
    const normalizedFullName = normalizeIdentityValue(fullName);
    const normalizedJobTitle = normalizeIdentityValue(jobTitle);
    const users = readUsers();
    const duplicate = users.some((user) => (
      user.normalizedFullName === normalizedFullName
      && user.role === values.role
      && user.normalizedJobTitle === normalizedJobTitle
    ));

    if (duplicate) {
      showNotification(
        "Este usuario ya está registrado.",
        "Revisa el nombre, el tipo de usuario y el cargo ingresados."
      );
      return;
    }

    const originalButtonText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = "Registrando…";

    try {
      const passwordData = await hashPassword(values.password);
      users.push({
        id: createUserId(),
        fullName,
        normalizedFullName,
        role: values.role,
        jobTitle,
        normalizedJobTitle,
        ...passwordData,
        twoFactorEnabled: values.twoFactorEnabled,
        createdAt: new Date().toISOString()
      });
      writeUsers(users);
      form.reset();
      fieldNames.forEach((name) => setFieldError(form, name, ""));
      form.elements.password.type = "password";
      passwordToggle.textContent = "Mostrar";
      passwordToggle.setAttribute("aria-label", "Mostrar contraseña");
      passwordToggle.setAttribute("aria-pressed", "false");
      closeDialog();
      showToast("Usuario registrado en este navegador. Este es un registro demostrativo y no crea una cuenta en un servidor.");
    } catch (error) {
      console.error("No fue posible completar el registro local.", error);
      showNotification(
        "No fue posible guardar el registro en este navegador.",
        "Revisa los permisos de almacenamiento e inténtalo nuevamente."
      );
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = originalButtonText;
    }
  });
}
