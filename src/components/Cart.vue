<template>
    <Drawer v-model:visible="isVisible" header="Shopping Cart" position="right" @hide="onClose" :modal="true">
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

        <template #footer>
            <div class="cart-footer">
                <div class="totals">
                    <div>Subtotal</div>
                    <div class="total-value">{{ formattedTotal }}</div>
                </div>
                <button v-if="cart && cart.length" @click="showConfirm = true" class="buy-btn">
                    Buy Now
                </button>
            </div>
        </template>
    </Drawer>

    <Dialog v-model:visible="showConfirm" header="Confirm Purchase" :modal="true" :closable="true">
        <p>Are you sure you want to complete your purchase?</p>
        <p><strong>Total: {{ formattedTotal }}</strong></p>
        <template #footer>
            <button @click="showConfirm = false" class="dialog-cancel-btn">Cancel</button>
            <button @click="completePurchase" class="dialog-confirm-btn">Confirm Purchase</button>
        </template>
    </Dialog>
</template>

<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
    cart: { type: Array, default: () => [] },
    modelValue: { type: Boolean, default: false }
})

const emit = defineEmits(['close', 'remove', 'change-qty', 'update:modelValue', 'purchase-complete'])

const isVisible = ref(props.modelValue)
const showConfirm = ref(false)

watch(() => props.modelValue, (newVal) => {
    isVisible.value = newVal
})

watch(isVisible, (newVal) => {
    emit('update:modelValue', newVal)
})

const total = computed(() => {
    if (!props.cart || props.cart.length === 0) {
        return 0
    }

    let sum = 0
    for (let item of props.cart) {
        sum = sum + (item.priceValue * item.qty)
    }
    return sum
})

const formattedTotal = computed(() => `$${total.value.toFixed(2)}`)

function onClose() {
    emit('close')
}

function changeQty(id, qty) {
    emit('change-qty', { id, qty })
}

function onQtyInput(id, event) {
    let qty = Number(event.target.value)
    changeQty(id, qty)
}

function completePurchase() {
    showConfirm.value = false
    alert('Thank you for your purchase!')
    emit('purchase-complete')
    isVisible.value = false
}
</script>

<style scoped>
.cart-items {
    margin-bottom: 1rem;
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
    display: flex;
    flex-direction: column;
    gap: 12px;
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

.buy-btn {
    width: 100%;
    background: #16a34a;
    color: #fff;
    border: none;
    padding: 10px 12px;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
    font-size: 14px;
}

.buy-btn:hover {
    background: #15803d;
}

.dialog-cancel-btn {
    background: #e5e7eb;
    color: #111827;
    border: none;
    padding: 6px 12px;
    border-radius: 4px;
    cursor: pointer;
    margin-right: 8px;
}

.dialog-confirm-btn {
    background: #16a34a;
    color: #fff;
    border: none;
    padding: 6px 12px;
    border-radius: 4px;
    cursor: pointer;
}

:deep(.p-dialog) {
    background-color: #fff !important;
    background: #fff !important;
    opacity: 1 !important;
    backdrop-filter: none !important;
    -webkit-backdrop-filter: none !important;
    filter: none !important;
    mix-blend-mode: normal !important;
}

:deep(.p-dialog[style]) {
    background-color: #fff !important;
    background: #fff !important;
    opacity: 1 !important;
}

:deep(.p-dialog.p-component) {
    background-color: #fff !important;
    background: #fff !important;
    opacity: 1 !important;
}

:deep(.p-dialog .p-dialog-header) {
    background-color: #fff !important;
    background: #fff !important;
    border-bottom: 1px solid #ddd !important;
    opacity: 1 !important;
}

:deep(.p-dialog .p-dialog-content) {
    background-color: #fff !important;
    background: #fff !important;
    color: #000 !important;
    opacity: 1 !important;
}

:deep(.p-dialog .p-dialog-footer) {
    background-color: #fff !important;
    background: #fff !important;
    border-top: 1px solid #ddd !important;
    opacity: 1 !important;
}

:deep(.p-dialog-mask) {
    background: rgba(0, 0, 0, 0.7) !important;
}

:deep(.p-component) {
    background-color: #fff !important;
    background: #fff !important;
    opacity: 1 !important;
}

:deep(.p-dialog p) {
    color: #000 !important;
    opacity: 1 !important;
    background-color: #fff !important;
    background: #fff !important;
}

:deep(.p-dialog-content p) {
    background-color: #fff !important;
    background: #fff !important;
    color: #000 !important;
    opacity: 1 !important;
}

:deep(.p-dialog-title) {
    color: #000 !important;
}
</style>