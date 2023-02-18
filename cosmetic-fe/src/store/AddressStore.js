import { defineStore } from 'pinia'

export const useAddressStore = defineStore('address', {
    state: () => {
        return { isShow: false }
    },
    // could also be defined as
    // state: () => ({ count: 0 })
    actions: {
        showAddAddress() {
            this.isShow = true
        },
        closeAddAddress() {
            this.isShow = false
        },
    },
})