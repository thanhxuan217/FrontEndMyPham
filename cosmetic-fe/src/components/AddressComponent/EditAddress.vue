<script setup>
import { reactive, watch, nextTick, computed, ref } from 'vue'
import { onMounted, defineProps } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useAddressStore } from '../../store/AddressStore';
import AddressAPI from '../../api/AddressAPI/AddressAPI'
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
const addressStore = useAddressStore()
const props = defineProps({
    address: Object
})
let isInitDistrict = 0
let isInitVillage = 0
const route = useRoute()
const provinces = ref([])
const state = reactive({
    name: '',
    phone: '',
    currentVillageId: '',
    currentDistrictId: '',
    currentProvinceId: '',
    isDefault: false,
    addressDetail: ''
})

const getDistricts = computed(() => {
    if (state.currentProvinceId.length === 0) {
        return []
    }
    // luc đổi tỉnh => reset district id to first and
    const provinceFound = provinces.value.find(province => parseInt(province.PROVINCE_ID) === parseInt(state.currentProvinceId))
    if (provinceFound) {
        // if first init => continue
        if (isInitDistrict !== 0) {
            if (provinceFound.districts.length) {
                state.currentDistrictId = provinceFound.districts[0].DISTRICT_ID
            } else {
                state.currentDistrictId = ''
            }
        } else {
            isInitDistrict = 1
        }
        return provinceFound.districts
    } else {
        return []
    }
})

const getVillages = computed(() => {
    if (state.currentDistrictId.length === 0) {
        return []
    }
    const districtFound = getDistricts.value.find(district => parseInt(district.DISTRICT_ID) === parseInt(state.currentDistrictId))
    if (districtFound) {
        if (isInitVillage !== 0) {
            if (districtFound.villages.length) {
                state.currentVillageId = districtFound.villages[0].VILLAGE_ID
            } else {
                state.currentVillageId = ''
            }
        } else {
            isInitVillage = 1
        }
        return districtFound.villages
    } else {
        return []
    }
})
async function saveAddress() {
    const data = {
        name: state.name,
        phone: state.phone,
        villageId: state.currentVillageId,
        isDefault: state.isDefault,
        addressDetail: state.addressDetail,
        addressId: props.address.ADDRESS_ID
    }
    await AddressAPI.updateAddress(data)
        .then(res => {
            toast.success("Sửa địa chỉ thành công!", { theme: 'colored' })
            addressStore.getAllAddress()
            addressStore.closeEdit()
        }).catch(err => {
            toast.error(err.response.data, { theme: 'colored' })
        })
}
onMounted(() => {
    AddressAPI.getAllProvince()
        .then(res => {
            provinces.value = res.data
        })
    state.currentProvinceId = props.address.VILLAGE.DISTRICT.PROVINCE.PROVINCE_ID
    state.currentDistrictId = props.address.VILLAGE.DISTRICT.DISTRICT_ID
    state.currentVillageId = props.address.VILLAGE.VILLAGE_ID
    state.name = props.address.CLIENT_NAME
    state.phone = props.address.PHONE
    state.isDefault = props.address.IS_DEFAULT
    state.addressDetail = props.address.ADDRESS_DETAIL
})
</script>
<template>
    <div class="add-address-form">
        <div class="form">
            <div class="title">
                Chỉnh sửa địa chỉ
            </div>
            <div class="content">
                <div class="row">
                    <div class='my-input'>
                        <label></label>
                        <input placeholder="Họ tên" class="split" v-model="state.name" />
                        <label class='error'></label>
                    </div>
                    <div class='my-input'>
                        <label></label>
                        <input placeholder="Số điện thoại" class="split" v-model="state.phone" />
                        <label class='error'></label>
                    </div>
                </div>
                <div class="row row-select">
                    <div class='group-select'>
                        <label></label>
                        <select class='select add-address-select' v-model="state.currentProvinceId">
                            <option value="" disabled>
                                Chọn tỉnh/thành phố
                            </option>
                            <option :value="province.PROVINCE_ID" v-for="province in provinces">
                                {{ province.PROVINCE_NAME }}
                            </option>
                        </select>
                        <label></label>
                    </div>
                    <div class='group-select'>
                        <label></label>
                        <select class='select add-address-select' v-model="state.currentDistrictId">
                            <option disabled value="">
                                Chọn quận/huyện
                            </option>
                            <option :value="district.DISTRICT_ID" v-for="district in getDistricts">
                                {{ district.DISTRICT_NAME }}
                            </option>
                        </select>
                        <label></label>
                    </div>
                </div>
                <div class="row row-select">
                    <div class='group-select'>
                        <label></label>
                        <select class='select add-address-select' v-model="state.currentVillageId">
                            <option disabled value="">
                                Chọn Xã/Phường
                            </option>
                            <option :value="village.VILLAGE_ID" v-for="village in getVillages">
                                {{ village.VILLAGE_NAME }}
                            </option>
                        </select>
                        <label></label>
                    </div>
                    <div class='checkbox'>
                        <label>Đặt làm mặc định</label>
                        <input type="checkbox" v-model="state.isDefault" />
                    </div>
                </div>
                <div class="row">
                    <div class='my-input'>
                        <label></label>
                        <input placeholder="Địa chỉ cụ thể" class="full" v-model="state.addressDetail" />
                        <label class='error'></label>
                    </div>
                </div>
                <div class="row">
                    <div class="group-btn">
                        <button class="return" @click="addressStore.closeEdit">Quay lại</button>
                        <button class="luu" @click="saveAddress">Lưu</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
.add-address-form {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9999;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.4);
}

.row-select {
    gap: 19px
}

.form {
    display: flex;
    flex-direction: column;
    padding: 30px;
    background-color: #fff;
    box-shadow: 0 2px 4px rgb(0 0 0 / 54%);
    border-radius: 3px;
    width: 500px;
    gap: 20px
}

.form .title {
    font-size: 20px;
}

.form .content .row .add-address-select {
    width: 231px;
}

.form .content .row {
    display: flex;
    align-items: center;
}

.form .content .row .checkbox {
    display: flex;
    align-items: center;
    gap: 15px
}

.form .content .row .checkbox input {
    margin-top: 8px;
}

.form .content .row .split {
    width: 200px;
}

.form .content .row .full {
    width: 464px;
}

.form .content .row .group-btn {
    display: flex;
    gap: 15px;
    width: 100%;
    margin-top: 20px;
    justify-content: flex-end;
}

.form .content .row .group-btn button {
    padding: 10px 15px;
    color: white;
    cursor: pointer;
}

.form .content .row .group-btn .luu {
    border: solid 1px #d4762a;
    background-color: #d4762a;
    border-radius: 3px;
}

.form .content .row .group-btn .return {
    border: solid 1px white;
    border-radius: 3px;
    background-color: white;
    color: black;
}

.add-address-content {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.add-address-content .row {
    display: flex;
    flex-direction: row;
    border-bottom: 1px solid rgb(219, 208, 208);
    padding-top: 15px;
    padding-bottom: 15px;
}

.add-address-content .row-bottom {
    padding-bottom: 30px;
}

.add-address-content .group-btn {
    justify-content: flex-end;
    align-items: center;
    gap: 15px;
    border-bottom: none;
}

.add-address-content .row .go-back {
    background-color: white;
    color: black;
}

.add-address-content .row .left-column {
    flex-basis: 33%;
    font-size: 16px;
}

.add-address-content .row .right-column {
    flex-basis: 66%;
    display: flex;
    flex-direction: column;
}

.add-address-content .row .right-column .group-2 {
    display: flex;
    flex-direction: row;
    gap: 30px;
}

.add-address-content .row .right-column .bot {
    margin-bottom: 15px;
}
</style>
