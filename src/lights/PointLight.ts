import { FBO } from "../textures/FBO";
import { Mesh } from "../objects/Mesh";
import { setTransform } from "../engine";
import { EmissiveMaterial } from "./Light";
import { vec3 } from "gl-matrix";
export class PointLight {
    /**
     * Creates an instance of PointLight.
     * @param {float} lightIntensity  The intensity of the PointLight.
     * @param {vec3f} lightColor The color of the PointLight.
     * @memberof PointLight
     */

    mesh;
    mat;
    hasShadowMap;
    fbo;

    constructor(
        lightIntensity: number,
        lightColor: vec3,
        hasShadowMap: boolean,
        gl: WebGLRenderingContext
    ) {
        this.mesh = Mesh.cube(setTransform(0, 0, 0, 0.2, 0.2, 0.2));
        this.mat = new EmissiveMaterial(lightIntensity, lightColor);

        this.hasShadowMap = hasShadowMap;
        this.fbo = new FBO(gl);
        if (!this.fbo) {
            console.log("无法设置帧缓冲区对象");
            return;
        }
    }
}
