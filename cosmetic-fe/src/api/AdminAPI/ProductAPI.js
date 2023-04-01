import axiosPath from "../axiosPath";
class CartAPI {
    static async getProducts() {
        return await axiosPath.default().get('/api/admin/product/getProducts')
    }
    static async getProviders() {
        return await axiosPath.default().get('/api/admin/product/getAllProvider')
    }
    static async getCategories() {
        return await axiosPath.default().get('/api/admin/product/getAllCategory')
    }
    static async addNewProduct(formData) {
        return await axiosPath.formData().post('/api/admin/product/create', formData)
    }
}
export default CartAPI