<template>
  <div>
    <nav class="nav">
      <div class="nav-inner container">
        <ul class="nav-links">
          <li><a href="#home">Home</a></li>
          <li><a href="#products">Products</a></li>
          <li><a href="#contact">Contact Us</a></li>
        </ul>
        <button @click="showCart = !showCart" class="cart-toggle">Cart ({{ cartCount }})</button>
      </div>
    </nav>

    <header class="container header">
      <h1>Welcome to E-Shop</h1>
    </header>

    <div class="container">
      <div class="filters">
        <div class="filter-group">
          <label>Search</label>
          <input v-model="query" type="text" placeholder="Search products" class="input" />
        </div>
        <div class="filter-group">
          <label><input type="checkbox" v-model="onlyNew" /> Show only New</label>
        </div>
        <div class="filter-group">
          <label>Sort</label>
          <select v-model="sort" class="input">
            <option value="default">Default</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      <main>
        <h2>Featured Products</h2>
        <div class="product-grid">
          <ProductCard v-for="product in filteredProducts" :key="product.id" :productId="product.id"
            :productName="product.name" :productImage="product.image" :productLink="product.link" :price="product.price"
            :priceValue="product.priceValue" :badge="product.badge" :description="product.description"
            @add-to-cart="addToCart" />
        </div>
      </main>
    </div>
    <CartPanel v-if="showCart" :cart="cart" @close="showCart = false" @remove="removeFromCart"
      @change-qty="updateQuantity" />
  </div>
</template>

<script setup>
import ProductCard from './components/ProductCard.vue'
import CartPanel from './components/Cart.vue'
import { ref, computed } from 'vue'

// Filter state
const query = ref('')
const onlyNew = ref(false)
const sort = ref('default')

// Cart state
const cart = ref([])
const showCart = ref(false)

const products = ref([
  {
    id: 1,
    name: 'hEX lite',
    image: 'https://cdn.mikrotik.com/web-assets/rb_images/2064_tm.webp',
    link: '/product/hex_lite',
    price: '$39.95',
    priceValue: 39.95,
    badge: 'New',
    features: ['5x Ethernet', 'Small plastic case', 'RouterOS L4'],
    description: 'Compact 5 port ethernet router, ideal for small setups.'
  },
  {
    id: 2,
    name: 'hEX',
    image: 'https://cdn.mikrotik.com/web-assets/rb_images/2350_tm.webp',
    link: '/product/hex',
    price: '$59.95',
    priceValue: 59.95,
    badge: null,
    features: ['5x Gigabit Ethernet', 'RouterOS L4'],
    description: 'Small form factor router with gigabit ports for home and office.'
  },
  {
    id: 3,
    name: 'hEX PoE lite',
    image: 'https://cdn.mikrotik.com/web-assets/rb_images/2066_tm.webp',
    link: '/product/hex_poe_lite',
    price: '$59.95',
    priceValue: 59.95,
    badge: null,
    features: ['PoE output', '5x Ethernet', 'USB'],
    description: 'Affordable router with PoE output for powering devices.'
  },
  {
    id: 4,
    name: 'RB5009UG+S+IN',
    image: 'https://cdn.mikrotik.com/web-assets/rb_images/2350_tm.webp',
    link: '/product/rb5009ugs',
    price: '$349.00',
    priceValue: 349.0,
    badge: 'Popular',
    features: ['10G Ethernet', 'SFP+', 'RouterOS L7'],
    description: 'Enterprise-grade router with multiple 10G-capable ports.'
  },
  {
    id: 5,
    name: 'RB4011iGS+RM',
    image: 'https://cdn.mikrotik.com/web-assets/rb_images/2466_lg.webp',
    link: '/product/rb4011',
    price: '$199.00',
    priceValue: 199.0,
    badge: null,
    features: ['10x Gigabit', '1x SFP+', '64bit CPU'],
    description: 'Powerful multi-port router for more demanding networks.'
  },
  {
    id: 6,
    name: 'RB3011UiAS-RM',
    image: 'https://cdn.mikrotik.com/web-assets/rb_images/2490_lg.webp',
    link: '/product/rb3011',
    price: '$179.00',
    priceValue: 179.0,
    badge: null,
    features: ['10x Gigabit', 'Dual-core CPU', 'USB'],
    description: 'Balanced performance router with multiple ports and features.'
  },
  {
    id: 7,
    name: 'CCR1009-7G-1C-1S+',
    image: 'https://cdn.mikrotik.com/web-assets/rb_images/883_lg.webp',
    link: '/product/ccr1009',
    price: '$649.00',
    priceValue: 649.0,
    badge: 'Pro',
    features: ['7x Gigabit', '1x Combo', '1x SFP+'],
    description: 'Carrier-class router for demanding enterprise environments.'
  },
  {
    id: 8,
    name: 'RBcAPGi-5acD2nD',
    image: 'https://cdn.mikrotik.com/web-assets/rb_images/845_lg.webp',
    link: '/product/rbcap',
    price: '$129.00',
    priceValue: 129.0,
    badge: null,
    features: ['Outdoor', 'Dual-band', 'PoE'],
    description: 'Robust outdoor unit with dual-band WiFi and PoE support.'
  },
  {
    id: 9,
    name: 'hEX S',
    image: 'https://cdn.mikrotik.com/web-assets/rb_images/1282_lg.webp',
    link: '/product/hex_s',
    price: '$119.00',
    priceValue: 119.0,
    badge: null,
    features: ['SFP', 'Gigabit ports', 'RouterOS'],
    description: 'Small router with SFP port for fiber connectivity.'
  }
])


const cartCount = computed(() => {
  let count = 0
  for (let item of cart.value) {
    count = count + item.qty
  }
  return count
})

function addToCart(item) {
  if (!item) return

  let found = false
  for (let i = 0; i < cart.value.length; i++) {
    if (cart.value[i].id === item.id) {
      cart.value[i].qty += 1
      found = true
      break
    }
  }

  if (!found) {
    cart.value.push({
      id: item.id,
      name: item.name,
      price: item.price,
      priceValue: item.priceValue,
      image: item.image,
      qty: 1
    })
  }

  showCart.value = true
}

function removeFromCart(id) {
  const index = cart.value.findIndex(item => item.id === id)
  if (index > -1) {
    cart.value.splice(index, 1)
  }
}

function updateQuantity({ id, qty }) {
  for (let item of cart.value) {
    if (item.id === id) {
      item.qty = qty
      if (item.qty <= 0) {
        removeFromCart(id)
      }
      break
    }
  }
}



const filteredProducts = computed(() => {
  let list = []
  const searchText = query.value.toLowerCase()

  for (let i = 0; i < products.value.length; i++) {
    let product = products.value[i]

    if (searchText) {
      const matchName = product.name.toLowerCase().includes(searchText)
      const matchDesc = product.description.toLowerCase().includes(searchText)
      if (!matchName && !matchDesc) continue
    }

    if (onlyNew.value && product.badge !== 'New') continue

    list.push(product)
  }

  if (sort.value === 'price-asc') {
    for (let i = 0; i < list.length; i++) {
      for (let j = i + 1; j < list.length; j++) {
        if (list[j].priceValue < list[i].priceValue) {
          let temp = list[i]
          list[i] = list[j]
          list[j] = temp
        }
      }
    }
  }

  if (sort.value === 'price-desc') {
    for (let i = 0; i < list.length; i++) {
      for (let j = i + 1; j < list.length; j++) {
        if (list[j].priceValue > list[i].priceValue) {
          let temp = list[i]
          list[i] = list[j]
          list[j] = temp
        }
      }
    }
  }

  return list
})
</script>

<style>
body {
  font-family: system-ui, -apple-system, sans-serif;
  margin: 0;
  padding: 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Navigation */
.nav {
  background: #f3f4f6;
}

.nav-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
}

.nav-links {
  display: flex;
  list-style: none;
  gap: 2rem;
  margin: 0;
  padding: 0;
}

.nav-links a {
  color: #2563eb;
  text-decoration: none;
}

.nav-links a:hover {
  text-decoration: underline;
}

.cart-toggle {
  background: #111827;
  color: #fff;
  padding: 6px 10px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
}

.cart-toggle:hover {
  opacity: 0.9;
}

/* Header */
.header {
  padding: 2rem 0;
}

.header h1 {
  margin: 0;
}

.filters {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 2rem;
  padding: 1rem;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  flex-wrap: wrap;
  align-items: flex-end;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
  min-width: 150px;
}

.filter-group label {
  font-size: 14px;
  font-weight: 500;
}

.filter-group input[type="checkbox"] {
  width: auto;
  margin-right: 0.5rem;
}

.input {
  width: 100%;
  padding: 6px 8px;
  border: 1px solid #ddd;
  border-radius: 6px;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1rem;
}

@media (min-width: 768px) {
  .product-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .product-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
