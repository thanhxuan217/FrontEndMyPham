<script setup>
import 'vue-slider-component/theme/antd.css'
import { reactive, watch, nextTick, computed, ref } from 'vue'
import { onMounted } from 'vue'
import VNDCurrencyFormatter from '../util/VNDCurrencyFormatter'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import CartAPI from '../api/CartAPI/CartAPI'
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import { useCartStore } from '../store/CartStore'
const cartStore = useCartStore()
const route = useRoute()
const sort = ref(1)
const page = ref(1)
const loading = ref(true)
const state = reactive({
    cartItems: [],
})

function getPercent(price, priceAfterDiscount) {
    const percent = ((parseFloat(price) - parseFloat(priceAfterDiscount || 0)) / parseFloat(price)).toFixed(3)
    return '- ' + percent * 100 + '%'
}
function getSumprice(price, quantity) {
    return VNDCurrencyFormatter.formatToVND((parseFloat(price) * parseInt(quantity)).toFixed(3))
}
async function minusOrPlusQuantity(e) {
    const id = e.target.id.split(' ')
    const cosmeticId = state.cartItems.listCartItem[id[0]].cosmetic.COSMETIC_ID
    const currentQuantity = state.cartItems.listCartItem[id[0]].quantity
    loading.value = true
    switch (id[1]) {
        case 'btn-plus':
            await CartAPI.addCartItem(cosmeticId, 1).catch(err => {
                toast.error(err.response.data, { theme: 'colored' })
                loading.value = false
                return
            })
            // then not working ???
            CartAPI.getCartItem().then(res => {
                state.cartItems = res.data
                loading.value = false
                // access after change
                // setTimeout(() => loading.value = false, 2000)
            })
            break
        default:
            if (currentQuantity === 1) {
                loading.value = false
                return
            }
            await CartAPI.addCartItem(cosmeticId, -1)
                .catch(err => {
                    toast.error(err.response.data, { theme: 'colored' })
                    loading.value = false
                    return
                })
            CartAPI.getCartItem().then(res => {
                state.cartItems = res.data
                loading.value = false
                // setTimeout(() => loading.value = false, 2000)
            })
            break
    }
}
const getCartItem = computed(() => {
    return state.cartItems.listCartItem
})
const getKey = computed(() => {
    return state.cartItems.key
})
const getSumAll = computed(() => {
    let sum = 0
    if (state.cartItems.listCartItem) {
        state.cartItems.listCartItem.forEach(cartItem => {
            const price = cartItem.discount ? cartItem.discount.priceAfterDiscount : cartItem.cosmetic.PRICE
            sum += parseFloat(price) * parseInt(cartItem.quantity)
        })
    }

    return VNDCurrencyFormatter.formatToVND(sum)
})
async function changeInput(e) {
    const quantity = e.target.value
    const inputId = e.target.id.split(' ')
    const cosmeticId = inputId[0]
    if (isNaN(quantity) || parseInt(quantity) <= 0) {
        toast.error("Số lượng không hợp lệ", { theme: 'colored' })
        return
    }
    loading.value = true
    await CartAPI.updateCartItem(cosmeticId, quantity).catch(
        (err) => {
            toast.error(err.response.data, { theme: 'colored' })
            loading.value = false
            return
        }
    )
    CartAPI.getCartItem().then(res => {
        state.cartItems = res.data
        loading.value = false
        // setTimeout(() => loading.value = false, 2000)
    })
}
async function deleteCartItem(e) {
    const cosmeticId = e.currentTarget.id.split(' ')[0]
    loading.value = true
    await CartAPI.deleteCartItem(cosmeticId)
        .catch(err => {
            toast.error(err.response.data, { theme: 'colored' })
            loading.value = false
            return
        })
    await CartAPI.getCartItem().then(res => {
        state.cartItems = res.data
        cartStore.commitCartQuantity(res.data.listCartItem.length)
        loading.value = false
        // setTimeout(() => loading.value = false, 2000)
    })
}
onMounted(() => {
    CartAPI.getCartItem().then(async res => {
        state.cartItems = res.data
        loading.value = false
    })
})
</script>
<template>
    <div class='cart-container' v-if="!loading" :key="getKey">
        <div class='left-cart'>
            <table class='cart-table'>
                <thead>
                    <tr class='head'>
                        <td width="50%">Sản phẩm</td>
                        <td width="15%">Đơn giá</td>
                        <td width="10%">Số lượng</td>
                        <td width="15%" class="thanhtien">Thành tiền</td>
                        <td width="2%"></td>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(cartItem, index) in getCartItem">
                        <td width="50%">
                            <div class='product'>
                                <img alt='img' :src="cartItem.cosmetic.IMAGE.IMAGE_URL" />
                                {{ cartItem.cosmetic.COSMETIC_NAME }}
                            </div>
                        </td>
                        <td>
                            <div class="price" v-if="cartItem.discount">
                                <div class="price-after-sale">
                                    {{ VNDCurrencyFormatter.formatToVND(cartItem.discount.priceAfterDiscount) }}
                                </div>
                                <div class='price-sale'>
                                    <label class='real-price'>
                                        {{ VNDCurrencyFormatter.formatToVND(cartItem.cosmetic.PRICE) }}
                                    </label>
                                    &nbsp;|&nbsp;
                                    <label class='percent-discount'>
                                        {{ getPercent(cartItem.discount.price, cartItem.discount.priceAfterDiscount) }}
                                    </label>
                                </div>
                            </div>
                            <div class="price-not-sale" v-else>
                                {{ VNDCurrencyFormatter.formatToVND(cartItem.cosmetic.PRICE) }}
                            </div>
                        </td>
                        <td>
                            <div class='quantity'>
                                <button :id="index + ' btn-minus'" @click="minusOrPlusQuantity">-</button>
                                <input class='input-quantity' :id="cartItem.cosmetic.COSMETIC_ID + ' input'"
                                    :value="cartItem.quantity" @change="changeInput" />
                                <button :id="index + ' btn-plus'" @click="minusOrPlusQuantity">+</button>
                            </div>
                        </td>
                        <td width="15%" class="thanhtien">
                            <span v-if="cartItem.discount">
                                {{ getSumprice(cartItem.discount.priceAfterDiscount, cartItem.quantity) }}
                            </span>
                            <span v-else>
                                {{ getSumprice(cartItem.cosmetic.PRICE, cartItem.quantity) }}
                            </span>
                        </td>
                        <td class="trash">
                            <div :id="cartItem.cosmetic.COSMETIC_ID + ' delete'" @click="deleteCartItem">
                                <i class="bi bi-trash"></i>
                            </div>
                        </td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr>
                        <td colspan="8">
                            <div class="foot">
                                <div class="go-back" onClick={goBack}>
                                    <i class="bi bi-arrow-left"></i>
                                    Tiếp tục mua hàng
                                </div>
                            </div>
                        </td>
                    </tr>
                </tfoot>
            </table>
        </div>
        <div class='right-cart-container'>
            <div class='right-cart'>

                <div class='content'>
                    <div class='row'>
                        <div class='row-title'>Tạm tính: </div>
                        <div class='row-content temp-price'>
                            {{ getSumAll }}
                        </div>
                    </div>
                    <div class='row'>
                        <div class='row-title'>Tổng tiền: </div>
                        <div class='row-content sum-price'>
                            {{ getSumAll }}
                        </div>
                    </div>
                </div>
            </div>
            <button class='btn-pay' id="payment" onClick={handlePay}>Thanh toán</button>
        </div>
    </div>
    <div class='cart-container' v-else>
        <div class='left-cart'>
            <table class='cart-table'>
                <thead>
                    <tr class='head'>
                        <td width="50%">Sản phẩm</td>
                        <td width="15%">Đơn giá</td>
                        <td width="10%">Số lượng</td>
                        <td width="15%" class="thanhtien">Thành tiền</td>
                        <td width="2%"></td>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(cartItem, index) in getCartItem">
                        <td width="50%">
                            <div class='product'>
                                <img alt='img' :src="cartItem.cosmetic.IMAGE.IMAGE_URL" />
                                {{ cartItem.cosmetic.COSMETIC_NAME }}
                            </div>
                        </td>
                        <td>
                            <div class="price" v-if="cartItem.discount">
                                <div class="price-after-sale">
                                    {{ VNDCurrencyFormatter.formatToVND(cartItem.discount.priceAfterDiscount) }}
                                </div>
                                <div class='price-sale'>
                                    <label class='real-price'>
                                        {{ VNDCurrencyFormatter.formatToVND(cartItem.cosmetic.PRICE) }}
                                    </label>
                                    &nbsp;|&nbsp;
                                    <label class='percent-discount'>
                                        {{ getPercent(cartItem.discount.price, cartItem.discount.priceAfterDiscount) }}
                                    </label>
                                </div>
                            </div>
                            <div class="price-not-sale" v-else>
                                {{ VNDCurrencyFormatter.formatToVND(cartItem.cosmetic.PRICE) }}
                            </div>
                        </td>
                        <td>
                            <div class='quantity'>
                                <button :id="index + ' btn-minus'" disabled>-</button>
                                <input class='input-quantity' />
                                <button :id="index + ' btn-plus'" disabled>+</button>
                            </div>
                        </td>
                        <td width="15%" class="thanhtien">
                            <span v-if="cartItem.discount">
                                {{ getSumprice(cartItem.discount.priceAfterDiscount, cartItem.quantity) }}
                            </span>
                            <span v-else>
                                {{ getSumprice(cartItem.cosmetic.PRICE, cartItem.quantity) }}
                            </span>
                        </td>
                        <td class="trash">
                            <i class="bi bi-trash"></i>
                        </td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr>
                        <td colspan="8">
                            <div class="foot">
                                <div class="go-back">
                                    <i class="bi bi-arrow-left"></i>
                                    Tiếp tục mua hàng
                                </div>
                            </div>
                        </td>
                    </tr>
                </tfoot>
            </table>
        </div>
        <div class='right-cart-container'>
            <div class='right-cart'>

                <div class='content'>
                    <div class='row'>
                        <div class='row-title'>Tạm tính: </div>
                        <div class='row-content temp-price'>
                            {{ getSumAll }}
                        </div>
                    </div>
                    <div class='row'>
                        <div class='row-title'>Tổng tiền: </div>
                        <div class='row-content sum-price'>
                            {{ getSumAll }}
                        </div>
                    </div>
                </div>
            </div>
            <button class='btn-pay' id="payment" onClick={handlePay}>Thanh toán</button>
        </div>
    </div>
</template>
<style scoped>
.cart-container {
    display: flex;
    flex-direction: row;
    min-height: 500px;
    padding: 30px 30px;
    gap: 15px;
    font-size: 15px;
}

.cart-container .left-cart {
    display: flex;
    padding: 20px 25px;
    flex-direction: column;
    box-shadow: 0 0 35px 0 rgb(193, 191, 191);
    border-radius: 10px;
    height: fit-content;
    flex-grow: 2;
}

.cart-container .right-cart-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex-basis: 25%;
}

.cart-container .right-cart {
    display: flex;
    font-size: 15px;
    padding: 20px 25px;
    flex-direction: column;
    box-shadow: 0 0 35px 0 rgb(193, 191, 191);
    border-radius: 10px;
    height: fit-content;
    width: 310px;
}

.cart-container .left-cart .cart-table {
    border-collapse: collapse;
}

.cart-container .left-cart .cart-table td {
    padding: 15px 0px;
    padding-right: 20px;
}

.cart-container .left-cart .cart-table .head td {
    font-weight: bold;
    border-bottom: solid 3px rgb(237, 233, 233);
    padding-bottom: 10px;
    padding-top: 10px;
}

.cart-container .left-cart .cart-table td .price-sale {
    font-size: 13.5px;
    color: rgb(96, 93, 93);
}

.cart-container .left-cart .cart-table td .price-sale .real-price {
    text-decoration: line-through;
}

.cart-container .left-cart .cart-table td .price-sale .percent-discount {
    color: red;
}

.cart-container .left-cart .cart-table .checkbox {
    width: 25px;
}

.cart-container .left-cart .cart-table .checkbox input {
    width: 18px;
    height: 18px;
}

.cart-container .left-cart .cart-table tbody .sum {
    max-width: 137.5px;
}

.cart-container .left-cart .cart-table tbody .sum div {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: 15px;
}

.cart-container .left-cart .cart-table tbody td {
    vertical-align: middle;
}

.cart-container .left-cart .cart-table tbody .group-select-cart select {
    display: flex;
    outline: none;
    border: none;
    font-size: 14px;
    margin-top: 2px;
}

.cart-container .left-cart .cart-table tbody .group-select-cart option {
    padding: 1px 2px;
}

.cart-container .left-cart .cart-table tbody .price {
    font-size: 15px;
}

.cart-container .left-cart .cart-table tbody .price-not-sale {
    font-size: 15px;
    font-weight: 600;
}

.cart-container .left-cart .cart-table tbody .price .price-after-sale {
    font-weight: 600;
}

.cart-container .left-cart .cart-table tbody .product {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
}

.cart-container .left-cart .cart-table tbody .product img {
    width: 70px;
    height: 70px;
}

.cart-container .left-cart .cart-table tbody .quantity {
    min-width: 100px;
    display: flex;
}

.cart-container .left-cart .cart-table tbody .quantity button {
    border: 1px solid rgb(219, 215, 215);
    padding: 8px 8px;
    cursor: pointer;
}

.cart-container .left-cart .cart-table tbody .quantity .input-quantity {
    width: 20px;
    text-align: center;
    border: 1px solid rgb(219, 215, 215);
    padding: 8px 8px;
}

.cart-container .left-cart .cart-table tbody .quantity .input-quantity:focus {
    outline: none;
}

.cart-container .left-cart .cart-table tbody img {
    width: 100px;
    height: 100px;
    padding: 3px;
}

.cart-container .left-cart .cart-table .delete-cart {
    font-size: 22px;
    font-weight: 100;
    cursor: pointer;
}

.cart-container .right-cart .title {
    padding-top: 10px;
    padding-bottom: 10px;
    font-weight: bold;
    border-bottom: solid 3px rgb(237, 233, 233);
    height: fit-content;
    width: 100%;
}

.cart-container .right-cart .content {
    display: flex;
    gap: 15px;
    flex-direction: column;
    padding: 15px 0px;
}

.cart-container .right-cart .content .row {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
}


.cart-container .right-cart-container .btn-pay {
    background-image: linear-gradient(to right, #ba8152 0%, #ff5634 51%, #e62828 100%);
    padding: 15px 20px;
    border: solid 1px;
    text-align: center;
    width: 250px;
    text-transform: uppercase;
    transition: 0.5s;
    background-size: 200% auto;
    color: white;
    box-shadow: 0 0 20px #eee;
    border-radius: 12px;
    display: block;
    margin-top: 20px;
    cursor: pointer;
    font-weight: bold;
}

.cart-container .right-cart-container .btn-pay:hover {
    background-position: right center;
    /* change the direction of the change here */
    color: #fff;
    text-decoration: none;
}

.cart-container .right-cart .content .address-row {
    gap: 15px;
    justify-content: flex-start;
}

.cart-container .right-cart .content .address-row .row-content {
    flex-grow: 2;
}

.cart-container .right-cart .content .row .sum-price {
    color: red;
    font-weight: bold;
    font-size: 20px;
}

.cart-container .left-cart .cart-table tfoot .go-back {
    display: flex;
    align-items: center;
    gap: 15px;
    cursor: pointer;
    width: fit-content;
}

.thanhtien {
    text-align: center;
}

.trash {
    cursor: pointer;
    padding-right: 0 !important;
}

.cart-container .foot {
    display: flex;
    justify-content: space-between;
}

.cart-container .foot .update button {
    padding: 8px 15px;
    border: 2px solid #d66a12;
    border-radius: 5px;
    font-weight: bold;
    color: #d66a12;
    cursor: pointer;
}
</style>
