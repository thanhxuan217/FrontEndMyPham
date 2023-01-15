<script setup>
import { RouterLink, RouterView } from 'vue-router'
import HeaderView from './views/HeaderView.vue';
import FooterView from './views/FooterView.vue';
</script>

<template>
  <HeaderView />
  <RouterView />
  <FooterView />
  <!-- router-view will display the component that corresponds to the url => component in vue. -->
</template>

<style scoped>

</style>
