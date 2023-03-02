import * as THREE from "three";

async function loadShaderFile(filename: string) {
    return new Promise<string>((resolve, reject) => {
        const loader = new THREE.FileLoader();

        loader.load(filename, (data) => {
            resolve(`${data}`);
        });
    });
}

export async function getShaderString(filename: string) {
    return await loadShaderFile(filename);
}
