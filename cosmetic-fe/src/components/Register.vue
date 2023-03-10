<script setup>
import 'vue-slider-component/theme/antd.css'
import { reactive, watch, nextTick, computed, ref } from 'vue'
import { onMounted } from 'vue'

const emit = defineEmits(['closeQuickView'])

onMounted(() => {

})
function close() {
    emit('closeQuickView')
}
</script>
<template>
    <div class="quick-view-content">
        <div class="white-space">

        </div>
        <div class="quick-view-right">
            <div class="btn-close" @click="close">
                X
            </div>
            <div class="content">
                <div class="title">
                    Đăng ký
                </div>
                <div class="group-input">
                    <div class='my-input'>
                        <label>Tên tài khoản:</label>
                        <input placeholder="Tên tài khoản" class="split" />
                        <label class='error'></label>
                    </div>
                    <div class='my-input'>
                        <label>Email:</label>
                        <input placeholder="Email" class="split" />
                        <label class='error'></label>
                    </div>
                    <div class='my-input'>
                        <label>Mật khẩu:</label>
                        <input placeholder="Mật khẩu" class="split" type="password" />
                        <label class='error'></label>
                    </div>
                    <div class='my-input'>
                        <label>Nhập lại mật khẩu:</label>
                        <input placeholder="Nhập lại mật khẩu" class="split" type="password"/>
                        <label class='error'></label>
                    </div>
                    <div class='register'>
                        <button class="">Đăng ký</button>
                    </div>
                </div>

            </div>
        </div>

    </div>
</template>
<style scoped>
.quick-view-content {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 99999;
    display: flex;
    justify-content: flex-end;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.4);
}

.quick-view-content .content {
    background-color: white;
    padding: 50px 30px;
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 93%;
}

.quick-view-content .content .title {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 30px 20px;
    font-weight: bold;
    font-size: 18px;
    text-transform: uppercase;
}

.quick-view-content .content .group-input {
    display: flex;
    padding: 15px 15px;
    flex-direction: column;
}

.quick-view-content .quick-view-right {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 5px
}

.quick-view-content .quick-view-right .btn-close {
    align-self: flex-start;
    border-radius: 50%;
    background-color: white;
    padding: 10px;
    height: 20px;
    width: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    margin-top: 5px;
    cursor: pointer;
}

.quick-view-content .white-space {
    flex-grow: 2;
}

.my-input input {
    width: 300px;
}

.register {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin-top: 30px;
}

.register button {
    padding: 15px 15px;
    border-radius: 3px;
    width: 100%;
    background-color: #909b6b;
    border: 1px solid #909b6b;
    color: white;
}
</style>
