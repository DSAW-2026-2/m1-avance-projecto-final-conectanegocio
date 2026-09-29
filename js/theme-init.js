try {
  if (localStorage.getItem("cn-theme") === "dark") {
    document.documentElement.classList.add("dark");
  }
} catch {
  // El tema claro permanece como alternativa si el almacenamiento está bloqueado.
}
