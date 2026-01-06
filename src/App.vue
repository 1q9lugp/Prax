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
          <label>Category</label>
          <select v-model="selectedCategory" class="input">
            <option value="">All Categories</option>
            <option v-for="cat in allCategories" :key="cat" :value="cat">{{ cat }}</option>
          </select>
        </div>
        <div class="filter-group">
          <label>Price Range: ${{ priceRange[0] }} - ${{ priceRange[1] }}</label>
          <input type="range" v-model.number="priceRange[0]" min="0" max="1000" step="10" class="range-slider" />
          <input type="range" v-model.number="priceRange[1]" min="0" max="1000" step="10" class="range-slider" />
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
    <CartPanel v-model="showCart" :cart="cart" @close="showCart = false" @remove="removeFromCart"
      @change-qty="updateQuantity" @purchase-complete="completePurchase" />
  </div>
</template>

<script setup>
import ProductCard from './components/ProductCard.vue'
import CartPanel from './components/Cart.vue'
import { ref, computed } from 'vue'
import productsData from './assets/products.json'

const query = ref('')
const onlyNew = ref(false)
const sort = ref('default')
const selectedCategory = ref('')
const priceRange = ref([0, 1000])

const cart = ref([])
const showCart = ref(false)

const products = ref(productsData)

const allCategories = computed(() => {
  let cats = new Set()
  for (let p of products.value) {
    if (p.category) {
      cats.add(p.category)
    }
  }
  return Array.from(cats).sort()
})


const cartCount = computed(() => {
  let count = 0
  for (let i of cart.value) {
    count = count + i.qty
  }
  return count
})

function addToCart(item) {
  if (!item) return

  let found = false
  for (let i = 0; i < cart.value.length; i++) {
    if (cart.value[i].id === item.id) {
      cart.value[i].qty = cart.value[i].qty + 1
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
  for (let i = 0; i < cart.value.length; i++) {
    if (cart.value[i].id === id) {
      cart.value.splice(i, 1)
      break
    }
  }
}

function updateQuantity(data) {
  for (let item of cart.value) {
    if (item.id === data.id) {
      item.qty = data.qty
      if (item.qty <= 0) {
        removeFromCart(data.id)
      }
      break
    }
  }
}

function completePurchase() {
  cart.value = []
}



const filteredProducts = computed(() => {
  let list = []
  let search = query.value.toLowerCase()

  for (let i = 0; i < products.value.length; i++) {
    let p = products.value[i]

    if (search) {
      let nameMatch = p.name.toLowerCase().includes(search)
      let descMatch = p.description.toLowerCase().includes(search)
      if (!nameMatch && !descMatch) continue
    }

    if (onlyNew.value && p.badge !== 'New') continue

    if (selectedCategory.value && p.category !== selectedCategory.value) continue

    if (p.priceValue < priceRange.value[0] || p.priceValue > priceRange.value[1]) continue

    list.push(p)
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

.range-slider {
  width: 100%;
  cursor: pointer;
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
