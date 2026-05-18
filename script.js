const menuItems = [
  { id: "kureci-smes-ryze", category: "main", categoryLabel: "Hlavní jídla", name: "Kuřecí směs s rýží", description: "Ukázková demo položka s jemnou omáčkou a dušenou rýží.", price: 159 },
  { id: "smazene-nudle-zelenina", category: "main", categoryLabel: "Hlavní jídla", name: "Smažené nudle se zeleninou", description: "Demo návrh rychlého jídla s křupavou zeleninou.", price: 149 },
  { id: "pikantni-masova-smes", category: "main", categoryLabel: "Hlavní jídla", name: "Pikantní masová směs", description: "Ukázková pikantnější varianta pro zákazníky, kteří chtějí výraznější chuť.", price: 169 },
  { id: "zeleninove-nudle", category: "lunch", categoryLabel: "Rychlé obědy", name: "Zeleninové nudle", description: "Lehká demo porce vhodná na rychlý oběd s sebou.", price: 139 },
  { id: "obedova-miska", category: "lunch", categoryLabel: "Rychlé obědy", name: "Obědová miska", description: "Ukázková miska s rýží, zeleninou a omáčkou dne.", price: 145 },
  { id: "polevka-dne", category: "soup", categoryLabel: "Polévky", name: "Polévka dne", description: "Demo položka. Reálný druh polévky doplní provozovatel podle nabídky.", price: 49 },
  { id: "vyvar-demo", category: "soup", categoryLabel: "Polévky", name: "Jemný vývar", description: "Bezpečná ukázková položka pro prezentaci polévkové nabídky.", price: 55 },
  { id: "domaci-limonada", category: "drink", categoryLabel: "Nápoje", name: "Domácí limonáda", description: "Ukázkový nealko nápoj pro objednávkový systém.", price: 59 },
  { id: "cola-nealko", category: "drink", categoryLabel: "Nápoje", name: "Cola / nealko", description: "Demo položka pro běžné balené nealkoholické nápoje.", price: 45 },
  { id: "extra-ryze", category: "side", categoryLabel: "Extra přílohy", name: "Extra rýže", description: "Doplňková ukázková příloha k hlavním jídlům.", price: 35 },
  { id: "extra-omacka", category: "side", categoryLabel: "Extra přílohy", name: "Extra omáčka", description: "Demo příplatek pro zákazníky, kteří chtějí omáčku navíc.", price: 25 }
];

const categoryTabs = document.querySelectorAll(".category-tab");
const menuContainer = document.querySelector("#menu-items");
const cartItemsEl = document.querySelector("#cart-items");
const cartEmptyEl = document.querySelector("#cart-empty");
const cartCountEl = document.querySelector("#cart-count");
const cartTotalEl = document.querySelector("#cart-total");
const mobileCartTotalEl = document.querySelector("#mobile-cart-total");
const mobileCartButton = document.querySelector("#mobile-cart-button");
const orderForm = document.querySelector("#order-form");
const formMessage = document.querySelector("#form-message");
const toast = document.querySelector("#toast");
const paymentModal = document.querySelector("#payment-modal");
const successModal = document.querySelector("#success-modal");
const paymentSummary = document.querySelector("#payment-summary");
const pickupCustomRadio = document.querySelector("#pickup-custom-radio");
const customTimeWrap = document.querySelector("#custom-time-wrap");
const customTimeInput = document.querySelector("#pickup-custom-time");
const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector("#site-nav");

let activeCategory = "all";
let cart = [];
let toastTimer;

function formatPrice(price) {
  return `${price.toLocaleString("cs-CZ")} Kč`;
}

function renderMenu() {
  const filteredItems = activeCategory === "all"
    ? menuItems
    : menuItems.filter((item) => item.category === activeCategory);

  menuContainer.innerHTML = filteredItems.map((item) => `
    <article class="menu-card" data-menu-card="${item.id}">
      <span class="menu-category">${item.categoryLabel}</span>
      <h3>${item.name}</h3>
      <p>${item.description}</p>
      <div class="menu-bottom">
        <span class="price">${formatPrice(item.price)}</span>
        <button class="btn btn-primary add-to-cart" type="button" data-id="${item.id}">Přidat do košíku</button>
      </div>
    </article>
  `).join("");
}

function getCartTotal() {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function getCartCount() {
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}

function renderCart() {
  const count = getCartCount();
  const total = getCartTotal();

  cartCountEl.textContent = count;
  cartTotalEl.textContent = formatPrice(total);
  mobileCartTotalEl.textContent = formatPrice(total);
  cartEmptyEl.classList.toggle("is-hidden", cart.length > 0);

  cartItemsEl.innerHTML = cart.map((item) => `
    <div class="cart-item">
      <div>
        <h3>${item.name}</h3>
        <p>${formatPrice(item.price)} za kus</p>
      </div>
      <div class="cart-controls" aria-label="Množství pro ${item.name}">
        <button class="qty-btn" type="button" data-action="decrease" data-id="${item.id}" aria-label="Snížit množství ${item.name}">-</button>
        <span class="qty">${item.quantity}</span>
        <button class="qty-btn" type="button" data-action="increase" data-id="${item.id}" aria-label="Zvýšit množství ${item.name}">+</button>
        <button class="remove-btn" type="button" data-action="remove" data-id="${item.id}" aria-label="Odebrat ${item.name}">×</button>
      </div>
    </div>
  `).join("");

  formMessage.textContent = cart.length
    ? "Vyplňte kontakt a pokračujte k demo platbě."
    : "Nejdříve přidejte alespoň jednu položku do košíku.";
}

function showToast(message) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("is-visible");
  toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2200);
}

function addToCart(id) {
  const menuItem = menuItems.find((item) => item.id === id);
  if (!menuItem) return;

  const existingItem = cart.find((item) => item.id === id);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...menuItem, quantity: 1 });
  }

  const card = document.querySelector(`[data-menu-card="${id}"]`);
  if (card) {
    card.classList.remove("added");
    requestAnimationFrame(() => card.classList.add("added"));
  }

  renderCart();
  showToast(`${menuItem.name} přidáno do košíku.`);
}

function updateQuantity(id, action) {
  const item = cart.find((cartItem) => cartItem.id === id);
  if (!item) return;

  if (action === "increase") {
    item.quantity += 1;
  }

  if (action === "decrease") {
    item.quantity -= 1;
  }

  if (action === "remove" || item.quantity <= 0) {
    cart = cart.filter((cartItem) => cartItem.id !== id);
  }

  renderCart();
}

function getPickupValue(formData) {
  const pickup = formData.get("pickup");
  if (pickup === "Vlastní čas") {
    return customTimeInput.value ? `Vlastní čas: ${customTimeInput.value}` : "";
  }
  return pickup || "";
}

function buildOrderPayload() {
  const formData = new FormData(orderForm);
  return {
    customer: {
      name: formData.get("name")?.trim(),
      phone: formData.get("phone")?.trim(),
      email: formData.get("email")?.trim() || null
    },
    pickup: getPickupValue(formData),
    note: formData.get("note")?.trim() || null,
    items: cart.map((item) => ({
      id: item.id,
      name: item.name,
      quantity: item.quantity,
      unitPrice: item.price,
      lineTotal: item.price * item.quantity
    })),
    total: getCartTotal(),
    currency: "CZK",
    source: "github-pages-demo"
  };
}

function validateOrder() {
  if (!cart.length) {
    formMessage.textContent = "Košík je prázdný. Přidejte prosím alespoň jednu položku.";
    showToast("Nejdříve přidejte jídlo do košíku.");
    return false;
  }

  const formData = new FormData(orderForm);
  const pickup = getPickupValue(formData);

  if (!orderForm.checkValidity() || !pickup) {
    formMessage.textContent = "Doplňte jméno, telefon a čas vyzvednutí.";
    orderForm.reportValidity();
    return false;
  }

  if (formData.get("pickup") === "Vlastní čas" && !customTimeInput.value) {
    formMessage.textContent = "U vlastního vyzvednutí zadejte konkrétní čas.";
    customTimeInput.focus();
    return false;
  }

  return true;
}

function renderPaymentSummary(payload) {
  const lines = payload.items.map((item) => `
    <div class="payment-line">
      <span>${item.quantity}× ${item.name}</span>
      <strong>${formatPrice(item.lineTotal)}</strong>
    </div>
  `).join("");

  paymentSummary.innerHTML = `
    ${lines}
    <div class="payment-line">
      <span>Vyzvednutí</span>
      <strong>${payload.pickup}</strong>
    </div>
    <div class="payment-line payment-total">
      <span>Celkem</span>
      <strong>${formatPrice(payload.total)}</strong>
    </div>
  `;
}

function openModal(modal) {
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  const closeButton = modal.querySelector("button");
  if (closeButton) closeButton.focus();
}

function closeModal(modal) {
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

// Future production payment integration:
// Replace this demo function with a backend call to POST /api/create-payment.
// Example payload is returned by buildOrderPayload() and contains customer,
// pickup time, cart items, total price and currency.
async function createPaymentSession(orderPayload) {
  console.info("Demo payment payload for /api/create-payment:", JSON.stringify(orderPayload, null, 2));

  // Production example:
  // const response = await fetch("/api/create-payment", {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify(orderPayload)
  // });
  // const { checkoutUrl } = await response.json();
  // window.location.href = checkoutUrl;

  return {
    provider: "demo",
    status: "ready",
    checkoutUrl: null,
    payload: orderPayload
  };
}

categoryTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    activeCategory = tab.dataset.category;
    categoryTabs.forEach((button) => button.classList.toggle("is-active", button === tab));
    renderMenu();
  });
});

menuContainer.addEventListener("click", (event) => {
  const button = event.target.closest(".add-to-cart");
  if (button) addToCart(button.dataset.id);
});

cartItemsEl.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;
  updateQuantity(button.dataset.id, button.dataset.action);
});

orderForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!validateOrder()) return;

  const payload = buildOrderPayload();
  await createPaymentSession(payload);
  renderPaymentSummary(payload);
  openModal(paymentModal);
});

document.querySelectorAll("input[name='pickup']").forEach((radio) => {
  radio.addEventListener("change", () => {
    const isCustom = pickupCustomRadio.checked;
    customTimeWrap.classList.toggle("is-hidden", !isCustom);
    customTimeInput.toggleAttribute("required", isCustom);
    if (!isCustom) customTimeInput.value = "";
  });
});

document.querySelector("#simulate-payment").addEventListener("click", () => {
  closeModal(paymentModal);
  openModal(successModal);
});

document.querySelector("#modal-close").addEventListener("click", () => closeModal(paymentModal));
document.querySelector("#modal-cancel").addEventListener("click", () => closeModal(paymentModal));
document.querySelector("#success-close").addEventListener("click", () => closeModal(successModal));

document.querySelector("#new-order").addEventListener("click", () => {
  closeModal(successModal);
  cart = [];
  orderForm.reset();
  customTimeWrap.classList.add("is-hidden");
  customTimeInput.removeAttribute("required");
  renderCart();
});

[paymentModal, successModal].forEach((modal) => {
  modal.addEventListener("click", (event) => {
    if (event.target === modal) closeModal(modal);
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeModal(paymentModal);
    closeModal(successModal);
  }
});

mobileCartButton.addEventListener("click", () => {
  document.querySelector("#objednat").scrollIntoView({ behavior: "smooth" });
});

menuToggle.addEventListener("click", () => {
  const isOpen = siteNav.classList.toggle("is-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

siteNav.addEventListener("click", (event) => {
  if (event.target.matches("a")) {
    siteNav.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
  }
});

renderMenu();
renderCart();
