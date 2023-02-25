<script setup>
import ProductAPI from '../api/ProductAPI/ProductAPI'
import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/antd.css'
import { reactive, watch, nextTick, computed, ref } from 'vue'
import { onMounted } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import AddressAPI from '../api/AddressAPI/AddressAPI'
import ShipPriceAPI from '../api/ShipPriceAPI/ShipPriceAPI'
import CartAPI from '../api/CartAPI/CartAPI'
import VNDCurrencyFormatter from '../util/VNDCurrencyFormatter'
import ChangeAddress from '../components/PaymentComponent/ChangeAddress.vue'
import ChangeShipMethod from './PaymentComponent/ChangeShipMethod.vue'
import { loadScript } from "@paypal/paypal-js"
import PriceUltil from '../util/PriceUtil'
const paypalBtn = ref(null)

const route = useRoute()
const loading = ref(true)
const state = reactive({
    addresses: [],
    currentAddress: null,
    currentService: null,
    currentPaymentMethod: 'cash',
    shipPriceDetail: []
})
const isOpenAddressEdit = ref(false)
const isOpenShipMethodEdit = ref(false)
const cartItems = ref([])
let isFirstInit = 0
onMounted(async () => {
    await CartAPI.getCartItem()
        .then(res => {
            cartItems.value = res.data.listCartItem
        })
    await AddressAPI.getAllAddress()
        .then(async res => {
            const cartItems = await CartAPI.getCartItem()
            state.addresses = res.data
            if (res.data.length !== 0) {
                const defaultAddress = res.data.find(address => address.IS_DEFAULT);
                state.currentAddress = defaultAddress
                state.shipPriceDetail = await ShipPriceAPI.getShipPrice(defaultAddress, cartItems.data.listCartItem)
                state.currentService = state.shipPriceDetail[0]
                loading.value = false
            }
        })
    let paypal
    try {
        paypal = await loadScript({
            'client-id': 'AblowdzjW4qMJOBp7OZNdpHd3GiiFBLnJet_zderciQE9qDsq3_bYfc3SmVPloWY7Rezl1DTP7_lcXZ7',
        });
    } catch (error) {
        console.error('failed to load the PayPal JS SDK script', error);
    }

    if (paypal) {
        try {
            await paypal.Buttons({
                async createOrder(data, actions) {
                    let price = PriceUltil.convertToUSD(getTotal._value);
                    // const getPrice = async () => {
                    //     await PriceUltil.convertToUSD(Number(getTotal) + Number(state.currentService.feeShip.total))
                    //         .then(res => {
                    //             price = res;
                    //         })
                    // }
                    // await getPrice()
                    return actions.order.create({
                        purchase_units: [
                            {
                                amount: {
                                    "currency_code": "USD",
                                    "value": price + '',
                                },
                                "reference_id": "AblowdzjW4qMJOBp7OZNdpHd3GiiFBLnJet_zderciQE9qDsq3_bYfc3SmVPloWY7Rezl1DTP7_lcXZ7"
                            },
                        ],
                    });
                },
                onApprove(data, actions) {
                    return actions.order.capture().then((details) => {
                        const name = details.payer.name.given_name;
                        // setLoading(true);
                        // CartAPI.payment({
                        //     shipPrice: currentService.feeShip.total,
                        //     addressId: currentAddress.addressId,
                        //     method: 'paypal'
                        // })
                        //     .then(res => {
                        //         navigate('/', { replace: true });
                        //         props.setReload()
                        //     })
                        //     .catch((err) => {
                        //         NotificationManager.error("Lỗi")
                        //     })
                        console.log(name)
                    });
                }
            }
            ).render(paypalBtn.value);
        } catch (error) {
            console.error('failed to render the PayPal Buttons', error);
        }
    }
})
function getPercent(price, priceAfterDiscount) {
    const percent = ((parseFloat(price) - parseFloat(priceAfterDiscount || 0)) / parseFloat(price)).toFixed(3)
    return '- ' + percent * 100 + '%'
}
function getSumprice(price, quantity) {
    return VNDCurrencyFormatter.formatToVND((parseFloat(price) * parseInt(quantity)).toFixed(3))
}
const getSumAll = computed(() => {
    let sum = 0
    if (cartItems) {
        cartItems.value.forEach(cartItem => {
            const price = cartItem.discount ? cartItem.discount.priceAfterDiscount : cartItem.cosmetic.PRICE
            sum += parseFloat(price) * parseInt(cartItem.quantity)
        })
    }
    return VNDCurrencyFormatter.formatToVND(sum)
})
const getTotal = computed(() => {
    let sum = 0
    if (cartItems) {
        cartItems.value.forEach(cartItem => {
            const price = cartItem.discount ? cartItem.discount.priceAfterDiscount : cartItem.cosmetic.PRICE
            sum += parseFloat(price) * parseInt(cartItem.quantity)
        })
    }
    return sum + parseFloat(state.currentService.feeShip.total)
})

async function changeCurrentAddress(newAddressId) {
    if (isFirstInit === 0) {
        isFirstInit = 1
        return
    }
    if (parseInt(newAddressId) === parseInt(state.currentAddress.ADDRESS_ID)) {
        return
    }
    loading.value = true
    const newAddress = state.addresses.find(address => parseInt(address.ADDRESS_ID) === parseInt(newAddressId))
    // current address change => call watch in currentAddressId => loop infinity
    state.currentAddress = newAddress
    const shipPriceDetail = await ShipPriceAPI.getShipPrice(newAddress, cartItems.value)
    state.currentService = shipPriceDetail[0]
    loading.value = false
}

function changeShipMethod(newServiceId) {
    if (!newServiceId) {
        return
    }
    // not call api => not need to call loading
    const newService = state.shipPriceDetail.find(method => parseInt(method.service.service_type_id) === parseInt(newServiceId))
    state.currentService = newService
}
// }
// send loading to child component => if loading => disabled
const isShowChangeAddressInLoading = computed(() => {
    return isOpenAddressEdit.value && state.currentAddress !== null && loading.value === true
})
</script>
<template>
    <div class='container' v-if="!loading">
        <ChangeAddress v-if="isOpenAddressEdit" @changeAddress="changeCurrentAddress"
            @closeChangeAddress="() => isOpenAddressEdit = false" :addresses="state.addresses"
            :currentAddress="state.currentAddress" :key="state.currentAddress.ADDRESS_ID" />
        <ChangeShipMethod v-show="isOpenShipMethodEdit" @changeShipMethod="changeShipMethod"
            @closeChangeShipMethod="() => isOpenShipMethodEdit = false" :shipDetail="state.shipPriceDetail"
            :currentService="state.currentService" />
        <div class='container-title'>
            Thanh toán
        </div>
        <div class='payment'>
            <div class='payment-header form-container my-custom-form'>
                <div class='title my-custom-form'>
                    <div>

                    </div>
                    <div> Địa chỉ nhận hàng </div>
                </div>
                <div class='content'>
                    <div class='address-select'>
                        <div class='address-detail'>
                            <div class='userName'>
                                <b>
                                    {{ state.currentAddress.CLIENT_NAME }}
                                    &nbsp;|&nbsp;{{ state.currentAddress.PHONE }}
                                </b>
                            </div>
                            <div class='address'>
                                {{ state.currentAddress.ADDRESS_DETAIL }}
                            </div>
                            <div class='default-address' v-if="state.currentAddress.IS_DEFAULT">
                                Mặc định
                            </div>
                        </div>
                        <div class='change-address'>
                            <div @click="isOpenAddressEdit = true" class="change">Thay đổi</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class='payment-product form-container my-custom-form'>
                <div class='title my-custom-form'>
                    Sản phẩm đã đặt
                </div>
                <div class='content'>
                    <div class='product'>
                        <table>
                            <thead>
                                <tr>
                                    <td>
                                        Sản phẩm
                                    </td>
                                    <td class='price sub'>
                                        Đơn giá
                                    </td>
                                    <td class='quantity sub'>
                                        Số lượng
                                    </td>
                                    <td class='sum sub'>
                                        Thành tiền
                                    </td>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="cartItem in cartItems">
                                    <td class='product-img'>
                                        <img alt='img' :src="cartItem.cosmetic.IMAGE.IMAGE_URL" />
                                        <div>{{ cartItem.cosmetic.COSMETIC_NAME }}</div>
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
                                                    {{ getPercent(cartItem.discount.price,
                                                        cartItem.discount.priceAfterDiscount) }}
                                                </label>
                                            </div>
                                        </div>
                                        <div class="price-not-sale" v-else>
                                            {{ VNDCurrencyFormatter.formatToVND(cartItem.cosmetic.PRICE) }}
                                        </div>

                                    </td>
                                    <td class='quantity'>
                                        {{ cartItem.quantity }}
                                    </td>
                                    <td class='sum'>
                                        <span v-if="cartItem.discount">
                                            {{ getSumprice(cartItem.discount.priceAfterDiscount, cartItem.quantity) }}
                                        </span>
                                        <span v-else>
                                            {{ getSumprice(cartItem.cosmetic.PRICE, cartItem.quantity) }}
                                        </span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div class='ship-method form-container my-custom-form'>
                <div class='title'>
                    <div>

                    </div>
                    <div>Phương thức vận chuyển</div>
                </div>
                <div class='content'>
                    <div class='services'>
                        <div class='services-detail'>
                            <div>
                                Phương thức vận chuyển: &nbsp; {{ state.currentService.service.short_name }}
                            </div>
                            <div>
                                Phí vận chuyển: &nbsp;
                                <label>
                                    {{ VNDCurrencyFormatter.formatToVND(state.currentService.feeShip.total) }}
                                </label>
                            </div>
                        </div>
                        <div class="change" @click="isOpenShipMethodEdit = true">
                            Thay đổi
                        </div>
                    </div>
                </div>
            </div>
            <div class='sum-price form-container my-custom-form'>
                <div class='title'>
                    Chi tiết thanh toán:
                </div>
                <div class='content'>
                    <div>
                        Tổng tiền hàng: &nbsp;
                        {{ getSumAll }}
                    </div>
                    <div>Phí vận chuyển : &nbsp;
                        {{ VNDCurrencyFormatter.formatToVND(state.currentService.feeShip.total) }}
                    </div>
                    <div>Tổng tiền: &nbsp;
                        <span class="total">
                            {{ VNDCurrencyFormatter.formatToVND(getTotal) }}
                        </span>
                    </div>
                </div>
            </div>
            <div class='select-payment-option form-container my-custom-form'>
                <div class='title my-custom-form'>
                    Phương thức thanh toán:
                </div>
                <div class='content'>
                    <div class='payment-option'>
                        <div @click="state.currentPaymentMethod = 'cash'" class='payment-method' id='cash-method'
                            :class="{ active: state.currentPaymentMethod === 'cash' }">
                            <div class='method-title'>
                                Tiền mặt
                            </div>
                            <div class="method-icon">
                                <i class="bi bi-cash"></i>
                            </div>
                        </div>
                        <div class='payment-method' @click="state.currentPaymentMethod = 'paypal'" id='paypal-method'
                            :class="{ active: state.currentPaymentMethod === 'paypal' }">
                            <div class='method-title'>
                                Paypal
                            </div>
                            <div class="method-icon">
                                <i class="bi bi-paypal"></i>
                            </div>
                        </div>
                    </div>
                    <div class='cash-payment-group' v-show="state.currentPaymentMethod === 'cash'">
                        <div>
                            <p>
                                <b>Thanh toán khi nhận hàng: </b>
                                <br />
                                Phí thu hộ: 0 VNĐ
                            </p>
                        </div>
                        <button class='save pay'>Đặt hàng</button>
                    </div>
                    <div class="payment-withpaypal" v-show="state.currentPaymentMethod !== 'cash'">
                        <div>
                            <b>Thanh toán trực tiếp bằng paypal:</b>
                        </div>
                        <div ref="paypalBtn"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class='container' v-if="loading">
        <ChangeAddress v-if="isShowChangeAddressInLoading" :addresses="state.addresses"
            :currentAddress="state.currentAddress" :loading="loading" />
        <div class='container-title'>
            Thanh toán
        </div>
        <div class='payment'>
            <div class='payment-header form-container my-custom-form'>
                <div class='title my-custom-form'>
                    <div>

                    </div>
                    <div> Địa chỉ nhận hàng </div>
                </div>
                <div class='content'>
                    <div class='address-select'>
                        <div class='address-detail'>
                            <div class='userName'>
                                <b>

                                    &nbsp;|&nbsp;
                                </b>
                            </div>
                            <div class='address'>

                            </div>
                        </div>
                        <div class='change-address'>
                            <div>Thay đổi</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class='payment-product form-container my-custom-form'>
                <div class='title my-custom-form'>
                    Sản phẩm đã đặt
                </div>
                <div class='content'>
                    <div class='product'>
                        <table>
                            <thead>
                                <tr>
                                    <td>
                                        Sản phẩm
                                    </td>
                                    <td class='price sub'>
                                        Đơn giá
                                    </td>
                                    <td class='quantity sub'>
                                        Số lượng
                                    </td>
                                    <td class='sum sub'>
                                        Thành tiền
                                    </td>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td class='product-img'>

                                        <div></div>
                                    </td>
                                    <td>
                                        <div class="price">
                                            <div class="price-after-sale">

                                            </div>
                                            <div class='price-sale'>
                                                <label class='real-price'>

                                                </label>
                                                &nbsp;|&nbsp;
                                                <label class='percent-discount'>

                                                </label>
                                            </div>
                                        </div>


                                    </td>
                                    <td class='quantity'>

                                    </td>
                                    <td class='sum'>

                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div class='ship-method form-container my-custom-form'>
                <div class='title'>
                    <div>

                    </div>
                    <div>Phương thức vận chuyển</div>
                </div>
                <div class='content'>
                    <div class='services'>
                        <div class='services-detail'>
                            <div>
                                Phương thức vận chuyển: &nbsp;
                            </div>
                            <div>
                                Phí vận chuyển: &nbsp;
                                <label>

                                </label>
                            </div>
                        </div>
                        <div class="change">
                            Thay đổi
                        </div>
                    </div>
                </div>
            </div>
            <div class='sum-price form-container my-custom-form'>
                <div class='title'>
                    Chi tiết thanh toán:
                </div>
                <div class='content'>
                    <div>
                        Tổng tiền hàng: &nbsp;

                    </div>
                    <div>Phí vận chuyển : &nbsp;

                    </div>
                    <div>Tổng tiền: &nbsp;
                        <span class="total">

                        </span>
                    </div>
                </div>
            </div>
            <div class='select-payment-option form-container my-custom-form'>
                <div class='title my-custom-form'>
                    Phương thức thanh toán:
                </div>
                <div class='content'>
                    <div class='payment-option'>
                        <div class='payment-method' id='cash-method'>
                            <div class='method-title'>
                                Tiền mặt
                            </div>
                            <div class="method-icon">
                                <i class="bi bi-cash"></i>
                            </div>
                        </div>
                        <div class='payment-method' id='paypal-method'>
                            <div class='method-title'>
                                Paypal
                            </div>
                            <div class="method-icon">
                                <i class="bi bi-paypal"></i>
                            </div>
                        </div>
                    </div>
                    <div class='cash-payment-group'>
                        <div>
                            <p>
                                <b>Thanh toán khi nhận hàng: </b>
                                <br />
                                Phí thu hộ: 0 VNĐ
                            </p>
                        </div>
                        <button class='save pay'>Đặt hàng</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
.change {
    cursor: pointer;
    color: blue;
}

.payment {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 20px;
    border-radius: 3px;
    border: solid 1px rgba(231, 224, 224, 0.902) !important;
    box-shadow: 0 0 35px 0 rgba(203, 198, 198, 0.902)
}

.payment .payment-product .product .product-img img {
    width: 100px;
    height: 100px;
}

.payment .payment-header {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.my-custom-form {
    box-shadow: none !important;
    border-top: none;
    border-left: none;
    border-right: none;
    border-radius: 0px;
    border-bottom: solid 1px rgba(223, 215, 215, 0.884) !important;
}

.payment .payment-product .content .product table {
    width: 100%;
    border-collapse: collapse;
}

.sub {
    color: #888;
}

.payment .payment-product .content .product table .product-img {
    display: flex;
    align-items: center;
    gap: 15px;
    text-align: left;
}

.payment .payment-product .content .product table td {}

.payment .payment-product .content .product table .sum {
    text-align: end;
}

.payment .payment-product .content .product table .quantity {
    text-align: center;
}

.payment .payment-product .content .product table tr {
    border-bottom: solid 1px rgb(237, 233, 233);
}

.payment .payment-header .content .address-select {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    min-height: 31.6px;
}

.payment .payment-header .content .address-select .address-detail {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: 10px;
}

.payment .payment-header .content .address-select .address-detail div {
    display: flex;
    align-items: center;
}

.payment .payment-header .content .address-select .address-detail .default-address {
    border: red 1px solid;
    padding: 5px 10px;
    border-radius: 3px;
    color: red;
}

.payment thead td {
    border-bottom: solid 3px rgb(237, 233, 233);
    padding-bottom: 10px;
    padding-top: 10px;
}

.payment td {
    vertical-align: middle;
    padding: 15px 0px;
    padding-right: 20px;
}

.detail {
    display: flex;
    flex-direction: column;
    gap: 5px
}

.address-detail .userName {
    font-weight: 500;
}

.my-popup-content {
    width: 500px !important;
    border-radius: 5px;
    font-size: 15px;
    padding: 20px 0px !important;
}

.my-popup-container {
    width: 100%;
}

.my-popup-container .content {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.my-popup-container .content .content-row {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    border-bottom: solid 1px rgb(214, 211, 211);
    padding: 15px 20px;
}

.my-popup-container .title {
    font-size: 16px;
    border-bottom: solid 1px rgb(214, 211, 211);
    padding-bottom: 15px;
    padding-left: 15px;
    padding-right: 15px;
    font-weight: 500;
    text-transform: uppercase;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
}

.my-popup-container .radio-box {
    display: flex;
    justify-content: center;
    align-items: center;
}

.my-popup-container .radio-box input {
    outline: none;
    border: none;
}

.payment .ship-method .services {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
}

.payment .ship-method .services .services-detail {}

.payment .select-payment-option .content {
    display: flex;
    justify-content: space-between;
    min-height: 220px;
}

.payment .select-payment-option .content .payment-option {
    display: flex;
    flex-direction: row;
    gap: 15px;
}

.payment .select-payment-option .content .payment-option .payment-method {
    display: flex;
    flex-direction: column;
    border-radius: 5px;
    border: 1px solid rgb(202, 196, 196);
    height: fit-content;
    padding: 5px 20px;
    cursor: pointer;
}

.payment .select-payment-option .payment-withpaypal {
    display: flex;
    justify-content: center;
    gap: 15px;
    flex-direction: column;
}

.payment .select-payment-option .content .payment-option .active {
    border: 3px solid rgb(57, 50, 50);
}

.payment .select-payment-option .content .payment-option .payment-method .method-title {
    font-weight: 500;
    font-size: 16px;
}

.payment .select-payment-option .content .payment-option .payment-method .method-icon {
    font-size: 20px;
}

.payment .select-payment-option .content .my-paypal-button {
    width: 300px;
}

.payment .select-payment-option .content .cash-payment-group {
    display: flex;
    flex-direction: column;
    gap: 60px;
}

.payment .select-payment-option .content .cash-payment-group .pay {
    width: 190px;
    background-color: rgb(22, 20, 20);
    padding: 17px 20px;
}

.payment .payment-product .content .product table .price-sale {
    font-size: 13.5px;
    color: rgb(96, 93, 93);
}

.payment .payment-product .content .product table .price-sale .real-price {
    text-decoration: line-through;
}

.payment .payment-product .content .product table .price-sale .percent-discount {
    color: red;
}

tbody .price {
    font-size: 15px;
}

tbody .price-not-sale {
    font-size: 15px;
    font-weight: 600;
}

tbody .price .price-after-sale {
    font-weight: 600;
}

.sum-price .total {
    color: red;
    font-size: 18px;
    font-weight: 600;
}
</style>
