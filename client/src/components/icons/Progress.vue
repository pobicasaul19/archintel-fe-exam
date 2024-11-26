<template>
  <div class="container">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" class="spinner">
      <circle cx="25" cy="25" r="20" fill="none" stroke-width="4" />
    </svg>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.container {
  width: 100%;
  height: 100%;
}
.spinner {
  width: 20px;
  height: 20px;
  animation: rotate 1s linear infinite;
}

.spinner circle {
  stroke: #ffffff;
  stroke-dasharray: 150, 200;
  stroke-dashoffset: 0;
  stroke-linecap: round;
  animation: dash 1.5s ease-in-out infinite;
}

@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes dash {
  0% {
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -35;
  }
  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -124;
  }
}
</style>
