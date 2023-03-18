<script setup>
import { reactive, watch, nextTick, computed, ref } from 'vue'
import { onMounted } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import AuthenticationAPI from '../api/LoginAPI/AuthenticationAPI';

const router = useRouter()
const route = useRoute()
onMounted(() => {
})
function activeAccount() {
    AuthenticationAPI.confirmToken(route.params.token)
        .then(() => {
            router.push('/')
        })
}
</script>
<template>
    <div class='login-page'>
        <div class='login-container'>
            <button @click="activeAccount">Kích hoạt tài khoản</button>
        </div>
    </div>
</template>
<style scoped>
.login-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    border-radius: 5px;
    height: fit-content;
    box-shadow: 0 0 35px 0 rgb(176, 174, 174);
    background: white;
    gap: 13px;
    padding: 50px;
    width: 400px;
    align-items: center;
}

.login-page {
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
}


button {
    padding: 15px 45px;
    border-radius: 3px;
    border: solid 1px #909b6b;
    background-color: #909b6b;
    color: white;
    cursor: pointer;
}

.content-login {
    display: flex;
    gap: 25px;
    flex-direction: column;
    justify-content: center;
    width: 100%;
}

.content-login .bot {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
}

.content-login a {
    color: #3a7afe;
    text-decoration: none;
}

.content-login label {
    display: block;
    font-weight: 490;
    font-size: 14px;
}

.content-login .form-group .input-login {
    background: #fff;
    border: 1px solid #d7dae3;
    color: #181c32;
    height: 40px;
    width: 100%;
    border-radius: 5px;
    margin-top: 8px;
}

.content-login .form-group .input-login:focus {
    outline: 1px solid #446fef;
}

.content-login .form-group label {
    font-weight: 500;
}

.content-login .save-forgot-account {
    display: flex;
    flex-direction: row;
    gap: 5px;
}

.content-login .save-forgot-account a {
    text-decoration: none;
    color: #3a7afe;
    display: block;
    align-self: flex-end;
    justify-self: end;
    flex-grow: 2;
    text-align: end;
}

.content-login .save-forgot-account div {
    display: flex;
    width: fit-content;
    text-align: center;
}

.content-login .save-forgot-account label {
    align-self: flex-end;
}

.content-login .btn-login {
    height: 45px;
    background-color: #3a7afe;
    border-color: #3a7afe;
    color: white;
    font-weight: 500;
    border-radius: 10px;
    padding: 5px 5px;
    border: 1px solid transparent;
    cursor: pointer;
}

.register {
    margin-top: 100px;
    padding-bottom: 100px;
}
</style>
