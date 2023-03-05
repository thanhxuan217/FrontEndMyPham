<script setup>
import 'vue-slider-component/theme/antd.css'
import { reactive, watch, nextTick, computed, ref } from 'vue'
import { onMounted } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useAddressStore } from '../store/AddressStore'
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import 'vue3-carousel/dist/carousel.css'
import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel';
import CartAPI from '../api/CartAPI/CartAPI';
import ProductAPI from '../api/ProductAPI/ProductAPI'
import VNDCurrencyFormatter from '../util/VNDCurrencyFormatter'
import { useCartStore } from '../store/cartStore'
import DiscountDetail from './DiscountDetail.vue'

const cartStore = useCartStore()
const router = useRouter()
const mySlide = ref(null)
const currentImgUrl = ref('')
const route = useRoute()
const product = ref(null)
const loading = ref(true)
const isModalShow = ref(false)
const currentQuantity = ref(1)
const getImages = computed(() => {
    return product.value.images
})
function handleSlideStart(data) {
    currentImgUrl.value = product.value.images[data.slidingToIndex].IMAGE_URL
}
const getCategories = computed(() => {
    const categoriesName = product.value.categories.map(category => {
        return category.CATEGORY_DETAIL_NAME
    })
    return categoriesName.join(',')
})
onMounted(() => {
    ProductAPI.getProductById(route.params.id)
        .then(res => {
            console.log(res.data)
            currentImgUrl.value = res.data.images[0].IMAGE_URL
            loading.value = false
            product.value = res.data
        })
})
function handleChangSlide(e) {
    const indexOfImage = e.target.id.split(' ')[0]
    mySlide.value.slideTo(indexOfImage)
}

function showModal(e) {
    document.getElementById("target-img").src = e.target.src
    isModalShow.value = true
    document.addEventListener('click', handleClickModal, true)
}
function handleClickModal(e) {
    const id = e.target.id
    if (!id.includes('target-img')) {
        isModalShow.value = false
    }
    document.removeEventListener('click', handleClickModal)
}
function minusQuantity() {
    if (isNaN(currentQuantity.value) || parseInt(currentQuantity.value) <= 0) {
        toast.error("Số lượng không hợp lệ", { theme: 'colored' })
        return
    }
    currentQuantity.value = parseInt(currentQuantity.value) - 1
}
function plusQuantity() {
    if (isNaN(currentQuantity.value) || parseInt(currentQuantity.value) <= 0) {
        toast.error("Số lượng không hợp lệ", { theme: 'colored' })
        return
    }
    currentQuantity.value = parseInt(currentQuantity.value) + 1
}
function checkValueOfInput(e) {
    const value = e.target.value
    if (isNaN(value) || parseInt(value) <= 0) {
        toast.error("Số lượng không hợp lệ", { theme: 'colored' })
        return
    }
}
async function updateProductInCart(e) {
    const value = parseInt(currentQuantity.value)
    if (isNaN(value) || value <= 0) {
        toast.error("Số lượng không hợp lệ!", { theme: 'colored' })
    }
    await CartAPI.addCartItem(product.value.COSMETIC_ID, value)
        .then(res => {
            toast.success("Thêm sản phẩm vào giỏ thành công!", { theme: 'colored' })
        })
        .catch(err => {
            toast.error(err.response.data, { theme: 'colored' })
            return
        })
    await CartAPI.getCartItem()
        .then(res => {
            cartStore.commitCartQuantity(res.data.listCartItem.length)
        })
}
const isThisCosmeticDisconting = computed(() => {
    if (!product.value.discountCalculated) {
        return false
    }
    return product.value.discountCalculated.price ? true : false
})
const getDiscount = computed(() => {
    if (parseInt(product.value.discountCalculated.discount.DISCOUNT_CATEGORY) === 1) {
        const percent = VNDCurrencyFormatter.formatToVND(parseFloat(product.value.discountCalculated.discount.DISCOUNT_VALUE))
        return '- ' + percent * 100 + '%'
    } else if (parseInt(product.value.discountCalculated.discount.DISCOUNT_CATEGORY) === 2) {
        const discountValue = parseFloat(product.value.discountCalculated.discount.DISCOUNT_VALUE)
        const price = parseFloat(product.value.discountCalculated.price)
        const percent = discountValue / price
        return '- ' + percent * 100 + '%'
    } else {
        const price = parseFloat(product.value.discountCalculated.price)
        const priceAfterDiscount = parseFloat(product.value.discountCalculated.priceAfterDiscount)
        const percent = (price - priceAfterDiscount) / price
        return '- ' + percent * 100 + '%'
    }
})
const getAllDiscountIsNot0Condition = computed(() => {
    const discountsByCategories = product.value.discountsByCategories || []
    const discountsByCosmetics = product.value.discountsByCosmetics || []
    const allDiscount = [...discountsByCategories, ...discountsByCosmetics]
    const result = allDiscount.filter(discount => parseInt(discount.DISCOUNT_CONDITION) !== 0)
    return result
})
</script>
<template>
    <div class='product-detail' v-if="!loading">
        <div class="diaglog-image" v-show="isModalShow">
            <div class="close-btn">
                X
            </div>
            <img src="" id="target-img" />
        </div>
        <div class="breadcrumbs">
            <a to='/' class="none-underline">TRANG CHỦ</a> /&nbsp; <span class="menu-title"> </span>
        </div>
        <div class='product-detail-content'>
            <div class='product-imgs'>
                <img v-for="(img, index) in getImages" :src="img.IMAGE_URL"
                    :class="{ target: img.IMAGE_URL === currentImgUrl }" :id="index + ' index'" @click="handleChangSlide" />
            </div>
            <div class='target-img'>
                <carousel :itemsToShow="1" @slide-start="handleSlideStart" ref="mySlide">
                    <slide v-for="img in getImages" :key="img.IMAGE_ID">
                        <img :src="img.IMAGE_URL" class="img" @click="showModal" />
                    </slide>
                    <template #addons>
                        <navigation />
                    </template>
                </carousel>
            </div>
            <div class='detail'>
                <div class='title'>
                    {{ product.COSMETIC_NAME }}
                </div>
                <div class='price'>
                    <div class="product-price">
                        <div v-if="isThisCosmeticDisconting" class="discount-group">
                            <div class="apply-price">
                                {{ VNDCurrencyFormatter.formatToVND(product.discountCalculated.priceAfterDiscount) }}
                            </div>
                            <div class="real-price">
                                {{ VNDCurrencyFormatter.formatToVND(product.discountCalculated.price) }}
                            </div>
                            <div class="discount">
                                {{ getDiscount }}
                            </div>
                        </div>
                        <div v-else class="price-normal">
                            {{ VNDCurrencyFormatter.formatToVND(product.PRICE) }}
                        </div>
                    </div>
                </div>
                <div class='discount-view' v-if="getAllDiscountIsNot0Condition.length !== 0">
                    <discount-detail v-for="discount in getAllDiscountIsNot0Condition" :discount="discount" />
                </div>
                <div class='detail-container '>
                    Dung tích: {{ product.CAPACITY }} ({{ product.UNIT }})
                </div>
                <div class='detail-container '>
                    Tình trạng: Còn hàng ({{ product.QUANTITY }})
                </div>
                <div class='detail-container '>
                    Thể loại: {{ getCategories }}
                </div>
                <div class="add-to-cart-group">
                    <div class="group-btn-input">
                        <button class="btn-plus-minus" @click="minusQuantity"
                            :disabled="parseInt(currentQuantity) === 1">-</button>
                        <input v-model="currentQuantity" @change="checkValueOfInput" />
                        <button class="btn-plus-minus" @click="plusQuantity"
                            :disabled="parseInt(currentQuantity) === parseInt(product.QUANTITY)">+</button>
                    </div>
                    <button class="add-to-cart-quickview" @click="updateProductInCart"
                        :disabled="parseInt(product.QUANTITY) === 0">Thêm vào giỏ</button>
                </div>

                <div class='detail-container '>
                    Mô tả: {{ product.DESCRIPTION }}
                </div>
            </div>
        </div>
        <div class='description'>
            <div class='description-row'>
                <div class='title'>
                    Đánh giá
                </div>
                <div class='content'>
                    <div class='content-detail'>
                        <div class='content-detail-title'>
                            Very good
                        </div>
                        <div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
.product-detail {
    display: flex;
    flex-direction: column;
    margin: 40px 60px;
    font-size: 15px;
}

.product-detail .breadcrumbs {
    font-size: 18px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    min-height: 35px;
    margin-bottom: 20px;
}

.product-detail .product-detail-content {
    display: flex;
    flex-direction: row;
    gap: 20px;
}

.product-detail .product-detail-content .product-imgs {
    display: flex;
    flex-direction: column;
    flex-basis: 2%;
    gap: 15px;
}

.product-detail .product-detail-content .product-imgs img {
    width: 110px;
    height: 110px;
    opacity: 0.5;
    cursor: pointer;
}

.product-detail .product-detail-content .product-imgs .target {
    opacity: 1;
}

.product-detail .product-detail-content .target-img {
    width: 600px;
    height: 600px;
    border: 1px solid rgb(207, 205, 205);
}
.discount-view {
    display: flex;
    align-items: center;
    gap: 10px
}
.product-detail .product-detail-content .target-img img {
    width: auto;
    max-width: 600px;
    height: 600px;
    /* border-radius: 5px;
    border-bottom-right-radius: 0px;
    border-bottom-left-radius: 0px; */
    cursor: pointer;
}

.product-detail .product-detail-content .active {
    display: flex !important;
}


.my-popup-product-content {
    background: none;
    border: none;
}

.my-popup-product-content .img-container {
    height: fit-content !important;
    padding: 0;
    display: flex;
    justify-content: center;
    position: relative;
}

.my-popup-product-content .img-container img {
    width: 650px;
    height: 650px;
    display: block;
    align-self: center;
}

.my-popup-product-content .img-container .close-icon {
    position: absolute;
    right: 55px;
    font-size: 23px;
    cursor: pointer;
}


.product-detail .product-detail-content .detail {
    display: flex;
    flex-direction: column;
    flex-basis: 25%;
    flex-grow: 2;
    gap: 20px
}

.product-detail .product-detail-content .detail .title {
    font-size: 30px;
    font-weight: 500;
}

.product-detail .product-detail-content .detail .price {
    text-align: center;
    font-size: 28px;
}

.product-detail .product-detail-content .detail .price .product-price .discount-group {
    display: flex;
    gap: 10px;
    position: relative;
}

.product-detail .product-detail-content .detail .price .product-price .discount-group .real-price {
    display: flex;
    text-decoration: line-through;
    color: rgb(124, 122, 122);
}

.apply-price {
    display: flex;
    justify-content: flex-end;
    font-weight: 600;
}

.discount {
    display: flex;
    color: green;
    justify-content: flex-end;
    right: 0
}

.price-normal {
    text-align: left;
    font-weight: 500;
}

.product-detail .product-detail-content .detail .detail-container {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.product-detail .product-detail-content .detail .detail-container .list {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 10px;
}

.product-detail .product-detail-content .detail .detail-container .color {
    width: 45px;
    height: 45px;
    border-radius: 50%;
    border: solid 0.5px rgb(194, 192, 192);
    cursor: pointer;
}

.product-detail .product-detail-content .detail .detail-container .list .size {
    padding: 13px 30px;
    border-radius: 5px;
    border: 1px solid rgb(215, 214, 214);
    cursor: pointer;
}

.product-detail .product-detail-content .detail .btn-addtocart {
    padding: 20px 25px;
    border-radius: 32px;
    font-size: 15px;
    color: white;
    background-color: black;
    width: 85%;
    cursor: pointer;
}

.product-detail .select {
    border: 1px solid black !important;
}

.product-detail .disabled {
    cursor: no-drop !important;
    opacity: 0.5;
}

.product-detail .description {
    margin-top: 50px;
    margin-bottom: 50px;
    border-top: solid 1px rgb(206, 198, 198);
    font-size: 18px;
    gap: 15px;
    display: flex;
    flex-direction: column;
}

.product-detail .description .description-row {
    display: flex;
    flex-direction: row;
    border-bottom: solid 1px rgb(206, 198, 198);
    padding: 20px 30px;
}

.product-detail .description .description-row .title {
    flex-basis: 10%;
    text-transform: uppercase;
    font-weight: 500;
}

.product-detail .description .description-row .content {
    display: flex;
    gap: 15px;
    flex-basis: 90%;
    flex-direction: column;
}

.product-detail .description .description-row .content .content-detail {
    display: flex;
    gap: 15px;
}

.product-detail .description .description-row .content .content-detail .content-detail-title {
    font-weight: 500;
    min-width: 200px;
}

.img-slide {
    width: 700px;
}

.add-to-cart-group {
    display: flex;
    align-items: center;
    gap: 30px;
}

.add-to-cart-group .group-btn-input {
    display: flex;
}

.add-to-cart-group .btn-plus-minus {
    border: 1px solid rgb(219, 215, 215);
    padding: 10px 10px;
    cursor: pointer;
}

.add-to-cart-group input {
    width: 20px;
    text-align: center;
    border: 1px solid rgb(219, 215, 215);
    padding: 9px 10px;
    outline: none;
}

.add-to-cart-quickview {
    padding: 12px 20px;
    cursor: pointer;
    font-size: 15px;
    background: rgb(152, 3, 3);
    color: white;
    border: 1px solid rgb(152, 3, 3);
    border-radius: 3px;
}

.diaglog-image {
    display: flex;
    position: fixed;
    z-index: 99999;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.4);
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.diaglog-image .close-btn {
    align-self: flex-end;
    font-weight: 600;
    font-size: 30px;
    cursor: pointer;
    margin-right: 510px;
    color: white;
}

.diaglog-image img {
    width: 500px;
    height: 500px;
}
</style>
