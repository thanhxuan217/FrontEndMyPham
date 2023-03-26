<template>
  <div class="q-pa-md">
    <q-dialog v-model="form" persistent full-height full-width>
      <q-card class="column full-height no-wrap">
        <q-card-section>
          <div class="text-h6">{{ currentProduct === null ? 'Thêm' : 'Sửa' }}</div>
        </q-card-section>
        <q-card-section>
          <q-form @reset="onReset" class="q-gutter-md">
            <div class="column" style="gap: 10px">
              <q-input filled v-model="name" label="Tên *" hint="Tên mỹ phẩm" lazy-rules
                :rules="[val => val && val.length > 0 || 'Tên mỹ phẩm không được để trống']" />
              <q-select outlined v-model="currentCategoriesSelected" multiple :options="categories" label="Thể loại" />
              <div class="row">
                <q-checkbox v-model="categoryDetailsSelected" :val="categoryDetail.CATEGORY_DETAIL_ID"
                  :label="categoryDetail.CATEGORY_DETAIL_NAME" v-for="categoryDetail in getCategoryDetails"
                  :key="categoryDetail.CATEGORY_DETAIL_ID" />
              </div>
              <q-input filled type="number" v-model="age" hint="Số lượng" label="Số lượng *" lazy-rules :rules="[
                val => val !== null && val !== '' || 'Số lượng không được để trống',
                val => val > 0 || 'Số lượng phải lớn hơn 0'
              ]" />
              <q-input filled type="number" v-model="age" hint="Giá" label="Giá *(VNĐ)" lazy-rules :rules="[
                val => val !== null && val !== '' || 'Please type something',
                val => val > 0 || 'Giá phải lớn hơn 0'
              ]" />
              <div class="row justify-between no-wrap" style="gap: 5px">
                <div class="col-6">
                  <q-input filled type="number" v-model="age" hint="Dung tích" label="Dung tích" lazy-rules :rules="[
                    val => val > 0 || 'Dung tích phải lớn hơn 0'
                  ]" />
                </div>
                <div class="col-6">
                  <q-select outlined v-model="currentUnitSelected" :options="unit" label="Đơn vị" />
                </div>
              </div>
              <q-select outlined v-model="model" :options="options" label="Nhà cung cấp" />
              <q-input type="textarea" autofocus hint="Mô tả" />

            </div>
          </q-form>
        </q-card-section>
        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn label="Lưu" type="button" @click="saveProduct" color="primary" v-close-popup />
          <q-btn label="Huỷ bỏ" color="primary" flat class="q-ml-sm" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <!-- row-key (tr) lay trong row => la ten cua row nha -->
    <q-table title="Treats" selection="multiple" v-model:selected="selected" :rows="rows" :columns="columns"
      row-key="COSMETIC_ID" :loading="loading" :filter="filter" no-data-label="I didn't find anything for you"
      no-results-label="The filter didn't uncover any results" separator="cell">
      <template v-slot:top>
        <q-btn color="primary" :disable="loading" label="Thêm" @click="addRow" />
        <q-btn class="q-ml-sm" color="primary" :disable="loading" label="Xoá" />
        <q-space />
        <q-input dense debounce="300" v-model="filter" placeholder="Search">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
      <!-- <template v-slot:bottom>
        <q-btn color="primary" icon-right="archive" label="Tải xuống excel file" no-caps @click="exportTable" />
      </template> -->
      <template v-slot:loading>
        <q-inner-loading showing color="primary" />
      </template>
      <!-- <template v-slot:top-left>
        
      </template> -->
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
          <q-td>
            <q-icon @click="openForm" :id="props.row.COSMETIC_ID + ' edit'" name="edit" style="cursor: pointer;"
              :props="props" />
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
import { ref, watch, onMounted, computed } from 'vue'
import { exportFile, useQuasar } from 'quasar'
import _ from 'lodash'
import ProductAPI from '../../api/AdminAPI/ProductAPI'
const $q = useQuasar()
const columns = [
  { name: 'name', align: 'center', label: 'Tên mỹ phẩm', field: 'name' },
  { name: 'quantity', label: 'Số lượng', field: 'quantity' },
  { name: 'price', label: 'Giá', field: 'price' },
  { name: 'capacity', label: 'Dung tích', field: 'capacity' },
  { name: 'unit', label: 'Đơn vị', field: 'unit' },
  { name: 'providerName', label: 'Nhà cung cấp', field: 'providerName' },
  { name: 'edit', label: '' },
]

const rows = ref([])
const loading = ref(true)
const rowCount = ref(10)
const filter = ref('')
const selected = ref([])
const products = ref([])
const form = ref(false)
const currentProduct = ref(null)
const providers = ref([])
const categories = ref([])
let allCategory = []

const categoryDetailsSelected = ref([])
const currentCategoriesSelected = ref([])
const currentUnitSelected = ref(null)
const unit = [
  'g', 'mg', 'l', 'ml'
]
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
      loading.value = false
    })
  ProductAPI.getCategories()
    .then(res => {
      const options = _.map(res.data, category => ({
        label: category.CATEGORY_NAME,
        value: category.CATEGORY_ID
      }))
      categories.value = options
      allCategory = res.data
      currentCategoriesSelected.value.push(options[0])
    })
  ProductAPI.getProviders()
    .then(res => {
      providers.value = res.data
    })
})

const getCategoryDetails = computed(() => {
  if (currentCategoriesSelected.value) {
    let categoryDetails = []
    const currentCategoryIds = currentCategoriesSelected.value.map(category => parseInt(category.value))
    allCategory.forEach(category => {
      if (currentCategoryIds.includes(parseInt(category.CATEGORY_ID))) {
        categoryDetails.push(category.category_details)
      }
    })
    let result = []
    _.forEach(categoryDetails, categoryDetail => {
      result = [...result, ...categoryDetail]
    })
    console.log(result);
    return result
  }
})

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
function openForm(e) {
  const id = e.currentTarget.id.split(' ')
  const productId = id[0]
  const product = _.find(products.value, product => parseInt(product.COSMETIC_ID) === parseInt(productId))
  currentProduct.value = product
  form.value = true
}

function addRow() {
  form.value = true
  currentProduct.value = null
}

function saveProduct() {
  // save new => current Product === null
}
// function onRowClick(row) {
//   alert(`${row.name} clicked`)
// }
//  const columns = ref(columns),
//  const rows = ref(rows) 
</script>
  