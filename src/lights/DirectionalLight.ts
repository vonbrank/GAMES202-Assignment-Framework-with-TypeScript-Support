import { mat4, vec3 } from "gl-matrix";
import { Mesh } from "../objects/Mesh";
import { EmissiveMaterial } from "./Light";
import { FBO } from "../textures/FBO";
import { setTransform } from "../engine";
export class DirectionalLight {
    mesh;
    mat;
    lightPos;
    focalPoint: vec3;
    lightUp: vec3;
    hasShadowMap;
    fbo;

    constructor(
        lightRadiance: vec3,
        lightPos: vec3,
        hasShadowMap: boolean,
        gl: WebGLRenderingContext
    ) {
        this.mesh = Mesh.cube(setTransform(0, 0, 0, 0.2, 0.2, 0.2));
        this.mat = new EmissiveMaterial(lightRadiance);
        this.lightPos = lightPos;
        this.focalPoint = [0, 0, 0];
        this.lightUp = [0, 1, 0];

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
        mat4.identity(modelMatrix);
        mat4.translate(modelMatrix, modelMatrix, translate);
        mat4.scale(modelMatrix, modelMatrix, scale);
        // View transform
        mat4.lookAt(viewMatrix, this.lightPos, this.focalPoint, this.lightUp);
        // Projection transform
        let w = 100;
        let h = 100;
        mat4.ortho(projectionMatrix, -w, w, -h, h, 1, 1000);

        mat4.multiply(lightMVP, projectionMatrix, viewMatrix);
        mat4.multiply(lightMVP, lightMVP, modelMatrix);

        return lightMVP;
    }
}
