import { sample, cloneDeep } from 'lodash'
import { ref, reactive, computed, watch } from 'vue'

//reference https://github.com/meth-meth-method/tetris/blob/master/tetris.js

export enum Block {
    I = "I",
    L = "L",
    J = "J",
    O = "O",
    Z = "Z",
    S = "S",
    T = "T"
}

export const blockType = Object.freeze({
    [Block.I]: [
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
    ],
    [Block.L]: [
        [0, 2, 0],
        [0, 2, 0],
        [0, 2, 2],
    ],
    [Block.J]: [
        [0, 3, 0],
        [0, 3, 0],
        [3, 3, 0],
    ],
    [Block.O]: [
        [4, 4],
        [4, 4],
    ],
    [Block.Z]: [
        [5, 5, 0],
        [0, 5, 5],
        [0, 0, 0],
    ],
    [Block.S]: [
        [0, 6, 6],
        [6, 6, 0],
        [0, 0, 0],
    ],
    [Block.T]: [
        [0, 7, 0],
        [7, 7, 7],
        [0, 0, 0],
    ]
})

function randomBlock() {
    return sample(Object.values(Block)) as Block
}

export function newBlock(type: Block) {
    return cloneDeep(blockType[type])
}

export function matrixToCoordinate(matrix: any[][]) {
    const context: Array<{ x: number, y: number, z: number }> = []
    matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                context.push({ x, y, z: 0 })
            }
        });
    });
    return context;
}

export function rotate(matrix: any[], dir: number) {
    for (let y = 0; y < matrix.length; ++y) {
        for (let x = 0; x < y; ++x) {
            [
                matrix[x][y],
                matrix[y][x],
            ] = [
                    matrix[y][x],
                    matrix[x][y],
                ];
        }
    }

    if (dir > 0) {
        matrix.forEach(row => row.reverse());
    } else {
        matrix.reverse();
    }
    return matrix
}

export const init = () => {
    const blockType = ref<Block>(randomBlock());
    const blockMatrix = ref(newBlock(blockType.value));
    const blockPosition = computed(() => matrixToCoordinate(blockMatrix.value))

    const setBlock = (block: Block | null) => { 
        blockType.value = block ?? randomBlock()
        blockMatrix.value = newBlock(blockType.value);
    }
    const rotateBlock = (r = 1) => {
        blockMatrix.value = rotate(blockMatrix.value, r)
    }

    return {
        //methods
        setBlock,
        rotateBlock,
        //state 
        blockPosition
    }
}