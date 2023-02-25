<script setup>
import { reactive, watch, nextTick, computed, ref } from 'vue'
import { onMounted, defineProps } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useAddressStore } from '../../store/AddressStore';
import AddressAPI from '../../api/AddressAPI/AddressAPI'
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import ShipPriceAPI from '../../api/ShipPriceAPI/ShipPriceAPI'
import { walkIdentifiers } from '@vue/compiler-core';
const route = useRoute()
const props = defineProps({
    addresses: Array,
    currentAddress: Object,
    loading: Boolean
})
const currentAddressId = ref(null)
const emit = defineEmits(['closeChangeAddress', 'changeAddress', 'changeShipDetail'])
function getAddress(data) {
    const result = data.ADDRESS_DETAIL + ',  ' + data.VILLAGE.VILLAGE_NAME + ',  ' + data.VILLAGE.DISTRICT.DISTRICT_NAME + ',  ' + data.VILLAGE.DISTRICT.PROVINCE.PROVINCE_NAME;
    return result;
}
onMounted(() => {
    currentAddressId.value = props.currentAddress.ADDRESS_ID
})
function closeChangeAddress() {
    // emit => call function in parent
    emit('closeChangeAddress')
}
const getCurrentAddressId = computed(() => {
    return props.currentAddress.ADDRESS_ID
})
watch(currentAddressId, async (newAddressId, oldAddressId) => {
    emit('changeAddress', newAddressId)
})
</script>
<template>
    <div class="add-address-form" v-if="!props.loading">
        <div class="form">
            <div class="title">
                <div>
                    Chọn địa chỉ
                </div>
                <div class="close" @click="closeChangeAddress">
                    x
                </div>
            </div>
            <div class="content">
                <div class="row" v-for="address in props.addresses">
                    <div className='detail'>
                        <div className='userName'>
                            {{ address.CLIENT_NAME }}
                            &nbsp;|&nbsp;
                            {{ address.PHONE }}
                        </div>
                        <div className='address'>
                            {{ getAddress(address) }}
                        </div>
                        <div v-if="address.IS_DEFAULT" class="default">
                            Mặc định
                        </div>
                    </div>
                    <div className='radio-box'>
                        <input 
                            type='radio' 
                            :key="address.ADDRESS_ID + 'checkbox'"
                            name='radio-address' 
                            v-model="currentAddressId"
                            :value="address.ADDRESS_ID" 
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="add-address-form" v-else>
        <div class="form">
            <div class="title">
                <div>
                    Chọn địa chỉ
                </div>
                <div class="close" @click="closeChangeAddress">
                    x
                </div>
            </div>
            <div class="content">
                <div class="row" v-for="address in props.addresses">
                    <div className='detail'>
                        <div className='userName'>
                            {{ address.CLIENT_NAME }}
                            &nbsp;|&nbsp;
                            {{ address.PHONE }}
                        </div>
                        <div className='address'>
                            {{ getAddress(address) }}
                        </div>
                        <div v-if="address.IS_DEFAULT" class="default">
                            Mặc định
                        </div>
                    </div>
                    <div className='radio-box'>
                        <input type='radio' :checked="parseInt(getCurrentAddressId) === parseInt(address.ADDRESS_ID)"
                            name='radio-address' :value="address.ADDRESS_ID" :disabled="props.loading" />
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
    gap: 35px
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

.form .content {
    display: flex;
    flex-direction: column;
    gap: 10px
}

.form .title {
    font-size: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.row .detail .userName {
    font-weight: bold;

}

.row .detail .default {
    color: red;

}

.form .title .close {
    cursor: pointer;
}

.form .content .row .add-address-select {
    width: 231px;
}

.form .content .row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: solid 1px rgb(222, 216, 216);
    padding: 15px 0px;
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
