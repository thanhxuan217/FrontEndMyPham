<script setup>
import 'vue-slider-component/theme/antd.css'
import { reactive, watch, nextTick, computed, ref } from 'vue'
import { onMounted } from 'vue'
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import AuthenticationAPI from '../api/LoginAPI/AuthenticationAPI';
import RegularExpression from '../util/RegularExpression'
const emit = defineEmits(['closeQuickView'])
const userName = ref(null)
const email = ref(null)
const password = ref(null)
const repeatPassword = ref(null)

const useNameError = ref(null)
const emailError = ref(null)
const passwordError = ref(null)
const repeatPasswordError = ref(null)
onMounted(() => {

})
function close() {
    emit('closeQuickView')
}
function register(e) {
    const button = e.target
    if (!RegularExpression.checkUserName(userName.value)) {
        toast.error("Tên tài phải có ít nhất 8 ký tự và không chứa ký tự đặc biệt!", { theme: 'colored' })
        useNameError.value = "Tên tài phải có ít nhất 8 ký tự và không chứa ký tự đặc biệt!"
        return
    } else {
        useNameError.value = null
    }

    if (!RegularExpression.checkEmail(email.value)) {
        console.log(email.value)
        toast.error("Email không hợp lệ!", { theme: 'colored' })
        emailError.value = "Email không hợp lệ!"
        return
    } else {
        emailError.value = null
    }

    if (!RegularExpression.checkPassword(password.value)) {
        toast.error("Mật khẩu không hợp lệ!", { theme: 'colored' })
        passwordError.value = "Mật khẩu phải chứa ít nhất 1 số, 1 chữ thường, 1 chữ in và có ít nhất 8 ký tự!"
        return
    } else {
        passwordError.value = null
    }

    if (password.value !== repeatPassword.value) {
        toast.error("Mật khẩu không khớp!", { theme: 'colored' })
        repeatPasswordError.value = "Mật khẩu không khớp"
        return
    } else {
        repeatPasswordError.value = null
    }
    button.disabled = true
    const data = { userName: userName.value, email: email.value, password: password.value }
    AuthenticationAPI
        .register(data)
        .then(res => {
            toast.success("Đăng ký thành công", { theme: 'colored' })
            emit('closeQuickView')
        })
        .catch(err => {
            button.disabled = false
            toast.error(err.response.data, { theme: 'colored' })
        })
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
                    <div class='my-input' style="width: auto;">
                        <label>Tên tài khoản:</label>
                        <input placeholder="Tên tài khoản" class="split" v-model="userName" />
                        <label class='error'>
                            {{ useNameError }}
                        </label>
                    </div>
                    <div class='my-input'>
                        <label>Email:</label>
                        <input placeholder="Email" class="split" v-model="email" />
                        <label class='error'>
                            {{ emailError }}
                        </label>
                    </div>
                    <div class='my-input'>
                        <label>Mật khẩu:</label>
                        <input placeholder="Mật khẩu" class="split" type="password" v-model="password" />
                        <label class='error'>
                            {{ passwordError }}
                        </label>
                    </div>
                    <div class='my-input'>
                        <label>Nhập lại mật khẩu:</label>
                        <input placeholder="Nhập lại mật khẩu" class="split" type="password" v-model="repeatPassword" />
                        <label class='error'>
                            {{ repeatPasswordError }}
                        </label>
                    </div>
                    <div class='register'>
                        <button class="" @click="register">Đăng ký</button>
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
    cursor: pointer;
}
</style>
