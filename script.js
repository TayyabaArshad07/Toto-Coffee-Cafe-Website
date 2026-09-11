const menuItems = [
  {
    id: 1,
    name: "Classic Cappuccino",
    category: "Coffee",
    type: "Hot Coffee",
    price: 1250,
    description: "Velvety foam, double espresso, and a little cocoa",
    image: "/images/cuppacino.jfif",
  },
  {
    id: 2,
    name: "Caramel Latte",
    category: "Coffee",
    type: "Hot Coffee",
    price: 1400,
    description: "Silky steamed milk with house caramel and espresso",
    image: "/images/caramel latte.jfif",
  },
  {
    id: 3,
    name: "Spanish Latte",
    category: "Coffee",
    type: "Espresso",
    price: 1550,
    description: "Bold espresso softened with sweetened condensed milk",
    image: "/images/spanish latte.jfif",
  },
  {
    id: 4,
    name: "Iced Mocha",
    category: "Cold Drinks",
    type: "Cold Coffee",
    price: 1500,
    description: "Cold brew, cacao, and cream over hand-cut ice",
    image: "/images/Iced Mocha.jfif",
  },
  {
    id: 5,
    name: "Butter Croissant",
    category: "Pastries",
    type: "Pastries",
    price: 950,
    description: "Flaky, golden, and baked fresh every morning",
    image: "/images/Butter Croissant.jfif",
  },
  {
    id: 6,
    name: "Chocolate Brownie",
    category: "Desserts",
    type: "Desserts",
    price: 1100,
    description: "Fudgy dark chocolate with icecream and chocolate syrup",
    image: "/images/FOREVER LOVE🤎🍫.jfif",
  },
  {
    id: 7,
    name: "Brown Sugar Cinnamon Latte",
    category: "Coffee",
    type: "Hot Coffee",
    price: 1650,
    description: "Our signature comfort drink with warm spice",
    image: "/images/caramel latte.jfif",
  },
  {
    id: 8,
    name: "Matcha Cloud",
    category: "Cold Drinks",
    type: "Tea",
    price: 1550,
    description: "Ceremonial matcha, oat milk, and a soft vanilla cloud",
    image: "/images/cafe.jfif",
  },
];

const categories = ["All", "Coffee", "Cold Drinks", "Pastries", "Desserts"];

let activeCategory = "All";
let cart = [];
let orderType = "Pickup";
let orderPlaced = false;

const money = (value) => `PKR ${value.toLocaleString()}`;

const grid = document.querySelector("#product-grid");
const filters = document.querySelector("#filters");
const count = document.querySelector("#cart-count");
const backdrop = document.querySelector("#drawer-backdrop");
const cartContent = document.querySelector("#cart-content");
const drawerTitle = document.querySelector("#drawer-title");

function renderFilters() {
  filters.innerHTML = categories
    .map((category) => {
      const activeClass = activeCategory === category ? "active" : "";

      return `
        <button class="filter ${activeClass}" data-category="${category}">
          ${category}
        </button>
      `;
    })
    .join("");

  filters.querySelectorAll("[data-category]").forEach((button) => {
    button.addEventListener("click", () => {
      activeCategory = button.dataset.category;
      renderFilters();
      renderProducts();
    });
  });
}

function renderProducts() {
  const visible =
    activeCategory === "All"
      ? menuItems.slice(0, 6)
      : menuItems.filter((item) => item.category === activeCategory);
  grid.innerHTML = visible
    .map((item, index) => {
      return `
        <article
          class="product-card product-${item.id}"
          style="animation-delay: ${index * 60}ms"
        >
          <div class="product-image">
            <img src="${item.image}" alt="${item.name}" />
            <span class="product-type">${item.type}</span>
          </div>
          <div class="product-info">
            <div>
              <h3>${item.name}</h3>
              <p>${item.description}</p>
            </div>
            <div class="product-bottom">
              <strong>${money(item.price)}</strong>
              <button
                class="add-button"
                data-add="${item.id}"
                aria-label="Add ${item.name} to order"
              >
                +
              </button>
            </div>
          </div>
        </article>
      `;
    })
    .join("");

  grid.querySelectorAll("[data-add]").forEach((button) => {
    button.addEventListener("click", () => {
      addToCart(Number(button.dataset.add));
    });
  });
}

function addToCart(id) {
  const item = menuItems.find((product) => product.id === id);
  const existing = cart.find((product) => product.id === id);
  if (existing) existing.quantity += 1;
  else cart.push({ ...item, quantity: 1 });
  updateCartCount();
  openCart();
}

function updateCartCount() {
  count.textContent = cart.reduce((total, item) => total + item.quantity, 0);
}

function changeQuantity(id, amount) {
  const item = cart.find((product) => product.id === id);

  if (item) item.quantity += amount;

  cart = cart.filter((product) => product.quantity > 0);
  renderCart();
}

function subtotal() {
  return cart.reduce((total, item) => total + item.price * item.quantity, 0);
}

function renderCart() {
  updateCartCount();

  if (orderPlaced) {
    drawerTitle.textContent = "All set";
    cartContent.innerHTML = `
      <div class="order-success">
        <div class="success-mark">✓</div>
        <h3>Your order is brewing</h3>
        <p>
          Thanks, friend. It will be ready in about
          <strong>15-20 minutes</strong>
        </p>
        <button class="button button-dark" data-close-cart>
          Back to browsing
        </button>
      </div>
    `;

    cartContent
      .querySelector("[data-close-cart]")
      .addEventListener("click", closeCart);

    return;
  }

  drawerTitle.textContent = "A little treat";

  if (!cart.length) {
    cartContent.innerHTML = `
      <div class="empty-cart">
        <span>✦</span>
        <p>Your basket is taking a quiet moment</p>
        <button class="text-link" data-scroll="menu">
          Explore the menu <span>→</span>
        </button>
      </div>
    `;

    cartContent
      .querySelector("[data-scroll]")
      .addEventListener("click", closeCart);

    return;
  }

  const total = subtotal() + 100;

  const cartItems = cart
    .map(
      (item) => `
        <div class="cart-item">
          <img src="${item.image}" alt="" />
          <div>
            <h4>${item.name}</h4>
            <span>${money(item.price)}</span>
            <div class="quantity">
              <button data-minus="${item.id}">−</button>
              <b>${item.quantity}</b>
              <button data-plus="${item.id}">+</button>
            </div>
          </div>
        </div>
      `,
    )
    .join("");

  cartContent.innerHTML = `
    <div class="cart-items">
      ${cartItems}
    </div>
    <div class="cart-actions">
      <button class="clear-button" id="clear-cart">Clear cart</button>
      <button class="button button-dark" id="checkout">
        Checkout <span>↗</span>
      </button>
    </div>
    <div id="checkout-slot"></div>
  `;

  cartContent.querySelectorAll("[data-minus]").forEach((button) => {
    button.addEventListener("click", () => {
      changeQuantity(Number(button.dataset.minus), -1);
    });
  });

  cartContent.querySelectorAll("[data-plus]").forEach((button) => {
    button.addEventListener("click", () => {
      changeQuantity(Number(button.dataset.plus), 1);
    });
  });

  cartContent.querySelector("#clear-cart").addEventListener("click", () => {
    cart = [];
    renderCart();
  });

  cartContent.querySelector("#checkout").addEventListener("click", () => {
    renderCheckout(total);
  });
}

function renderCheckout(total) {
  const slot = document.querySelector("#checkout-slot");
  const pickupClass = orderType === "Pickup" ? "selected" : "";
  const dineInClass = orderType === "Dine-in" ? "selected" : "";

  slot.innerHTML = `
    <form class="checkout-form" id="checkout-form">
      <h3>Almost there</h3>
      <div class="order-toggle">
        <button type="button" class="${pickupClass}" data-type="Pickup">
          Pickup
        </button>
        <button type="button" class="${dineInClass}" data-type="Dine-in">
          Dine-in
        </button>
      </div>
      <input required placeholder="Your name" />
      <input required type="email" placeholder="Email address" />
      <div class="total-line">
        <span>Subtotal</span>
        <b>${money(subtotal())}</b>
      </div>
      <div class="total-line">
        <span>Service & tax</span>
        <b>PKR 100</b>
      </div>
      <div class="total-line grand">
        <span>Total</span>
        <b>${money(total)}</b>
      </div>
      <button class="button button-dark full" type="submit">
        Place mock order <span>↗</span>
      </button>
    </form>
  `;

  slot.querySelectorAll("[data-type]").forEach((button) => {
    button.addEventListener("click", () => {
      orderType = button.dataset.type;
      renderCheckout(total);
    });
  });

  slot.querySelector("form").addEventListener("submit", (event) => {
    event.preventDefault();
    orderPlaced = true;
    cart = [];
    renderCart();
  });
}

function openCart() {
  backdrop.hidden = false;
  renderCart();
}
function closeCart() {
  backdrop.hidden = true;
}

document.querySelectorAll("[data-open-cart]").forEach((button) => {
  button.addEventListener("click", openCart);
});

document.querySelector("[data-close-cart]").addEventListener("click", closeCart);

backdrop.addEventListener("click", (event) => {
  if (event.target === backdrop) closeCart();
});

document.querySelectorAll("[data-scroll]").forEach((button) => {
  button.addEventListener("click", () => {
    document
      .getElementById(button.dataset.scroll)
      ?.scrollIntoView({ behavior: "smooth" });
  });
});

document.querySelectorAll("[data-add]").forEach((button) => {
  button.addEventListener("click", () => {
    addToCart(Number(button.dataset.add));
  });
});

renderFilters();
renderProducts();
