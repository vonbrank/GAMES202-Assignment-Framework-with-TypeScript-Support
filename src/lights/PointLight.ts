import { Mesh } from "../objects/Mesh";
import { EmissiveMaterial } from "./Light";
import { setTransform } from "../engine";
import { FBO } from "../textures/FBO";
import { vec3, mat4 } from 'gl-matrix';
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
    lightPos;

    constructor(
        lightIntensity: vec3,
        lightPos: vec3,
        hasShadowMap: boolean,
        gl: WebGLRenderingContext
    ) {
        this.mesh = Mesh.cube(setTransform(0, 0, 0, 0.2, 0.2, 0.2));
        this.mat = new EmissiveMaterial(lightIntensity);
        this.lightPos = lightPos;


        this.hasShadowMap = hasShadowMap;
        this.fbo = new FBO(gl);
        if (!this.fbo) {
            console.log("无法设置帧缓冲区对象");
            return;
        }
    }

    CalcLightMVP(translate: vec3, scale: vec3) {
        let lightMVP = mat4.create();
        let modelMatrix = mat4.create();
        let viewMatrix = mat4.create();
        let projectionMatrix = mat4.create();

        // Model transform

        // View transform

        // Projection transform

        mat4.multiply(lightMVP, projectionMatrix, viewMatrix);
        mat4.multiply(lightMVP, lightMVP, modelMatrix);

        return lightMVP;
    }
}
