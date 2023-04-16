<template>
  <div class="q-pa-md row">
    <div class="q-pb-md" style="width: 100%;">
      <div class="text-h6 q-pa-md">
        Thống kê doanh thu
      </div>
      <q-separator />
      <div class="q-pa-md row">
        <q-select filled v-model="category" :options="selectOptions" label="Chọn loại thời gian" />
        <q-input v-model="date" filled type="date" hint="Từ ngày" />
        <q-input v-model="date" filled type="date" hint="Đến ngày" />
      </div>
    </div>
    <q-separator />
    <div class="row justify-center" style="width: 100%;">
      <VueApexCharts width="900" type="bar" :options="chartOptions" :series="series" />
    </div>

  </div>
</template>
    
<script setup>
import { ref, watch, onMounted, computed } from 'vue'
import { exportFile, useQuasar } from 'quasar'
import VueApexCharts from "vue3-apexcharts";
const $q = useQuasar()
const selectOptions = [
  'Theo ngày', 'Theo tháng','Theo năm'
]
const category = ref('Theo ngày')
const chartOptions = {
  chart: {
    id: "vuechart-example",
  },
  xaxis: {
    categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998],
  },

}
// data
const series = [
  {
    name: "series-1",
    data: [30, 40, 35, 50, 49, 60, 70, 91],
  },
]
onMounted(() => {

})
</script>
    