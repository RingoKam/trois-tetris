<template>
  <div class="end-game">
    <h1>Gameover...</h1>
    <div class="menu">
      <button
        type="button"
        class="nes-btn is-error spacing"
        @click.prevent="emit('backToMenu')"
      >
        Back to Menu
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
const emit = defineEmits<{
  (e: "backToMenu"): void;
}>();
</script>

<style scoped>
h1 {
  margin-bottom: 50px;
}
.end-game {
  display: flex;
  height: 100%;
  width: 100%;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  background: #0000009e;
}
.menu {
  display: flex;
  width: 500px;
  flex-direction: column;
  align-items: center;
}

.spacing {
  margin: 10px 0px;
}
</style>