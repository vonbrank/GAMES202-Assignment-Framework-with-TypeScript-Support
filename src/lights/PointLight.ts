import { FBO } from "../textures/FBO";
import { Mesh } from "../objects/Mesh";
import { setTransform } from "../engine";
import { EmissiveMaterial, LightDir } from "./Light";
import { vec3, mat4 } from "gl-matrix";

export class PointLight {
    /**
     * Creates an instance of PointLight.
     * @param {float} lightIntensity  The intensity of the PointLight.
     * @param {vec3f} lightColor The color of the PointLight.
     * @memberof PointLight
     */

    mesh;
    mat;
    fbo;
    lightDir: LightDir;
    lightPos: vec3;

    constructor(
        lightIntensity: vec3,
        lightColor: vec3,
        gl: WebGLRenderingContext
    ) {
        this.mesh = Mesh.cube(setTransform(0, 0, 0, 0.2, 0.2, 0.2, 0));
        this.mat = new EmissiveMaterial(lightIntensity, lightColor);
        this.lightDir = {
            x: 1,
            y: 1,
            z: 1,
        };
        this.lightPos = [0, 0, 0];

        this.fbo = new FBO(gl);
        if (!this.fbo) {
            console.log("无法设置帧缓冲区对象");
            return;
        }
    }

    CalcShadingDirection() {
        let lightDir: vec3 = [1, 1, 1];
        return lightDir;
    }

    CalcLightVP() {
        let lightVP = mat4.create();
        let viewMatrix = mat4.create();
        let projectionMatrix = mat4.create();

        // View transform

        // Projection transform

        // VP transform

        return lightVP;
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
