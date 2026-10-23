// Interacciones pequeñas para la tienda; el carrito y la suscripción son demostrativos.
const cartButton = document.querySelector(".cart-button");
const cartCount = document.querySelector(".cart-count");
const addToCartButtons = document.querySelectorAll(".add-to-cart");
const searchForm = document.querySelector(".search-form");
const searchInput = document.querySelector("#product-search");
const productCards = document.querySelectorAll(".product-card");
const emptyResults = document.querySelector(".empty-results");
const trendingLinks = document.querySelectorAll("[data-search-term]");
const newsletterForm = document.querySelector(".newsletter-form");
const menuToggle = document.querySelector(".menu-toggle");
const primaryNavigation = document.querySelector(".primary-navigation");

let itemsInCart = 0;

// Actualiza el contador y el nombre accesible del botón del carrito.
addToCartButtons.forEach((button) => {
  button.addEventListener("click", () => {
    itemsInCart += 1;
    cartCount.textContent = itemsInCart;
    cartButton.setAttribute(
      "aria-label",
      `Carrito, ${itemsInCart} ${itemsInCart === 1 ? "artículo" : "artículos"}`,
    );

    const originalText = button.textContent;
    button.textContent = "Añadido ✓";
    window.setTimeout(() => {
      button.textContent = originalText;
    }, 1300);
  });
});

// Filtra la cuadrícula por nombre o categoría de producto.
function filterProducts(searchTerm) {
  const normalizedTerm = searchTerm.trim().toLocaleLowerCase("es");
  let visibleProducts = 0;

  productCards.forEach((card) => {
    const searchableText = `${card.dataset.search} ${card.textContent}`.toLocaleLowerCase("es");
    const matches = searchableText.includes(normalizedTerm);
    card.hidden = !matches;
    if (matches) visibleProducts += 1;
  });

  emptyResults.hidden = visibleProducts > 0;
}

searchInput.addEventListener("input", () => filterProducts(searchInput.value));
searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  filterProducts(searchInput.value);
  document.querySelector("#catalogo").scrollIntoView({ behavior: "smooth" });
});

// Los enlaces de tendencias activan también la búsqueda correspondiente.
trendingLinks.forEach((link) => {
  link.addEventListener("click", () => {
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

// Confirmación local: la página no envía datos a un servicio externo.
newsletterForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!newsletterForm.reportValidity()) return;

  newsletterForm.querySelector(".form-message").textContent =
    "¡Gracias por suscribirte! Pronto recibirás noticias de Atelier.";
  newsletterForm.reset();
});
