<template>
  <div class="q-pa-md">
    <q-dialog v-model="form" persistent>
      <q-card class="column no-wrap" style="width: 700px; max-width: 80vw;">
        <q-card-section>
          <div class="text-h6">Thêm</div>
        </q-card-section>
        <q-card-section>
          <q-form class="q-gutter-md">
            <div class="column" style="gap: 10px">
              <q-select filled v-model="currentProduct" :options="getProductOption" label="Chọn sản phẩm" color="teal"
                clearable options-selected-class="text-deep-orange" outlined>
                <template v-slot:selected>
                  <q-chip v-if="currentProduct" dense square color="white" text-color="primary"
                    class="q-my-none q-ml-xs q-mr-none">
                    <q-avatar square>
                      <img :src="currentProduct.imgUrl">
                    </q-avatar>
                    {{ currentProduct.label }}
                  </q-chip>
                </template>
                <template v-slot:option="scope">
                  <q-item v-bind="scope.itemProps">
                    <q-item-section avatar>
                      <q-avatar square>
                        <img :src="scope.opt.imgUrl">
                      </q-avatar>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>{{ scope.opt.label }}</q-item-label>
                      <q-item-label caption>{{ scope.opt.description }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
              <div class="row justify-between no-wrap" style="gap: 5px">
                <div class="col-6">
                  <q-input outlined type="number" v-model="quantityCreate" label="Số lượng *" lazy-rules :rules="[
                      val => val !== null && val !== '' || 'Số lượng không được để trống',
                      val => val > 0 || 'Số lượng phải lớn hơn 0'
                    ]" />
                </div>
                <div class="col-6">
                  <q-input outlined type="number" v-model="priceCreate" label="Giá nhập *(VNĐ)" lazy-rules :rules="[
                      val => val !== null && val !== '' || 'Please type something',
                      val => val > 0 || 'Giá phải lớn hơn 0'
                    ]" />
                </div>
              </div>
              <q-select outlined v-model="currentProviderSelected" :options="providers" label="Nhà cung cấp" />
            </div>
          </q-form>
        </q-card-section>
        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn label="Thêm" type="button" @click="addNewProduct" color="primary" />
          <q-btn label="Huỷ bỏ" color="primary" flat class="q-ml-sm" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="formEdit" v-if="formEdit" persistent>
      <q-card class="column no-wrap" style="width: 700px; max-width: 80vw;">
        <q-card-section>
          <div class="text-h6">Sửa</div>
        </q-card-section>
        <q-card-section>
          <q-form class="q-gutter-md">
            <div class="column" style="gap: 10px">
              <q-select disable filled v-model="currentProductEdit" :options="getProductOption" label="Chọn sản phẩm"
                color="teal" clearable options-selected-class="text-deep-orange" outlined>
                <template v-slot:selected>
                  <q-chip v-if="currentProductEdit" dense square color="white" text-color="primary"
                    class="q-my-none q-ml-xs q-mr-none">
                    <q-avatar square>
                      <img :src="currentProductEdit.IMAGE.IMAGE_URL">
                    </q-avatar>
                    {{ currentProductEdit.COSMETIC_NAME }}
                  </q-chip>
                </template>
                <template v-slot:option="scope">
                  <q-item v-bind="scope.itemProps">
                    <q-item-section avatar>
                      <q-avatar square>
                        <img :src="scope.opt.imgUrl">
                      </q-avatar>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>{{ scope.opt.label }}</q-item-label>
                      <q-item-label caption>{{ scope.opt.description }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
              <div class="row justify-between no-wrap" style="gap: 5px">
                <div class="col-6">
                  <q-input outlined type="number" v-model="quantityEdit" label="Số lượng *" lazy-rules :rules="[
                      val => val !== null && val !== '' || 'Số lượng không được để trống',
                      val => val > 0 || 'Số lượng phải lớn hơn 0'
                    ]" />
                </div>
                <div class="col-6">
                  <q-input outlined type="number" v-model="priceEdit" label="Giá nhập *(VNĐ)" lazy-rules :rules="[
                      val => val !== null && val !== '' || 'Please type something',
                      val => val > 0 || 'Giá phải lớn hơn 0'
                    ]" />
                </div>
              </div>
              <q-select outlined v-model="currentProviderEditSelected" :options="providers" label="Nhà cung cấp" />
            </div>
          </q-form>
        </q-card-section>
        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn label="Sửa" type="button" @click="editProduct" color="primary" />
          <q-btn label="Huỷ bỏ" color="primary" flat class="q-ml-sm" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <!-- row-key (tr) lay trong row => la ten cua row nha -->
    <q-table class="admin-table" title="Treats" selection="multiple" v-model:selected="selected" :rows="getProduct"
      :columns="columns" row-key="COSMETIC_ID" :loading="loading" :filter="filter" :filter-method="filterProduct"
      no-data-label="I didn't find anything for you" no-results-label="The filter didn't uncover any results"
      separator="cell">
      <template v-slot:top>
        <q-btn color="primary" :disable="loading" label="Thêm" @click="addRow" />
        <q-btn class="q-ml-sm" color="primary" :disable="loading" @click="deleteProduct" label="Xoá" />
        <q-space />
        <q-input dense debounce="300" v-model="filter" placeholder="Tìm kiếm...">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
      <template v-slot:loading>
        <q-inner-loading showing color="primary" />
      </template>
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td>
            <q-checkbox v-model="props.selected" />
          </q-td>
          <!-- value in row -->
          <q-td key="image" :props="props">
            <q-img :src="props.row.IMAGE.IMAGE_URL" width="60px" height="60px" fit />
          </q-td>
          <q-td key="name" :props="props">
            {{ props.row.COSMETIC_NAME }}
          </q-td>
          <q-td key="quantity" :props="props">
            {{ props.row.QUANTITY }}
          </q-td>
          <q-td key="price" :props="props">
            {{ VNDCurrencyFormatter.formatToVND(props.row.PRICE) }}
          </q-td>
          <q-td key="providerName" :props="props">
            {{ props.row.PROVIDER_NAME }}
          </q-td>
          <q-td>
            <q-icon @click="openEditForm" :id="props.row.COSMETIC_ID + ' edit'" name="edit" style="cursor: pointer;"
              :props="props" />
          </q-td>
        </q-tr>
      </template>
      <template v-slot:no-data="{ icon, message, filter }">
        <div class="full-width row flex-center text-accent q-gutter-sm">

        </div>
      </template>
    </q-table>
  </div>
</template>
<script setup>
import { ref, watch, onMounted, computed } from 'vue'
import { exportFile, useQuasar } from 'quasar'
import _ from 'lodash'
import ProductAPI from '../../api/AdminAPI/ProductAPI'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import VNDCurrencyFormatter from '../../util/VNDCurrencyFormatter'
const $q = useQuasar()

const columns = [
  { name: 'image', label: 'Hình đại diện', field: 'image' },
  { name: 'name', align: 'center', label: 'Tên mỹ phẩm', field: 'name' },
  { name: 'quantity', label: 'Số lượng nhập', field: 'quantity' },
  { name: 'price', label: 'Giá nhập', field: 'price' },
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
const formDetail = ref(false)
const providers = ref([])
const categories = ref([])
const quantityCreate = ref(null)
const priceCreate = ref(null)
const priceEdit = ref(null)
const quantityEdit = ref(null)
let allCategory = []
const slide = ref('')
const formEdit = ref(false)

const currentProduct = ref(null)
const currentProductEdit = ref(null)

const currentCategoriesSelected = ref([])
const currentUnitSelected = ref(null)
const currentProviderSelected = ref(null)
const currentProviderEditSelected = ref(null)
const unit = [
  'g', 'mg', 'l', 'ml'
]
onMounted(() => {
  ProductAPI.getProducts()
    .then(res => {
      products.value = res.data
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
      const options = _.map(res.data, provider => ({
        label: provider.PROVIDER_NAME,
        value: provider.PROVIDER_ID
      }))
      providers.value = options
    })
})

const getProductOption = computed(() => {
  if (products.value) {
    return products.value.map(product => ({ label: product.COSMETIC_NAME, imgUrl: product.IMAGE.IMAGE_URL, value: product.COSMETIC_ID }))
  }
})

const getProduct = computed(() => {
  return rows.value
})

function openEditForm(e) {
  const id = e.currentTarget.id.split(' ')
  const productId = id[0]
  const findProduct = rows.value.find(row => parseInt(row.COSMETIC_ID) === parseInt(productId))
  currentProductEdit.value = findProduct
  const providerFound = providers.value.find(provider => provider.label === findProduct.PROVIDER_NAME)
  currentProviderEditSelected.value = providerFound
  priceEdit.value = findProduct.PRICE
  quantityEdit.value = findProduct.QUANTITY
  formEdit.value = true
}

function addRow() {
  form.value = true
  currentProduct.value = null
}

function addNewProduct() {
  // save new => current Product === null
  const newProduct = {
    "COSMETIC_ID": currentProduct.value.value,
    "COSMETIC_NAME": currentProduct.value.label,
    "QUANTITY": quantityCreate.value,
    "PRICE": priceCreate.value,
    "IMAGE": {
      IMAGE_ID: null,
      IMAGE_URL: currentProduct.value.imgUrl
    },
    "PROVIDER_NAME": currentProviderSelected.value.label
  }
  const findProduct = rows.value.find(row => parseInt(row.COSMETIC_ID) === parseInt(newProduct.COSMETIC_ID))
  if (!findProduct) {
    rows.value = [...rows.value, newProduct]
  }
  // add to rows.value
}

function editProduct() {
  // delete and asign new array
  let findProduct = null
  let foundIndex = null
  rows.value.forEach((row, index) => {
    if (parseInt(row.COSMETIC_ID) === parseInt(currentProductEdit.value.COSMETIC_ID)) {
      findProduct = row
      foundIndex = index
    }
  })
  const newProduct = {
    "COSMETIC_ID": currentProductEdit.value.COSMETIC_ID,
    "COSMETIC_NAME": currentProductEdit.value.COSMETIC_NAME,
    "QUANTITY": quantityEdit.value,
    "PRICE": priceEdit.value,
    "IMAGE": {
      IMAGE_ID: null,
      IMAGE_URL: currentProductEdit.value.IMAGE.IMAGE_URL
    },
    "PROVIDER_NAME": currentProviderEditSelected.value.label
  }
  rows.value[foundIndex] = newProduct
  // add to rows.value
}

const getImageEditUrl = computed(() => {
  if (fileEdit.value) {
    return window.URL.createObjectURL(fileEdit.value)
  } else {
    const fileUrl = currentProduct.value.IMAGE.IMAGE_URL
    return fileUrl
  }
})

const getImagesEditUrl = computed(() => {
  if (filesEdit.value) {
    const filesUrl = Array.from(filesEdit.value).map(file => {
      return window.URL.createObjectURL(file)
    })
    return filesUrl
  } else {
    const filesUrl = currentProduct.value.images.map(image => {
      return image.IMAGE_URL
    })
    return filesUrl
  }
})

const getCategoryDetailsEdit = computed(() => {
  if (currentCategoriesSelectedEdit.value) {
    let categoryDetails = []
    const currentCategoryIds = currentCategoriesSelectedEdit.value.map(category => parseInt(category.value))
    allCategory.forEach(category => {
      if (currentCategoryIds.includes(parseInt(category.CATEGORY_ID))) {
        categoryDetails.push(category.category_details)
      }
    })
    let result = []
    _.forEach(categoryDetails, categoryDetail => {
      result = [...result, ...categoryDetail]
    })
    return result
  }
})

function deleteProduct() {
  const ids = selected.value.map(product => parseInt(product.COSMETIC_ID))
  if (!ids.length) {
    return
  }
  $q.dialog({
    dark: true,
    title: 'Xác nhận',
    message: 'Bạn có chắc chắn xoá?',
    cancel: true,
    persistent: true
  }).onOk(() => {
    const newProducts = rows.value.filter(row => !ids.includes(parseInt(row.COSMETIC_ID)))
    rows.value = newProducts
  }).onCancel(() => {
    // console.log('>>>> Cancel')
  }).onDismiss(() => {
    // console.log('I am triggered on both OK and Cancel')
  })
}

function filterProduct(rows) {
  if (filter.value) {
    const lowercaseFilter = filter.value.toLowerCase()
    const filterResult = rows.filter(cosmetic => {
      if (cosmetic.COSMETIC_NAME.toLowerCase().includes(lowercaseFilter)) {
        return true
      } else if (cosmetic.PRICE && cosmetic.PRICE.toLowerCase().includes(lowercaseFilter)) {
        return true
      } else if (cosmetic.PROVIDER_NAME && cosmetic.PROVIDER_NAME.toLowerCase().includes(lowercaseFilter)) {
        return true
      }
    })
    const result = _.map(filterResult, cosmetic => ({
      "COSMETIC_ID": cosmetic.COSMETIC_ID,
      "COSMETIC_NAME": cosmetic.COSMETIC_NAME,
      "QUANTITY": cosmetic.QUANTITY,
      "PRICE": cosmetic.PRICE,
      "IMAGE": cosmetic.IMAGE,
      "PROVIDER_NAME": cosmetic.PROVIDER_NAME
    }))
    return result
  }
  return rows
}
  // function onRowClick(row) {
  //   alert(`${row.name} clicked`)
  // }
  //  const columns = ref(columns),
  //  const rows = ref(rows) 
</script>
<style>
.admin-table thead {
  background-color: #1976D2;
}

.admin-detail-product .scroll {
  overflow: hidden;
}
</style>
    