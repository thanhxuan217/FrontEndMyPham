<script setup>
import 'vue-slider-component/theme/antd.css'
import { reactive, watch, nextTick, computed, ref } from 'vue'
import { onMounted } from 'vue'
import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel';
import VNDCurrencyFormatter from '../util/VNDCurrencyFormatter'
const props = defineProps({
    discount: Object
})
onMounted(() => {
    console.log(props.discount)
})
function getDate(dateTime) {
    return dateTime.split('T')[0]
}
const getDiscountCondidtion = computed(() => {
    let category = null
    if (parseInt(props.discount.DISCOUNT_CATEGORY) === 1) {
        category = 'giảm <span style="color: red; font-weight: 500">' + parseFloat(props.discount.DISCOUNT_VALUE) * 100 + ' %</span>'
    } else if (parseInt(props.discount.DISCOUNT_CATEGORY) === 2) {
        category = 'giảm <span style="color: red; font-weight: 500">' + VNDCurrencyFormatter.formatToVND(props.discount.DISCOUNT_VALUE) + ' </span>'
    } else {
        category = 'đồng giá <span style="color: red; font-weight: 500">' + VNDCurrencyFormatter.formatToVND(props.discount.DISCOUNT_VALUE) + ' </span>'
    }
    if (parseInt(props.discount.DISCOUNT_CONDITION) === 1) {
        return 'Khi mua tối thiểu <span style="color: red; font-weight: 500">' + VNDCurrencyFormatter.formatToVND(props.discount.MIN_CONDITION) + "</span> sẽ được " + category
    } else {
        return 'Khi mua tối thiểu <span style="color: red; font-weight: 500">' + props.discount.MIN_CONDITION + "</span> sản phẩm sẽ được " + category
    }
})
</script>
<template>
    <div class="discount-detail">
        <div class="discount-name">
            <i class="bi bi-lightning-fill"></i>
            {{ props.discount.DISCOUNT_NAME }} (Từ: {{ getDate(props.discount.FROM_DATE) }} tới: {{
                getDate(props.discount.TO_DATE) }})
        </div>
        <div v-html="getDiscountCondidtion">
        </div>
    </div>
</template>
<style scoped>
.discount-detail {
    display: flex;
    gap: 5px;
    flex-direction: column;
}
.discount-detail .red {
    color: red;
    font-weight: 500;
}
</style>
