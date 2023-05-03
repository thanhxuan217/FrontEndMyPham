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
                                        <!-- <div class="col">
                                            <q-field color="purple-12" label="Phê duyệt" stack-label>
                                                <template v-slot:control>
                                                    <div class="self-center full-width no-outline" tabindex="0">{{
                                                        getApproveStatus(currentOrderSelected.IS_APPROVE) }}
                                                    </div>
                                                </template>
                                            </q-field>
                                        </div> -->
                                    </div>
                                    <div class="row" style="gap: 10px">
                                        <div class="col">
                                            <q-field color="purple-12" label="Tổng tiền hàng" stack-label>
                                                <template v-slot:control>
                                                    <div class="self-center full-width no-outline" tabindex="0">
                                                        {{ VNDCurrencyFormatter.formatToVND(getSumOfOrder) }}
                                                    </div>
                                                </template>
                                            </q-field>
                                        </div>
                                        <q-separator />
                                        <div class="col">
                                            <q-field color="purple-12" label="Người duyệt" stack-label>
                                                <template v-slot:control>
                                                    <div class="self-center full-width no-outline" tabindex="0"
                                                        style="color: ;">
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
                                            <q-item-section>{{ currentOrderSelected.CLIENT.IS_DISABLED ? "Bị vô hiệu" :
                                                "Hiện hành" }}</q-item-section>
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
                    <q-list bordered>
                        <q-item v-for="orderDetail in getOrderDetails">
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

                </q-card-section>
            </q-card>
        </q-dialog>
        <q-tabs v-model="tab" narrow-indicator dense class="text-grey" active-color="primary" indicator-color="primary"
            align="justify">
            <q-tab name="0" label="Tất cả" />
            <q-tab name="1" label="Chưa duyệt" />
            <q-tab name="2" label="Đã duyệt" />
            <q-tab name="3" label="Đã thanh toán" />
            <q-tab name="4" label="Đang chuẩn bị hàng" />
            <q-tab name="5" label="Đang giao" />
            <q-tab name="6" label="Đã hoàn thành" />
            <q-tab name="7" label="Đã huỷ" />
        </q-tabs>
        <q-separator />
        <!-- row-key (tr) lay trong row => la ten cua row nha -->
        <q-table :key="Math.floor(Math.random() * 10) + 1" selection="multiple" v-model:selected="selected"
            class="admin-table" title="Danh sách đơn hàng" :rows="rows" :columns="columns" row-key="ORDER_ID"
            :loading="loading" :filter="filter" :filter-method="filterProduct"
            no-data-label="I didn't find anything for you" no-results-label="The filter didn't uncover any results"
            separator="cell">
            <template v-slot:top>
                <div class="row items-center" style="justify-content: space-between;width: 100%;">
                    <!-- <div style="min-width: 250px; max-width: 300px">
                        <q-badge color="secondary" class="q-mb-md">
                            Lọc theo trạng thái:
                        </q-badge>
                        <q-select filled v-model="filterStatus" :options="statusesOption">
                            <template v-slot:prepend>
                                <q-icon name="filter_alt" />
                            </template>
                        </q-select>
                    </div> -->
                    <div style="min-width: 250px; max-width: 300px">
                        <q-btn color="primary" :disable="loading" label="Duyệt" @click="approve" />
                    </div>
                    <!-- <q-btn color="primary" :disable="loading" label="Duyệt" @click="approve" />
                <q-btn class="q-ml-sm" color="negative" :disable="loading" @click="reject" label="Từ chối" />
                <q-space /> -->
                    <q-input dense debounce="300" v-model="filter" placeholder="Tìm kiếm...">
                        <template v-slot:append>
                            <q-icon name="search" />
                        </template>
                    </q-input>
                </div>
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
                    <q-th></q-th>
                    <q-th v-for="col in columns" :key="col.name">
                        {{ col.label }}
                    </q-th>
                </q-tr>
            </template>
            <template v-slot:body="props">
                <q-tr :props="props">
                    <q-td>
                        <q-checkbox v-model="props.selected"
                            :disable="6 === parseInt(props.row.STATUS.value) || 7 === parseInt(props.row.STATUS.value)" />
                    </q-td>
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
                    <q-td key="sum" :props="props">
                        {{ VNDCurrencyFormatter.formatToVND(props.row.SUM) }}
                    </q-td>
                    <q-td key="status" :props="props">
                        {{ props.row.STATUS.label }}
                        <!-- <select @change="handleChangeSelect" :id="props.row.ORDER_ID + ' select'" class="my-select"
                            :disabled="6 === parseInt(props.row.STATUS.value) || 7 === parseInt(props.row.STATUS.value)">
                            <option v-for="status in statuses" :value="status.value"
                                :disabled="parseInt(status.value) !== parseInt(props.row.STATUS.value) + 1"
                                :selected="parseInt(status.value) === parseInt(props.row.STATUS.value)">
                                {{ status.label }}
                            </option>
                        </select> -->
                        <!-- <q-select @input-value="handleChangeSelect"  outlined :model-value="props.row.STATUS" :options="statuses" label="Trạng thái"
                            :option-disable="opt => Object(opt) === opt ? parseInt(opt.value) <= parseInt(props.row.STATUS.value) : true" /> -->
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
    { name: 'sum', label: 'Tổng tiền', field: 'sum' },
    { name: 'status', align: 'center', label: 'Trạng thái', field: 'status' },
    { name: 'admin', align: 'center', label: "Người duyệt", field: "admin" },
    { name: '', label: '' },
]

const filterStatus = ref({
    label: "Tất cả",
    value: 0
})
const rows = ref([])
const loading = ref(true)
const filter = ref('')
const selected = ref([])
const orders = ref([])
const detail = ref(false)
const currentOrderSelected = ref(null)
const splitterModel = ref(70)
const tab = ref("0")
const statuses = [
    {
        label: "Chưa duyệt",
        value: 1
    },
    {
        label: "Đã duyệt",
        value: 2
    },
    {
        label: "Đã thanh toán",
        value: 3
    },
    {
        label: "Đang chuẩn bị hàng",
        value: 4
    },
    {
        label: "Đang giao",
        value: 5
    },
    {
        label: "Đã hoàn thành",
        value: 6
    },
    {
        label: "Đã huỷ",
        value: 7
    }
]

const statusesOption = [
    {
        label: "Tất cả",
        value: 0
    },
    {
        label: "Chưa duyệt",
        value: 1
    },
    {
        label: "Đã duyệt",
        value: 2
    },
    {
        label: "Đã thanh toán",
        value: 3
    },
    {
        label: "Đang chuẩn bị hàng",
        value: 4
    },
    {
        label: "Đang giao",
        value: 5
    },
    {
        label: "Đã hoàn thành",
        value: 6
    },
    {
        label: "Đã huỷ",
        value: 7
    }
]
function test(e) {
    console.log(e.target.value)
}

// const getAllOrder = computed(() => {
//     if (parseInt(tab.value) === 0) {
//         return rows.value
//     }
//     const result = rows.value.filter(row => parseInt(tab.value) === parseInt(row.STATUS.value))
//     return result
// })

watch(tab, (newTab) => {
    fetchAPI()
})

function getStatus(value) {
    const result = statuses.find(status => parseInt(status.value) === parseInt(value))
    return result.label
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

const getOrderDetails = computed(() => {
    if (currentOrderSelected.value) {
        return currentOrderSelected.value.order_details
    }
})

const getSumOfOrder = computed(() => {
    if (currentOrderSelected.value) {
        let sum = 0
        currentOrderSelected.value.order_details.forEach(orderDetail => {
            sum += parseFloat(orderDetail.PRICE)
        })
        return sum
    }
})

const fetchAPI = () => {
    loading.value = true
    OrderAPI.getAll().then(res => {
        orders.value = res.data
        const allRows = _.map(res.data, order => {
            const address = getAddress(order.ADDRESS)
            const status = statuses.find(status => parseInt(status.value) === parseInt(order.STATUS))
            const approve =
            {
                label: getApproveStatus(order.IS_APPROVE),
                value: order.IS_APPROVE
            }
            const day = dayjs(order.ORDER_TIME).format('DD/MM/YYYY HH:mm:ss') // display
            let sum = 0
            order.order_details.forEach(orderDetail => {
                sum += parseFloat(orderDetail.PRICE)
            })
            console.log()
            const result = {
                "ORDER_ID": order.ORDER_ID,
                "ADDRESS": address,
                "CLIENT_NAME": order.CLIENT.USER_NAME,
                "ORDER_TIME": day,
                "METHOD": order.METHOD,
                "SUM": parseFloat(sum) + parseFloat(order.SHIP_PRICE),
                "STATUS": status,
                "EMPLOYEE": order.EMPLOYEE,
            }
            return result
        })
        if (parseInt(tab.value) === 0) {
            rows.value = allRows
        } else {
            console.log(tab.value)
            console.log(allRows)
            const result = allRows.filter(row => parseInt(tab.value) === parseInt(row.STATUS.value))
            console.log(result)
            rows.value = result
        }
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
        message: 'Bạn có chắc chắn duyệt các đơn này?',
        cancel: true,
        persistent: true
    }).onOk(() => {
        OrderAPI.approve(orderIds)
            .then(res => {
                if (parseInt(tab.value) === 2) {
                    tab.value = (parseInt(tab.value) + 2) + ""
                } else if (parseInt(tab.value) !== 0) {
                    tab.value = (parseInt(tab.value) + 1) + ""
                }
            })
        toast.success("Cập nhật thành công!", { theme: 'colored' })
        // if (parseInt(tab.value) === 2) {
        //     tab.value = (parseInt(tab.value) + 2) + ""
        // } else if (parseInt(tab.value) !== 0) {
        //     tab.value = (parseInt(tab.value) + 1) + ""
        // }
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
            } else if (order.STATUS && order.STATUS.label.toLowerCase().includes(lowercaseFilter)) {
                return true
            }
        })
    } else {
        return rows
    }
}

function handleChangeSelect(e) {
    const orderId = e.target.id.split(' ')[0]
    const status = e.target.value
    OrderAPI.updateStatus(
        { orderId, status }
    )
        .then(res => {
            fetchAPI()
            toast.success("Cập nhật thành công!", { theme: 'colored' })
        })
}
</script>
<style scoped>
.my-select {
    padding: 15px 10px;
    outline: none;
    border-radius: 3px;
    border: solid 1px rgb(222, 219, 219);
}

.my-select option {
    font-size: 13px;
    border: none;
}
</style>
    