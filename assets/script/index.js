// Containers
const catagoryContainer = document.getElementById("catagory-container");
const productsContainer = document.getElementById("products-container");
const trendingContainer = document.getElementById("trending-container");
const modalContainer = document.getElementById("product_modal");
const modalContent = document.getElementById("modal-content");

// Generate Rating Stars
const generateStars = (rating) => {
  let stars = "";
  const rounded = Math.round(rating);
  for (let i = 1; i <= 3; i++) {
    stars += `<i class="fa-solid fa-star ${i <= rounded ? "text-yellow-400" : "text-gray-300"}"></i>`;
  }
  return stars;
};

// Modal Show
const showProductDetails = (id) => {
  fetch(`https://fakestoreapi.com/products/${id}`)
    .then((res) => res.json())
    .then((product) => {
      modalContent.innerHTML = `
        <div>
          <h2 class="text-2xl font-bold mb-2">${product.title}</h2>
          <img src="${product.image}" alt="${product.title}" class="h-60 mx-auto object-contain mb-4" />
        </div>
        <div>
          <h3 class="font-bold">Description</h3>
          <p>${product.description}</p>
        </div>
        <div class="mt-3">
          <h3 class="font-bold">Price & Rating</h3>
          <p class="text-xl font-bold">$${product.price}</p>
          <div class="flex items-center gap-2">
            ${generateStars(product.rating.rate)}
            <span class="font-medium">${product.rating.rate}</span>
            <span>(${product.rating.count})</span>
          </div>
        </div>
        <div class="mt-4">
          <button id="buy-now-btn" class="btn bg-[#4f39f6] text-white w-full flex items-center justify-center gap-2">
            <i class="fa-solid fa-cart-shopping"></i> Buy Now
          </button>
        </div>
      `;
      modalContainer.showModal();
    });
};

// Product Card Generator
const createProductCard = (product) => {
  const card = document.createElement("div");
  card.className =
    "card bg-base-100 shadow-lg rounded-xl overflow-hidden hover:shadow-xl transition duration-300 mt-12";
  card.innerHTML = `
    <figure class="h-60 flex items-center justify-center bg-white p-4">
      <img src="${product.image}" alt="${product.title}" class="h-full object-contain" />
    </figure>
    <div class="card-body p-4">
      <div class="flex justify-between text-sm text-gray-500">
        <div class="bg-indigo-100 text-indigo-600 px-3 py-1 text-xs rounded-full capitalize">${product.category}</div>
        <div class="flex items-center gap-1">
          ${generateStars(product.rating.rate)}
          <span class="font-medium">${product.rating.rate}</span>
          <span>(${product.rating.count})</span>
        </div>
      </div>
      <h2 class="card-title text-lg font-semibold mt-3 leading-snug line-clamp-1">${product.title}</h2>
      <p class="text-2xl font-bold text-gray-900">$${product.price}</p>
      <div class="card-actions justify-between mt-4 gap-3">
        <button class="details-btn flex-1 btn h-10 flex items-center justify-center gap-2 rounded-xl text-gray-700 bg-white bottom-1" data-id="${product.id}">
          <i class="fa-solid fa-eye"></i> Details
        </button>
        <button class="flex-1 btn bg-[#4f39f6] text-white border-0 h-10 flex items-center justify-center gap-2 rounded-lg">
          <i class="fa-solid fa-cart-shopping"></i> Add
        </button>
      </div>
    </div>
  `;
  card
    .querySelector(".details-btn")
    .addEventListener("click", () => showProductDetails(product.id));
  return card;
};

// Load Categories
const loadCatagory = () => {
  fetch("https://fakestoreapi.com/products/categories")
    .then((res) => res.json())
    .then((categories) => displayCatagory(categories));
};

const displayCatagory = (categories) => {
  if (!catagoryContainer) return;
  catagoryContainer.innerHTML = "";

  const allBtn = createCategoryButton("All", "all");
  allBtn.classList.add("bg-indigo-600", "text-white");
  catagoryContainer.appendChild(allBtn);

  categories.forEach((category) => {
    const btn = createCategoryButton(category, category);
    catagoryContainer.appendChild(btn);
  });

  loadProducts("all", allBtn);
};

const createCategoryButton = (text, value) => {
  const button = document.createElement("button");
  button.innerText = text;
  button.className =
    "btn rounded-full border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white capitalize";
  button.onclick = () => loadProducts(value, button);
  return button;
};

// Load Products by Category / All
const loadProducts = (category, clickedBtn) => {
  document
    .querySelectorAll("#catagory-container button")
    .forEach((btn) => btn.classList.remove("bg-indigo-600", "text-white"));
  clickedBtn.classList.add("bg-indigo-600", "text-white");

  const url =
    category === "all"
      ? "https://fakestoreapi.com/products"
      : `https://fakestoreapi.com/products/category/${encodeURIComponent(category)}`;

  fetch(url)
    .then((res) => res.json())
    .then((products) => {
      allProducts = category === "all" ? products : allProducts;
      if (!productsContainer) return;
      productsContainer.innerHTML = "";
      products.forEach((product) =>
        productsContainer.appendChild(createProductCard(product)),
      );
    });
};

// Load Trending (Top Rated)
const loadTopRated = () => {
  fetch("https://fakestoreapi.com/products")
    .then((res) => res.json())
    .then((products) => {
      const topThree = products
        .filter((product) => product.rating.rate >= 4)
        .sort((a, b) => b.rating.rate - a.rating.rate)
        .slice(0, 3);

      if (!trendingContainer) return;
      trendingContainer.innerHTML = "";

      topThree.forEach((product) => {
        trendingContainer.appendChild(createProductCard(product));
      });
    })
    .catch((error) => {
      console.error("Error loading top rated products:", error);
    });
};

// Initialize
loadCatagory();
loadTopRated();
