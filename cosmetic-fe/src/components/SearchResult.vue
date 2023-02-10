<script setup>
import ProductAPI from '../api/ProductAPI/ProductAPI'
import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/antd.css'
import { reactive, watch, nextTick, computed, ref } from 'vue'
import { onMounted } from 'vue'
import VNDCurrencyFormatter from '../util/VNDCurrencyFormatter'
import Card from '../components/Card.vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import Paginate from "vuejs-paginate-next";
const route = useRoute()
const sort = ref(1)
const page = ref(1)
const state = reactive({
    products: null,
})
const getProductsSorted = computed(() => {
    if (Number(sort.value) === 1) {
        const productSorted = state.products.products.sort((p1, p2) => {
            const p1Id = Number(p1.COSMETIC_ID)
            const p2Id = Number(p2.COSMETIC_ID)
            return p1Id - p2Id
        })
        return productSorted
    } else if (Number(sort.value) === 2) {
        const productSorted = state.products.products.sort((p1, p2) => {
            const price1 = p1.discountCalculated ? p1.discountCalculated.priceAfterDiscount : p1.PRICE
            const price2 = p2.discountCalculated ? p2.discountCalculated.priceAfterDiscount : p2.PRICE
            return Number(price1) - Number(price2)
        })
        return productSorted
    } else {
        const productSorted = state.products.products.sort((p1, p2) => {
            const price1 = p1.discountCalculated ? p1.discountCalculated.priceAfterDiscount : p1.PRICE
            const price2 = p2.discountCalculated ? p2.discountCalculated.priceAfterDiscount : p2.PRICE
            return Number(price2) - Number(price1)
        })
        return productSorted
    }

})
async function pagination(pageNum) {
    ProductAPI.searchProduct(route.query.keyword, pageNum, 8)
        .then(res => {
            console.log(res.data)
            state.products = res.data
        })
}
onMounted(() => {
    if (route.query) {
        console.log(route.query)
        if (route.query.keyword) {
            ProductAPI.searchProduct(route.query.keyword)
                .then(res => {
                    console.log(res.data)
                    state.products = res.data
                })
        }
    } else {

    }
})
</script>
<template>
    <div class="product-page" v-if="state.products != null">
        <div class="right-page">
            <div class="sort">
                <div class="result-found">Kết quả tìm kiếm cho: {{ route.query.keyword }}</div>
                <div class="sort-container">
                    <span>Tìm được tất cả {{ state.products.products.length }} kết quả</span>
                    <select class="select-input" v-model="sort">
                        <option value=1>Sắp xếp theo: mới nhất</option>
                        <option value=2>Sắp xếp theo: giá thấp đến cao</option>
                        <option value=3>Sắp xếp theo: giá cao đến thấp</option>
                    </select>
                </div>
            </div>
            <div className="product-result">
                <Card v-for="cosmetic in getProductsSorted" :key="cosmetic.COSMETIC_ID" :cosmetic="cosmetic" />

            </div>
            <div class="phantrang">
                <paginate :page-count="state.products.totalPage" :click-handler="pagination" :prev-text="'<'"
                    :next-text="'>'" :container-class="'pagination'">
                </paginate>
            </div>
        </div>
    </div>
</template>
<style scoped>
.product-page {
    display: flex;
    flex-direction: row;
    gap: 15px;
    min-height: 1000px;
}

.product-page .phantrang {
    display: flex;
    align-items: center;
    justify-content: center;
}

.product-page .left-page {
    flex-basis: 25%;
    display: flex;
    flex-direction: column;
    padding-top: 50px;
    padding-bottom: 50px;
    padding-left: 50px;
    padding-right: 20px;
    gap: 25px;
}

.product-page .left-page .breadcrumbs {
    font-size: 18px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    min-height: 35px;
    margin-bottom: 20px;
}

.product-page .left-page .breadcrumbs .menu-title {
    font-weight: 500;
    text-transform: uppercase;
}

.product-page .left-page .filter {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.product-page .left-page .filter .filter-title {
    text-transform: uppercase;
    font-weight: 500;
    font-size: 18px;
}


.filter .btn-and-price {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
}

.filter .btn-and-price .btn {
    border-radius: 15px;
    border: solid 1px rgb(78, 75, 75);
    padding: 5px 15px;
    background-color: rgb(78, 75, 75);
    color: white;
    cursor: pointer;
}

.product-page .left-page .filter .diver {
    max-width: 45px;
    height: 3px;
    background-color: rgb(109, 103, 103);
}

.product-page .left-page .filter .filter-content {
    border: solid 1px rgb(194, 186, 186);
    border-radius: 3px;
    display: flex;
    flex-direction: column;
    padding: 18px 15px;
    gap: 12px;
}

.product-page .left-page .filter .filter-content .categories {
    display: flex;
    flex-direction: column;
}

.product-page .left-page .filter .filter-content .categories .category {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.product-page .left-page .filter .filter-content .categories .category .active {
    font-weight: bold;
}

.product-page .left-page .filter .filter-content .categories .category-details .active {
    font-weight: bold;
}

.product-page .left-page .filter .filter-content .categories .category .active-icon {
    transform: rotate(90deg);
}

.product-page .left-page .filter .filter-content .categories .category-details {
    display: none;
    flex-direction: column;
    gap: 5px;
    animation-name: toggle-dropdownmenu;
    animation-duration: 0.2s;
    animation-fill-mode: forwards;
    padding-bottom: 7px;
}

.product-page .left-page .filter .filter-content .categories .active {
    display: flex;
}

.product-page .left-page .filter .filter-content .categories .category-details .category-detail {
    padding: 5px 10px;
}

.product-page .left-page .filter .filter-content div {
    cursor: pointer;
}

.product-page .left-page .filter .row-container {
    flex-direction: row;
    flex-wrap: wrap;
}

.product-page .left-page .reset-all-filter {
    text-transform: uppercase;
    color: white;
    background-color: rgb(52, 45, 45);
    border: solid 1px rgb(52, 45, 45);
    padding: 10px 15px;
    width: 150px;
    border-radius: 5px;
    font-weight: 600;
    cursor: pointer;
}

.product-page .left-page .category-provider {
    padding: 5px;
}

.product-page .left-page .active-category-provider {
    font-weight: bold;
}

.product-page .left-page .filter .filter-content .active-color-size {
    border: 1px solid rgb(86, 158, 234);
    box-shadow: 0 0 10px 0 rgb(86, 158, 234);
}

@keyframes toggle-dropdownmenu {
    from {
        transform: translate(0px, 0px);
    }

    to {
        transform: translate(0px, 7px);
    }
}

.product-page .right-page {
    flex-basis: 100%;
    display: flex;
    flex-direction: column;
    padding-top: 50px;
    padding-bottom: 50px;
    padding-left: 50px;
    padding-right: 50px;
}

.product-page .right-page .sort {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    align-items: center;
}

.product-page .right-page .sort .result-found {
    font-weight: bold;
    font-size: 18px;
}

.product-page .right-page .sort .sort-container {
    display: flex;
    gap: 10px;
    align-items: center;
}

.product-page .right-page .sort .sort-container .select-input {
    padding: 8px 13px;
    border-radius: 3px;
    border: 1px solid rgb(183, 179, 179);
    font-weight: 400;
    /* box-shadow: 0 0 35px 0 rgb(224 220 220); */
}

.product-page .right-page .sort .sort-container .select-input:focus {
    outline: none;
}

.product-page .right-page .product-result {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 15px;
}
</style>
