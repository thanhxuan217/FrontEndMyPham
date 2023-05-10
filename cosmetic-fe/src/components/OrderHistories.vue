<template>
    <q-dialog v-model="ratingForm" persistent>
        <div class="q-pa-md" style="width: 400px; max-width: 80vw;background-color: white;">
            <q-form class="q-gutter-md">
                <div class="column" v-for="(orderDetail, index) in currentOrder.order_details">
                    <q-item clickable v-ripple>
                        <q-item-section side>
                            <q-avatar rounded size="48px">
                                <img :src="orderDetail.COSMETIC.IMAGE.IMAGE_URL" />
                            </q-avatar>
                        </q-item-section>
                        <q-item-section>
                            <q-item-label>{{ orderDetail.COSMETIC.COSMETIC_NAME }}</q-item-label>
                            <q-item-label caption>{{ 'x' + orderDetail.QUANTITY }}</q-item-label>
                        </q-item-section>
                    </q-item>
                    <q-input v-model="comment[index]" filled autogrow aria-placeholder="Bình luận" label="Bình luận" />
                    <q-rating v-model="ratingModel[index]" size="3.5em" color="yellow" icon="star_border"
                        icon-selected="star" />
                    <q-separator />
                </div>
                <div>
                    <q-btn label="Gửi" type="button" color="primary" @click="handleRating" />
                    <q-btn label="Huỷ bỏ" type="button" color="primary" flat class="q-ml-sm" v-close-popup />
                </div>
            </q-form>
        </div>
    </q-dialog>
    <q-dialog v-model="detailPreviewForm">
        <div class="q-pa-md" style="width: 400px; max-width: 80vw;background-color: white;">
            <q-form class="q-gutter-md">
                <div class="column" v-for="(orderDetail, index) in currentOrder.order_details">
                    <q-item v-ripple>
                        <q-item-section side>
                            <q-avatar rounded size="48px">
                                <img :src="orderDetail.COSMETIC.IMAGE.IMAGE_URL" />
                            </q-avatar>
                        </q-item-section>
                        <q-item-section>
                            <q-item-label>{{ orderDetail.COSMETIC.COSMETIC_NAME }}</q-item-label>
                            <q-item-label caption>{{ 'x' + orderDetail.QUANTITY }}</q-item-label>
                        </q-item-section>
                        <q-item-section side top>
                            <q-item-label caption>{{ dayjs(currentOrder.reviews[index].CREATED_AT).fromNow()
                            }}</q-item-label>
                        </q-item-section>
                    </q-item>
                    <q-field outlined label="Bình luận" stack-label :dense="dense">
                        <template v-slot:control>
                            <div class="self-center full-width no-outline" tabindex="0">{{
                                currentOrder.reviews[index].COMMENT }}</div>
                        </template>
                    </q-field>
                    <q-rating disable v-model="currentOrder.reviews[index].SCORE" size="3.5em" color="yellow"
                        icon="star_border" icon-selected="star" />
                    <q-separator />
                </div>
            </q-form>
        </div>
    </q-dialog>
    <div class="q-pa-md">
        <div class="q-gutter-y-md" style="width: 100%;">
            <q-tabs style="background-color: #b1cfe0;" v-model="tab" shrink="false" narrow-indicator dense active-color="primary"
                indicator-color="primary" align="justify">
                <q-tab backgroundColor="rgb(69, 222, 8)" name="0" label="Tất cả" />
                <q-tab name="1" label="Chưa duyệt" />
                <q-tab name="2" label="Đã duyệt" />
                <q-tab name="3" label="Đã thanh toán" />
                <q-tab name="4" label="Đang chuẩn bị hàng" />
                <q-tab name="5" label="Đang giao" />
                <q-tab name="6" label="Đã hoàn thành" />
                <q-tab name="7" label="Đã huỷ" />
            </q-tabs>
            <q-separator />
            <div class='change-userinfo-form-right-container order-history'>
                <div class='content order-history-content' v-for="order in getAllOrder">
                    <div class='order-container' >
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
                                <div class='order-content status'>
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
                                        <label><b>x{{ orderDetail.QUANTITY }}</b></label>
                                    </div>
                                </div>
                                <div class='detail'>
                                </div>
                                <div class='price'>
                                    Giá: {{ VNDCurrencyFormatter.formatToVND(orderDetail.PRICE) }}
                                </div>
                            </div>
                            <q-separator />
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
                                    Thành tiền:&nbsp;
                                </label>
                                <label class="thanhtien">
                                    {{ VNDCurrencyFormatter.formatToVND(getSumPrice(order)) }}
                                </label>
                                <q-space></q-space>

                                <q-btn color="red" v-if="parseInt(order.STATUS) === 6 && !order.reviews.length"
                                    :id="order.ORDER_ID + ' review'" @click="openReviewForm">
                                    Đánh giá
                                    <template v-slot:loading>
                                        Loading...
                                    </template>
                                </q-btn>

                                <q-btn color="red" v-else-if="order.reviews.length" :id="order.ORDER_ID + ' detai-review'"
                                    @click="detailPreview">
                                    Xem đánh giá
                                    <template v-slot:loading>
                                        Loading...
                                    </template>
                                </q-btn>

                                <q-btn color="red" v-else :disable="parseInt(order.STATUS) !== 1"
                                    :id="order.ORDER_ID + ' order'" @click="updateStatus">
                                    Huỷ đơn
                                    <template v-slot:loading>
                                        Loading...
                                    </template>
                                </q-btn>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { reactive, watch, nextTick, computed, ref } from 'vue'
import { onMounted } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import AuthenticationAPI from '../api/LoginAPI/AuthenticationAPI';
import OrderHistoriesView from '../views/OrderHistoriesView.vue';
import VNDCurrencyFormatter from '../util/VNDCurrencyFormatter';
import OrderAPI from '../api/OrderAPI/OrderAPI';
import RatingAPI from '../api/RatingAPI/RatingAPI'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)
const router = useRouter()
const route = useRoute()
const tab = ref('0')
const orders = ref([])
const ratingForm = ref(false)
const detailPreviewForm = ref(false)
const ratingModel = ref([])
const comment = ref([])
const currentOrder = ref(null)
onMounted(() => {
    AuthenticationAPI.getOrders()
        .then(res => {
            orders.value = res.data
        })
})
function getAddress(data) {
    const result = data.ADDRESS_DETAIL + ',  ' + data.VILLAGE.VILLAGE_NAME + ',  ' + data.VILLAGE.DISTRICT.DISTRICT_NAME + ',  ' + data.VILLAGE.DISTRICT.PROVINCE.PROVINCE_NAME;
    return result;
}
const statuses = [
    {
        label: "Chưa duyệt",
        value: 1
    },
    {
        label: "Đã duyệt",
        value: 2
    },
    {
        label: "Đã thanh toán",
        value: 3
    },
    {
        label: "Đang chuẩn bị hàng",
        value: 4
    },
    {
        label: "Đang giao",
        value: 5
    },
    {
        label: "Đã hoàn thành",
        value: 6
    },
    {
        label: "Đã huỷ",
        value: 7
    }
]
function getStatus(value) {
    const result = statuses.find(status => parseInt(status.value) === parseInt(value))
    return result.label
}
function getSumPrice(order) {
    let sumprice = 0
    const orderdetails = order.order_details || []
    if (orderdetails.length) {
        orderdetails.forEach(orderDetail => {
            sumprice += parseInt(orderDetail.QUANTITY) * parseFloat(orderDetail.PRICE)
        })
    }
    return sumprice + parseFloat(order.SHIP_PRICE)
}
function updateStatus(e) {
    const orderId = e.currentTarget.id.split(' ')[0]
    OrderAPI.updateStatus(
        { orderId, status: 7 }
    )
        .then(res => {
            AuthenticationAPI.getOrders()
                .then(res => {
                    orders.value = res.data
                })
            toast.success("Cập nhật thành công!", { theme: 'colored' })
        })
}
const getAllOrder = computed(() => {
    if (tab.value === "0") {
        return orders.value
    } else {
        return orders.value.filter(order => parseInt(order.STATUS) === parseInt(tab.value))
    }
})
function openReviewForm(e) {
    ratingForm.value = true
    const orderFound = orders.value.find(order => parseInt(order.ORDER_ID) === parseInt(e.currentTarget.id.split(' ')[0]))
    currentOrder.value = orderFound
}
function detailPreview(e) {
    detailPreviewForm.value = true
    const orderFound = orders.value.find(order => parseInt(order.ORDER_ID) === parseInt(e.currentTarget.id.split(' ')[0]))
    currentOrder.value = orderFound
}
function handleRating() {
    let data = []
    currentOrder.value.order_details.forEach((orderDetail, index) => {
        data.push({
            COSMETIC_ID: orderDetail.COSMETIC_ID,
            ORDER_ID: currentOrder.value.ORDER_ID,
            SCORE: ratingModel.value[index],
            COMMENT: comment.value[index]
        })
    })
    RatingAPI.rating(data)
        .then((res => {
            currentOrder.value = null
            ratingForm.value = false
            AuthenticationAPI.getOrders()
                .then(res => {
                    orders.value = res.data
                })
            toast.success("Đánh giá thành công!", { theme: 'colored' })
        }))
}
</script>

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
    padding-bottom: 15px;
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

.order-history-content .order-container .order-info .group-2 .order-title {
    font-size: 13.5px;
    color: rgb(131, 128, 128);
}

.order-history-content .order-container .order-info .group-2 .order-content {}

.order-history-content .order-container .order-info .group-2 .status {
    color: red;
    text-transform: uppercase;
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


.order-history-content .order-container .price-info .sum-price {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
}

.order-history-content .order-container .price-info .sum-price .thanhtien {
    font-size: 24px;
    color: red;
}
.q-tab--active {
    background-color: #909b6b;
    color: white !important;
}
</style>
