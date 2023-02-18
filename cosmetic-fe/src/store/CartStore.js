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
        callAPIToComitQuantity() {
            CartAPI.getCartItem().then(res => {
                // this => is false
                this.quantity = res.data.listCartItem.length
                console.log(this.quantity)
            })
        }
    },
})