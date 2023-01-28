<script setup>
import ProductAPI from '../api/ProductAPI/ProductAPI'
import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/antd.css'
import { reactive } from 'vue'
import { onMounted } from 'vue'
import VNDCurrencyFormatter from '../util/VNDCurrencyFormatter'
import Card from '../components/Card.vue'
const state = reactive({
    firstPrice: [0, 5000000],
    categories: [],
    discounts: [],
    products: [],
    queryParam: [],
    filters: []
})

function toggleDropdownMenu(e) {
    const divId = e.currentTarget.id
    const id = divId.split(' ')[0]
    const dropdownId = id + " dropdown"
    const toggleMenu = document.getElementById(dropdownId)
    if (!toggleMenu.className.includes('active') && !e.currentTarget.className.includes('active-icon')) {
        toggleMenu.className += ' active'
        e.currentTarget.className += ' active-icon'
    } else {
        toggleMenu.className = toggleMenu.className.split(' ')[0]
        e.currentTarget.className = e.currentTarget.className.split(' ')[0]
    }
}
//khi query param thay doi=> load lai products
onMounted(() => {
    ProductAPI.getAllCategory()
        .then(res => {
            state.categories = res.data.categories
            state.discounts = res.data.discounts
        })

    ProductAPI.filterProduct(state.queryParam)
        .then(res => {
            console.log(res.data)
            state.products = res.data
        })
})
</script>
<template>
    <div class="product-page">
        <div class="left-page">
            <div class="breadcrumbs">
                <Link to='/' class="none-underline">TRANG CHỦ</Link>/&nbsp;<span class="menu-title">
                </span>
            </div>
            <div class="filter">
                <div class="filter-title">
                    DANH MỤC
                </div>
                <div class="diver"></div>
                <div class="filter-content">
                    <div class="categories" v-for="category in state.categories">
                        <div class="category">
                            <div class="category-name">
                                {{ category.CATEGORY_NAME }}
                            </div>
                            <div class="dropdown-icon" :id="category.CATEGORY_ID + ' arrow'"
                                @click="toggleDropdownMenu">
                                <i class="bi bi-chevron-down"></i>
                            </div>
                        </div>
                        <div class="category-details" :id="category.CATEGORY_ID + ' dropdown'">
                            <div class="category-detail" v-for="categoryDetail in category.category_details">
                                {{ categoryDetail.CATEGORY_DETAIL_NAME }}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="filter-title">
                    Giá
                </div>
                <div class="diver"></div>
                <div class="filter-content">
                    <div class="slider">
                        <vue-slider v-model="state.firstPrice" drag-on-click="true" tooltip="hover" min=0 max=5000000
                            :tooltip-formatter="val => VNDCurrencyFormatter.formatToVND(val)"
                            :rail-style="{ backgroundColor: 'rgb(174 171 171)' }"
                            :process-style="{ backgroundColor: 'rgb(109, 103, 103)' }"
                            :dot-style="{ border: '2px solid rgb(109, 103, 103)' }" />
                    </div>
                    <div class="btn-and-price">
                        <button class="btn">Lọc</button>
                        <div class="price">
                            Giá:
                            <span>
                                {{
                                    VNDCurrencyFormatter.formatToVND(state.firstPrice[0]) + ': ' +
                                    VNDCurrencyFormatter.formatToVND(state.firstPrice[1])
                                }}
                                &nbsp;
                            </span>
                        </div>
                    </div>
                </div>
                <div class="filter-title">
                    Khuyến mãi
                </div>
                <div class="diver"></div>
                <div class="filter-content">
                    <div class="categories" v-for="discount in state.discounts">
                        <div class="category">
                            <div class="category-name">
                                {{ discount.DISCOUNT_NAME }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <button class="reset-all-filter">Làm mới lọc</button>
        </div>
        <div class="right-page">
            <div class="sort">
                <div class="sort-container">
                    <span>Tìm được tất cả kết quả</span>
                    <select class="select-input" onChange={handleSortProduct}>
                        <option value='1'>Sắp xếp theo: mới nhất</option>
                        <option value='2'>Sắp xếp theo: giá thấp đến cao</option>
                        <option value='3'>Sắp xếp theo: giá cao đến thấp</option>
                    </select>
                </div>
            </div>
            <div className="product-result">
                <Card v-for="cosmetic in state.products" :key="cosmetic.COSMETIC_ID" :cosmetic="cosmetic" />
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
    flex-basis: 75%;
    display: flex;
    flex-direction: column;
    padding-top: 50px;
    padding-bottom: 50px;
    padding-left: 50px;
    padding-right: 50px;
}

.product-page .right-page .sort {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 20px;
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
    gap: 40px;
}
</style>
