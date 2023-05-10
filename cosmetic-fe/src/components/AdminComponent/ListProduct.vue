<template>
  <div class="q-pa-md">
    <q-dialog v-model="form" persistent>
      <q-card class="column full-height no-wrap" style="width: 700px; max-width: 80vw;">
        <q-card-section>
          <div class="text-h6">Thêm</div>
        </q-card-section>
        <q-card-section>
          <q-form class="q-gutter-md">
            <div class="column" style="gap: 10px">
              <q-input outlined v-model="nameCreate" label="Tên *" lazy-rules
                :rules="[val => val && val.length > 0 || 'Tên mỹ phẩm không được để trống']" />

              <q-select outlined v-model="currentCategoriesSelected" multiple :options="categories" label="Thể loại" />

              <div class="row">
                <q-checkbox outlined v-model="categoryDetailsSelected" :val="categoryDetail.CATEGORY_DETAIL_ID"
                  :label="categoryDetail.CATEGORY_DETAIL_NAME" v-for="categoryDetail in getCategoryDetails"
                  :key="categoryDetail.CATEGORY_DETAIL_ID" />
              </div>

              <q-input outlined type="number" v-model="quantityCreate" label="Số lượng *" lazy-rules :rules="[
                  val => val !== null && val !== '' || 'Số lượng không được để trống',
                  val => val > 0 || 'Số lượng phải lớn hơn 0'
                ]" />

              <q-input outlined type="number" v-model="priceCreate" label="Giá *(VNĐ)" lazy-rules :rules="[
                  val => val !== null && val !== '' || 'Please type something',
                  val => val > 0 || 'Giá phải lớn hơn 0'
                ]" />

              <div class="row justify-between no-wrap" style="gap: 5px">
                <div class="col-6">
                  <q-input outlined type="number" v-model="capacityCreate" hint="Dung tích" label="Dung tích" lazy-rules
                    :rules="[
                        val => val > 0 || 'Dung tích phải lớn hơn 0'
                      ]" />
                </div>
                <div class="col-6">
                  <q-select outlined v-model="currentUnitSelected" :options="unit" label="Đơn vị" />
                </div>
              </div>
              <q-select outlined v-model="currentProviderSelected" :options="providers" label="Nhà cung cấp" />
              <div class="column q-gutter-sm">
                <q-input outlined @update:model-value="val => { fileCreate = val[0] }" type="file"
                  hint="Tải ảnh địa diện" />
                <q-img :src="getImageCreateUrl" v-if="getImageCreateUrl !== null" spinner-color="white"
                  style="height: 150px; max-width: 150px">
                  <template v-slot:loading>
                    <div class="text-subtitle1 text-white">
                      Loading...
                    </div>
                  </template>
                </q-img>
              </div>
              <div class="column q-gutter-sm">
                <q-input v-model:model-value="filesCreate" outlined multiple
                  @update:model-value="val => { filesCreate = val }" type="file" hint="Tải ảnh của sản phẩm" />
                <div class="q-gutter-sm row items-start no-wrap">
                  <q-img v-for="imgUrl in getImagesCreateUrl" :src="imgUrl" style="height: 150px; max-width: 150px">
                    <template v-slot:loading>
                      <div class="text-subtitle1 text-white">
                        Loading...
                      </div>
                    </template>
                  </q-img>
                </div>
              </div>
              <q-input outlined autogrow label="Mô tả" v-model="descriptionCreate" />
            </div>
          </q-form>
        </q-card-section>
        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn label="Lưu" type="button" @click="saveProduct" color="primary" />
          <q-btn label="Huỷ bỏ" color="primary" flat class="q-ml-sm" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="formEdit" v-if="formEdit" persistent>
      <q-card class="column full-height no-wrap" style="width: 700px; max-width: 80vw;">
        <q-card-section>
          <div class="text-h6">Sửa</div>
        </q-card-section>
        <q-card-section>
          <q-form class="q-gutter-md">
            <div class="column" style="gap: 10px">
              <q-input outlined v-model="nameEdit" label="Tên *" lazy-rules
                :rules="[val => val && val.length > 0 || 'Tên mỹ phẩm không được để trống']" disable />

              <q-select outlined v-model="currentCategoriesSelectedEdit" multiple :options="categories"
                label="Thể loại" />

              <div class="row">
                <q-checkbox outlined v-model="categoryDetailsSelectedEdit" :val="categoryDetail.CATEGORY_DETAIL_ID"
                  :label="categoryDetail.CATEGORY_DETAIL_NAME" v-for="categoryDetail in getCategoryDetailsEdit"
                  :key="categoryDetail.CATEGORY_DETAIL_ID + 'edit'" />
              </div>

              <q-input outlined type="number" v-model="quantityEdit" label="Số lượng *" lazy-rules :rules="[
                  val => val !== null && val !== '' || 'Số lượng không được để trống',
                  val => val > 0 || 'Số lượng phải lớn hơn 0'
                ]" />

              <q-input outlined type="number" v-model="priceEdit" label="Giá *(VNĐ)" lazy-rules :rules="[
                  val => val !== null && val !== '' || 'Please type something',
                  val => val > 0 || 'Giá phải lớn hơn 0'
                ]" />

              <div class="row justify-between no-wrap" style="gap: 5px">
                <div class="col-6">
                  <q-input outlined type="number" v-model="capacityEdit" hint="Dung tích" label="Dung tích" lazy-rules
                    :rules="[
                        val => val > 0 || 'Dung tích phải lớn hơn 0'
                      ]" />
                </div>
                <div class="col-6">
                  <q-select outlined v-model="currentUnitSelectedEdit" :options="unit" label="Đơn vị" />
                </div>
              </div>
              <q-select outlined v-model="currentProviderSelectedEdit" :options="providers" label="Nhà cung cấp" />
              <div class="column q-gutter-sm">
                <q-input outlined @update:model-value="val => { fileEdit = val[0] }" type="file"
                  hint="Tải ảnh địa diện" />
                <q-img :src="getImageEditUrl" v-if="getImageEditUrl !== null" spinner-color="white"
                  style="height: 150px; max-width: 150px">
                  <template v-slot:loading>
                    <div class="text-subtitle1 text-white">
                      Loading...
                    </div>
                  </template>
                </q-img>
              </div>
              <div class="column q-gutter-sm">
                <q-input v-model:model-value="filesEdit" outlined multiple
                  @update:model-value="val => { filesEdit = val }" type="file" hint="Tải ảnh của sản phẩm" />
                <div class="q-gutter-sm row items-start no-wrap">
                  <q-img v-for="imgUrl in getImagesEditUrl" :src="imgUrl" style="height: 150px; max-width: 150px">
                    <template v-slot:loading>
                      <div class="text-subtitle1 text-white">
                        Loading...
                      </div>
                    </template>
                  </q-img>
                </div>
              </div>
              <q-input outlined autogrow label="Mô tả" v-model="descriptionEdit" />
            </div>
          </q-form>
        </q-card-section>
        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn label="Lưu" type="button" @click="saveEdit" color="primary" />
          <q-btn label="Huỷ bỏ" color="primary" flat class="q-ml-sm" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog class="admin-detail-product" transition-show="slide-up" transition-hide="slide-down" v-model="formDetail" v-if="formDetail" persistent>
      <q-card class="column full-height no-wrap" style="width: 700px; max-width: 80vw;">
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
                  <div class="self-center full-width no-outline" tabindex="0">
                    {{ currentCategoriesSelectedEdit[0] && currentCategoriesSelectedEdit[0].label }}
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
              <div class="column wrap">
                <q-field outlined label="Nhà cung cấp" stack-label :dense="dense">
                  <template v-slot:control>
                    <div class="self-center full-width no-outline" tabindex="0">{{ currentProviderSelectedEdit.label }}
                    </div>
                  </template>
                </q-field>
                <q-field outlined label="Ảnh đại diện" stack-label :dense="dense">
                  <template v-slot:control>
                    <q-img :src="getImageEditUrl" v-if="getImageEditUrl !== null" spinner-color="white"
                      style="height: 150px; max-width: 150px" fit>
                      <template v-slot:loading>
                        <div class="text-subtitle1 text-white">
                          Loading...
                        </div>
                      </template>
                    </q-img>
                  </template>
                </q-field>
                <div class="q-pa-md">
                  <q-carousel padding swipeable animated v-model="slide" thumbnails infinite dark>
                    <q-carousel-slide style="background-size: contain; background-repeat: no-repeat;"
                      v-for="imgUrl in getImagesEditUrl" :name="imgUrl" :img-src="imgUrl" />
                  </q-carousel>
                </div>
                <q-field outlined label="Mô tả" stack-label :dense="dense">
                  <template v-slot:control>
                    <div class="self-center full-width no-outline" tabindex="0">{{ descriptionEdit }}
                    </div>
                  </template>
                </q-field>
              </div>
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
    <!-- row-key (tr) lay trong row => la ten cua row nha -->
    <q-table class="admin-table" title="Treats" selection="multiple" v-model:selected="selected" :rows="rows"
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
            <q-icon @click="openEditForm" :id="props.row.COSMETIC_ID + ' edit'" name="edit" style="cursor: pointer;"
              :props="props" />
            |
            <q-icon @click="openDetailForm" :id="props.row.COSMETIC_ID + ' detail'" name="preview"
              style="cursor: pointer;" :props="props" />
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
const formDetail = ref(false)
const providers = ref([])
const categories = ref([])
const nameCreate = ref(null)
const quantityCreate = ref(null)
const priceCreate = ref(null)
const capacityCreate = ref(null)
const descriptionCreate = ref(null)
const fileCreate = ref(null)
const filesCreate = ref(null)
let allCategory = []
const slide = ref('')

const formEdit = ref(false)
const currentProduct = ref(null)
const nameEdit = ref(null)
const quantityEdit = ref(null)
const priceEdit = ref(null)
const capacityEdit = ref(null)
const descriptionEdit = ref(null)
const fileEdit = ref(null)
const filesEdit = ref(null)
const categoryDetailsSelectedEdit = ref([])
const currentCategoriesSelectedEdit = ref([])
const currentUnitSelectedEdit = ref(null)
const currentProviderSelectedEdit = ref(null)

const categoryDetailsSelected = ref([])
const currentCategoriesSelected = ref([])
const currentUnitSelected = ref(null)
const currentProviderSelected = ref(null)
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
        "CAPACITY": cosmetic.CAPACITY,
        "UNIT": cosmetic.UNIT,
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
      const options = _.map(res.data, provider => ({
        label: provider.PROVIDER_NAME,
        value: provider.PROVIDER_ID
      }))
      providers.value = options
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

function openEditForm(e) {
  const id = e.currentTarget.id.split(' ')
  const productId = id[0]
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

  formEdit.value = true
}

function openDetailForm(e) {
  const id = e.currentTarget.id.split(' ')
  const productId = id[0]
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
  slide.value = product.images[0].IMAGE_URL
  categoryDetailsSelectedEdit.value = categoryDetailIds
  formDetail.value = true
}

function addRow() {
  form.value = true
  currentProduct.value = null
}

function saveProduct() {
  // save new => current Product === null
  let formData = new FormData()
  formData.append('name', nameCreate.value)
  categoryDetailsSelected.value.forEach(id => {
    formData.append('categoryDetailsId', id)
  })
  formData.append('quantity', quantityCreate.value)
  formData.append('capacity', capacityCreate.value)
  formData.append('unit', currentUnitSelected.value)
  formData.append('providerId', currentProviderSelected.value.value)
  formData.append('description', descriptionCreate.value)
  formData.append('price', priceCreate.value)
  formData.append('avatar', fileCreate.value)
  if (filesCreate.value) {
    const files = Array.from(filesCreate.value)
    files.forEach(file => {
      formData.append('imgs', file)
    })
  }
  ProductAPI.addNewProduct(formData)
    .then(res => {
      toast.success("Thêm thành công!", { theme: 'colored' })
      form.value = false
      loading.value = true
      ProductAPI.getProducts()
        .then(res => {
          products.value = res.data
          rows.value = _.map(res.data, cosmetic => ({
            "COSMETIC_ID": cosmetic.COSMETIC_ID,
            "COSMETIC_NAME": cosmetic.COSMETIC_NAME,
            "QUANTITY": cosmetic.QUANTITY,
            "PRICE": cosmetic.PRICE,
            "CAPACITY": cosmetic.CAPACITY,
            "UNIT": cosmetic.UNIT,
            "IMAGE": cosmetic.IMAGE,
            "PROVIDER_NAME": cosmetic.PROVIDER ? cosmetic.PROVIDER.PROVIDER_NAME : null
          }))
          loading.value = false
        })
    }).catch(err => {
      console.log(err)
    })
}

function saveEdit() {
  // save new => current Product === null
  let formData = new FormData()
  formData.append('id', currentProduct.value.COSMETIC_ID)
  formData.append('name', nameEdit.value)
  categoryDetailsSelectedEdit.value.forEach(id => {
    formData.append('categoryDetailsId', id)
  })
  formData.append('quantity', quantityEdit.value)
  formData.append('capacity', capacityEdit.value)
  formData.append('unit', currentUnitSelectedEdit.value)
  formData.append('providerId', currentProviderSelectedEdit.value.value)
  formData.append('description', descriptionEdit.value)
  formData.append('price', priceEdit.value)
  console.log(fileEdit.value)
  formData.append('avatar', fileEdit.value)
  if (filesEdit.value) {
    const files = Array.from(filesEdit.value)
    files.forEach(file => {
      formData.append('imgs', file)
    })
  }
  ProductAPI.updateProduct(formData)
    .then(res => {
      toast.success("Sửa thành công!", { theme: 'colored' })
      formEdit.value = false
      loading.value = true
      ProductAPI.getProducts()
        .then(res => {
          products.value = res.data
          rows.value = _.map(res.data, cosmetic => ({
            "COSMETIC_ID": cosmetic.COSMETIC_ID,
            "COSMETIC_NAME": cosmetic.COSMETIC_NAME,
            "QUANTITY": cosmetic.QUANTITY,
            "PRICE": cosmetic.PRICE,
            "CAPACITY": cosmetic.CAPACITY,
            "UNIT": cosmetic.UNIT,
            "IMAGE": cosmetic.IMAGE,
            "PROVIDER_NAME": cosmetic.PROVIDER ? cosmetic.PROVIDER.PROVIDER_NAME : null
          }))
          loading.value = false
        })
    }).catch(err => {
      console.log(err)
    })
}

const getImageCreateUrl = computed(() => {
  if (fileCreate.value) {
    return window.URL.createObjectURL(fileCreate.value)
  }
  return null
})

const getImagesCreateUrl = computed(() => {
  if (filesCreate.value) {
    console.log(filesCreate.value)
    const filesUrl = Array.from(filesCreate.value).map(file => {
      return window.URL.createObjectURL(file)
    })
    return filesUrl
  }
  return null
})

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
  const ids = selected.value.map(product => product.COSMETIC_ID)
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
    ProductAPI.delete(ids).then(() => {
      loading.value = true
      ProductAPI.getProducts()
        .then(res => {
          products.value = res.data
          rows.value = _.map(res.data, cosmetic => ({
            "COSMETIC_ID": cosmetic.COSMETIC_ID,
            "COSMETIC_NAME": cosmetic.COSMETIC_NAME,
            "QUANTITY": cosmetic.QUANTITY,
            "PRICE": cosmetic.PRICE,
            "CAPACITY": cosmetic.CAPACITY,
            "UNIT": cosmetic.UNIT,
            "IMAGE": cosmetic.IMAGE,
            "PROVIDER_NAME": cosmetic.PROVIDER ? cosmetic.PROVIDER.PROVIDER_NAME : null
          }))
          loading.value = false
        })
    })
  }).onCancel(() => {
    // console.log('>>>> Cancel')
  }).onDismiss(() => {
    // console.log('I am triggered on both OK and Cancel')
  })
}

function filterProduct(rows) {
  if (filter.value) {
    const lowercaseFilter = filter.value.toLowerCase()
    const filterResult = products.value.filter(cosmetic => {
      if (cosmetic.COSMETIC_NAME.toLowerCase().includes(lowercaseFilter)) {
        return true
      } else if (cosmetic.PRICE && cosmetic.PRICE.toLowerCase().includes(lowercaseFilter)) {
        return true
      } else if (cosmetic.UNIT && cosmetic.UNIT.toLowerCase().includes(lowercaseFilter)) {
        return true
      } else if (cosmetic.PROVIDER_NAME && cosmetic.PROVIDER_NAME.toLowerCase().includes(lowercaseFilter)) {
        return true
      } else {
        const categoryDetailName = _.map(cosmetic.CATEGORY_DETAIL_ID_category_detail_cosmetic_categories, categoryDetail => {
          return categoryDetail.CATEGORY_DETAIL_NAME.toLowerCase()
        })
        const categoryName = _.map(cosmetic.CATEGORY_DETAIL_ID_category_detail_cosmetic_categories, categoryDetail => {
          return categoryDetail.CATEGORY.CATEGORY_NAME.toLowerCase()
        })
        const findFilterInCategoryName = categoryName.filter(item => item.includes(lowercaseFilter))
        if (findFilterInCategoryName.length) {
          return true
        }
        const findFilterInCategoryDetailName = categoryDetailName.filter(item => item.includes(lowercaseFilter))
        if (findFilterInCategoryDetailName.length) {
          return true
        }
      }
    })
    const result = _.map(filterResult, cosmetic => ({
      "COSMETIC_ID": cosmetic.COSMETIC_ID,
      "COSMETIC_NAME": cosmetic.COSMETIC_NAME,
      "QUANTITY": cosmetic.QUANTITY,
      "PRICE": cosmetic.PRICE,
      "CAPACITY": cosmetic.CAPACITY,
      "UNIT": cosmetic.UNIT,
      "IMAGE": cosmetic.IMAGE,
      "PROVIDER_NAME": cosmetic.PROVIDER ? cosmetic.PROVIDER.PROVIDER_NAME : null
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
.admin-table thead{
  background-color: #bdbdbd!important;
}
.admin-detail-product .scroll {
  overflow: hidden;
}
</style>
  