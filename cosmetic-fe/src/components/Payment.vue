<script setup>
import ProductAPI from '../api/ProductAPI/ProductAPI'
import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/antd.css'
import { reactive, watch, nextTick, computed, ref } from 'vue'
import { onMounted } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import AddressAPI from '../api/AddressAPI/AddressAPI'
const route = useRoute()
const sort = ref(1)
const page = ref(1)
const state = reactive({
    addresses: [],
    currentAddress: null,
    currentService: null,
    currentPaymentMethod: 'cash',
    shipPriceDetail: 0
})

onMounted(() => {
    AddressAPI.getAllAddress()
        .then(res => {
            state.addresses = res.data
            if (res.data.length !== 0) {
                const defaultAddress = res.data.find(address => address.IS_DEFAULT);
                state.currentAddress = defaultAddress
                console.log(defaultAddress)
            }
        })
})
</script>
<template>
    <div class='container'>
        <div class='container-title'>
            Thanh toán
        </div>
        <div class='payment'>
            <div class='payment-header form-container my-custom-form'>
                <div class='title my-custom-form'>
                    <div>
                        
                    </div>
                    <div> Địa chỉ: </div>
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

                            <div class='default-address'>
                                Mặc định
                            </div>

                        </div>
                        <div class='change-address'>
                            <div onClick={openAddressTooltip}>Thay đổi</div>

                        </div>
                    </div>
                </div>
            </div>
            <div class='payment-product form-container my-custom-form'>
                <div class='title my-custom-form'>
                    Sản phẩm
                </div>
                <div class='content'>
                    <div class='product'>
                        <table>
                            <thead>
                                <tr>
                                    <td>
                                        Sản phẩm
                                    </td>
                                    <td class='price'>
                                        Đơn giá
                                    </td>
                                    <td class='quantity'>
                                        Số lượng
                                    </td>
                                    <td class='sum'>
                                        Thành tiền
                                    </td>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td class='product-img'>
                                        <img alt='img' />
                                        <div></div>
                                    </td>
                                    <td class='price'>

                                        <div class='price-sale'>
                                            <label class='real-price'>

                                            </label>
                                            &nbsp;|&nbsp;
                                            <label class='percent-discount'>

                                            </label>
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
                        <div>
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

                    </div>
                </div>
            </div>
            <div class='select-payment-option form-container my-custom-form'>
                <div class='title my-custom-form'>
                    Phương thức thanh toán:
                </div>
                <div class='content'>
                    <div class='payment-option'>
                        <div class='payment-method' onClick={handleChangePaymentMethod} id='cash-method'>
                            <div class='method-title'>
                                Tiền mặt
                            </div>
                            <div class="method-icon">
                                <HiOutlineCash />
                            </div>
                        </div>
                        <div class='paypal' onClick={handleChangePaymentMethod} id='paypal-method'>
                            <div class='method-title'>
                                Paypal
                            </div>
                            <div class="method-icon">
                                <FaPaypal />
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
                        <button class='save pay' onClick={handleCashPay}>Đặt hàng</button>
                    </div>
                    <div class="payment-withpaypal">
                        <div>
                            <b>Thanh toán trực tiếp bằng paypal:</b>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>

.payment {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 20px;
    border-radius: 3px;
    border: solid 1px rgba(231, 224, 224, 0.902)!important;
    box-shadow: 0 0 35px 0 rgba(203, 198, 198, 0.902)}

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
    box-shadow: none!important;
    border-top: none;
    border-left: none;
    border-right: none;
    border-radius: 0px;
    border-bottom: solid 1px rgba(223, 215, 215, 0.884)!important;
}

.payment .payment-product .content .product table {
    width: 100%;
    border-collapse: collapse;
}

.payment .payment-product .content .product table .product-img {
    display: flex;
    align-items: center;
    gap: 15px;
    text-align: left;
}

.payment .payment-product .content .product table td {
    text-align: center;
}

.payment .payment-product .content .product table .sum {
    text-align: end;
}

.payment .payment-product .content .product table tr {
    border-bottom: solid 1px rgb(237, 233, 233);
}

.payment .payment-header .content .address-select {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
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
}

.payment thead td {
    font-weight: 600;
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

.detail .userName {
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
</style>
