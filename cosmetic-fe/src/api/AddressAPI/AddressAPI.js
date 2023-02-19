import axiosPath from "../axiosPath";
class AddressAPI {
    static async getAllProvince() {
        return await axiosPath.authentication().get('/api/address/getAllProvince')
    }
    static async createAddress(data) {
        return await axiosPath.authentication().post('/api/address/addNewAddress', data)
    }
    static async updateAddress(data) {
        return await axiosPath.authentication().put('/api/address/updateAddress', data)
    }
    static async getAllAddress() {
        return await axiosPath.authentication().get('/api/address/getAllAddress')
    }
    static async getAddressById(addressId) {
        return await axiosPath.authentication().get('/api/address/getAddressById/' + addressId)
    }
    static async deleteAddress(addressId) {
        return await axiosPath.authentication().delete('/api/address/deleteAddress/' + addressId)
    }
    static async updateDefault(addressId) {
        return await axiosPath.authentication().put('/api/address/updateDefault/' + addressId)
    }
}
export default AddressAPI