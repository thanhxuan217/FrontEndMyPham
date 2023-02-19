import { defineStore } from 'pinia'
import CartAPI from '../api/CartAPI/CartAPI'
export const useCartStore = defineStore('cart', {
    state: () => {
        return { quantity: 0 }
    },
    actions: {
        commitCartQuantity(quantity) {
            this.quantity = quantity
        },
        async callAPIToComitQuantity() {
            const listCart = await CartAPI.getCartItem()
            this.quantity = listCart.data.listCartItem.length
        }
    },
})