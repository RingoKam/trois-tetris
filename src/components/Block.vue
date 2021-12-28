<template>
  <Group>
    <Box v-for="pos in shape" 
      :key="pos.x + '-' + pos.y" 
      :position="pos">
      <LambertMaterial />
    </Box>
  </Group>
</template>

<script setup lang="ts">
import { LambertMaterial, Mesh, Group, Box } from "troisjs";

const testing = () => {
  console.log("testing")
}


</script>

<style>
</style>