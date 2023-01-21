import axiosPath from "../axiosPath";
class ProductAPI {
    static async getAllCategory() {
        return axiosPath.default().get('/api/product/getAllCategory')
    }
    static async getPopularProducts() {
        return axiosPath.default().get('/api/product/getPopularProducts')
    }
}
export default ProductAPI