import axiosPath from "../axiosPath";
class CartAPI {
    static async getCartItem() {
        return await axiosPath.default().get('/api/cart/getProductInCart')
    }
    static async addCartItem(cosmeticId, quantity) {
        return await axiosPath.default().post('/api/cart/addProductToCart',
            { cosmeticId: cosmeticId, quantity: quantity })
    }
    static async updateCartItem(cosmeticId, quantity) {
        return await axiosPath.default().post('/api/cart/updateProductInCart',
            { cosmeticId: cosmeticId, quantity: quantity })
    }
    static async deleteCartItem(cosmeticId) {
        return await axiosPath.default().delete('/api/cart/deleteProductInCart/' + cosmeticId)
    }
}
export default CartAPI