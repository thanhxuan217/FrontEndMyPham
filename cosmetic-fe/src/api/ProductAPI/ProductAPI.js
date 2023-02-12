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
    static async getProductsByDiscountId(discountId) {
        return await axiosPath.default().get('/api/product/getProductByDiscountId/' + discountId);
    }
    static async searchProduct(keyword, page, limit) {
        return await axiosPath.default().get('/api/product/searchProductByKeyword', { params: { keyword: keyword, page: page, limit: limit } });
    }
    
}
export default ProductAPI