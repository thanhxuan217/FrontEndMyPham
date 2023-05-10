import axiosPath from "../axiosPath";
class OrderAPI {
    static async getAll() {
        return await axiosPath.default().get('/api/admin/order/getAll')
    }
    static async updateStatus(data) {
        return await axiosPath.authentication().put('/api/admin/order/updateStatus', data)
    }
    static async approve(data) {
        return await axiosPath.authentication().put('/api/admin/order/approve', data)
    }
}
export default OrderAPI;