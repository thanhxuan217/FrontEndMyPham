import axiosPath from "../axiosPath";
class CartAPI {
    static async getProducts() {
        return await axiosPath.default().get('/api/admin/product/getProducts')
    }
}
export default CartAPI