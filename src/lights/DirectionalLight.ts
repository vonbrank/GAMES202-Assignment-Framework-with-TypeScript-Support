import { Mesh } from "../objects/Mesh";
import { EmissiveMaterial, LightDir } from "./Light";
import { setTransform } from "../engine";
import { FBO } from "../textures/FBO";
import { mat4, vec3 } from "gl-matrix";

export class DirectionalLight {
    mesh;
    mat;
    lightPos;
    lightDir;
    focalPoint: vec3;
    lightUp;
    fbo;

    constructor(
        lightRadiance: vec3,
        lightPos: vec3,
        lightDir: LightDir,
        lightUp: vec3,
        gl: WebGLRenderingContext
    ) {
        this.mesh = Mesh.cube(setTransform(0, 0, 0, 0.1, 0.1, 0.1));
        this.mat = new EmissiveMaterial(lightRadiance);
        this.lightPos = lightPos;
        this.lightDir = lightDir;
        this.focalPoint = [0, 0, 0];
        this.lightUp = lightUp;

        this.fbo = new FBO(gl);
        if (!this.fbo) {
            console.log("无法设置帧缓冲区对象");
            return;
        }
    }

    CalcShadingDirection() {
        let lightDir: vec3 = [
            -this.lightDir["x"],
            -this.lightDir["y"],
            -this.lightDir["z"],
        ];
        return lightDir;
    }

    CalcLightVP() {
        let lightVP = mat4.create();
        let viewMatrix = mat4.create();
        let projectionMatrix = mat4.create();

        // View transform
        let focalPoint: vec3 = [
            this.lightDir["x"] + this.lightPos[0],
            this.lightDir["y"] + this.lightPos[1],
            this.lightDir["z"] + this.lightPos[2],
        ];
        mat4.lookAt(viewMatrix, this.lightPos, focalPoint, this.lightUp);
        // Projection transform
        mat4.ortho(projectionMatrix, -10, 10, -10, 10, 1e-2, 1000);
        // VP transform
        mat4.multiply(lightVP, projectionMatrix, viewMatrix);

        return lightVP;
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
