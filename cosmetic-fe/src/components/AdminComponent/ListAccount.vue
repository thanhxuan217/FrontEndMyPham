<template>
  <div class="q-pa-md">
    <q-dialog transition-show="slide-up" transition-hide="slide-down" v-model="formDetail" v-if="formDetail" persistent
      full-height full-width>
      <q-card class="column full-height no-wrap">
        <q-bar class="bg-primary">
          <q-space />
          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip class="bg-white text-primary">Đóng</q-tooltip>
          </q-btn>
        </q-bar>
        <q-card-section>
          <div class="text-h4">Chi tiết người dùng</div>
        </q-card-section>
        <q-card style="height: 358px">
          <div class="q-pa-md">
            <div class="text-h6 q-mb-md">Thông tin người dùng</div>
            <q-card class="my-card" flat bordered>
              <q-item>
                <q-item-section avatar>
                  <q-avatar>
                    <img
                      :src="currentAccount.IMAGE ? currentAccount.IMAGE.IMAGE_URL : 'https://cdn.quasar.dev/img/boy-avatar.png'">
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label>
                    {{ currentAccount.USER_NAME }}
                    <q-icon color="primary" :name="currentAccount.SEX ? 'male' : 'female'" />
                  </q-item-label>
                  <q-item-label caption>
                    {{ dayjs(currentAccount.BIRTH_DAY).format('DD/MM/YYYY') }}
                  </q-item-label>
                </q-item-section>
              </q-item>
              <q-separator />
              <q-card-section>
                <q-list bordered>
                  <q-item class="row justify-between">
                    <div class="row" style="width: 100%;">
                      <div style="flex-basis: 50%;" class="q-pr-md row">
                        <q-item-section avatar>
                          Họ:
                        </q-item-section>
                        <q-item-section>
                          {{ currentAccount.FIRST_NAME }}
                        </q-item-section>
                      </div>
                      <q-separator vertical />
                      <div class="q-pl-md row">
                        <q-item-section avatar>
                          Tên:
                        </q-item-section>
                        <q-item-section>
                          {{ currentAccount.LAST_NAME }}
                        </q-item-section>
                      </div>
                    </div>
                  </q-item>
                  <q-separator />
                  <q-item>
                    <q-item-section avatar>
                      <q-icon color="primary" name="email" />
                    </q-item-section>
                    <q-item-section>
                      {{ currentAccount.EMAIL }}
                    </q-item-section>
                  </q-item>
                  <q-separator />
                  <q-item>
                    <q-item-section avatar>
                      <q-icon color="primary" name="phone" />
                    </q-item-section>
                    <q-item-section>
                      {{ currentAccount.PHONE }}
                    </q-item-section>
                  </q-item>
                  <q-separator />
                  <q-item>
                    <q-item-section avatar>
                      Trạng thái:
                    </q-item-section>
                    <q-item-section>
                      {{ currentAccount.IS_DISABLED ? "Bị vô hiệu" :
                        "Hiện hành" }}
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-card-section>
            </q-card>
          </div>
        </q-card>
        <q-separator />
        <q-card>
          <div class="q-pa-md">
            <div class="text-h6 q-mb-md">Danh sách đơn đặt</div>
            <q-card class="q-pa-md my-card" flat bordered v-for="order in currentAccount.orders">
              <q-item>
                <div class="column" style="width: 100%;">
                  <div class="row" style="gap: 10px">
                    <div class="col">
                      <q-field color="purple-12" label="Mã đơn đặt" stack-label>
                        <template v-slot:control>
                          <div class="self-center full-width no-outline" tabindex="0">
                            {{ order.ORDER_ID }}
                          </div>
                        </template>
                      </q-field>
                    </div>
                    <q-separator />
                    <div class="col">
                      <q-field color="purple-12" label="Thời gian đặt" stack-label>
                        <template v-slot:control>
                          <div class="self-center full-width no-outline" tabindex="0">{{
                            dayjs(order.ORDER_TIME).format('DD/MM/YYYY HH:mm:ss')
                          }}
                          </div>
                        </template>
                      </q-field>
                    </div>
                  </div>
                  <div class="row" style="gap: 10px">
                    <div class="col">
                      <q-field color="purple-12" label="Phương thức" stack-label>
                        <template v-slot:control>
                          <div class="self-center full-width no-outline" tabindex="0">
                            {{ order.METHOD }}
                          </div>
                        </template>
                      </q-field>
                    </div>
                    <q-separator />
                    <div class="col">
                      <q-field color="purple-12" label="Phí vận chuyển" stack-label>
                        <template v-slot:control>
                          <div class="self-center full-width no-outline" tabindex="0">{{
                            VNDCurrencyFormatter.formatToVND(order.SHIP_PRICE) }}
                          </div>
                        </template>
                      </q-field>
                    </div>
                  </div>
                  <div class="row" style="gap: 10px">
                    <div class="col">
                      <q-field color="purple-12" label="Trạng thái" stack-label>
                        <template v-slot:control>
                          <div class="self-center full-width no-outline" tabindex="0">
                            {{ getStatus(order.STATUS) }}
                          </div>
                        </template>
                      </q-field>
                    </div>
                    <q-separator />
                    <div class="col">
                      <q-field color="purple-12" label="Phê duyệt" stack-label>
                        <template v-slot:control>
                          <div class="self-center full-width no-outline" tabindex="0">{{
                            getApproveStatus(order.IS_APPROVE) }}
                          </div>
                        </template>
                      </q-field>
                    </div>
                  </div>
                  <div class="row" style="gap: 10px">
                    <div class="col">
                      <q-field color="purple-12" label="Tổng tiền hàng" stack-label>
                        <template v-slot:control>
                          <div class="self-center full-width no-outline" tabindex="0">
                            {{ VNDCurrencyFormatter.formatToVND(getSumOrder(order)) }}
                          </div>
                        </template>
                      </q-field>
                    </div>
                    <q-separator />
                    <div class="col">
                      <q-field color="purple-12" label="Người duyệt" stack-label>
                        <template v-slot:control>
                          <div class="self-center full-width no-outline" tabindex="0" style="color: ;">
                            {{ order.EMPLOYEE ?
                              order.EMPLOYEE.EMPLOYEE_NAME : "Chưa có" }}
                          </div>
                        </template>
                      </q-field>
                    </div>
                  </div>
                </div>
              </q-item>
              <q-separator />
              <q-item class="column q-pa-md">
                <div class="text-h8 q-pa-md" style="font-weight: bold;">Chi tiết đơn đặt</div>
                <q-separator />
                <q-list>
                  <q-item v-for="orderDetail in order.order_details">
                    <q-item-section avatar>
                      <q-img :src="orderDetail.COSMETIC.IMAGE.IMAGE_URL" spinner-color="white"
                        style="height: 140px; max-width: 150px" />
                    </q-item-section>
                    <q-item-section>
                      {{ orderDetail.COSMETIC.COSMETIC_NAME }}
                    </q-item-section>
                    <q-separator vertical dark />
                    <q-item-section>
                      <q-item-label style="font-weight: bold;">
                        {{ 'x ' + orderDetail.QUANTITY }}
                      </q-item-label>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>
                        Giá bán:
                      </q-item-label>
                      <q-item-label>
                        <span style="font-weight: bold;">
                          {{ VNDCurrencyFormatter.formatToVND(orderDetail.PRICE) }}
                        </span>
                        <span style="color: red;">
                          {{ " (-" + ((orderDetail.COSMETIC.PRICE - orderDetail.PRICE) /
                            orderDetail.COSMETIC.PRICE) * 100 + "%)" }}
                        </span>
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-item>
            </q-card>
          </div>
        </q-card>
      </q-card>
    </q-dialog>
    <!-- row-key (tr) lay trong row => la ten cua row nha -->
    <q-table title="Treats" selection="multiple" v-model:selected="selected" :rows="rows" :columns="columns"
      row-key="CLIENT_ID" :loading="loading" :filter="filter" :filter-method="filterProduct"
      no-data-label="I didn't find anything for you" no-results-label="The filter didn't uncover any results"
      separator="cell">
      <template v-slot:top>
        <q-btn color="dark" :disable="loading" label="Vô hiệu" @click="disableAccount" />
        <q-btn class="q-ml-sm" color="primary" :disable="loading" @click="activeAccount" label="Kích hoạt" />
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
            <q-icon @click="openDetailForm" :id="props.row.CLIENT_ID + ' detail'" name="preview" style="cursor: pointer;"
              :props="props" />
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
import dayjs from 'dayjs'

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
const selected = ref([])
const formDetail = ref(false)
const currentAccount = ref(null)

onMounted(() => {
  AccountAPI.getAll()
    .then(res => {
      accounts.value = res.data
      console.log(res.data);
      rows.value = res.data
      loading.value = false
    })

})
function getStatus(status) {
  let result
  switch (parseInt(status)) {
    case 0:
      result = 'Đã thanh toán'
      break
    case 1:
      result = 'Chưa thanh toán'
      break
  }
  return result
}

function getSumOrder(order) {
  let sum = 0
  order.order_details.forEach(orderDetail => {
    sum += parseFloat(orderDetail.PRICE)
  })
  return sum
}

function getApproveStatus(status) {
  let result
  switch (parseInt(status)) {
    case 0:
      result = 'Chưa duyệt'
      break
    case 1:
      result = 'Đã duyệt'
      break
    default:
      result = "Từ chối"
      break
  }
  return result
}
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
  const accountFound = accounts.value.find(account => parseInt(account.CLIENT_ID) === parseInt(id))
  currentAccount.value = accountFound
  formDetail.value = true
}

function activeAccount() {
  if (!selected.value.length) {
    return
  }
  $q.dialog({
    dark: true,
    title: 'Xác nhận',
    message: 'Bạn có chắc chắn kích hoạt các tài khoản này?',
    cancel: true,
    persistent: true
  }).onOk(() => {
    const clientIds = selected.value.map(item => item.CLIENT_ID)
    console.log(clientIds);
    const data = {
      clientIds,
      isActive: true
    }
    loading.value = true
    AccountAPI.activeAccount(data)
      .then(res => {
        AccountAPI.getAll()
          .then(res => {
            selected.value = []
            accounts.value = res.data
            rows.value = res.data
            loading.value = false
          })
        toast.success("Cập nhật thành công!", { theme: 'colored' })
        loading.value = false
      })
      .catch(err => {
        loading.value = false
      })
  }).onCancel(() => {
    // console.log('>>>> Cancel')
  }).onDismiss(() => {
    // console.log('I am triggered on both OK and Cancel')
  })
}

function disableAccount() {
  if (!selected.value.length) {
    return
  }
  $q.dialog({
    dark: true,
    title: 'Xác nhận',
    message: 'Bạn có chắc chắn vô hiệu hoá các tài khoản này?',
    cancel: true,
    persistent: true
  }).onOk(() => {
    const clientIds = selected.value.map(item => item.CLIENT_ID)
    const data = {
      clientIds,
      isActive: false
    }
    loading.value = true
    AccountAPI.activeAccount(data)
      .then(res => {
        selected.value = []
        AccountAPI.getAll()
          .then(res => {
            accounts.value = res.data
            rows.value = res.data
            loading.value = false
          })
        toast.success("Cập nhật thành công!", { theme: 'colored' })
        loading.value = false
      })
      .catch(err => {
        loading.value = false
      })
  }).onCancel(() => {
    // console.log('>>>> Cancel')
  }).onDismiss(() => {
    // console.log('I am triggered on both OK and Cancel')
  })
}
</script>
    