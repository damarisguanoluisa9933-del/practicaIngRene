// Interacciones compartidas por las páginas de Atelier.
const cartButton = document.querySelector(".cart-button");
const cartCount = document.querySelector(".cart-count");
const addToCartButtons = document.querySelectorAll(".add-to-cart");
const searchForm = document.querySelector(".search-form");
const searchInput = document.querySelector("#product-search");
const productCards = document.querySelectorAll(".product-card");
const emptyResults = document.querySelector(".empty-results");
const newsletterForm = document.querySelector(".newsletter-form");
const menuToggle = document.querySelector(".menu-toggle");
const primaryNavigation = document.querySelector(".primary-navigation");
const salesTable = document.querySelector("#sales-table");
const printButton = document.querySelector("#print-report");
const downloadCsvButton = document.querySelector("#download-csv");

const cartStorageKey = "atelier-cart-count";
let itemsInCart = Number.parseInt(localStorage.getItem(cartStorageKey) || "0", 10);
if (!Number.isFinite(itemsInCart) || itemsInCart < 0) itemsInCart = 0;

if (cartCount && cartButton) {
  cartCount.textContent = itemsInCart;
  updateCartLabel();
}

// Actualiza el contador y su nombre accesible cuando se agrega una prenda.
function updateCartLabel() {
  cartCount.textContent = itemsInCart;
  cartButton.setAttribute(
    "aria-label",
    `Carrito, ${itemsInCart} ${itemsInCart === 1 ? "artículo" : "artículos"}`,
  );
}

addToCartButtons.forEach((button) => {
  button.addEventListener("click", () => {
    itemsInCart += 1;
    localStorage.setItem(cartStorageKey, String(itemsInCart));
    if (cartCount && cartButton) updateCartLabel();

    const originalText = button.textContent;
    button.textContent = "Añadido ✓";
    window.setTimeout(() => {
      button.textContent = originalText;
    }, 1300);
  });
});

// Filtra el catálogo y muestra un mensaje cuando no hay coincidencias.
function filterProducts(searchTerm) {
  const normalizedTerm = searchTerm.trim().toLocaleLowerCase("es");
  let visibleProducts = 0;

  productCards.forEach((card) => {
    const searchableText = `${card.dataset.search || ""} ${card.textContent}`.toLocaleLowerCase("es");
    const matches = searchableText.includes(normalizedTerm);
    card.hidden = !matches;
    if (matches) visibleProducts += 1;
  });

  if (emptyResults) emptyResults.hidden = visibleProducts > 0;
}

if (searchInput && productCards.length > 0) {
  const initialSearch = new URLSearchParams(window.location.search).get("q") || "";
  searchInput.value = initialSearch;
  if (initialSearch) filterProducts(initialSearch);

  searchInput.addEventListener("input", () => filterProducts(searchInput.value));
}

// En la landing el formulario navega al catálogo; en el catálogo filtra en sitio.
if (searchForm && searchInput && productCards.length > 0) {
  searchForm.addEventListener("submit", (event) => {
    if (window.location.pathname.endsWith("catalogo.html")) {
      event.preventDefault();
      filterProducts(searchInput.value);
      document.querySelector("#contenido")?.scrollIntoView({ behavior: "smooth" });
    }
  });
}

// Los enlaces de tendencias filtran las prendas del catálogo.
document.querySelectorAll("[data-search-term]").forEach((link) => {
  link.addEventListener("click", () => {
    if (!searchInput) return;
    searchInput.value = link.dataset.searchTerm;
    filterProducts(searchInput.value);
  });
});

// Favoritos con estado accesible, sin requerir una cuenta.
document.querySelectorAll(".favorite-button").forEach((button) => {
  button.setAttribute("aria-pressed", "false");
  button.addEventListener("click", () => {
    const isFavorite = button.getAttribute("aria-pressed") === "true";
    button.setAttribute("aria-pressed", String(!isFavorite));
    button.textContent = isFavorite ? "♡" : "♥";
  });
});

// Menú desplegable para pantallas pequeñas.
if (menuToggle && primaryNavigation) {
  menuToggle.addEventListener("click", () => {
    const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isExpanded));
    menuToggle.setAttribute("aria-label", isExpanded ? "Abrir menú" : "Cerrar menú");
    primaryNavigation.classList.toggle("is-open", !isExpanded);
  });

  primaryNavigation.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Abrir menú");
      primaryNavigation.classList.remove("is-open");
    });
  });
}

// Confirmación local: la página no envía datos a un servicio externo.
if (newsletterForm) {
  newsletterForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!newsletterForm.reportValidity()) return;

    newsletterForm.querySelector(".form-message").textContent =
      "¡Gracias por suscribirte! Pronto recibirás noticias de Atelier.";
    newsletterForm.reset();
  });
}

if (printButton) {
  printButton.addEventListener("click", () => window.print());
}

// Descarga como CSV el contenido visible de la tabla del dashboard.
if (downloadCsvButton && salesTable) {
  downloadCsvButton.addEventListener("click", () => {
    const rows = Array.from(salesTable.querySelectorAll("tr")).map((row) =>
      Array.from(row.querySelectorAll("th, td")).map((cell) => {
        const value = cell.textContent.trim().replaceAll('"', '""');
        return `"${value}"`;
      }),
    );
    const csv = `\uFEFF${rows.map((row) => row.join(",")).join("\r\n")}`;
    const file = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const downloadUrl = URL.createObjectURL(file);
    const downloadLink = document.createElement("a");

    downloadLink.href = downloadUrl;
    downloadLink.download = "atelier-top-prendas.csv";
    document.body.append(downloadLink);
    downloadLink.click();
    downloadLink.remove();
    URL.revokeObjectURL(downloadUrl);
  });
}
