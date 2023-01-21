<script>
import VNDCurrencyFormatter from '../util/VNDCurrencyFormatter'
export default {
    props: {
        cosmetic: Object
    },
    data() {
        return {
            isShowQuickViewBtn: false,
            isShowQuickView: false
        }
    },
    methods: {
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
        }
    },
    computed: {
        formatToVND() {
            return VNDCurrencyFormatter.formatToVND(this.cosmetic.PRICE)
        },
        getId() {
            return 'quick-view ' + this.cosmetic.COSMETIC_ID
        }
    },
    mounted() {
        console.log(this.cosmetic)
    }
}
</script>
<template>
    <div class="card-product" @mouseenter="isShowQuickViewBtn = true" @mouseleave="isShowQuickViewBtn = false">
        <div class="quick-view-content" v-if="isShowQuickView">
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
                        <div>
                            <img :src="cosmetic.IMAGE.IMAGE_URL" class="img" />
                            <div>

                            </div>
                        </div>
                    </div>
                    <div class="price">
                        {{ formatToVND }}
                    </div>
                    <div class="add-to-cart-group">
                        <div class="group-btn-input">
                            <button class="btn-plus-minus">-</button>
                            <input value="1" />
                            <button class="btn-plus-minus">+</button>
                        </div>
                        <button class="add-to-cart-quickview">Thêm vào giỏ</button>
                    </div>
                    <div class="categories">
                        <div>Thể loại:</div>
                        <div v-for="item in cosmetic.CATEGORY_DETAIL_ID_category_detail_cosmetic_categories">
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
                <span>
                    {{ formatToVND }}
                    &nbsp;
                </span>
            </div>
            <div class="box-button-add-to-cart">
                <button id={props.productId} class='button-add-to-cart'>Thêm vào giỏ</button>
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

.card-product .quick-view-content .content .name {
    font-weight: bold;
    font-size: 20px;
}

.card-product .quick-view-content .content .price {
    font-weight: bold;
    font-size: 20px;
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
    gap: 1px;
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
    width: 300px;
    height: 300px;
    border-radius: 5px;
    border-bottom-right-radius: 0px;
    border-bottom-left-radius: 0px;
}
.card-product .category {
    text-align: center;
    font-size: 10px;
    color: rgb(152, 140, 140);
}

.card-product .product-name {
    text-align: center;
    font-size: 13px;
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
    font-weight: 500;
    text-align: center;
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
