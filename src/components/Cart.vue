<template>
    <div class="cart-overlay">
        <div class="cart-panel">
            <header class="cart-header">
                <h3>Shopping Cart</h3>
                <button class="close-btn" @click="$emit('close')">Close</button>
            </header>

            <div v-if="cart && cart.length" class="cart-items">
                <div v-for="item in cart" :key="item.id" class="cart-item">
                    <img v-if="item.image" :src="item.image" class="item-thumb" />
                    <div class="item-body">
                        <div class="item-name">{{ item.name }}</div>
                        <div class="item-price">{{ item.price }}</div>
                        <div class="item-qty">
                            <button @click="changeQty(item.id, (item.qty || 1) - 1)">-</button>
                            <input type="number" min="0" :value="item.qty || 1" @input="onQtyInput(item.id, $event)" />
                            <button @click="changeQty(item.id, (item.qty || 0) + 1)">+</button>
                        </div>
                    </div>
                    <div class="item-actions">
                        <button class="remove" @click="$emit('remove', item.id)">Remove</button>
                    </div>
                </div>
            </div>
            <div v-else class="empty">Your cart is empty</div>

            <footer class="cart-footer">
                <div class="totals">
                    <div>Subtotal</div>
                    <div class="total-value">{{ formattedTotal }}</div>
                </div>
            </footer>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    cart: { type: Array, default: () => [] }
})

const emit = defineEmits(['close', 'remove', 'change-qty'])

const total = computed(() => {
    if (!props.cart || props.cart.length === 0) {
        return 0
    }

    let totalPrice = 0
    for (let item of props.cart) {
        totalPrice = totalPrice + (item.priceValue * item.qty)
    }
    return totalPrice
})

const formattedTotal = computed(() => `$${total.value.toFixed(2)}`)

function changeQty(id, qty) {
    emit('change-qty', { id, qty })
}

function onQtyInput(id, event) {
    const qty = Number(event.target.value)
    changeQty(id, qty)
}
</script>

<style scoped>
.cart-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.35);
    display: flex;
    justify-content: flex-end;
    z-index: 60;
}

.cart-panel {
    width: 360px;
    max-width: 100%;
    background: #fff;
    height: 100%;
    padding: 16px;
    box-shadow: -6px 0 24px rgba(0, 0, 0, 0.12);
    display: flex;
    flex-direction: column;
}

.cart-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.cart-header h3 {
    margin: 0;
}

.close-btn {
    background: transparent;
    border: 1px solid #ddd;
    padding: 6px 8px;
    border-radius: 6px;
    cursor: pointer;
}

.cart-items {
    flex: 1;
    overflow: auto;
    margin-top: 12px;
}

.cart-item {
    display: flex;
    gap: 10px;
    padding: 12px 0;
    border-bottom: 1px solid #f0f0f0;
}

.item-thumb {
    width: 60px;
    height: 60px;
    object-fit: cover;
    border-radius: 6px;
}

.item-body {
    flex: 1;
}

.item-name {
    font-weight: 700;
    margin: 0 0 6px 0;
}

.item-price {
    color: #666;
    font-size: 14px;
    margin: 0 0 6px 0;
}

.item-qty {
    display: flex;
    align-items: center;
    gap: 6px;
}

.item-qty button {
    width: 28px;
    height: 28px;
    border: 1px solid #ddd;
    background: #f9f9f9;
    cursor: pointer;
    border-radius: 4px;
}

.item-qty input {
    width: 50px;
    padding: 4px;
    border: 1px solid #ddd;
    border-radius: 4px;
    text-align: center;
}

.item-qty input::-webkit-outer-spin-button,
.item-qty input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

.item-qty input[type=number] {
    appearance: textfield;
    -moz-appearance: textfield;
}

.item-actions {
    display: flex;
}

.remove {
    background: transparent;
    border: 1px solid #ff6b6b;
    color: #ff6b6b;
    padding: 4px 8px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;
}

.empty {
    padding: 20px;
    text-align: center;
    color: #999;
}

.cart-footer {
    border-top: 1px solid #eee;
    padding-top: 12px;
}

.totals {
    display: flex;
    justify-content: space-between;
    font-weight: 700;
    font-size: 16px;
}

.total-value {
    color: #000;
}
</style>