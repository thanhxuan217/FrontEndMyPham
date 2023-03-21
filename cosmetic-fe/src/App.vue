<script setup>
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { onMounted } from 'vue';
import { ref } from 'vue'
</script>
<template >
  <RouterView />
<!-- <div v-if="!route.meta.layout.includes('admin')">
    <HeaderView />
    <RouterView />
    <FooterView />
  </div>
  <q-layout view="hHh lpR fff" v-else style="overflow-x: hidden;">
    <q-header reveal elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />
        <q-toolbar-title>
          <q-avatar>
            Leo
          </q-avatar>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above v-model="leftDrawerOpen" side="left" elevated>
      <div class="q-pa-md" style="max-width: 250px">
        <q-list bordered padding class="rounded-borders text-primary">
          <q-item clickable v-ripple :active="link === 'inbox'" @click="link = 'inbox'" active-class="my-menu-link">
            <q-item-section avatar>
              <q-icon name="inbox" />
            </q-item-section>

            <q-item-section>Quản lý sản phẩm</q-item-section>
          </q-item>

          <q-item clickable v-ripple :active="link === 'outbox'" @click="link = 'outbox'" active-class="my-menu-link">
            <q-item-section avatar>
              <q-icon name="send" />
            </q-item-section>

            <q-item-section>Duyệt đơn hàng</q-item-section>
          </q-item>
          <q-item clickable v-ripple :active="link === 'trash'" @click="link = 'trash'" active-class="my-menu-link">
            <q-item-section avatar>
              <q-icon name="delete" />
            </q-item-section>

            <q-item-section>Quản lý khuyến mãi</q-item-section>
          </q-item>

          <q-item clickable v-ripple :active="link === 'trash'" @click="link = 'trash'" active-class="my-menu-link">
            <q-item-section avatar>
              <q-icon name="delete" />
            </q-item-section>

            <q-item-section>Thống kê</q-item-section>
          </q-item>
          <q-separator spaced />

          <q-item clickable v-ripple :active="link === 'settings'" @click="link = 'settings'" active-class="my-menu-link">
            <q-item-section avatar>
              <q-icon name="settings" />
            </q-item-section>

            <q-item-section>Cài đặt</q-item-section>
          </q-item>

          <q-item clickable v-ripple :active="link === 'help'" @click="link = 'help'" active-class="my-menu-link">
            <q-item-section avatar>
              <q-icon name="help" />
            </q-item-section>

            <q-item-section>Giúp đỡ</q-item-section>
          </q-item>
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

    </q-layout> -->
  <!-- router-view will display the component that corresponds to the url => component in vue. -->
</template>
<style scoped></style>
