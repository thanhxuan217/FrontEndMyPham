<script setup>
import { reactive, watch, nextTick, computed, ref } from 'vue'
import { onMounted } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import AuthenticationAPI from '../api/LoginAPI/AuthenticationAPI';
import OrderHistoriesView from '../views/OrderHistoriesView.vue';
import VNDCurrencyFormatter from '../util/VNDCurrencyFormatter';
const router = useRouter()
const route = useRoute()
const orders = ref([])
onMounted(() => {
    AuthenticationAPI.getOrders()
        .then(res => {
            console.log(res.data)
            orders.value = res.data
        })
})
function getAddress(data) {
    const result = data.ADDRESS_DETAIL + ',  ' + data.VILLAGE.VILLAGE_NAME + ',  ' + data.VILLAGE.DISTRICT.DISTRICT_NAME + ',  ' + data.VILLAGE.DISTRICT.PROVINCE.PROVINCE_NAME;
    return result;
}
function getStatus(status) {
    let result
    switch (parseInt(status)) {
        case 0:
            result = 'Chưa duyệt'
            break
        case 1:
            result = 'Đã duyệt'
            break
        case 2:
            result = 'Đã thanh toán'
            break
        case 3:
            result = 'Chưa thanh toán'
            break
    }
    return result
}
</script>
<template>
    <div class='change-userinfo-form-right-container order-history'>
        <div class='title'>
            Đơn hàng của bạn
        </div>
        <div class='content order-history-content'>
            <div class='order-container' v-for="order in orders">
                <div class='order-info'>
                    <div class='group-2'>
                        <div class='order-title'>
                            Thời gian đặt
                        </div>
                        <div class='order-content'>
                            {{ order.ORDER_TIME }}
                        </div>
                    </div>
                    <div class='group-2'>
                        <div class='order-title'>
                            Địa chỉ giao
                        </div>
                        <div class='order-content'>
                            {{ getAddress(order.ADDRESS) }}
                        </div>
                    </div>
                    <div class='group-2'>
                        <div class='order-title'>
                            Phương thức thanh toán
                        </div>
                        <div class='order-content'>
                            {{ order.METHOD === 'paypal' ? 'Paypal' : 'Tiền mặt' }}
                        </div>
                    </div>
                    <div class='group-2'>
                        <div class='order-title'>
                            Trạng thái
                        </div>
                        <div class='order-content'>
                            {{ getStatus(order.STATUS) }}
                        </div>
                    </div>
                </div>


                <div class='order-detail' v-for="orderDetail in order.order_details">
                    <div class='product-info'>
                        <div class='product-img'>
                            <img :src="orderDetail.COSMETIC.IMAGE.IMAGE_URL" />
                            <div class='product-name'>
                                <label>{{ orderDetail.COSMETIC.COSMETIC_NAME }}</label>
                                <label>x{{ orderDetail.COSMETIC.QUANTITY }}</label>
                            </div>
                        </div>
                        <div class='detail'>

                        </div>
                        <div class='price'>
                            Giá: {{ VNDCurrencyFormatter.formatToVND(orderDetail.PRICE) }}
                        </div>
                    </div>

                </div>
                <div class='price-info'>
                    <div class='ship-price'>
                        <label>
                            Phí ship:&nbsp;
                        </label>
                        <label>
                            {{ VNDCurrencyFormatter.formatToVND(order.SHIP_PRICE) }}
                        </label>
                    </div>
                    <div class='sum-price'>
                        <label>
                            Tổng tiền:&nbsp;
                        </label>
                        <label>
                            
                        </label>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
.order-history {
    overflow-x: hidden;
    overflow-y: scroll;
    display: flex;
    padding: 30px 50px;
    min-height: 500px;
    gap: 20px;
    font-size: 16px;
    flex-direction: column;
}

.order-history .title {
    padding-bottom: 15px;
    border-bottom: 1px solid rgb(219, 208, 208);
    font-weight: bold;
    text-transform: capitalize;
    font-size: 17px;
}

.order-history-content {
    display: flex;
    font-size: 15px;
    flex-direction: column;
    gap: 20px;
    flex-basis: 85%;
    flex-grow: 2;
    background-color: white;
    border: 1px solid white;
    border-radius: 10px;
    padding: 30px 50px;
    box-shadow: 0 0 35px 0 rgb(196, 193, 193);
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.order-history-content .order-container {
    box-shadow: 0 4px 20px 1px rgb(0 0 0 / 6%), 0 1px 4px rgb(0 0 0 / 8%);
}

.order-history-content .order-container .btn {
    display: flex;
    justify-content: flex-end;
    margin-top: 15px;
}

.order-history-content .order-container .btn .disabled {
    cursor: not-allowed !important;
    background-color: rgb(90, 84, 84) !important;
    background-image: none !important;
}

.order-history-content .order-container .btn .received {
    padding: 15px 25px;
    background-image: linear-gradient(to right, #D31027 0%, #EA384D 51%, #D31027 100%);
    color: white;
    border-radius: 5px;
    border: solid 1px;
    cursor: pointer;
}

.order-history-content .order-container .order-info {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid rgb(219, 208, 208);
    padding-bottom: 15px;
}

.order-history-content .order-container .order-info .group-2 {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.order-history-content .order-container .order-info .group-2 .order-content {
    font-weight: bold;
}

.order-history-content .order-container .order-detail {
    display: flex;
    flex-direction: column;
}

.order-history-content .order-container .order-detail .product-info {
    display: flex;
    padding: 15px 0 15px 0;
}

.order-history-content .order-container .order-detail .product-info .product-img {
    flex-basis: 33%;
    display: flex;
    gap: 10px;
}

.order-history-content .order-container .order-detail .product-info .product-img .product-name {
    display: flex;
    flex-direction: column;
}

.order-history-content .order-container .order-detail .product-info .detail {
    flex-basis: 50%;
}

.order-history-content .order-container .order-detail .product-info img {
    width: 100px;
    height: 100px;
}

.order-history-content .order-container .order-detail .product-info .price {
    flex-grow: 2;
    display: flex;
    justify-content: flex-end;
}

.order-history-content .order-container .price-info .ship-price,
.order-history-content .order-container .price-info .sum-price {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
}
</style>
