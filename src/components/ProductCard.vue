<template>
    <div class="product-card">
        <a class="overlay" :href="productLink" :title="`Product page for ${productName}`"></a>

        <button @click="toggleCompare" class="compare-btn" :class="{ 'active': isCompared }"
            :title="isCompared ? 'Remove from compare' : 'Add to compare'">
            <span v-if="!isCompared">⇅</span>
            <span v-else>✓</span>
        </button>

        <div class="image-wrap">
            <img v-if="productImage" :src="productImage" :alt="productName || 'Product image'" loading="lazy" />
            <div v-else class="image-fallback">Image</div>
        </div>

        <div class="info">
            <span v-if="badge" class="badge">{{ badge }}</span>
            <p class="title">{{ productName || 'Product Name' }}</p>
            <p class="price" title="Suggested price">{{ price || '$0.00' }}<sup>*</sup></p>
            <p class="desc">{{ description || 'Short product description.' }}</p>
        </div>

        <div class="actions">
            <button @click="onAddToCart" class="add-to-cart-btn" :title="`Add ${productName} to cart`">Add to
                cart</button>
        </div>
    </div>

</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
    productId: [String, Number],
    productName: String,
    productImage: String,
    productLink: String,
    price: String,
    priceValue: Number,
    badge: String,
    description: String
})

const emit = defineEmits(['add-to-cart'])
const isCompared = ref(false)

function toggleCompare() {
    isCompared.value = !isCompared.value
}

function onAddToCart() {
    emit('add-to-cart', {
        id: props.productId,
        name: props.productName,
        price: props.price,
        priceValue: props.priceValue,
        image: props.productImage
    })
}
</script>

<style scoped>
.product-card {
    background: #fff;
    padding: 14px;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
    display: flex;
    flex-direction: column;
    gap: 10px;
    position: relative;
    height: 100%;
}

.overlay {
    position: absolute;
    inset: 0;
    z-index: 5;
}

.compare-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 20;
    background: #fff;
    border: 1px solid #eee;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    cursor: pointer;
    font-size: 14px;
}

.compare-btn.active {
    background: #16a34a;
    color: #fff;
}

.image-wrap {
    background: #f3f4f6;
    display: grid;
    place-items: center;
    padding: 12px;
    border-radius: 6px;
}

.image-wrap img {
    max-width: 100%;
    height: auto;
}

.image-fallback {
    width: 80px;
    height: 80px;
    background: #e5e7eb;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #999;
    border-radius: 6px;
}

.badge {
    background: #16a34a;
    color: #fff;
    padding: 3px 6px;
    font-size: 12px;
    border-radius: 4px;
    display: inline-block;
}

.title {
    font-weight: 700;
    margin: 6px 0;
}

.price {
    color: #666;
    font-size: 14px;
}

.desc {
    color: #666;
    font-size: 13px;
    margin: 0;
}

.info {
    flex: 1;
}

.actions {
    margin-top: auto;
    position: relative;
    z-index: 20;
}

.add-to-cart-btn {
    width: 100%;
    background: #2563eb;
    color: #fff;
    border: none;
    padding: 8px 12px;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
    position: relative;
    z-index: 20;
}

.add-to-cart-btn:hover {
    background: #1e40af;
}
</style>
