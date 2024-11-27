<script setup>
import AppHeader from './AppHeader.vue';
</script>

<template>
  <div class="layout-wrapper">
    <app-header />
    <div class="layout-main-container">
      <div class="layout-main">
        <router-view />
      </div>
    </div>
    <div class="layout-mask animate-fadein"></div>
  </div>
  <Toast />
</template>