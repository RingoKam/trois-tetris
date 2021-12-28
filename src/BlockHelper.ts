export const SHAPES = [
    // l shape block 0
    [
        { x: 1, y: 0, z: 0 },
        { x: 1, y: 1, z: 0 },
        { x: 1, y: 2, z: 0 },
        { x: 1, y: 3, z: 0 },
    ],
    // L shape block 1
    [
        { x: 1, y: 0, z: 0 },
        { x: 0, y: 0, z: 0 },
        { x: 0, y: 1, z: 0 },
        { x: 0, y: 2, z: 0 },
    ],
     // left L shape block 2
     [
        { x: -1, y: 0, z: 0 },
        { x: 0, y: 0, z: 0 },
        { x: 0, y: 1, z: 0 },
        { x: 0, y: 2, z: 0 },
    ],
    // square 3
    [
        { x: 0, y: 1, z: 0 },
        { x: 1, y: 0, z: 0 },
        { x: 1, y: 1, z: 0 },
        { x: 0, y: 0, z: 0 },
    ],
    // s green
    [
        { x: 0, y: 2, z: 0 },
        { x: 0, y: 1, z: 0 },
        { x: 1, y: 1, z: 0 },
    ],
    //
    [
        { x: 0, y: 1, z: 0 },
        { x: 1, y: 1, z: 0 },
        { x: 1, y: 2, z: 0 },
    ],
];
/**
 * 
 * @param {number} type 
 * @returns Array<{x: number, y: number, z:number }>
 */
export function createBlock(type: number): Array<{x: number, y: number, z:number }> {
    return SHAPES[type]
}

export function rotateBlock(block: Array<{x: number, y: number, z:number }>, rotate: 0|1|2|3) {
    return block.map(point => rotatePoints(point, rotate))
}

function rotatePoints(point: {x: number, y: number, z: number}, rotate: 0|1|2|3) {
    const {x,y,z} = point 
    switch (rotate) {
        case 1: //90
            return { x, y: -y, z }
        case 2: //180
            return { x: -x, y: -y, z }
        case 3: //270
            return { x: -x, y, z }
        case 0:
        default:
            return {x,y,z}
    }
}

