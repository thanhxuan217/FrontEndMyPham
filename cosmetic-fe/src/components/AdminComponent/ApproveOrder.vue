<template>
    <div class="q-pa-md">
        <q-dialog transition-show="slide-up" transition-hide="slide-down" v-model="detail" v-if="detail" persistent
            full-height full-width>
            <q-card class="column full-height no-wrap">
                <q-bar class="bg-primary">
                    <q-space />
                    <q-btn dense flat icon="close" v-close-popup>
                        <q-tooltip class="bg-white text-primary">Đóng</q-tooltip>
                    </q-btn>
                </q-bar>
                <q-card-section>
                    <div class="text-h4">Chi tiết đơn đặt</div>
                </q-card-section>
                <q-splitter v-model="splitterModel" style="height: 358px">
                    <template v-slot:before>
                        <div class="q-pa-md">
                            <div class="text-h6 q-mb-md">Thông tin đơn đặt</div>
                            <q-card-section class="text-body1">
                                <div class="column">
                                    <div class="row" style="gap: 10px">
                                        <div class="col">
                                            <q-field color="purple-12" label="Mã đơn đặt" stack-label>
                                                <template v-slot:control>
                                                    <div class="self-center full-width no-outline" tabindex="0">
                                                        {{ currentOrderSelected.ORDER_ID }}
                                                    </div>
                                                </template>
                                            </q-field>
                                        </div>
                                        <q-separator />
                                        <div class="col">
                                            <q-field color="purple-12" label="Thời gian đặt" stack-label>
                                                <template v-slot:control>
                                                    <div class="self-center full-width no-outline" tabindex="0">{{
                                                        dayjs(currentOrderSelected.ORDER_TIME).format('DD/MM/YYYY HH:mm:ss')
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
                                                        {{ currentOrderSelected.METHOD }}
                                                    </div>
                                                </template>
                                            </q-field>
                                        </div>
                                        <q-separator />
                                        <div class="col">
                                            <q-field color="purple-12" label="Phí vận chuyển" stack-label>
                                                <template v-slot:control>
                                                    <div class="self-center full-width no-outline" tabindex="0">{{
                                                        VNDCurrencyFormatter.formatToVND(currentOrderSelected.SHIP_PRICE) }}
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
                                                        {{ getStatus(currentOrderSelected.STATUS) }}
                                                    </div>
                                                </template>
                                            </q-field>
                                        </div>
                                        <q-separator />
                                        <div class="col">
                                            <q-field color="purple-12" label="Phê duyệt" stack-label>
                                                <template v-slot:control>
                                                    <div class="self-center full-width no-outline" tabindex="0">{{
                                                        getApproveStatus(currentOrderSelected.IS_APPROVE) }}
                                                    </div>
                                                </template>
                                            </q-field>
                                        </div>
                                    </div>
                                    <div class="row" style="gap: 10px">
                                        <div class="col">
                                            <q-field color="purple-12" label="Người duyệt" stack-label>
                                                <template v-slot:control>
                                                    <div class="self-center full-width no-outline" tabindex="0">
                                                        {{ currentOrderSelected.EMPLOYEE ?
                                                            currentOrderSelected.EMPLOYEE.EMPLOYEE_NAME : "Chưa có" }}
                                                    </div>
                                                </template>
                                            </q-field>
                                        </div>
                                    </div>
                                </div>
                            </q-card-section>
                        </div>
                    </template>
                    <template v-slot:after>
                        <div class="q-pa-md">
                            <div class="text-h6 q-mb-md">Thông tin người dùng</div>
                            <q-card class="my-card" flat bordered>
                                <q-item>
                                    <q-item-section avatar>
                                        <q-avatar>
                                            <img
                                                :src="currentOrderSelected.CLIENT.IMAGE ? currentOrderSelected.CLIENT.IMAGE.IMAGE_URL : 'https://cdn.quasar.dev/img/boy-avatar.png'">
                                        </q-avatar>
                                    </q-item-section>
                                    <q-item-section>
                                        <q-item-label>
                                            {{ currentOrderSelected.CLIENT.USER_NAME }}
                                            <q-icon color="primary" :name="currentOrderSelected.SEX ? 'male' : 'female'" />
                                        </q-item-label>
                                        <q-item-label caption>
                                            {{ dayjs(currentOrderSelected.CLIENT.BIRTH_DAY).format('DD/MM/YYYY') }}
                                        </q-item-label>
                                    </q-item-section>
                                </q-item>
                                <q-separator />
                                <q-card-section>
                                    <q-list bordered>
                                        <q-item class="row justify-between">
                                            <div class="row justify-between" style="width: 100%;">
                                                <q-item-section avatar>
                                                    Họ:
                                                </q-item-section>
                                                <q-item-section>
                                                    {{ currentOrderSelected.CLIENT.FIRST_NAME }}
                                                </q-item-section>
                                                <q-separator vertical />
                                                <q-item-section avatar>
                                                    Tên:
                                                </q-item-section>
                                                <q-item-section>{{ currentOrderSelected.CLIENT.LAST_NAME }}</q-item-section>
                                            </div>
                                        </q-item>
                                        <q-separator />
                                        <q-item>
                                            <q-item-section avatar>
                                                <q-icon color="primary" name="email" />
                                            </q-item-section>
                                            <q-item-section>{{ currentOrderSelected.CLIENT.EMAIL }}</q-item-section>
                                        </q-item>
                                        <q-separator />
                                        <q-item>
                                            <q-item-section avatar>
                                                <q-icon color="primary" name="phone" />
                                            </q-item-section>
                                            <q-item-section>{{ currentOrderSelected.CLIENT.PHONE }}</q-item-section>
                                        </q-item>
                                        <q-separator />
                                        <q-item>
                                            <q-item-section avatar>
                                                Trạng thái:
                                            </q-item-section>
                                            <q-item-section>{{ currentOrderSelected.CLIENT.IS_DISABLED ? "Bị vô hiệu": "Hiện hành" }}</q-item-section>
                                        </q-item>
                                    </q-list>
                                </q-card-section>
                            </q-card>
                        </div>
                    </template>
                </q-splitter>
                <q-separator />
                <q-card-section>
                    <div class="text-h6">Chi tiết đơn đặt</div>

                </q-card-section>
            </q-card>
        </q-dialog>
        <!-- row-key (tr) lay trong row => la ten cua row nha -->
        <q-table title="Treats" selection="multiple" v-model:selected="selected" :rows="rows" :columns="columns"
            row-key="ORDER_ID" :loading="loading" :filter="filter" :filter-method="filterProduct"
            no-data-label="I didn't find anything for you" no-results-label="The filter didn't uncover any results"
            separator="cell">
            <template v-slot:top>
                <q-btn color="primary" :disable="loading" label="Duyệt" @click="approve" />
                <q-btn class="q-ml-sm" color="negative" :disable="loading" @click="reject" label="Từ chối" />
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
            <template v-slot:header>
                <q-tr>
                    <q-th />
                    <q-th v-for="col in columns" :key="col.name">
                        {{ col.label }}
                    </q-th>
                </q-tr>
            </template>
            <template v-slot:body="props">
                <q-tr :props="props">
                    <q-td>
                        <q-checkbox v-model="props.selected" :disable="parseInt(props.row.IS_APPROVE.value) !== 0" />
                    </q-td>
                    <!-- value in row -->
                    <q-td key="id" :props="props">
                        {{ props.row.ORDER_ID }}
                    </q-td>
                    <q-td key="address" :props="props">
                        {{ props.row.ADDRESS }}
                    </q-td>
                    <q-td key="client" :props="props">
                        {{ props.row.CLIENT_NAME }}
                    </q-td>
                    <q-td key="orderTime" :props="props">
                        {{ props.row.ORDER_TIME }}
                    </q-td>
                    <q-td key="method" :props="props">
                        {{ props.row.METHOD }}
                    </q-td>
                    <q-td key="shipPrice" :props="props">
                        {{ VNDCurrencyFormatter.formatToVND(props.row.SHIP_PRICE) }}
                    </q-td>
                    <q-td key="status" :props="props">
                        {{ props.row.STATUS }}
                    </q-td>
                    <q-td key="approve" :props="props">
                        <!-- v model in popup edit bindding with q-select -->
                        <!-- <q-popup-edit v-model="props.row.IS_APPROVE" v-slot="scope">
                            <q-select outlined v-model="scope.value" :options="statuses" label="Duyệt đơn"
                                @keyup.enter="scope.set">
                                <template v-slot:after>
                                    <q-btn flat dense color="negative" icon="cancel" @click.stop.prevent="scope.cancel" />
                                    <q-btn flat dense color="positive" :value="scope.value" @click="test" id="test"
                                        icon="check_circle" @click.stop.prevent="scope.set"
                                        :disable="scope.validate(scope.value) === false || scope.initialValue === scope.value" />
                                </template>
                            </q-select>
                        </q-popup-edit> -->
                        {{ props.row.IS_APPROVE.label }}
                    </q-td>
                    <q-td key="admin" :props="props">
                        {{ props.row.EMPLOYEE ? props.row.EMPLOYEE.EMPLOYEE_NAME : null }}
                    </q-td>
                    <q-td>
                        <q-icon @click="openDetail" :id="props.row.ORDER_ID + ' detail'" name="preview"
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
        <!-- <div class="q-mt-md">
            Selected: {{ JSON.stringify(selected) }}
        </div> -->
    </div>
</template>
    
<script setup>
import { ref, watch, onMounted, computed } from 'vue'
import { exportFile, useQuasar } from 'quasar'
import _ from 'lodash'
import OrderAPI from '../../api/OrderAPI/OrderAPI'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import VNDCurrencyFormatter from '../../util/VNDCurrencyFormatter'
import dayjs from 'dayjs'
const $q = useQuasar()

const columns = [
    { name: 'id', align: 'center', label: 'Mã đơn hàng', field: 'id', sortable: true, },
    { name: 'address', align: 'center', label: 'Địa chỉ giao', field: 'address' },
    { name: 'client', align: 'center', label: 'Tên tài khoản', field: 'client' },
    { name: 'orderTime', align: 'center', label: 'Thời gian đặt', field: 'orderTime', sortable: true, },
    { name: 'method', label: 'Phương thức', field: 'method' },
    { name: 'shipPrice', label: 'Phí vận chuyển', field: 'shipPrice' },
    { name: 'status', align: 'center', label: 'Trạng thái', field: 'status' },
    { name: 'approve', align: 'center', label: "Phê duyệt", field: "approve" },
    { name: 'admin', label: 'Người duyệt', field: 'admin' },
    { name: '', label: '' },
]

const rows = ref([])
const loading = ref(true)
const filter = ref('')
const selected = ref([])
const orders = ref([])
const detail = ref(false)
const currentOrderSelected = ref(null)
const splitterModel = ref(70)
const statuses = [
    {
        label: "Phê duyệt",
        value: 1
    },
    {
        label: "Từ chối",
        value: 0
    }
]
function test(e) {
    console.log(e.target.value)
}
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
function openDetail(e) {
    const id = e.currentTarget.id.split(' ')
    const orderId = id[0]
    console.log(orderId);
    const orderFound = orders.value.find(order => parseInt(order.ORDER_ID) === parseInt(orderId))
    currentOrderSelected.value = orderFound
    console.log(orderFound);
    detail.value = true
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

function getAddress(data) {
    const result = data.ADDRESS_DETAIL + ',  ' + data.VILLAGE.VILLAGE_NAME + ',  ' + data.VILLAGE.DISTRICT.DISTRICT_NAME + ',  ' + data.VILLAGE.DISTRICT.PROVINCE.PROVINCE_NAME;
    return result;
}
const fetchAPI = () => {
    loading.value = true
    OrderAPI.getAll().then(res => {
        orders.value = res.data
        rows.value = _.map(res.data, order => {
            const address = getAddress(order.ADDRESS)
            const status = getStatus(order.STATUS)
            const approve =
            {
                label: getApproveStatus(order.IS_APPROVE),
                value: order.IS_APPROVE
            }
            const day = dayjs(order.ORDER_TIME).format('DD/MM/YYYY HH:mm:ss') // display
            const result = {
                "ORDER_ID": order.ORDER_ID,
                "ADDRESS": address,
                "CLIENT_NAME": order.CLIENT.USER_NAME,
                "ORDER_TIME": day,
                "METHOD": order.METHOD,
                "SHIP_PRICE": order.SHIP_PRICE,
                "STATUS": status,
                "IS_APPROVE": approve
            }
            return result
        })
        loading.value = false
        selected.value = []
    }).catch(err => {
        console.log(err)
    })
}
onMounted(() => {
    fetchAPI()
})
function approve() {
    const orderIds = selected.value.map(item => item.ORDER_ID)
    if (orderIds.length === 0) {
        return
    }
    $q.dialog({
        dark: true,
        title: 'Xác nhận',
        message: 'Bạn có chắc chắn từ chối các đơn này?',
        cancel: true,
        persistent: true
    }).onOk(() => {
        const data = {
            orderIds,
            isApprove: 1
        }
        OrderAPI.approve(data)
            .then(() => {
                fetchAPI()
            })

    }).onCancel(() => {
    }).onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
    })
}
function reject() {
    const orderIds = selected.value.map(item => item.ORDER_ID)
    if (orderIds.length === 0) {
        return
    }
    $q.dialog({
        dark: true,
        title: 'Xác nhận',
        message: 'Bạn có chắc chắn duyệt các đơn này?',
        cancel: true,
        persistent: true
    }).onOk(() => {
        const data = {
            orderIds,
            isApprove: 2
        }
        OrderAPI.approve(data)
            .then(() => {
                fetchAPI()
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
        return rows.filter(order => {
            if (order.ADDRESS.includes(lowercaseFilter)) {
                return true
            } else if (order.CLIENT_NAME && order.CLIENT_NAME.toLowerCase().includes(lowercaseFilter)) {
                return true
            } else if (order.METHOD && order.METHOD.toLowerCase().includes(lowercaseFilter)) {
                return true
            } else if (order.SHIP_PRICE && order.SHIP_PRICE.toLowerCase().includes(lowercaseFilter)) {
                return true
            } else if (order.IS_APPROVE && order.IS_APPROVE.label.toLowerCase().includes(lowercaseFilter)) {
                return true
            } else if (order.STATUS && order.STATUS.toLowerCase().includes(lowercaseFilter)) {
                return true
            }
        })
    } else {
        return rows
    }
}
</script>
    