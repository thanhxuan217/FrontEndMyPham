import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
    state: () => {
        return { quantity: 0 }
    },
    actions: {
        commitCartQuantity(quantity) {
            this.quantity = quantity
        }
    },
})