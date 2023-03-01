import { mat4, mat3 } from "gl-matrix";
import * as math from "mathjs";

export function getRotationPrecomputeL(
    precompute_L: number,
    rotationMatrix: mat4
) {
    const result = 0;
    return result;
}

export function computeSquareMatrix_3by3(rotationMatrix: mat4) {
    // 计算方阵SA(-1) 3*3

    // 1、pick ni - {ni}
    let n1 = [1, 0, 0, 0];
    let n2 = [0, 0, 1, 0];
    let n3 = [0, 1, 0, 0];

    // 2、{P(ni)} - A  A_inverse

    // 3、用 R 旋转 ni - {R(ni)}

    // 4、R(ni) SH投影 - S

    // 5、S*A_inverse
}

export function computeSquareMatrix_5by5(rotationMatrix: mat4) {
    // 计算方阵SA(-1) 5*5

    // 1、pick ni - {ni}
    let k = 1 / (math.sqrt(2) as number);
    let n1 = [1, 0, 0, 0];
    let n2 = [0, 0, 1, 0];
    let n3 = [k, k, 0, 0];
    let n4 = [k, 0, k, 0];
    let n5 = [0, k, k, 0];

    // 2、{P(ni)} - A  A_inverse

    // 3、用 R 旋转 ni - {R(ni)}

    // 4、R(ni) SH投影 - S

    // 5、S*A_inverse
}

export function mat4Matrix2mathMatrix(rotationMatrix: mat4) {
    let mathMatrix = [];
    for (let i = 0; i < 4; i++) {
        let r = [];
        for (let j = 0; j < 4; j++) {
            r.push(rotationMatrix[i * 4 + j]);
        }
        mathMatrix.push(r);
    }
    return math.matrix(mathMatrix);
}

export function getMat3ValueFromRGB(precomputeL: [number, number, number][]) {
    let colorMat3: mat3[] = [];
    for (var i = 0; i < 3; i++) {
        colorMat3[i] = mat3.fromValues(
            precomputeL[0][i],
            precomputeL[1][i],
            precomputeL[2][i],
            precomputeL[3][i],
            precomputeL[4][i],
            precomputeL[5][i],
            precomputeL[6][i],
            precomputeL[7][i],
            precomputeL[8][i]
        );
    }
    return colorMat3;
}
