import axiosPath from "../axiosPath";
class ProductAPI {
    static async getAllCategory() {
        return await axiosPath.default().get('/api/product/getAllCategory')
    }
    static async getPopularProducts() {
        return await axiosPath.default().get('/api/product/getPopularProducts')
    }
    static async filterProduct(queryParam) {
        return await axiosPath.default().get('/api/product/filterProduct', { params: queryParam });
    }
}
export default ProductAPI