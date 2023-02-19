import { defineStore } from 'pinia'
import AddressAPI from '../api/AddressAPI/AddressAPI'
export const useAddressStore = defineStore('address', {
    state: () => {
        return { isShow: false, showEditAddress: false, addresses: [] }
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
        showEdit() {
            this.showEditAddress = true
        },
        closeEdit() {
            this.showEditAddress = false
        },
        async getAllAddress() {
            const addresses = await AddressAPI.getAllAddress()
            this.addresses = addresses.data
        }
    },
})