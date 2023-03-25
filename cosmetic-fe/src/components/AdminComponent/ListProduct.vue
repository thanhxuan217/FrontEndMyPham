<template>
  <div class="q-pa-md">
    <!-- row-key (tr) lay trong row => la ten cua row nha -->
    <q-table title="Treats" selection="multiple" v-model:selected="selected" :rows="rows" :columns="columns"
      row-key="COSMETIC_ID" :loading="loading" :filter="filter" no-data-label="I didn't find anything for you"
      no-results-label="The filter didn't uncover any results" separator="cell">
      <template v-slot:top-right>
        <q-btn color="primary" icon-right="archive" label="Export to csv" no-caps @click="exportTable" />
      </template>
      <template v-slot:loading>
        <q-inner-loading showing color="primary" />
      </template>
      <template v-slot:top-left>
        <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
      <!-- this is props from table -->
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td>
            <q-checkbox v-model="props.selected" />
          </q-td>
          <!-- value in row -->
          <q-td key="name" :props="props">
            {{ props.row.COSMETIC_NAME }}
          </q-td>
          <q-td key="quantity" :props="props">
            {{ props.row.QUANTITY }}
          </q-td>
          <q-td key="price" :props="props">
            {{ props.row.PRICE }}
          </q-td>
          <q-td key="capacity" :props="props">
            {{ props.row.CAPACITY }}
          </q-td>
          <q-td key="unit" :props="props">
            {{ props.row.UNIT }}
          </q-td>
          <q-td key="providerName" :props="props">
            {{ props.row.PROVIDER_NAME }}
          </q-td>
        </q-tr>
      </template>
      <!-- <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="desc" :props="props">
            {{ props.row.name }}
            <q-popup-edit v-model="props.row.name" v-slot="scope">
              <q-input id="test" v-model="scope.value" dense autofocus counter @keyup.enter="scope.set">
                <template v-slot:after>
                  <q-btn flat dense color="negative" icon="cancel" @click.stop.prevent="scope.cancel" />
                  <q-btn flat dense color="positive" :value="scope.value" @click="test" id="test" icon="check_circle"
                    @click.stop.prevent="scope.set"
                    :disable="scope.validate(scope.value) === false || scope.initialValue === scope.value" />
                </template>
              </q-input>
            </q-popup-edit>
          </q-td>
          <q-td key="calories" :props="props">
            {{ props.row.calories }}
            <q-popup-edit @save="test" v-model.number="props.row.calories" buttons v-slot="scope">
              <q-input type="number" v-model.number="scope.value" dense autofocus @keyup.enter="scope.set" />
            </q-popup-edit>
          </q-td>
          <q-td key="fat" :props="props">
            <div class="text-pre-wrap">{{ props.row.fat }}</div>
            <q-popup-edit @save="test" v-model.number="props.row.fat" buttons v-slot="scope">
              <q-input type="number" v-model.number="scope.value" dense autofocus @keyup.enter="scope.set" />
            </q-popup-edit>
          </q-td>
          <q-td key="carbs" :props="props">
            {{ props.row.carbs }}
            <q-popup-edit v-model.number="props.row.carbs" buttons persistent v-slot="scope">
              <q-input type="number" v-model.number="scope.value" dense autofocus @keyup.enter="scope.set" />
            </q-popup-edit>
          </q-td>
          <q-td key="protein" :props="props">
            {{ props.row.protein }}
            <q-popup-edit v-model.number="props.row.protein" buttons label-set="Save" label-cancel="Close" v-slot="scope">
              <q-input type="number" v-model.number="scope.value" dense autofocus @keyup.enter="scope.set" />
            </q-popup-edit>
          </q-td>
          <q-td key="sodium" :props="props">
            {{ props.row.sodium }}
            <q-popup-edit v-model.number="props.row.sodium" buttons v-slot="scope">
              <q-input type="number" v-model.number="scope.value" dense autofocus @keyup.enter="scope.set" />
            </q-popup-edit>
          </q-td>
          <q-td key="calcium" :props="props">
            {{ props.row.calcium }}
            <q-popup-edit v-model="props.row.calcium" buttons v-slot="scope">
              <q-input v-model="scope.value" dense autofocus @keyup.enter="scope.set" />
            </q-popup-edit>
          </q-td>
          <q-td key="iron" :props="props">
            {{ props.row.iron }}
            <q-popup-edit v-model="props.row.iron" buttons v-slot="scope">
              <q-input v-model="scope.value" dense autofocus @keyup.enter="scope.set" />
            </q-popup-edit>
          </q-td>
        </q-tr>
      </template> -->

      <template v-slot:no-data="{ icon, message, filter }">
        <div class="full-width row flex-center text-accent q-gutter-sm">
          <q-icon size="2em" name="sentiment_dissatisfied" />
          <span>
            Well this is sad... {{ message }}
          </span>
          <q-icon size="2em" :name="filter ? 'filter_b_and_w' : icon" />
        </div>
      </template>
    </q-table>
    <div class="q-mt-md">
      Selected: {{ JSON.stringify(selected) }}
    </div>
  </div>
</template>
  
<script setup>
import { ref, watch, onMounted } from 'vue'
import { exportFile, useQuasar } from 'quasar'
import _ from 'lodash'
import ProductAPI from '../../api/AdminAPI/ProductAPI';
const $q = useQuasar()
const columns = [
  { name: 'name', align: 'center', label: 'Tên mỹ phẩm', field: 'name' },
  { name: 'quantity', label: 'Số lượng', field: 'quantity' },
  { name: 'price', label: 'Giá', field: 'price' },
  { name: 'capacity', label: 'Dung tích', field: 'capacity' },
  { name: 'unit', label: 'Đơn vị', field: 'unit' },
  { name: 'providerName', label: 'Nhà cung cấp', field: 'providerName' },
  { name: 'delete', label: '' },
]

const originalRows = [
  {
    name: 'Frozen Yogurt',
    calories: 159,
    fat: 6.0,
    carbs: 24,
    protein: 4.0,
    sodium: 87,
    calcium: '14%',
    iron: '1%'
  },
  {
    name: 'Ice cream sandwich',
    calories: 237,
    fat: 9.0,
    carbs: 37,
    protein: 4.3,
    sodium: 129,
    calcium: '8%',
    iron: '1%'
  },
  {
    name: 'Eclair',
    calories: 262,
    fat: 16.0,
    carbs: 23,
    protein: 6.0,
    sodium: 337,
    calcium: '6%',
    iron: '7%'
  },
  {
    name: 'Cupcake',
    calories: 305,
    fat: 3.7,
    carbs: 67,
    protein: 4.3,
    sodium: 413,
    calcium: '3%',
    iron: '8%'
  },
  {
    name: 'Gingerbread',
    calories: 356,
    fat: 16.0,
    carbs: 49,
    protein: 3.9,
    sodium: 327,
    calcium: '7%',
    iron: '16%'
  },
  {
    name: 'Jelly bean',
    calories: 375,
    fat: 0.0,
    carbs: 94,
    protein: 0.0,
    sodium: 50,
    calcium: '0%',
    iron: '0%'
  },
  {
    name: 'Lollipop',
    calories: 392,
    fat: 0.2,
    carbs: 98,
    protein: 0,
    sodium: 38,
    calcium: '0%',
    iron: '2%'
  },
  {
    name: 'Honeycomb',
    calories: 408,
    fat: 3.2,
    carbs: 87,
    protein: 6.5,
    sodium: 562,
    calcium: '0%',
    iron: '45%'
  },
  {
    name: 'Donut',
    calories: 452,
    fat: 25.0,
    carbs: 51,
    protein: 4.9,
    sodium: 326,
    calcium: '2%',
    iron: '22%'
  },
  {
    name: 'KitKat',
    calories: 518,
    fat: 26.0,
    carbs: 65,
    protein: 7,
    sodium: 54,
    calcium: '12%',
    iron: '6%'
  }
]

const rows = ref([])
const loading = ref(true)
const rowCount = ref(10)
const filter = ref('')
const selected = ref([])
const products = ref([])
onMounted(() => {
  ProductAPI.getProducts()
    .then(res => {
      products.value = res.data
      rows.value = _.map(res.data, cosmetic => ({
        "COSMETIC_ID": cosmetic.COSMETIC_ID,
        "COSMETIC_NAME": cosmetic.COSMETIC_NAME,
        "QUANTITY": cosmetic.QUANTITY,
        "PRICE": cosmetic.PRICE,
        "CAPACITY": "10",
        "UNIT": "ml",
        "IMAGE": cosmetic.IMAGE,
        "PROVIDER_NAME": cosmetic.PROVIDER ? cosmetic.PROVIDER.PROVIDER_NAME : null
      }))
      console.log(rows.value)
      loading.value = false
    })
})
// function test(e) {
//   console.log(e.currentTarget)
// }
// watch(rows, async (newRows, oldRows) => {

//   const test = _.range(1, 3)
//   // so sanh tung row trong rows => cai nao thay doi =>
// },
//   { deep: true }
// )

function exportTable() {
  // naive encoding to csv format
  const content = [columns.map(col => wrapCsvValue(col.label))].concat(
    rows.value.map(row => columns.map(col => wrapCsvValue(
      typeof col.field === 'function'
        ? col.field(row)
        : row[col.field === void 0 ? col.name : col.field],
      col.format,
      row
    )).join(','))
  ).join('\r\n')

  const status = exportFile(
    'table-export.csv',
    content,
    'text/csv'
  )
  if (status !== true) {
    $q.notify({
      message: 'Browser denied file download...',
      color: 'negative',
      icon: 'warning'
    })
  }
}
function wrapCsvValue(val, formatFn, row) {
  let formatted = formatFn !== void 0
    ? formatFn(val, row)
    : val

  formatted = formatted === void 0 || formatted === null
    ? ''
    : String(formatted)

  formatted = formatted.split('"').join('""')
  /**
   * Excel accepts \n and \r in strings, but some other CSV parsers do not
   * Uncomment the next two lines to escape new lines
   */
  // .split('\n').join('\\n')
  // .split('\r').join('\\r')

  return `"${formatted}"`
}

// function onRowClick(row) {
//   alert(`${row.name} clicked`)
// }
//  const columns = ref(columns),
//  const rows = ref(rows) 
</script>
  