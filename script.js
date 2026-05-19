const fallbackMenu = [
  {
    id: "tokyo-salmon-set",
    category: "sushi",
    categoryLabel: "Sushi",
    name: "Tokyo Salmon Set",
    description: "Demo sushi set s lososem, sezamem a jemnou citrusovou omáčkou.",
    price: 249,
    image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?auto=format&fit=crop&w=900&q=80",
    badge: "Signature"
  },
  {
    id: "shoyu-ramen",
    category: "ramen",
    categoryLabel: "Ramen",
    name: "Shoyu Ramen Bowl",
    description: "Ukázkový ramen s vývarem, nudlemi, vejcem a jarní cibulkou.",
    price: 219,
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=900&q=80",
    badge: "Steam"
  },
  {
    id: "neon-wok",
    category: "wok",
    categoryLabel: "Wok",
    name: "Neon Chicken Wok",
    description: "Kuřecí wok, zelenina, sójovo-zázvorová omáčka a jasmínová rýže.",
    price: 189,
    image: "https://images.unsplash.com/photo-1555126634-323283e090fa?auto=format&fit=crop&w=900&q=80",
    badge: "Hot"
  }
];

const categories = [
  { id: "all", label: "All" },
  { id: "sushi", label: "Sushi" },
  { id: "ramen", label: "Ramen" },
  { id: "wok", label: "Wok" },
  { id: "bao", label: "Bao" },
  { id: "bubble-tea", label: "Bubble Tea" },
  { id: "dessert", label: "Dezerty" }
];

const dom = {
  loader: document.querySelector("#loader"),
  menuTabs: document.querySelector("#menu-tabs"),
  menuContainer: document.querySelector("#menu-items"),
  cartItems: document.querySelector("#cart-items"),
  cartEmpty: document.querySelector("#cart-empty"),
  cartCount: document.querySelector("#cart-count"),
  cartTotal: document.querySelector("#cart-total"),
  mobileCartTotal: document.querySelector("#mobile-cart-total"),
  mobileCartButton: document.querySelector("#mobile-cart-button"),
  orderForm: document.querySelector("#order-form"),
  formMessage: document.querySelector("#form-message"),
  toast: document.querySelector("#toast"),
  paymentModal: document.querySelector("#payment-modal"),
  successModal: document.querySelector("#success-modal"),
  paymentSummary: document.querySelector("#payment-summary"),
  pickupCustomRadio: document.querySelector("#pickup-custom-radio"),
  customTimeWrap: document.querySelector("#custom-time-wrap"),
  customTimeInput: document.querySelector("#pickup-custom-time"),
  menuToggle: document.querySelector(".menu-toggle"),
  siteNav: document.querySelector("#site-nav"),
  modeToggle: document.querySelector("#mode-toggle"),
  videoToggle: document.querySelector("#video-toggle"),
  reservationForm: document.querySelector("#reservation-form"),
  reservationMessage: document.querySelector("#reservation-message"),
  cursorGlow: document.querySelector("#cursor-glow"),
  chopstickCursor: document.querySelector("#chopstick-cursor"),
  carousel: document.querySelector("#testimonial-carousel"),
  carouselDots: document.querySelector("#carousel-dots")
};

let menuItems = [];
let activeCategory = "all";
let cart = [];
let toastTimer;
let testimonialIndex = 0;

function formatPrice(price) {
  return `${Number(price).toLocaleString("cs-CZ")} Kč`;
}

async function loadMenu() {
  try {
    const response = await fetch("data/menu.json", { cache: "no-store" });
    if (!response.ok) throw new Error("Menu JSON unavailable");
    const data = await response.json();
    menuItems = Array.isArray(data.items) ? data.items : fallbackMenu;
  } catch (error) {
    menuItems = fallbackMenu;
    console.warn("Using fallback menu:", error.message);
  }
}

function renderTabs() {
  dom.menuTabs.innerHTML = categories.map((category) => `
    <button class="category-tab ${category.id === activeCategory ? "is-active" : ""}" type="button" data-category="${category.id}">
      ${category.label}
    </button>
  `).join("");
}

function renderMenu() {
  const filtered = activeCategory === "all"
    ? menuItems
    : menuItems.filter((item) => item.category === activeCategory);

  dom.menuContainer.innerHTML = filtered.map((item) => `
    <article class="menu-card reveal" data-menu-card="${item.id}">
      <div class="menu-image">
        <img loading="lazy" src="${item.image}" alt="${item.name}">
        <span>${item.badge || item.categoryLabel}</span>
      </div>
      <div class="menu-content">
        <p class="menu-category">${item.categoryLabel}</p>
        <h3>${item.name}</h3>
        <p>${item.description}</p>
        <div class="menu-bottom">
          <strong>${formatPrice(item.price)}</strong>
          <button class="btn btn-primary add-to-cart magnetic" type="button" data-id="${item.id}">Přidat</button>
        </div>
      </div>
    </article>
  `).join("");

  animateNewCards();
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

  dom.cartCount.textContent = count;
  dom.cartTotal.textContent = formatPrice(total);
  dom.mobileCartTotal.textContent = formatPrice(total);
  dom.cartEmpty.classList.toggle("is-hidden", cart.length > 0);

  dom.cartItems.innerHTML = cart.map((item) => `
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

  dom.formMessage.textContent = cart.length
    ? "Vyplňte kontakt a pokračujte k demo platbě."
    : "Nejdříve přidejte alespoň jednu položku do košíku.";
}

function showToast(message) {
  clearTimeout(toastTimer);
  dom.toast.textContent = message;
  dom.toast.classList.add("is-visible");
  toastTimer = setTimeout(() => dom.toast.classList.remove("is-visible"), 2200);
}

function addToCart(id) {
  const menuItem = menuItems.find((item) => item.id === id);
  if (!menuItem) return;

  const existing = cart.find((item) => item.id === id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...menuItem, quantity: 1 });
  }

  const card = document.querySelector(`[data-menu-card="${id}"]`);
  if (card && window.gsap) {
    gsap.fromTo(card, { scale: 1 }, { scale: 1.025, yoyo: true, repeat: 1, duration: 0.18, ease: "power2.out" });
  }

  renderCart();
  showToast(`${menuItem.name} přidáno do košíku.`);
}

function updateQuantity(id, action) {
  const item = cart.find((cartItem) => cartItem.id === id);
  if (!item) return;

  if (action === "increase") item.quantity += 1;
  if (action === "decrease") item.quantity -= 1;

  if (action === "remove" || item.quantity <= 0) {
    cart = cart.filter((cartItem) => cartItem.id !== id);
  }

  renderCart();
}

function getPickupValue(formData) {
  const pickup = formData.get("pickup");
  if (pickup === "Vlastní čas") {
    return dom.customTimeInput.value ? `Vlastní čas: ${dom.customTimeInput.value}` : "";
  }
  return pickup || "";
}

function buildOrderPayload() {
  const formData = new FormData(dom.orderForm);
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
    source: "github-pages-premium-demo"
  };
}

function validateOrder() {
  if (!cart.length) {
    dom.formMessage.textContent = "Košík je prázdný. Přidejte prosím alespoň jednu položku.";
    showToast("Nejdříve přidejte jídlo do košíku.");
    return false;
  }

  const formData = new FormData(dom.orderForm);
  const pickup = getPickupValue(formData);

  if (!dom.orderForm.checkValidity() || !pickup) {
    dom.formMessage.textContent = "Doplňte jméno, telefon a čas vyzvednutí.";
    dom.orderForm.reportValidity();
    return false;
  }

  if (formData.get("pickup") === "Vlastní čas" && !dom.customTimeInput.value) {
    dom.formMessage.textContent = "U vlastního vyzvednutí zadejte konkrétní čas.";
    dom.customTimeInput.focus();
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

  dom.paymentSummary.innerHTML = `
    ${lines}
    <div class="payment-line"><span>Vyzvednutí</span><strong>${payload.pickup}</strong></div>
    <div class="payment-line payment-total"><span>Celkem</span><strong>${formatPrice(payload.total)}</strong></div>
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

// Production payment integration placeholder:
// Replace this demo function with backend POST /api/create-payment.
// Example payload:
// {
//   customer: { name, phone, email },
//   pickup: "Za 30 minut",
//   items: [{ id, name, quantity, unitPrice, lineTotal }],
//   total: 438,
//   currency: "CZK"
// }
async function createPaymentSession(orderPayload) {
  console.info("Demo payload for /api/create-payment", JSON.stringify(orderPayload, null, 2));
  return { provider: "demo", status: "ready", checkoutUrl: null, payload: orderPayload };
}

function initLenis() {
  if (!window.Lenis) return;
  const lenis = new Lenis({ duration: 1.08, smoothWheel: true, wheelMultiplier: 0.86 });
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
}

function initAnimations() {
  if (!window.gsap) {
    setTimeout(() => dom.loader?.remove(), 500);
    return;
  }
  if (window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

  gsap.to(dom.loader, { autoAlpha: 0, delay: 0.58, duration: 0.7, ease: "power2.out", onComplete: () => dom.loader?.remove() });
  gsap.from(".hero .reveal", { y: 36, autoAlpha: 0, stagger: 0.12, duration: 0.9, ease: "power3.out", delay: 0.35 });
  gsap.to(".hero-media img", { scale: 1.08, duration: 9, ease: "power1.out" });

  if (window.ScrollTrigger) {
    gsap.utils.toArray(".reveal").forEach((element) => {
      gsap.fromTo(element, { y: 42, autoAlpha: 0 }, {
        y: 0,
        autoAlpha: 1,
        duration: 0.82,
        ease: "power3.out",
        scrollTrigger: { trigger: element, start: "top 86%" }
      });
    });

    gsap.utils.toArray(".speciality-card, .masonry figure").forEach((card) => {
      gsap.to(card.querySelector("img"), {
        yPercent: -8,
        ease: "none",
        scrollTrigger: { trigger: card, scrub: true }
      });
    });
  }
}

function animateNewCards() {
  if (!window.gsap) return;
  gsap.fromTo("#menu-items .menu-card", { y: 18, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.05, duration: 0.42, ease: "power2.out" });
}

function initMagneticButtons() {
  document.querySelectorAll(".magnetic").forEach((button) => {
    button.addEventListener("mousemove", (event) => {
      const rect = button.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      button.style.transform = `translate(${x * 0.09}px, ${y * 0.18}px)`;
    });
    button.addEventListener("mouseleave", () => {
      button.style.transform = "";
    });
  });
}

function initCursor() {
  window.addEventListener("pointermove", (event) => {
    const x = `${event.clientX}px`;
    const y = `${event.clientY}px`;
    if (dom.cursorGlow) {
      dom.cursorGlow.style.left = x;
      dom.cursorGlow.style.top = y;
    }
    if (dom.chopstickCursor) {
      dom.chopstickCursor.style.left = x;
      dom.chopstickCursor.style.top = y;
    }
  });
}

function initTestimonials() {
  const testimonials = Array.from(document.querySelectorAll(".testimonial"));
  if (!testimonials.length) return;

  dom.carouselDots.innerHTML = testimonials.map((_, index) => `<button type="button" aria-label="Recenze ${index + 1}" data-index="${index}"></button>`).join("");
  const dots = Array.from(dom.carouselDots.querySelectorAll("button"));

  function show(index) {
    testimonialIndex = index;
    testimonials.forEach((item, itemIndex) => item.classList.toggle("is-active", itemIndex === index));
    dots.forEach((dot, dotIndex) => dot.classList.toggle("is-active", dotIndex === index));
  }

  dots.forEach((dot) => dot.addEventListener("click", () => show(Number(dot.dataset.index))));
  show(0);
  setInterval(() => show((testimonialIndex + 1) % testimonials.length), 4800);
}

function bindEvents() {
  dom.menuTabs.addEventListener("click", (event) => {
    const button = event.target.closest(".category-tab");
    if (!button) return;
    activeCategory = button.dataset.category;
    renderTabs();
    renderMenu();
  });

  dom.menuContainer.addEventListener("click", (event) => {
    const button = event.target.closest(".add-to-cart");
    if (button) addToCart(button.dataset.id);
  });

  dom.cartItems.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-action]");
    if (!button) return;
    updateQuantity(button.dataset.id, button.dataset.action);
  });

  dom.orderForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!validateOrder()) return;
    const payload = buildOrderPayload();
    await createPaymentSession(payload);
    renderPaymentSummary(payload);
    openModal(dom.paymentModal);
  });

  document.querySelectorAll("input[name='pickup']").forEach((radio) => {
    radio.addEventListener("change", () => {
      const isCustom = dom.pickupCustomRadio.checked;
      dom.customTimeWrap.classList.toggle("is-hidden", !isCustom);
      dom.customTimeInput.toggleAttribute("required", isCustom);
      if (!isCustom) dom.customTimeInput.value = "";
    });
  });

  document.querySelector("#simulate-payment").addEventListener("click", () => {
    closeModal(dom.paymentModal);
    openModal(dom.successModal);
  });
  document.querySelector("#modal-close").addEventListener("click", () => closeModal(dom.paymentModal));
  document.querySelector("#modal-cancel").addEventListener("click", () => closeModal(dom.paymentModal));
  document.querySelector("#success-close").addEventListener("click", () => closeModal(dom.successModal));
  document.querySelector("#new-order").addEventListener("click", () => {
    closeModal(dom.successModal);
    cart = [];
    dom.orderForm.reset();
    dom.customTimeWrap.classList.add("is-hidden");
    dom.customTimeInput.removeAttribute("required");
    renderCart();
  });

  [dom.paymentModal, dom.successModal].forEach((modal) => {
    modal.addEventListener("click", (event) => {
      if (event.target === modal) closeModal(modal);
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeModal(dom.paymentModal);
      closeModal(dom.successModal);
    }
  });

  dom.mobileCartButton.addEventListener("click", () => document.querySelector("#objednat").scrollIntoView({ behavior: "smooth" }));

  dom.menuToggle.addEventListener("click", () => {
    const isOpen = dom.siteNav.classList.toggle("is-open");
    dom.menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  dom.siteNav.addEventListener("click", (event) => {
    if (event.target.matches("a")) {
      dom.siteNav.classList.remove("is-open");
      dom.menuToggle.setAttribute("aria-expanded", "false");
    }
  });

  dom.modeToggle.addEventListener("click", () => {
    const root = document.documentElement;
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    dom.modeToggle.textContent = next === "dark" ? "LIGHT" : "DARK";
  });

  dom.videoToggle.addEventListener("click", () => {
    document.body.classList.toggle("video-hero-active");
    dom.videoToggle.textContent = document.body.classList.contains("video-hero-active") ? "Image hero mode" : "Video hero mode";
  });

  dom.reservationForm.addEventListener("submit", (event) => {
    event.preventDefault();
    dom.reservationMessage.textContent = "Demo rezervace připravena. V ostré verzi se odešle provozovateli.";
    showToast("Demo rezervační poptávka připravena.");
  });
}

async function init() {
  await loadMenu();
  renderTabs();
  renderMenu();
  renderCart();
  bindEvents();
  initLenis();
  initAnimations();
  initMagneticButtons();
  initCursor();
  initTestimonials();
}

document.addEventListener("DOMContentLoaded", init);
