import * as THREE from 'three';

export function loadShaderFile(filename: string) {

    return new Promise((resolve, reject) => {
        const loader = new THREE.FileLoader();
        loader.load(filename, (data) => {
            resolve(data);
            //console.log(data);
        });
    });
}
