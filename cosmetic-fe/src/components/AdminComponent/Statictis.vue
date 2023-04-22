<template>
  <div class="q-pa-md row">
    <div class="q-pb-md" style="width: 100%;">
      <div class="text-h6 q-pa-md">
        Thống kê doanh thu
      </div>
      <q-separator />
      <div class="q-pa-md row items-center">
        <q-select filled v-model="category" :options="selectOptions" hint="Chọn loại thời gian" />
        <q-separator spaced />
        <q-input v-model="fromDate" filled type="date" hint="Từ ngày" />
        <q-separator spaced />
        <q-input v-model="toDate" filled type="date" hint="Đến ngày" />
        <q-separator spaced />
        <q-btn color="primary" label="Lọc" style="height: fit-content;" @click="filterProduct" />
      </div>
      <q-separator />
      <div class="q-pad-md">
        <q-list class="row">
          <q-item>
            <q-item-section top thumbnail>
              <q-avatar icon="signal_cellular_alt" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ orders.totalOrder }}</q-item-label>
              <q-item-label caption lines="2">Tổng số đơn hàng</q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section top thumbnail>
              <q-avatar icon="paid" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ VNDCurrencyFormatter.formatToVND(getSum) }}</q-item-label>
              <q-item-label caption lines="2">Tổng tiền</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
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
import { exportFile, useQuasar } from 'quasar'
import VueApexCharts from "vue3-apexcharts";
import StatictisAPI from '../../api/StatictisAPI/statictisAPI';
import VNDCurrencyFormatter from '../../util/VNDCurrencyFormatter';

const orders = ref([])
const loading = ref(true)
const $q = useQuasar()
const selectOptions = [
  {
    label: 'Theo ngày',
    value: 'day'
  },
  {
    label: 'Theo tháng',
    value: 'month'
  },
  {
    label: 'Theo năm',
    value: 'year'
  }
]
const fromDate = ref(new Date('2023-01-01').toISOString().slice(0, 10))
const toDate = ref(new Date().toISOString().slice(0, 10))
const category = ref({
  label: 'Theo ngày',
  value: 'day'
})
const chartOptions = ref({
  chart: {
    id: "vuechart-example",
  },
  xaxis: {
    categories: []
  },
  title: {
    text: "Biểu đồ thống kê doanh thu",
  },
  yaxis: {
    labels: {
      formatter: function (value) {
        return VNDCurrencyFormatter.formatToVND(value);
      }
    },
  }
})
// data
const series = ref([
  {
    name: "Tổng tiền",
    data: [],
  },

])

function filterProduct(e) {
  loading.value = true
  const data = {
    category: category.value.value,
    fromDate: fromDate.value,
    toDate: toDate.value
  }
  StatictisAPI.getRevenue(data)
    .then(res => {
      chartOptions.value.xaxis.categories = res.data.categories
      series.value[0].data = res.data.data
      orders.value = res.data
      loading.value = false
    })
}

const getSum = computed(() => {
  let sum = 0
  if (orders.value.data) {
    orders.value.data.forEach((item) => sum += parseFloat(item))
  }
  return sum
})
onMounted(() => {
  StatictisAPI.getRevenue({
    "category": "day",
    "fromDate": "2023-01-01",
    "toDate": "2023-04-10"
  })
    .then(res => {
      chartOptions.value.xaxis.categories = res.data.categories
      series.value[0].data = res.data.data
      orders.value = res.data
      console.log(res.data)
      loading.value = false
    })
})
</script>
    