<script setup>
import 'vue-slider-component/theme/antd.css'
import { reactive, watch, nextTick, computed, ref } from 'vue'
import { onMounted } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useAddressStore } from '../store/AddressStore'
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import 'vue3-carousel/dist/carousel.css'
import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel'

const route = useRoute()
const images = ['http://localhost:8080/api/product/getImage/Anthony 25 SPF Lip Balm with Sunscreen for Lips – Contains Green Tea Extract, Shea Butter & Vitamin E_1.jpg',
     'http://localhost:8080/api/product/getImage/Anthony 25 SPF Lip Balm with Sunscreen for Lips – Contains Green Tea Extract, Shea Butter & Vitamin E_2.jpg',
      'http://localhost:8080/api/product/getImage/Anthony 25 SPF Lip Balm with Sunscreen for Lips – Contains Green Tea Extract, Shea Butter & Vitamin E_1.jpg']
const getImages = computed(() => {
    return images
})
function handleSlideStart(data) {
    console.log(images[data.slidingToIndex])
}
onMounted(() => {

})
</script>
<template>
    <div class='product-detail'>
    <div class="breadcrumbs">
        <Link to='/' class="none-underline">TRANG CHỦ</Link> /&nbsp; <span class="menu-title"> </span>
    </div>
    <div class='product-detail-content'>
        <div class='product-imgs'>
                <img key={img.imgId} id={img.imgId} src={img.imgUrl} onClick={handleChangeImg} index={index} />
            </div>
            <div class='target-img' onMouseEnter={showArrow} onMouseLeave={closeArrow}>
                <carousel :itemsToShow="1" @slide-start="handleSlideStart">
                    <slide v-for="imgUrl in getImages" :key="imgUrl">
                        <img :src="imgUrl" class="img" @click="showModal" />
                    </slide>
                    <template #addons>
                        <navigation />
                    </template>
                </carousel>
            </div>
            <div class='detail'>
                <div class='title'>
                    Name
                </div>
                <div className='price'>
                    <span class='line-through'>
                        &nbsp;
                    </span>
                </div>
                <div class='detail-container '>
                    Tình trạng: Còn hàng (22)
                </div>
                <div class='detail-container '>
                    Thể loại: Trang điểm, chăm sóc da
                </div>
                <button class=' btn-addtocart' id={currentProductDetail.productId}>
                    Thêm vào giỏ
                </button>
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
    flex-grow: 2;
    height: 950px;
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
    width: 700px;
}
.product-detail .product-detail-content .target-img img {
    width: auto;
    max-width: 500px;
    height: 500px;
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
    gap: 10px
}

.product-detail .product-detail-content .detail .title {
    font-size: 30px;
    font-weight: 500;
}

.product-detail .product-detail-content .detail .price {
    font-size: 27px;
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
</style>
