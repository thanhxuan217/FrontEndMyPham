<template>
  <div class="q-pa-md">
    <q-dialog transition-show="slide-up" maximized transition-hide="slide-down" v-model="formDetail" v-if="formDetail"
      persistent full-height full-width>
      <q-card class="column full-height no-wrap">
        <q-bar class="bg-primary">
          <q-space />
          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip class="bg-white text-primary">Đóng</q-tooltip>
          </q-btn>
        </q-bar>
        <q-card-section>
          <div class="text-h6">Chi tiết</div>
        </q-card-section>
        <q-card-section>
          <q-form class="q-gutter-md">
            <div class="column" style="gap: 10px">
              <q-field outlined label="Tên" stack-label :dense="dense">
                <template v-slot:control>
                  <div class="self-center full-width no-outline" tabindex="0">{{ nameEdit }}</div>
                </template>
              </q-field>
              <q-field outlined label="Thể lo" stack-label :dense="dense">
                <template v-slot:control>
                  <div class="self-center full-width no-outline" tabindex="0">{{ currentCategoriesSelectedEdit[0].label }}
                  </div>
                </template>
              </q-field>

              <div class="row">
                <q-checkbox outlined v-model="categoryDetailsSelectedEdit" :val="categoryDetail.CATEGORY_DETAIL_ID"
                  :label="categoryDetail.CATEGORY_DETAIL_NAME" v-for="categoryDetail in getCategoryDetailsEdit"
                  :key="categoryDetail.CATEGORY_DETAIL_ID + 'edit'" disable />
              </div>

              <q-field outlined label="Số lượng" stack-label :dense="dense">
                <template v-slot:control>
                  <div class="self-center full-width no-outline" tabindex="0">{{ quantityEdit }}</div>
                </template>
              </q-field>

              <q-field outlined label="Số lượng" stack-label :dense="dense">
                <template v-slot:control>
                  <div class="self-center full-width no-outline" tabindex="0">{{ priceEdit }}</div>
                </template>
              </q-field>
              <div class="row justify-between no-wrap" style="gap: 5px">
                <div class="col-6">
                  <q-field outlined label="Dung tích" stack-label :dense="dense">
                    <template v-slot:control>
                      <div class="self-center full-width no-outline" tabindex="0">{{ capacityEdit }}</div>
                    </template>
                  </q-field>
                </div>
                <div class="col-6">
                  <q-field outlined label="Đơn vị" stack-label :dense="dense">
                    <template v-slot:control>
                      <div class="self-center full-width no-outline" tabindex="0">{{ currentUnitSelectedEdit }}</div>
                    </template>
                  </q-field>
                </div>
              </div>
              <q-field outlined label="Nhà cung cấp" stack-label :dense="dense">
                <template v-slot:control>
                  <div class="self-center full-width no-outline" tabindex="0">{{ currentProviderSelectedEdit.label }}
                  </div>
                </template>
              </q-field>
              <q-field outlined label="Ảnh đại diện" stack-label :dense="dense">
                <template v-slot:control>
                  <q-img :src="getImageEditUrl" v-if="getImageEditUrl !== null" spinner-color="white"
                    style="height: 150px; max-width: 150px">
                    <template v-slot:loading>
                      <div class="text-subtitle1 text-white">
                        Loading...
                      </div>
                    </template>
                  </q-img>
                </template>
              </q-field>
              <q-field outlined label="Ảnh của sản phẩm" stack-label :dense="dense">
                <template v-slot:control>
                  <q-img v-for="imgUrl in getImagesEditUrl" :src="imgUrl" style="height: 150px; max-width: 150px">
                    <template v-slot:loading>
                      <div class="text-subtitle1 text-white">
                        Loading...
                      </div>
                    </template>
                  </q-img>
                </template>
              </q-field>
              <q-field outlined label="Mô tả" stack-label :dense="dense">
                <template v-slot:control>
                  <div class="self-center full-width no-outline" tabindex="0">{{ descriptionEdit }}
                  </div>
                </template>
              </q-field>
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
    <!-- row-key (tr) lay trong row => la ten cua row nha -->
    <q-table title="Treats" selection="multiple" v-model:selected="selected" :rows="rows" :columns="columns"
      row-key="COSMETIC_ID" :loading="loading" :filter="filter" :filter-method="filterProduct"
      no-data-label="I didn't find anything for you" no-results-label="The filter didn't uncover any results"
      separator="cell">
      <template v-slot:top>
        <q-btn color="primary" :disable="loading" label="Vô hiệu" @click="addRow" />
        <q-btn class="q-ml-sm" color="primary" :disable="loading" @click="deleteProduct" label="Kích hoạt" />
        <q-space />
        <q-input dense debounce="300" v-model="filter" placeholder="Tìm kiếm...">
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
          <q-td key="userName" :props="props">
            {{ props.row.USER_NAME }}
          </q-td>
          <q-td key="email" :props="props">
            {{ props.row.EMAIL }}
          </q-td>
          <q-td key="phone" :props="props">
            {{ props.row.PHONE }}
          </q-td>

          <q-td key="disable" :props="props">
            {{ !props.row.IS_DISABLED ? "Hiện hành" : "Vô hiệu hoá" }}
          </q-td>

          <q-td>
            <q-icon @click="openDetailForm" :id="props.row.COSMETIC_ID + ' detail'" name="preview"
              style="cursor: pointer;" :props="props" />
          </q-td>
        </q-tr>
      </template>
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
  </div>
</template>
    
<script setup>
import { ref, watch, onMounted, computed } from 'vue'
import { exportFile, useQuasar } from 'quasar'
import _ from 'lodash'
import AccountAPI from '../../api/AdminAPI/AccountAPI'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import VNDCurrencyFormatter from '../../util/VNDCurrencyFormatter'
const $q = useQuasar()

const columns = [
  //  name phai trung voi key
  { name: 'userName', align: 'center', label: 'Tên tài khoản', field: 'name' },
  { name: 'email', label: 'Email', field: 'email' },
  { name: 'phone', label: 'Số điện thoại', field: 'phone' },
  { name: 'disable', label: 'Trạng thái', field: 'disable' },
  { name: 'edit', label: '' },
]

const rows = ref([])
const loading = ref(true)
const rowCount = ref(10)
const filter = ref('')
const accounts = ref([])

const formEdit = ref(false)
onMounted(() => {
  AccountAPI.getAll()
    .then(res => {
      accounts.value = res.data
      rows.value = res.data
      loading.value = false
    })

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

function openDetailForm(e) {
  const id = e.currentTarget.id.split(' ')
  const productId = id[0]
  if (!currentProduct.value) {
    const product = _.find(products.value, product => parseInt(product.COSMETIC_ID) === parseInt(productId))
    currentProduct.value = product
    currentProviderSelectedEdit.value = {
      value: product.PROVIDER.PROVIDER_ID,
      label: product.PROVIDER.PROVIDER_NAME
    }
    nameEdit.value = product.COSMETIC_NAME
    capacityEdit.value = product.CAPACITY
    currentUnitSelectedEdit.value = product.UNIT
    descriptionEdit.value = product.DESCRIPTION
    priceEdit.value = product.PRICE
    quantityEdit.value = product.QUANTITY
    let categoryIds = []
    product.CATEGORY_DETAIL_ID_category_detail_cosmetic_categories.forEach(categoryDetail => {
      const categoryFound = categoryIds.find(category => parseInt(category.value) === parseInt(categoryDetail.CATEGORY.CATEGORY_ID))
      if (!categoryFound) {
        categoryIds.push({
          value: categoryDetail.CATEGORY.CATEGORY_ID,
          label: categoryDetail.CATEGORY.CATEGORY_NAME
        })
      }
    })
    currentCategoriesSelectedEdit.value = categoryIds
    const categoryDetailIds = product.CATEGORY_DETAIL_ID_category_detail_cosmetic_categories.map(categoryDetail => {
      return categoryDetail.CATEGORY_DETAIL_ID
    })
    categoryDetailsSelectedEdit.value = categoryDetailIds
  }
  formDetail.value = true
}


  // function onRowClick(row) {
  //   alert(`${row.name} clicked`)
  // }
  //  const columns = ref(columns),
  //  const rows = ref(rows) 
</script>
    