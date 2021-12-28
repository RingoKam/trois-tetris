<template>
  <!-- UI overlay -->
  <div class="overlay">
    <!-- {{ gameState }} -->
    <!-- 3 diff ui state start game -> on going -> game over -->
    <StartGame v-if="gameState === 'start'" @startGame="start($event)" />
    <OnGoing v-if="gameState === 'ongoing'" :players="players" />
    <Gameover
      v-if="gameState === 'end'"
      :players="players"
      @backToMenu="toMenu()"
    />
  </div>
  <Renderer ref="rendererC" antialias resize="window">
    <!-- TODO: position the camera base on the view angle avaliable -->
    <Camera :position="{ z: 10 }" />
    <Scene>
      <PointLight :position="{ y: 50, z: 50 }" />
      <HemisphereLight />
      <Group
        v-for="(player, i) in players"
        :key="i"
        :position="{ x: playerPosX[i], y: -10, z: -40 }"
      >
        <Tetris
          :playerIndex="i"
          @gameover="endGame()"
          @score="addScore($event, i)"
        />
        <PlayerModel
          :playerIndex="i"
          :animationState="'idle'"
          :position="{ x: i == 0 ? 10 : -10 }"
          :rotation="{
            x: 0,
            y: i == 0 ? (players.length == 1 ? 0 : 0.4) : -0.4,
            z: 0,
          }"
        >
        </PlayerModel>
      </Group>

      <!-- <Tetris :position="{x: -15}"/>
      <Tetris :position="{x: 15}"/> -->
    </Scene>
  </Renderer>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import {
  MeshPublicInterface,
  Camera,
  PointLight,
  Renderer,
  HemisphereLight,
  RendererPublicInterface,
  Scene,
  Group,
  FbxModel,
} from "troisjs";
import {
  AnimationMixer,
  Clock,
  TextureLoader,
  MeshBasicMaterial,
  Cache,
} from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";

//Game
import Tetris from "./components/Tetris.vue";
import PlayerModel from "./components/PlayerModel.vue";
//UI
import StartGame from "./components/StartGame.vue";
import OnGoing from "./components/OnGoing.vue";
import Gameover from "./components/Gameover.vue";

const rendererC = ref<RendererPublicInterface>();
const gameState = ref<"ongoing" | "start" | "end">("start");
const players = ref<Array<number>>([]);

const playerPosX = computed<any>(() => {
  const playerCount = players.value.length;
  if (playerCount === 2) return { 0: -15, 1: 15 };
  return { 0: 0 };
});

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
};

let mixer: any = null;

const onLoad = (object: any) => {
  mixer = new AnimationMixer(object);
  const textureLoader = new TextureLoader();

  textureLoader.load("player2.png", (texture) => {
    const material = new MeshBasicMaterial({
      map: texture,
    });
    object.traverse((c: any) => {
      if (c.isMesh) {
        c.material = material;
      }
    });
  });

  const animLoader = new FBXLoader();
  animLoader.setPath("/");
  animLoader.load("Victory.fbx", (anim) => {
    const victory = mixer.clipAction(anim.animations[0]);
    victory.play();
  });
};

onMounted(() => {
  Cache.enabled = true;
  const renderer = rendererC.value;
  const clock = new Clock();
  renderer?.onBeforeRender(() => {
    mixer?.update(clock.getDelta());
  });
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
