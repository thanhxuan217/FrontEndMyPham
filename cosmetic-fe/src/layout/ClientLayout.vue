<script setup>
import HeaderView from '../views/HeaderView.vue';
import FooterView from '../views/FooterView.vue';
import { RouterLink, RouterView, useRoute } from 'vue-router'
</script>

<template>
    <HeaderView></HeaderView>
    <RouterView />
    <FooterView></FooterView>
</template>
