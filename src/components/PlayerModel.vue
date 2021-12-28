<template>
  <FbxModel
    src="/Model.fbx"
    :scale="{ x: 0.03, y: 0.03, z: 0.03 }"
    @load="onLoad"
  />
</template>

<script lang="ts" setup>
import { ref, defineProps, defineEmits, onMounted, inject } from "vue";
import {
  FbxModel,
  RendererInjectionKey,
  RendererPublicInterface,
} from "troisjs";
import { AnimationMixer, Clock, TextureLoader, MeshBasicMaterial } from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";

const renderer = inject<RendererPublicInterface>(
  RendererInjectionKey as symbol
);

const { playerIndex } = defineProps<{
  playerIndex: number;
  animationState: string;
}>();

const emits = defineEmits<{
  (e: "loadComplete"): void;
}>();

let mixer: any = null;

const setSkin = (object: any, texture: any) => {
  const material = new MeshBasicMaterial({
    map: texture,
  });
  object.traverse((c: any) => {
    if (c.isMesh) {
      c.material = material;
    }
  });
};

const onLoad = (object: any) => {
  mixer = new AnimationMixer(object);
  const textureLoader = new TextureLoader();
  const animLoader = new FBXLoader();
  let animations: any = null;

  //load skin
  textureLoader.loadAsync(`player${playerIndex + 1}.png`).then((texture) => {
    const material = new MeshBasicMaterial({
      map: texture,
    });
    object.traverse((c: any) => {
      if (c.isMesh) {
        c.material = material;
      }
    });
  });

  //load animation
  animLoader.setPath("/");
  Promise.all(
    ["Victory", "Idle", "Punch", "Defeat"].map((file) =>
      animLoader.loadAsync(`${file}.fbx`).then((anim) => ({ name: file, anim }))
    )
  ).then((anims) => {
    animations = anims.reduce<any>((acc, { name, anim }) => {
      acc[name] = {
        animation: anim.animations[0],
        duration: anim.animations[0].duration,
      };
      return acc;
    }, {});
    const clip = mixer.clipAction(animations["Idle"].animation);
    clip.play();
  });
};

onMounted(() => {
  const clock = new Clock();
  renderer?.onBeforeRender(() => {
    mixer?.update(clock.getDelta());
  });
});
</script>