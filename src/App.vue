<template>
  <Renderer ref="rendererC" antialias :orbit-ctrl="{ enableDamping: true }" resize="window">
    <Camera :position="{ z: 10 }" />
    <Scene>
      <PointLight :position="{ y: 50, z: 50 }" />
      <HemisphereLight />
      <Tetris/>
    </Scene>
  </Renderer>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { MeshPublicInterface, Camera, PointLight, Renderer, HemisphereLight, RendererPublicInterface, Scene } from 'troisjs'
import Tetris from './components/Tetris.vue'

const rendererC = ref<RendererPublicInterface>()
const sceneC = ref();

onMounted(() => {
  const renderer = rendererC.value;
})
</script>

<style>
body, html {
  margin: 0;
}
canvas {
  display: block;
}
</style>
