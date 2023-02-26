import axiosPath from "../axiosPath";
class CartAPI {
    static async getCartItem() {
        return await axiosPath.authentication().get('/api/cart/getProductInCart')
    }
    static async addCartItem(cosmeticId, quantity) {
        return await axiosPath.authentication().post('/api/cart/addProductToCart',
            { cosmeticId: cosmeticId, quantity: quantity })
    }
    static async updateCartItem(cosmeticId, quantity) {
        return await axiosPath.authentication().post('/api/cart/updateProductInCart',
            { cosmeticId: cosmeticId, quantity: quantity })
    }
    static async deleteCartItem(cosmeticId) {
        return await axiosPath.authentication().delete('/api/cart/deleteProductInCart/' + cosmeticId)
    }
    static async payment(data) {
        return await axiosPath.authentication().post('/api/cart/payment', data)
    }
}
export default CartAPI