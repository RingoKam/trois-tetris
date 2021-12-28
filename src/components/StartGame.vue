<template>
  <div class="start-game">
    <h1>Tetris with TroisJS</h1>
    <div class="menu">
      <button
        type="button"
        class="nes-btn is-primary spacing"
        @click.prevent="emit('start-game', 1)"
      >
        Start Game 1P
      </button>
      <button
        type="button"
        class="nes-btn is-error spacing"
        @click.prevent="emit('start-game', 2)"
      >
        Start Game 2P
      </button>
      <a class="nes-btn spacing" href="https://github.com/RingoKam/trois-tetris"
        >&lt;Source Code&gt;</a
      >
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineEmits } from "vue";

const emit = defineEmits<{
  (e: "start-game", player: number): void;
}>();
</script>

<style scoped>
h1 {
  margin-bottom: 50px;
}
.start-game {
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