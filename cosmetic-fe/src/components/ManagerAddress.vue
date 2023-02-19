<script setup>
import 'vue-slider-component/theme/antd.css'
import { reactive, watch, nextTick, computed, ref } from 'vue'
import { onMounted } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import AddAddress from './AddressComponent/AddAddress.vue'
import EditAddress from './AddressComponent/EditAddress.vue'
import { useAddressStore } from '../store/AddressStore'
import AddressAPI from '../api/AddressAPI/AddressAPI'
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
const route = useRoute()
const addressStore = useAddressStore()
const editAddress = ref(null)
const addresses = ref([])
const allAddresses = computed(() => {
    return addressStore.addresses
})
async function showEditAddress(e) {
    const id = e.target.id.split(' ')[0]
    console.log(id)
    await AddressAPI.getAddressById(id)
        .then(res => {
            console.log(res.data)
            editAddress.value = res.data
            addressStore.showEdit()
        })
}
async function setDefault(e) {
    const id = e.target.id.split(' ')[0]
    await AddressAPI.updateDefault(id)
        .then(res => {
            toast.success("Cập nhật thành công!", { theme: 'colored' })
            addressStore.getAllAddress()
        })
        .catch(err => {
            toast.error(err.response.data, { theme: 'colored' })
        })
}
async function deleteAddress(e) {
    const id = e.target.id.split(' ')[0]
    if (confirm("Bạn có chắc chắn") == true) {
        await AddressAPI.deleteAddress(id)
            .then(res => {
                toast.success("Xoá thành công!", { theme: 'colored' })
                addressStore.getAllAddress()
            })
            .catch(err => {
                toast.error(err.response.data, { theme: 'colored' })
            })
    }
}
onMounted(() => {
    addressStore.getAllAddress()
})
</script>
<template>
    <div class="change-userinfo-form">
        <vue-confirm-dialog></vue-confirm-dialog>
        <AddAddress v-show="addressStore.isShow" />
        <EditAddress v-if="addressStore.showEditAddress" :address="editAddress" />
        <div class='change-userinfo-form-right-container all-address'>
            <label>

            </label>
            <div class='title address-header'>
                <div>Địa chỉ của tôi</div>
                <button class='add-address' @click="addressStore.showAddAddress">Thêm địa chỉ</button>
            </div>
            <div class='content'>
                <div class='address-container' v-for="address in allAddresses">
                    <div class='address-container-content'>
                        <div class='top-address'>
                            <div class='userName'>{{ address.CLIENT_NAME }}&nbsp;
                                <label class='phone'>|</label>
                                &nbsp;
                            </div>
                            <div class='phone'>{{ address.PHONE }}</div>
                        </div>
                        <div class='bot-address'>
                            <div class='address-detail'>{{ address.ADDRESS_DETAIL }}</div>
                            <div class='isDefault' v-if="address.IS_DEFAULT">Mặc định</div>
                        </div>
                    </div>
                    <div class='group-btn'>
                        <div class='btn'>
                            <div class='edit' @click="showEditAddress" :id="address.ADDRESS_ID + ' edit'">
                                Chỉnh sửa
                            </div>
                            <div class='edit' :id="address.ADDRESS_ID + ' delete'" @click="deleteAddress" v-if="!address.IS_DEFAULT">
                                Xoá
                            </div>
                        </div>
                        <button class='setDefault' :disabled="address.IS_DEFAULT" :id="address.ADDRESS_ID + ' default'"
                            @click="setDefault">
                            Thiết lập mặc định
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
.change-userinfo-form {
    display: flex;
    padding: 30px 50px;
    min-height: 500px;
    gap: 20px;
    font-size: 16px;
}

.change-userinfo-form .left-container {
    flex-basis: 15%;
    border-right: 1px solid rgba(227, 220, 220, 0.817);
    padding: 30px 50px;
    box-shadow: 0 0 35px 0 rgb(224, 220, 220);
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.change-userinfo-form .left-container .active {
    color: red;
}

.change-userinfo-form .left-container .title {
    font-weight: bold;
    padding-bottom: 25px;
}

.change-userinfo-form .left-container .feature {
    display: flex;
    gap: 10px
}

.change-userinfo-form .left-container .feature .feature-icon {
    margin-top: 1.5px;
}

.change-userinfo-form .left-container .feature .feature-text {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.change-userinfo-form-right-container {
    flex-basis: 85%;
    flex-grow: 2;
    background-color: white;
    border: 1px solid white;
    border-radius: 10px;
    padding: 30px 50px;
    box-shadow: 0 0 35px 0 rgb(196, 193, 193);
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.change-userinfo-form-right-container .title {
    padding-bottom: 15px;
    border-bottom: 1px solid rgb(219, 208, 208);
    font-weight: bold;
    text-transform: capitalize;
    font-size: 18px;
}

.change-userinfo-form-right-container .content {}

.all-address .address-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 15px;
    border-bottom: solid 1px rgb(226, 222, 222);
}

.all-address .content {
    display: flex;
    gap: 15px;
    flex-direction: column;
    margin-top: 15px;
}

.all-address .address-header .add-address {
    color: white;
    background-color: #909b6b;
    padding: 13px 20px;
    border: 1px solid #909b6b;
    border-radius: 3px;
    cursor: pointer;
    font-size: 14px;
}

.all-address .address-container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
}

.all-address .address-container .address-container-content {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.all-address .address-container .group-btn {
    display: flex;
    gap: 10px;
    flex-direction: column;
    align-self: flex-start;
}

.all-address .address-container .group-btn .btn {
    display: flex;
    flex-direction: row;
    gap: 10px;
    justify-content: flex-end;
}

.address-container .group-btn .btn .edit {
    cursor: pointer;
    display: flex;
    justify-content: center;
    text-decoration: none;
    color: black;
    margin-top: 1px;
    color: blue;
}

.all-address .address-container .group-btn .setDefault {
    border: 1px solid rgb(183, 180, 180);
    padding: 8px 10px;
    border-radius: 5px;
    background-color: white;
    cursor: pointer;
}

.all-address .address-container .address-container-content .top-address {
    display: flex;
}

.all-address .address-container .address-container-content .top-address .userName {
    font-weight: 500;
}

.all-address .address-container .address-container-content .top-address .phone {
    color: rgba(0, 0, 0, .54);
}

.all-address .address-container .address-container-content .bot-address {
    display: flex;
    gap: 15px;
    flex-direction: column;
}

.all-address .address-container .address-container-content .bot-address .isDefault {
    border: solid 1px red;
    padding: 5px 10px;
    width: fit-content;
    border-radius: 5px;
    font-weight: 500;
    color: red;
}
</style>
