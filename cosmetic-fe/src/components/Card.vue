<script>
import VNDCurrencyFormatter from '../util/VNDCurrencyFormatter'
import 'vue3-carousel/dist/carousel.css'
import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel'
import CartAPI from '../api/CartAPI/CartAPI'
import { useCartStore } from '../store/cartStore'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import { mapState, mapActions } from 'pinia'
export default {
    props: {
        cosmetic: Object
    },
    components: {
        Carousel,
        Slide,
        Pagination,
        Navigation,
    },
    data() {
        return {
            isShowQuickViewBtn: false,
            isShowQuickView: false,
            isModalShow: false
        }
    },
    methods: {
        ...mapActions(useCartStore, ['commitCartQuantity']),
        handleClickOutside(e) {
            const id = e.target.id
            if (id.includes('quick-view')) {
                this.isShowQuickView = false
            }
            this.isShowQuickViewBtn = false
            document.removeEventListener('click', this.handleClickOutside)
        },
        showQuickView(e) {
            this.isShowQuickView = true
            document.addEventListener('click', this.handleClickOutside, true)
        },
        handleClickModal(e) {
            const id = e.target.id
            if (!id.includes('target-img')) {
                this.isModalShow = false
            }
            document.removeEventListener('click', this.handleClickOutside)
        },
        showModal(e) {
            document.getElementById("target-img").src = e.target.src
            this.isModalShow = true
            document.addEventListener('click', this.handleClickModal, true)
        },
        formatToVND(price) {
            return VNDCurrencyFormatter.formatToVND(price)
        },
        async addProductToCart(e) {
            const id = e.target.id.split(' ')
            const cosmeticId = id[0]
            await CartAPI.addCartItem(cosmeticId, 1)
                .then(res => {
                    toast.success("Thêm sản phẩm vào giỏ thành công!", { theme: 'colored' })
                })
                .catch(err => {
                    toast.error(err.response.data, { theme: 'colored' })
                    return
                })
            await CartAPI.getCartItem()
                .then(res => {
                    this.commitCartQuantity(res.data.listCartItem.length)
                })
        },
        async updateProductInCart(e) {
            const id = e.target.id.split(' ')
            const cosmeticId = id[0]
            const inputId = cosmeticId + ' input'
            const input = document.getElementById(inputId)
            const value = parseInt(input.value)
            if (isNaN(value) || value <=0) {
                toast.error("Số lượng không hợp lệ!", { theme: 'colored' })
            }
            await CartAPI.addCartItem(cosmeticId, value)
                .then(res => {
                    toast.success("Thêm sản phẩm vào giỏ thành công!", { theme: 'colored' })
                })
                .catch(err => {
                    toast.error(err.response.data, { theme: 'colored' })
                    return
                })
            await CartAPI.getCartItem()
                .then(res => {
                    this.commitCartQuantity(res.data.listCartItem.length)
                })
        }
    },
    computed: {
        getId() {
            return 'quick-view ' + this.cosmetic.COSMETIC_ID
        },
        getImages() {
            const images = this.cosmetic.images.map(image => image.IMAGE_URL)
            return images
        },
        isThisCosmeticDisconting() {
            if (!this.cosmetic.discountCalculated) {
                return false
            }
            return this.cosmetic.discountCalculated.price ? true : false
        },
        getDiscount() {
            if (parseInt(this.cosmetic.discountCalculated.discount.DISCOUNT_CATEGORY) === 1) {
                const percent = VNDCurrencyFormatter.formatToVND(parseFloat(this.cosmetic.discountCalculated.discount.DISCOUNT_VALUE))
                return '- ' + percent * 100 + '%'
            } else if (parseInt(this.cosmetic.discountCalculated.discount.DISCOUNT_CATEGORY) === 2) {
                const discountValue = parseFloat(this.cosmetic.discountCalculated.discount.DISCOUNT_VALUE)
                const price = parseFloat(this.cosmetic.discountCalculated.price)
                const percent = discountValue / price
                return '- ' + percent * 100 + '%'
            } else {
                const price = parseFloat(this.cosmetic.discountCalculated.price)
                const priceAfterDiscount = parseFloat(this.cosmetic.discountCalculated.priceAfterDiscount)
                const percent = (price - priceAfterDiscount) / price
                return '- ' + percent * 100 + '%'
            }
        }
    },
    mounted() {

    }
}
</script>
<template>
    <div class="card-product" @mouseenter="isShowQuickViewBtn = true" @mouseleave="isShowQuickViewBtn = false">
        <div class="quick-view-content" v-if="isShowQuickView">
            <div class="diaglog-image" v-show="isModalShow">
                <div class="close-btn">
                    X
                </div>
                <img src="" id="target-img" />
            </div>
            <div class="white-space" :id="getId">

            </div>
            <div class="quick-view-right">
                <div class="btn-close" @click="isShowQuickView = false">
                    X
                </div>
                <div class="content">
                    <div class="name">
                        {{ cosmetic.COSMETIC_NAME }}
                    </div>
                    <div className="img-slide">
                        <carousel :items-to-show="1">
                            <slide v-for="imgUrl in getImages" :key="imgUrl">
                                <img :src="imgUrl" class="img" @click="showModal" />
                            </slide>
                            <template #addons>
                                <navigation />
                            </template>
                        </carousel>
                    </div>
                    <div class="product-price">
                        <div v-if="isThisCosmeticDisconting" class="discount-group">
                            <div class="apply-price">
                                {{ formatToVND(cosmetic.discountCalculated.priceAfterDiscount) }}
                            </div>
                            <div class="real-price">
                                {{ formatToVND(cosmetic.discountCalculated.price) }}
                            </div>
                            <div class="discount">
                                {{ getDiscount }}
                            </div>
                        </div>
                        <div v-else>
                            {{ formatToVND(cosmetic.PRICE) }}
                        </div>
                    </div>
                    <div class="add-to-cart-group">
                        <div class="group-btn-input">
                            <button class="btn-plus-minus">-</button>
                            <input value="1" :id="cosmetic.COSMETIC_ID + ' input'"/>
                            <button class="btn-plus-minus">+</button>
                        </div>
                        <button :id="cosmetic.COSMETIC_ID + ' btn2'" @click="updateProductInCart"
                            class="add-to-cart-quickview">Thêm vào giỏ</button>
                    </div>
                    <div class="categories">
                        <div>Thể loại:</div>
                        <div v-for="item in cosmetic.categories">
                            {{ item.CATEGORY_DETAIL_NAME }}
                        </div>
                    </div>
                </div>
            </div>

        </div>
        <div class="img-container">
            <img :src="cosmetic.IMAGE.IMAGE_URL" class="img" />
            <button class="btn-quick-view" v-show="isShowQuickViewBtn" @click="showQuickView">
                Xem nhanh
            </button>
        </div>
        <div class="box-text">
            <div class="product-name">
                {{ cosmetic.COSMETIC_NAME }}
            </div>
            <div class="product-price">
                <div v-if="isThisCosmeticDisconting" class="discount-group">
                    <div class="apply-price">
                        {{ formatToVND(cosmetic.discountCalculated.priceAfterDiscount) }}
                    </div>
                    <div class="real-price">
                        {{ formatToVND(cosmetic.discountCalculated.price) }}
                    </div>
                    <div class="discount">
                        {{ getDiscount }}
                    </div>
                </div>
                <div v-else>
                    {{ formatToVND(cosmetic.PRICE) }}
                </div>
            </div>
            <div class="box-button-add-to-cart">
                <button :id="cosmetic.COSMETIC_ID + ' btn1'" class='button-add-to-cart' @click="addProductToCart">Thêm
                    vào giỏ</button>
            </div>
        </div>
    </div>
</template>
<style scoped>
.card-product {
    width: 300px;
    background-color: #EDF1F0;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    gap: 5px;
    border: 1px solid #ECEBEB;
    border-radius: 5px;
}

.card-product .quick-view-content {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 9999;
    display: flex;
    justify-content: flex-end;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.4);
}

.card-product .quick-view-content .content {
    width: 400px;
    background-color: white;
    padding: 25px 15px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    height: 93%;
}

.card-product .quick-view-content .content .img-slide {
    width: 400px;
}

.card-product .quick-view-content .diaglog-image {
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

.card-product .quick-view-right .content .product-price {
    font-size: 20px;
}

.card-product .quick-view-content .diaglog-image .close-btn {
    align-self: flex-end;
    font-weight: 600;
    font-size: 30px;
    cursor: pointer;
    margin-right: 510px;
    color: white;
}

.card-product .quick-view-content .diaglog-image img {
    width: 500px;
    height: 500px;
}

.card-product .quick-view-content .content .name {
    font-weight: bold;
    font-size: 20px;
}

.card-product .quick-view-content .content .price {
    text-align: center;
    font-size: 17px;
}

.card-product .quick-view-content .content .add-to-cart-group {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 30px
}

.card-product .quick-view-content .content .add-to-cart-group .group-btn-input {
    display: flex;
    align-items: center;
}

.card-product .quick-view-content .content .add-to-cart-group .btn-plus-minus {
    border: 1px solid rgb(219, 215, 215);
    padding: 10px 10px;
    cursor: pointer;
}

.card-product .quick-view-content .quick-view-right {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 5px
}

.card-product .quick-view-content .quick-view-right .btn-close {
    align-self: flex-start;
    border-radius: 50%;
    background-color: white;
    padding: 10px;
    height: 20px;
    width: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    margin-top: 5px;
    cursor: pointer;
}

.card-product .quick-view-content .content .add-to-cart-group input {
    width: 20px;
    text-align: center;
    border: 1px solid rgb(219, 215, 215);
    padding: 10px 10px;
}

.card-product .quick-view-content .white-space {
    flex-grow: 2;
}

.card-product .quick-view-content .content .add-to-cart-group input:focus {
    outline: none;
}

.card-product .quick-view-content .content .add-to-cart-quickview {
    padding: 12px 20px;
    cursor: pointer;
    font-size: 15px;
    background: rgb(152, 3, 3);
    color: white;
    border: 1px solid rgb(152, 3, 3);
    border-radius: 5px;
}

.card-product .quick-view-content .card-product .box-text {
    padding: 10px 10px;
    display: flex;
    gap: 2px;
    flex-direction: column;
}

.card-product .quick-view-content .categories {
    display: flex;
    gap: 5px;
    align-self: flex-start;
}

.card-product:hover {
    box-shadow: 0 0 35px 0 rgb(224, 220, 220);
    background-color: white;
}

.card-product .img {
    width: auto;
    max-width: 300px;
    height: 300px;
    border-radius: 5px;
    border-bottom-right-radius: 0px;
    border-bottom-left-radius: 0px;
    cursor: pointer;
}

.card-product .category {
    text-align: center;
    font-size: 10px;
    color: rgb(152, 140, 140);
}

.card-product .product-name {
    text-align: center;
    font-size: 13px;
    min-height: 58px;
}

.card-product .img-container {
    position: relative;
    display: flex;
    justify-content: center;
}

.card-product .btn-quick-view {
    padding: 11px 65px;
    text-transform: uppercase;
    font-size: 13px;
    cursor: pointer;
    border: solid 1px rgb(175, 172, 172);
    background-color: rgb(175, 172, 172);
    color: white;
    position: absolute;
    bottom: 0;
    width: 100%;
    transition: all 0.1s;
}

.card-product .product-price {
    text-align: center;
    font-size: 17px;
    width: 100%;
}

.card-product .discount-group {
    display: flex;
    gap: 10px;
    position: relative;
    justify-content: center;
}

.card-product .real-price {
    display: flex;
    text-decoration: line-through;
    color: rgb(124, 122, 122);
}

.card-product .apply-price {
    display: flex;
    justify-content: flex-end;
    font-weight: 600;
}

.card-product .discount {
    display: flex;
    color: green;
    justify-content: flex-end;
    position: absolute;
    right: 0
}

.card-product .box-button-add-to-cart {
    padding: 10px 10px;
    align-items: center;
    justify-content: center;
    display: flex;
}

.card-product .button-add-to-cart {
    padding: 11px 25px;
    font-size: 13px;
    cursor: pointer;
    text-transform: uppercase;
    border: solid 1px rgb(175, 172, 172);
    border-radius: 15px;
    background-color: rgb(34, 30, 30);
    color: white;
}

.card-product .box-text {
    padding: 10px 10px;
    display: flex;
    gap: 1px;
    flex-direction: column;
}
</style>
