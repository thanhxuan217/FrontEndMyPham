<script setup>
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
import { ref, computed, onMounted } from 'vue'
import AccountAPI from '../api/AdminAPI/AccountAPI'
const router = useRouter()
const leftDrawerOpen = ref(false)
const loading = ref(true)
const user = ref(null)
const pathName = ref('/admin')
function toggleLeftDrawer() {
    leftDrawerOpen.value = !leftDrawerOpen.value
}
onMounted(() => {
    if (localStorage.getItem('accessToken').toString() === 'null') {
        router.push('/admin/login')
    }
    AccountAPI.getUser()
        .then(res => {
            loading.value = false
            user.value = res.data
        })
        .catch(err => {
            loading.value = false
            router.push('/admin/login')
        })
    // check if is admin
})
function logout() {
    localStorage.setItem("accessToken", null)
    localStorage.setItem("refreshToken", null)
    router.push("/admin/login")
}
</script>

<template>
    <q-layout view="hHh lpR fff" style="overflow-x: hidden;" v-if="!loading">
        <q-header reveal elevated class="bg-primary text-white">
            <q-toolbar>
                <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />
                <q-toolbar-title>
                    <q-avatar>
                        Leo
                    </q-avatar>
                </q-toolbar-title>
                <div class="q-pa-md" style="padding-right: 30px;cursor: pointer;">
                    <q-icon name="logout" style="font-size: 20px;" @click="logout" />
                </div>
            </q-toolbar>
        </q-header>

        <q-drawer show-if-above v-model="leftDrawerOpen" side="left" elevated>
            <div class="q-pa-md" style="max-width: 250px">
                <q-list bordered padding class="rounded-borders text-primary">
                    <q-item clickable v-ripple :active="pathName === '/admin'" @click="pathName = '/admin'" to='/admin'
                        active-class="my-menu-link">
                        <q-item-section avatar>
                            <q-icon name="inventory" />
                        </q-item-section>

                        <q-item-section>Quản lý sản phẩm</q-item-section>
                    </q-item>

                    <q-item clickable v-ripple active-class="my-menu-link" to='/admin/order'
                        :active="pathName === '/admin/order'" @click="pathName = '/admin/order'">
                        <q-item-section avatar>
                            <q-icon name="grading" />
                        </q-item-section>

                        <q-item-section>Duyệt đơn hàng</q-item-section>
                    </q-item>
                    <!-- <q-item clickable v-ripple active-class="my-menu-link">
                        <q-item-section avatar>
                            <q-icon name="discount" />
                        </q-item-section>

                        <q-item-section>Quản lý khuyến mãi</q-item-section>
                    </q-item> -->

                    <q-item clickable v-ripple :active="pathName === '/admin/account'" @click="pathName = '/admin/account'"
                        to='/admin/account' active-class="my-menu-link">
                        <q-item-section avatar>
                            <q-icon name="manage_accounts" />
                        </q-item-section>

                        <q-item-section>Quản lý tài
                            khoản</q-item-section>
                    </q-item>

                    <q-expansion-item expand-separator active-class="my-menu-link" to='/admin/statictis'
                        :active="pathName === '/admin/statictis'" @click="pathName = '/admin/statictis'" icon="equalizer"
                        label="Thống kê" default-opened :content-inset-level="1" v-if="user && user.isAdmin">
                        <q-list>
                            <q-item clickable v-ripple :active="pathName === '/admin/statictis'"
                                @click="pathName = '/admin/statictis'" to='/admin/statictis' active-class="my-menu-link">
                                <q-item-section>Tổng doanh thu</q-item-section>
                            </q-item>
                            <q-item clickable v-ripple :active="pathName === '/admin/popular-product'"
                                @click="pathName = '/admin/popular-product'" to='/admin/popular-product'
                                active-class="my-menu-link">
                                <q-item-section>Sản phẩm bán chạy nhất</q-item-section>
                            </q-item>
                        </q-list>

                    </q-expansion-item>

                    <!-- <q-separator spaced />
                    <q-item clickable v-ripple :active="pathName === '/admin/receive'" @click="pathName = '/admin/receive'"
                        to='/admin/receive' active-class="my-menu-link">
                        <q-item-section avatar>
                            <q-icon name="manage_accounts" />
                        </q-item-section>

                        <q-item-section>Nhập hàng</q-item-section>
                    </q-item> -->
                    <!-- <q-item clickable v-ripple active-class="my-menu-link">
                        <q-item-section avatar>
                            <q-icon name="settings" />
                        </q-item-section>

                        <q-item-section>Cài đặt</q-item-section>
                    </q-item>

                    <q-item clickable v-ripple active-class="my-menu-link">
                        <q-item-section avatar>
                            <q-icon name="help" />
                        </q-item-section>

                        <q-item-section>Giúp đỡ</q-item-section>
                    </q-item> -->
                </q-list>
            </div>
        </q-drawer>

        <q-page-container>
            <router-view />
        </q-page-container>

        <q-footer elevated class="bg-grey-8 text-white">
            <q-toolbar>
                <q-toolbar-title>
                    <q-avatar>
                        Leo
                    </q-avatar>
                </q-toolbar-title>
            </q-toolbar>
        </q-footer>

    </q-layout>
</template>
<style scoped>
.my-menu-link {
    font-weight: bold;
    background-color: rgb(229, 226, 220);
}
</style>