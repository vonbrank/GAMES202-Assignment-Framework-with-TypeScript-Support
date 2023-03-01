import * as THREE from "three";

export const loadShaderFile: (filename: string) => Promise<string> = (
    filename: string
) => {
    return new Promise((resolve, reject) => {
        const loader = new THREE.FileLoader();

        loader.load(filename, (data) => {
            resolve(`${data}`);
            //console.log(data);
        });
    });
};

export async function getShaderString(filename: string) {
    return await loadShaderFile(filename);
}
