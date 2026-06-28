const menuGrid = document.querySelector('#menu-grid');
const dealGrid = document.querySelector('#deal-grid');
const tabs = document.querySelector('#category-tabs');
const searchInput = document.querySelector('#search-food');
const showAllButton = document.querySelector('#show-all');
const cartButton = document.querySelector('#cart-button');
const cartPanel = document.querySelector('#cart-panel');
const closeCart = document.querySelector('#close-cart');
const cartItems = document.querySelector('#cart-items');
const cartCount = document.querySelector('#cart-count');
const cartTotal = document.querySelector('#cart-total');
const checkoutLink = document.querySelector('#checkout-link');
const sellerForm = document.querySelector('#seller-form');
const formNote = document.querySelector('#form-note');
const adminLogin = document.querySelector('#admin-login');
const adminMessage = document.querySelector('#admin-message');
const adminDashboard = document.querySelector('#admin-dashboard');
const adminLogout = document.querySelector('#admin-logout');
const adminSummary = document.querySelector('#admin-summary');
const adminList = document.querySelector('#admin-list');
const nav = document.querySelector('#site-nav');
const menuToggle = document.querySelector('#menu-toggle');

const categories = ['All', 'Burger', 'Nasi', 'Pasta', 'Minuman', 'Kuih', 'Snack'];
const supabaseConfig = window.FOODHUB_SUPABASE || {};
const isSupabaseReady = Boolean(
  supabaseConfig.url
  && supabaseConfig.anonKey
  && window.supabase
);
const supabaseClient = isSupabaseReady
  ? window.supabase.createClient(supabaseConfig.url, supabaseConfig.anonKey)
  : null;
const supabaseTable = supabaseConfig.tableName || 'foods';
const supabaseStorageBucket = supabaseConfig.storageBucket || 'food-images';
const adminStateKey = 'foodhub_admin_state';
const adminSessionKey = 'foodhub_admin_logged_in';
const adminUsername = 'admin';
const adminPassword = 'admin123';

const defaultFoods = [
  {
    id: 'classic-zinger',
    name: 'Classic Zinger',
    category: 'Burger',
    price: 8.00,
    description: 'Crispy chicken burger with lettuce, mayo and soft bun.',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=80',
    badge: 'POPULAR',
    sellerPhone: '60176354253'
  },
  {
    id: 'creamy-zinger',
    name: 'Creamy Zinger',
    category: 'Burger',
    price: 9.00,
    description: 'Chicken burger with creamy sauce, cheese and fresh vegetables.',
    image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?auto=format&fit=crop&w=900&q=80',
    badge: 'HOT',
    sellerPhone: '60176354253'
  },
  {
    id: 'nasi-lemak-ayam',
    name: 'Nasi Lemak Ayam',
    category: 'Nasi',
    price: 7.50,
    description: 'Nasi lemak with fried chicken, sambal, cucumber and egg.',
    image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=900&q=80',
    badge: 'POPULAR',
    sellerPhone: '60176354253'
  },
  {
    id: 'carbonara-pasta',
    name: 'Creamy Carbonara',
    category: 'Pasta',
    price: 10.00,
    description: 'Creamy pasta with chicken slices and mushroom sauce.',
    image: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&w=900&q=80',
    badge: 'NEW',
    sellerPhone: '60176354253'
  },
  {
    id: 'fried-rice',
    name: 'Nasi Goreng Kampus',
    category: 'Nasi',
    price: 6.50,
    description: 'Spicy fried rice with egg, chicken and vegetables.',
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=900&q=80',
    badge: 'SAVE',
    sellerPhone: '60176354253'
  },
  {
    id: 'iced-tea',
    name: 'Teh Ais Kaw',
    category: 'Minuman',
    price: 2.50,
    description: 'Cold milk tea, suitable for lunch break.',
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=900&q=80',
    badge: 'COOL',
    sellerPhone: '60176354253'
  },
  {
    id: 'choco-muffin',
    name: 'Chocolate Muffin',
    category: 'Kuih',
    price: 3.00,
    description: 'Soft chocolate muffin baked fresh for students.',
    image: 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?auto=format&fit=crop&w=900&q=80',
    badge: 'NEW',
    sellerPhone: '60176354253'
  },
  {
    id: 'fries-box',
    name: 'Cheesy Fries Box',
    category: 'Snack',
    price: 5.00,
    description: 'Crispy fries with cheese sauce and spicy seasoning.',
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=900&q=80',
    badge: 'HOT',
    sellerPhone: '60176354253'
  }
];

const deals = [
  {
    id: 'combo-1',
    name: 'Combo 1 Classic Treat',
    price: 10.00,
    description: 'Classic Zinger + fries + iced tea.',
    image: 'https://images.unsplash.com/photo-1615297928064-24977384d0da?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 'combo-2',
    name: 'Combo 2 Chicken Lovers',
    price: 12.00,
    description: 'Chicken burger + cheesy fries + drink.',
    image: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 'combo-3',
    name: 'Combo 3 Student Saver',
    price: 8.50,
    description: 'Nasi goreng + teh ais + muffin.',
    image: 'https://images.unsplash.com/photo-1594007654729-407eedc4be65?auto=format&fit=crop&w=900&q=80'
  }
];

let adminState = JSON.parse(localStorage.getItem(adminStateKey) || '{}');
let foods = [];
let selectedCategory = 'All';
let visibleLimit = 8;
let cart = JSON.parse(localStorage.getItem('foodhub_cart') || '[]');

async function loadFoods() {
  if (supabaseClient) {
    try {
      const { data, error } = await supabaseClient
        .from(supabaseTable)
        .select('*')
        .eq('deleted', false)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []).map(normalizeFoodFromDatabase);
    } catch (error) {
      console.warn('Supabase menu load failed. Falling back to localStorage.', error);
      formNote.textContent = 'Supabase belum berjaya dibaca. Sementara itu data demo digunakan.';
    }
  }

  const saved = JSON.parse(localStorage.getItem('foodhub_foods') || '[]');
  return [...saved, ...defaultFoods].map(applyAdminState).filter((food) => !food.deleted);
}

function normalizeFoodFromDatabase(food) {
  return {
    id: food.id,
    name: food.name,
    category: food.category,
    price: Number(food.price),
    description: food.description || '',
    image: food.image || 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=900&q=80',
    badge: food.badge || 'SELLER',
    sellerPhone: food.seller_phone || food.sellerPhone || '60176354253',
    status: food.status || 'available',
    deleted: Boolean(food.deleted)
  };
}

function foodToDatabase(food) {
  return {
    id: food.id,
    name: food.name,
    category: food.category,
    price: food.price,
    description: food.description,
    image: food.image,
    badge: food.badge,
    seller_phone: food.sellerPhone,
    status: food.status || 'available',
    deleted: Boolean(food.deleted)
  };
}

function applyAdminState(food) {
  const state = adminState[food.id] || {};
  return {
    ...food,
    status: state.status || food.status || 'available',
    deleted: Boolean(state.deleted)
  };
}

function saveAdminState() {
  localStorage.setItem(adminStateKey, JSON.stringify(adminState));
}

function saveCart() {
  localStorage.setItem('foodhub_cart', JSON.stringify(cart));
}

function money(value) {
  return `RM${Number(value).toFixed(2)}`;
}

function whatsappNumber(value) {
  const digits = String(value || '').replace(/\D/g, '');
  if (!digits) return '60176354253';
  if (digits.startsWith('60')) return digits;
  if (digits.startsWith('0')) return `6${digits}`;
  return digits;
}

function escapeText(value) {
  return String(value || '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  }[char]));
}

function renderTabs() {
  tabs.innerHTML = categories.map((category) => `
    <button class="tab ${category === selectedCategory ? 'active' : ''}" data-category="${category}" type="button">
      ${escapeText(category)}
    </button>
  `).join('');

  tabs.querySelectorAll('.tab').forEach((button) => {
    button.addEventListener('click', () => {
      selectedCategory = button.dataset.category;
      visibleLimit = 8;
      renderTabs();
      renderMenu();
    });
  });
}

function getFilteredFoods() {
  const search = searchInput.value.trim().toLowerCase();
  return foods.filter((food) => {
    const matchCategory = selectedCategory === 'All' || food.category === selectedCategory;
    const matchSearch = food.name.toLowerCase().includes(search) || food.description.toLowerCase().includes(search);
    return food.status === 'available' && matchCategory && matchSearch;
  });
}

function renderMenu() {
  const filtered = getFilteredFoods();
  const visibleFoods = filtered.slice(0, visibleLimit);

  menuGrid.innerHTML = visibleFoods.length
    ? visibleFoods.map(foodCard).join('')
    : '<p class="empty">Tiada makanan dijumpai. Cuba kategori atau carian lain.</p>';

  showAllButton.style.display = filtered.length > visibleLimit ? 'inline-flex' : 'none';

  menuGrid.querySelectorAll('[data-add]').forEach((button) => {
    button.addEventListener('click', () => addToCart(button.dataset.add));
  });
}

function foodCard(food) {
  return `
    <article class="food-card">
      <img src="${escapeText(food.image)}" alt="${escapeText(food.name)}">
      <span class="badge">${escapeText(food.badge || 'MICOST')}</span>
      <div class="card-body">
        <h3 class="card-title">${escapeText(food.name)} <span>${money(food.price)}</span></h3>
        <p>${escapeText(food.description)}</p>
        <small class="seller-phone">WhatsApp: ${escapeText(whatsappNumber(food.sellerPhone))}</small>
        <button class="btn" data-add="${escapeText(food.id)}" type="button">Add to Cart</button>
      </div>
    </article>
  `;
}

function statusLabel(status) {
  if (status === 'sold-out') return 'Sold Out';
  if (status === 'expired') return 'Expired';
  return 'Available';
}

function renderAdminPanel() {
  if (!adminSummary || !adminList) return;
  const isLoggedIn = sessionStorage.getItem(adminSessionKey) === 'true';

  adminLogin?.classList.toggle('hidden', isLoggedIn);
  adminDashboard?.classList.toggle('hidden', !isLoggedIn);

  if (!isLoggedIn) {
    adminSummary.innerHTML = '';
    adminList.innerHTML = '';
    return;
  }

  const available = foods.filter((food) => food.status === 'available').length;
  const soldOut = foods.filter((food) => food.status === 'sold-out').length;
  const expired = foods.filter((food) => food.status === 'expired').length;

  adminSummary.innerHTML = `
    <div class="admin-stat"><strong>${foods.length}</strong><span>Total Food</span></div>
    <div class="admin-stat"><strong>${available}</strong><span>Available</span></div>
    <div class="admin-stat"><strong>${soldOut}</strong><span>Sold Out</span></div>
    <div class="admin-stat"><strong>${expired}</strong><span>Expired</span></div>
  `;

  adminList.innerHTML = foods.length
    ? foods.map((food) => `
      <article class="admin-card">
        <img src="${escapeText(food.image)}" alt="${escapeText(food.name)}">
        <div>
          <h3>
            ${escapeText(food.name)}
            <span class="status-pill ${escapeText(food.status)}">${statusLabel(food.status)}</span>
          </h3>
          <p>${escapeText(food.category)} · ${money(food.price)} · WhatsApp ${escapeText(whatsappNumber(food.sellerPhone))}</p>
          <p>${escapeText(food.description)}</p>
        </div>
        <div class="admin-actions">
          <button data-admin-status="${escapeText(food.id)}" data-status="available" type="button">Available</button>
          <button data-admin-status="${escapeText(food.id)}" data-status="sold-out" type="button">Sold Out</button>
          <button data-admin-status="${escapeText(food.id)}" data-status="expired" type="button">Expired</button>
          <button class="danger" data-admin-delete="${escapeText(food.id)}" type="button">Delete</button>
        </div>
      </article>
    `).join('')
    : '<p class="empty">Tiada makanan untuk diurus.</p>';

  adminList.querySelectorAll('[data-admin-status]').forEach((button) => {
    button.addEventListener('click', () => updateFoodStatus(button.dataset.adminStatus, button.dataset.status));
  });

  adminList.querySelectorAll('[data-admin-delete]').forEach((button) => {
    button.addEventListener('click', () => deleteFood(button.dataset.adminDelete));
  });
}

function loginAdmin(event) {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const username = String(form.get('username') || '').trim();
  const password = String(form.get('password') || '').trim();

  if (username === adminUsername && password === adminPassword) {
    sessionStorage.setItem(adminSessionKey, 'true');
    adminMessage.textContent = '';
    event.currentTarget.reset();
    renderAdminPanel();
    return;
  }

  adminMessage.textContent = 'Username atau password admin salah.';
}

function logoutAdmin() {
  sessionStorage.removeItem(adminSessionKey);
  renderAdminPanel();
}

async function refreshFoodViews() {
  foods = await loadFoods();
  renderMenu();
  renderAdminPanel();
}

async function updateFoodStatus(id, status) {
  if (supabaseClient) {
    const { error } = await supabaseClient
      .from(supabaseTable)
      .update({ status, deleted: false })
      .eq('id', id);

    if (error) {
      alert('Status gagal dikemaskini dalam Supabase.');
      console.error(error);
      return;
    }

    await refreshFoodViews();
    return;
  }

  adminState[id] = {
    ...(adminState[id] || {}),
    status,
    deleted: false
  };
  saveAdminState();
  refreshFoodViews();
}

async function deleteFood(id) {
  if (!confirm('Delete makanan ini daripada menu?')) return;

  if (supabaseClient) {
    const { error } = await supabaseClient
      .from(supabaseTable)
      .update({ deleted: true })
      .eq('id', id);

    if (error) {
      alert('Makanan gagal dipadam dalam Supabase.');
      console.error(error);
      return;
    }

    cart = cart.filter((item) => item.id !== id);
    saveCart();
    await refreshFoodViews();
    renderCart();
    return;
  }

  adminState[id] = {
    ...(adminState[id] || {}),
    deleted: true
  };
  cart = cart.filter((item) => item.id !== id);
  saveCart();
  saveAdminState();
  refreshFoodViews();
  renderCart();
}

function renderDeals() {
  dealGrid.innerHTML = deals.map((deal) => `
    <article class="deal-card">
      <img src="${escapeText(deal.image)}" alt="${escapeText(deal.name)}">
      <span class="badge">POPULAR</span>
      <div class="card-body">
        <h3 class="card-title">${escapeText(deal.name)} <span>${money(deal.price)}</span></h3>
        <p>${escapeText(deal.description)}</p>
        <button class="btn" data-deal="${escapeText(deal.id)}" type="button">Add to Cart</button>
      </div>
    </article>
  `).join('');

  dealGrid.querySelectorAll('[data-deal]').forEach((button) => {
    button.addEventListener('click', () => addDealToCart(button.dataset.deal));
  });
}

function addToCart(id) {
  const food = foods.find((item) => item.id === id);
  if (!food) return;
  addItem(food);
}

function addDealToCart(id) {
  const deal = deals.find((item) => item.id === id);
  if (!deal) return;
  addItem({ ...deal, category: 'Deal' });
}

function addItem(item) {
  const existing = cart.find((cartItem) => cartItem.id === item.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      id: item.id,
      name: item.name,
      price: item.price,
      sellerPhone: whatsappNumber(item.sellerPhone),
      quantity: 1
    });
  }
  saveCart();
  renderCart();
  cartPanel.classList.add('open');
}

function changeQuantity(id, amount) {
  const item = cart.find((cartItem) => cartItem.id === id);
  if (!item) return;
  item.quantity += amount;
  if (item.quantity <= 0) {
    cart = cart.filter((cartItem) => cartItem.id !== id);
  }
  saveCart();
  renderCart();
}

function renderCart() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  cartCount.textContent = totalItems;
  cartTotal.textContent = money(total);

  cartItems.innerHTML = cart.length
    ? cart.map((item) => `
      <div class="cart-row">
        <div>
          <h3>${escapeText(item.name)}</h3>
          <p>${money(item.price)} x ${item.quantity}</p>
        </div>
        <div>
          <button data-minus="${escapeText(item.id)}" type="button">-</button>
          <button data-plus="${escapeText(item.id)}" type="button">+</button>
        </div>
      </div>
    `).join('')
    : '<p class="empty">Cart masih kosong.</p>';

  cartItems.querySelectorAll('[data-minus]').forEach((button) => {
    button.addEventListener('click', () => changeQuantity(button.dataset.minus, -1));
  });

  cartItems.querySelectorAll('[data-plus]').forEach((button) => {
    button.addEventListener('click', () => changeQuantity(button.dataset.plus, 1));
  });

  const targetPhone = cart.length ? whatsappNumber(cart[0].sellerPhone) : '60176354253';
  const otherSellerNote = new Set(cart.map((item) => whatsappNumber(item.sellerPhone))).size > 1
    ? '%0A%0ANota: Cart ada item daripada lebih daripada seorang seller.'
    : '';
  const message = cart.length
    ? `Saya nak order:%0A${cart.map((item) => `- ${item.name} x${item.quantity} (${money(item.price * item.quantity)})`).join('%0A')}%0ATotal: ${money(total)}${otherSellerNote}`
    : 'Saya berminat dengan FoodHub MICOST';

  checkoutLink.href = `https://wa.me/${targetPhone}?text=${message}`;
}

function resizeImage(file) {
  return new Promise((resolve) => {
    if (!file || !file.type.startsWith('image/')) {
      resolve('');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.onload = () => {
        const maxSize = 900;
        const ratio = Math.min(maxSize / image.width, maxSize / image.height, 1);
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(image.width * ratio);
        canvas.height = Math.round(image.height * ratio);
        const context = canvas.getContext('2d');
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', .82));
      };
      image.onerror = () => resolve('');
      image.src = reader.result;
    };
    reader.onerror = () => resolve('');
    reader.readAsDataURL(file);
  });
}

async function getUploadedFoodImage(file) {
  if (!file || !file.type.startsWith('image/')) return '';
  if (!supabaseClient) return resizeImage(file);

  const extension = (file.name.split('.').pop() || 'jpg').toLowerCase();
  const path = `foods/${Date.now()}-${Math.random().toString(36).slice(2)}.${extension}`;
  const { error } = await supabaseClient.storage
    .from(supabaseStorageBucket)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    console.warn('Supabase image upload failed. Saving resized image data instead.', error);
    return resizeImage(file);
  }

  const { data } = supabaseClient.storage
    .from(supabaseStorageBucket)
    .getPublicUrl(path);

  return data.publicUrl;
}

async function addSellerFood(event) {
  event.preventDefault();
  const formElement = event.currentTarget;
  const submitButton = formElement.querySelector('button[type="submit"]');
  const originalButtonText = submitButton?.textContent || 'Add Food';

  if (submitButton) {
    submitButton.disabled = true;
    submitButton.textContent = 'Saving...';
  }

  const form = new FormData(formElement);

  try {
    const name = String(form.get('name') || '').trim();
    const category = String(form.get('category') || '').trim();
    const price = Number(form.get('price'));
    const sellerPhone = whatsappNumber(form.get('sellerPhone'));
    const description = String(form.get('description') || '').trim() || 'Menu baru daripada penjual MICOST.';

    formNote.textContent = supabaseClient
      ? 'Sedang upload gambar dan simpan menu ke Supabase...'
      : 'Sedang simpan menu dalam browser...';

    const uploadedImage = await getUploadedFoodImage(form.get('image'));

    const newFood = {
      id: `seller-${Date.now()}`,
      name,
      category,
      price,
      description,
      image: uploadedImage || 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=900&q=80',
      badge: 'SELLER',
      sellerPhone,
      status: 'available',
      deleted: false
    };

    if (supabaseClient) {
      const { error } = await supabaseClient
        .from(supabaseTable)
        .insert(foodToDatabase(newFood));

      if (error) {
        const detail = error.message || error.details || 'Unknown Supabase error';
        formNote.textContent = `Menu gagal disimpan ke Supabase: ${detail}`;
        console.error(error);
        return;
      }
    } else {
      const saved = JSON.parse(localStorage.getItem('foodhub_foods') || '[]');
      saved.unshift(newFood);
      localStorage.setItem('foodhub_foods', JSON.stringify(saved));
    }

    foods = [
      newFood,
      ...(await loadFoods()).filter((food) => food.id !== newFood.id)
    ];
    selectedCategory = category;
    visibleLimit = 8;
    renderTabs();
    renderMenu();
    renderAdminPanel();
    formElement.reset();
    formNote.textContent = supabaseClient
      ? `${name} berjaya disimpan dalam Supabase dan terus keluar di menu.`
      : `${name} berjaya ditambah dalam menu demo.`;
    location.hash = '#menu';
  } finally {
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent = originalButtonText;
    }
  }
}

searchInput.addEventListener('input', () => {
  visibleLimit = 8;
  renderMenu();
});

showAllButton.addEventListener('click', () => {
  visibleLimit += 8;
  renderMenu();
});

cartButton.addEventListener('click', () => cartPanel.classList.add('open'));
closeCart.addEventListener('click', () => cartPanel.classList.remove('open'));
sellerForm.addEventListener('submit', addSellerFood);
adminLogin.addEventListener('submit', loginAdmin);
adminLogout.addEventListener('click', logoutAdmin);

menuToggle.addEventListener('click', () => {
  nav.classList.toggle('open');
});

nav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => nav.classList.remove('open'));
});

async function initializeApp() {
  if (supabaseClient) {
    formNote.textContent = 'Database Supabase aktif. Menu akan disimpan dalam cloud.';
  }

  foods = await loadFoods();
  renderTabs();
  renderMenu();
  renderDeals();
  renderCart();
  renderAdminPanel();
}

initializeApp();
