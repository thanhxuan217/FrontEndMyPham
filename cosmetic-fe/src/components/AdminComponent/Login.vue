<template>
    <q-card class="bg-light-green window-height window-width row justify-center items-center">
        <div class="column">
            <div class="row">
                <h5 class="text-h5 text-white q-my-md">Admin page</h5>
            </div>
            <div class="row">
                <q-card square bordered class="q-pa-lg shadow-1">
                    <q-card-section>
                        <q-form class="q-gutter-md">
                            <q-input square filled clearable v-model="userName" label="Tài khoản" />
                            <q-input square filled clearable v-model="password" type="password" label="Mật khẩu" />
                        </q-form>
                    </q-card-section>
                    <q-card-actions class="q-px-md">
                        <q-btn unelevated color="light-green-7" size="lg" class="full-width" label="Đăng nhập"
                            @click="login" />
                    </q-card-actions>
                </q-card>
            </div>
        </div>
    </q-card>
</template>
<script setup>
import { ref, watch, onMounted, computed } from 'vue'
import AccountAPI from '../../api/AdminAPI/AccountAPI'
import router from '../../router';
const userName = ref('')
const password = ref('')

function login() {
    AccountAPI.login({
        userName: userName.value,
        password: password.value
    }).then(res => {
        router.push('/admin')
        localStorage.setItem('accessToken', res.data.accessToken)
        localStorage.setItem('refreshToken', res.data.refreshToken)
    })
}
</script>
  
<style>
.q-card {
    width: 360px;
}
</style>