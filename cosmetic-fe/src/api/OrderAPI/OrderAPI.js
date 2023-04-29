import axiosPath from "../axiosPath";
class OrderAPI {
    static async getAll() {
        return await axiosPath.default().get('/api/admin/order/getAll')
    }
    static async updateStatus(data) {
        return await axiosPath.default().put('/api/admin/order/updateStatus', data)
    }
}
export default OrderAPI;