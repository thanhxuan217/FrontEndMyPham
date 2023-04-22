<template>
  <div class="q-pa-md row">
    <div class="q-pb-md" style="width: 100%;">
      <div class="text-h6 q-pa-md">
        Thống kê top 10 sản phẩm bán chạy nhất
      </div>
      <q-separator />
      <div class="q-pa-md row items-center">
        <q-input v-model="fromDate" filled type="date" hint="Từ ngày" />
        <q-separator spaced />
        <q-input v-model="toDate" filled type="date" hint="Đến ngày" />
        <q-separator spaced />
        <q-btn color="primary" label="Lọc" style="height: fit-content;" @click="filterProduct" />
      </div>
      <q-separator />
    </div>
    <q-separator />
    <div class="row justify-center" style="width: 100%;">
      <VueApexCharts v-if="loading === false" width="900" type="bar" :options="chartOptions" :series="series" />
    </div>

  </div>
</template>
      
<script setup>
import { ref, watch, onMounted, computed } from 'vue'
import VueApexCharts from "vue3-apexcharts";
import StatictisAPI from '../../api/StatictisAPI/statictisAPI';
import VNDCurrencyFormatter from '../../util/VNDCurrencyFormatter';

const loading = ref(true)
const fromDate = ref(new Date('2023-01-01').toISOString().slice(0, 10))
const toDate = ref(new Date().toISOString().slice(0, 10))

const chartOptions = ref({
  chart: {
    id: "vuechart-example",
  },
  xaxis: {
    categories: []
  },
  title: {
    text: "Biểu đồ thống kê top 10 sản phẩm bán chạy nhất",
  },
  yaxis: {
    
  }
})
// data
const series = ref([
  {
    name: "Số lượng",
    data: [],
  },

])

function filterProduct(e) {
  loading.value = true
  const data = {
    fromDate: fromDate.value,
    toDate: toDate.value
  }
  StatictisAPI.getPopularProduct(data)
    .then(res => {
      chartOptions.value.xaxis.categories = res.data.cosmeticNames
      series.value[0].data = res.data.sumQuantity
      loading.value = false
    })
}

onMounted(() => {
  StatictisAPI.getPopularProduct({
    "fromDate": "2023-01-01",
    "toDate": "2023-04-10"
  })
    .then(res => {
      chartOptions.value.xaxis.categories = res.data.cosmeticNames
      series.value[0].data = res.data.sumQuantity
      loading.value = false
    })
})
</script>
      