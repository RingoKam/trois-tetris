<template>
  <div class="on-going">
      <div v-for="(player, i) in players" :key="i">
          Player_{{i + 1}}: {{player}}
      </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue'

const { players } = defineProps<{
    players: Array<number>
}>()

</script>

<style scoped>
.on-going {
    margin-top: 1vh;
    display: flex;
    justify-content: space-evenly;
}
</style>