import axiosPath from "../axiosPath";
class CartAPI {
    static async getCartItem() {
        return await axiosPath.default().get('/api/cart/getProductInCart')
    }
    static async updateCartItem(cosmeticId, quantity) {
        return await axiosPath.default().post('/api/cart/addProductToCart',
            { cosmeticId: cosmeticId, quantity: quantity })
    }
}
export default CartAPI