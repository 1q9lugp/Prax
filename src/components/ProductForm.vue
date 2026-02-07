<template>
  <div class="product-form">
    <h2>Add New Product</h2>
    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label for="name">Product Name</label>
        <input id="name" v-model="form.name" type="text" required />
      </div>
      <div class="form-group">
        <label for="price">Price</label>
        <input id="price" v-model.number="form.price" type="number" required />
      </div>
      <div class="form-group">
        <label for="category">Category</label>
        <input id="category" v-model="form.category" type="text" required />
      </div>
      <div class="form-group">
        <label for="description">Description</label>
        <textarea id="description" v-model="form.description" required></textarea>
      </div>
      <button type="submit">Add Product</button>
    </form>
  </div>
</template>

<script setup>
import { ref, defineEmits } from 'vue';

const emit = defineEmits(['product-added']);

const form = ref({
  name: '',
  price: '',
  category: '',
  description: ''
});

async function submitForm() {
  try {
    const response = await fetch('http://localhost:3333/produkty', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(form.value)
    });

    if (response.ok) {
      const newProduct = await response.json();
      alert('Product added successfully!');
      form.value = { name: '', price: '', category: '', description: '' };
      emit('product-added', newProduct);
    } else {
      alert('Failed to add product.');
    }
  } catch (error) {
    console.error('Error adding product:', error);
    alert('An error occurred while adding the product.');
  }
}
</script>

<style>
.product-form {
  max-width: 400px;
  margin: 0 auto;
  padding: 1rem;
  background: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

input,
textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  background: #2563eb;
  color: #fff;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background: #1e40af;
}
</style>
