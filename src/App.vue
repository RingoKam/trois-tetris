<template>
  <!-- UI overlay -->
  <div class="overlay">
    <!-- {{ gameState }} -->
    <!-- 3 diff ui state start game -> on going -> game over -->
    <StartGame v-if="gameState === 'start'" @startGame="start($event)" />
    <OnGoing v-if="gameState === 'ongoing'" :players="players" />
    <Gameover v-if="gameState === 'end'" @backToMenu="toMenu()" />
  </div>
  <Renderer ref="rendererC" antialias resize="window">
    <!-- TODO: position the camera base on the view angle avaliable -->
    <Camera :position="{ z: 10 }" />
    <Scene>
      <PointLight :position="{ y: 50, z: 50 }" />
      <HemisphereLight />
      <Tetris
        v-for="(player, i) in players"
        :key="i"
        :position="{ x: 0, y: -10, z: -40 }"
        :playerIndex="i"
        @gameover="endGame()"
        @score="addScore($event, i)"
      />
      <!-- <Tetris :position="{x: -15}"/>
      <Tetris :position="{x: 15}"/> -->
    </Scene>
  </Renderer>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import {
  MeshPublicInterface,
  Camera,
  PointLight,
  Renderer,
  HemisphereLight,
  RendererPublicInterface,
  Scene,
} from "troisjs";

//Game
import Tetris from "./components/Tetris.vue";
//UI
import StartGame from "./components/StartGame.vue";
import OnGoing from "./components/OnGoing.vue";
import Gameover from "./components/Gameover.vue";

const rendererC = ref<RendererPublicInterface>();
const gameState = ref<"ongoing" | "start" | "end">("start");
const players = ref<Array<number>>([]);

const start = (playerCount: number) => {
  // player.value =
  players.value = new Array<number>(playerCount).fill(0);
  gameState.value = "ongoing";
};

const addScore = (points: number, index: number) => {
  players.value[index] += points;
};

const endGame = () => {
  gameState.value = "end";
};

const toMenu = () => {
  players.value = [];
  gameState.value = "start";
  debugger;
};

onMounted(() => {
  const renderer = rendererC.value;
});
</script>

<style>
body,
html {
  margin: 0;
}
canvas {
  display: block;
}

.overlay {
  position: absolute;
  width: 100%;
  height: 100%;
  color: white;
}
</style>
