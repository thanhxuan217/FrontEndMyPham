import axiosPath from "../axiosPath";
class AddressAPI {
    static async getAllProvince() {
        return await axiosPath.default().get('/api/address/getAllProvince')
    }
    static async createAddress(data) {
        return await axiosPath.default().post('/api/address/addNewAddress', data)
    }
    static async getAllProvince() {
        return await axiosPath.default().get('/api/address/getAllProvince')
    }
}
export default AddressAPI