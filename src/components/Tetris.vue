<template>
  <Group ref="tetris">
    <!-- board -->
    <Box v-for="pos in boardGrid" :key="pos.x + 'b' + pos.y" :position="pos">
      <LambertMaterial :props="{ wireframe: false }" />
    </Box>
    <Box :position="{ x: 5, y: 10 }" :scale="{ y: 23 }">
      <LambertMaterial :props="{ wireframe: false }" />
    </Box>
    <Box :position="{ x: -6, y: 10 }" :scale="{ y: 23 }">
      <LambertMaterial :props="{ wireframe: false }" />
    </Box>
    <!-- player pieces -->
    <Box
      v-for="pos in playerBlocksPos"
      :key="pos.x + 'p' + pos.y"
      :position="pos"
    >
      <LambertMaterial :props="{ color: 'red' }" />
    </Box>
    <!-- frozen piece-->
    <Box v-for="pos in frozenBlocks" :key="pos.x + 'f' + pos.y" :position="pos">
      <LambertMaterial :props="{ wireframe: true }" />
    </Box>
  </Group>
</template>

<script lang='ts' setup>
import {
  Box,
  LambertMaterial,
  ToonMaterial,
  Group,
  RendererInjectionKey,
  RendererPublicInterface,
} from "troisjs";
import { Block, init } from "../PlayerBlock";
import { setupTimer } from "../Timer";
import { inject, onMounted, reactive, ref, computed } from "vue";
import { set } from "lodash";

const renderer = inject<RendererPublicInterface>(
  RendererInjectionKey as symbol
);
const tetris = ref();

onMounted(() => {
  //TODO: use
  window.addEventListener("keydown", handleKeyboardEvent);
});

const handleKeyboardEvent = (keyboard: KeyboardEvent) => {
  console.log(keyboard.key);
  switch (keyboard.key) {
    case "a":
      //detect wall collision
      if (playerBlocksPos.value.findIndex((b) => b.x < -4) !== -1) break;
      //detect block collision
      if (
        playerBlocksPos.value.findIndex(
          (b) => frozenBlocksDict.value?.[b.y]?.[b.x - 1] === true
        ) !== -1
      ) {
        console.log(frozenBlocksDict);
        break;
      }
      //if() break;
      playerBlocksOffset.x -= 1;
      break;
    case "d":
      //detect wall collision
      if (playerBlocksPos.value.findIndex((p) => p.x > 3) !== -1) break;
      //detect block collision
      if (
        playerBlocksPos.value.findIndex(
          (b) => frozenBlocksDict.value?.[b.y]?.[b.x + 1] === true
        ) !== -1
      )
        break;
      playerBlocksOffset.x += 1;
      break;
    case "s":
      moveDown();
      break;
    case "w":
    case " ":
      rotateBlock();
      break;
  }
};

//x -5 to 5
//y 0 to 24
const populateX = (
  startPos: { x: number; y: number; z: number },
  xCount: number
) => {
  const result = [];
  for (let index = 0; index < xCount; index++) {
    result.push({ x: startPos.x + index, y: startPos.y, z: startPos.z });
  }
  return result;
};

//init game
let playerBlocks = ref<Array<any>>([]);
let playerBlocksOffset = reactive({ x: 0, y: 24, z: 0 });
let frozenBlocks = ref<Array<any>>([]);
let frozenBlocksDict = computed(() => {
  return frozenBlocks.value.reduce((acc, cur) => {
    set(acc, [cur.y, cur.x], true);
    return acc;
  }, {});
});
const { duration, isTimeUp } = setupTimer();
const { setBlock, rotateBlock, blockPosition } = init();

//define a 10 x 24 board
const boardGrid = [...populateX({ x: -5, y: -1, z: 0 }, 10)];

const playerBlocksPos = computed(() => {
  return blockPosition.value.map((block) => {
    return {
      x: block.x + playerBlocksOffset.x,
      y: block.y + playerBlocksOffset.y,
      z: block.z + playerBlocksOffset.z,
    };
  });
});

const playerBlockDict = computed(() => {
  return playerBlocksPos.value.reduce<any>((acc: any, { x, y, z }) => {
    set(acc, [x, y], true);
    return acc;
  }, {});
});

/**
 * detect if collision with any blocks below player blocks
 */
const isCollide = () => {
  const isGround = playerBlocksPos.value.findIndex((e) => e.y === 0);
  if (isGround !== -1) return true;

  const isCollideWithFrozenBlock = frozenBlocks.value.findIndex((block) => {
    const result = playerBlockDict.value?.[block.x]?.[block.y + 1];
    return result !== null && result !== undefined;
  });
  if (isCollideWithFrozenBlock !== -1) return true;

  return false;
};

const moveDown = () => {
  //TODO: detect if going down is possible
  if (isCollide()) {
    frozenBlocks.value.push(...playerBlocksPos.value);
    setBlock(null);
    playerBlocksOffset.y = 24;
  } else {
    //drop the blocks by 1
    playerBlocksOffset.y -= 1;
  }
};

const isGameOver = () => {
  //if any of the frozen game pieces is above height, you are doomed
  return frozenBlocks.value.find((block) => block.y > 20);
};

const clearBlocks = () => {
  // find frozen blocks that line up
  const rows = Object.entries(frozenBlocksDict.value);
  const rowsToClear = rows
    .filter(([y, xs]) => Object.keys(<any>xs).length === 10)
    .map(([y]) => parseInt(y));
  if (rowsToClear.length > 0) {
      //rows to modify should have the row# and the number of row it has to be decrase by
    const rowsToModify = rows
      .filter(([y]) => !rowsToClear.includes(parseInt(y))) // rows that are not include in rows to clear
      .reduce<{ [key: string]: number }>((acc, [y]) => {
        const removeRows = rowsToClear.filter(
          (r) => r < parseInt(y) // if row is bigger than the row we are removing, we need to lower it
        ).length;
        acc[y] = removeRows;
        return acc;
      }, {});
    debugger;
    frozenBlocks.value = frozenBlocks.value
      .filter(({ y }) => !rowsToClear.includes(y))
      .map(({ x, y, z }) => {
          const newY = y - (rowsToModify?.[y] ?? 0);
          debugger;
        return {
          x,
          y: newY,
          z,
        };
      });
  }
};

onMounted(() => {
  renderer?.onBeforeRender(({ time }) => {
    //define game logic here

    //check if game is over
    if (isGameOver()) return;

    if (isTimeUp(time)) {
      moveDown();
    }

    clearBlocks();
  });
});
</script>