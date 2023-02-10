<script setup>
import ProductAPI from '../api/ProductAPI/ProductAPI'
import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/antd.css'
import { reactive, watch, nextTick, computed, ref } from 'vue'
import { onMounted } from 'vue'
import VNDCurrencyFormatter from '../util/VNDCurrencyFormatter'
import Card from '../components/Card.vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import Paginate from "vuejs-paginate-next"

const route = useRoute()
const sort = ref(1)
const page = ref(1)
const state = reactive({
    products: null,
})


onMounted(() => {

})
</script>
<template>
    <div class='cart-container'>
        <div class='left-cart'>
            <table class='cart-table'>
                <thead>
                    <tr class='head'>
                        <td width="50%">Sản phẩm</td>
                        <td width="15%">Đơn giá</td>
                        <td width="25%">Số lượng</td>
                        <td width="10%" class="thanhtien">Thành tiền</td>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td width="50%" class='product'>
                            
                        </td>
                        <td>
                            
                        </td>
                        <td class='group-select-cart'>
                            
                        </td>

                        <td width="10%" class="thanhtien">
                            
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
                                <div class="update">
                                    <button>Cập nhật</button>
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

                        </div>
                    </div>
                    <div class='row'>
                        <div class='row-title'>Tổng tiền: </div>
                        <div class='row-content sum-price'>

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

.cart-container .left-cart .cart-table tbody .product {
    display: flex;
    align-items: center;
}

.cart-container .left-cart .cart-table tbody .quantity {
    min-width: 100px;
}

.cart-container .left-cart .cart-table tbody .quantity button {
    border: 1px solid rgb(219, 215, 215);
    padding: 10px 10px;
    cursor: pointer;
}

.cart-container .left-cart .cart-table tbody .quantity .input-quantity {
    width: 20px;
    text-align: center;
    border: 1px solid rgb(219, 215, 215);
    padding: 10px 10px;
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
    gap: 30px;
    cursor: pointer;
    width: fit-content;
}
.thanhtien {
    text-align: end;
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
