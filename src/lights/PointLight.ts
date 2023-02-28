import { Mesh } from '../objects/Mesh';
import { EmissiveMaterial } from './Light';
import { vec3 } from 'gl-matrix';

export class PointLight {
    /**
     * Creates an instance of PointLight.
     * @param {float} lightIntensity  The intensity of the PointLight.
     * @param {vec3f} lightColor The color of the PointLight.
     * @memberof PointLight
     */

    mesh: Mesh;
    mat: EmissiveMaterial;

    constructor(lightIntensity: number, lightColor: vec3) {
        this.mesh = Mesh.cube();
        this.mat = new EmissiveMaterial(lightIntensity, lightColor);
    }
}