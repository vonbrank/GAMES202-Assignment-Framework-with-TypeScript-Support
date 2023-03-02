import * as THREE from "three";
import { MeshRender } from "./MeshRender";
import { LightType } from "../lights/Light";
import { mat4 } from "gl-matrix";
import { Camera } from "../engine";

export interface UpdatedParamters {
    uLightVP: mat4;
    uLightDir: number[];
}

export class WebGLRenderer {
    meshes: MeshRender[] = [];
    shadowMeshes: MeshRender[] = [];
    bufferMeshes: MeshRender[] = [];
    lights: {
        entity: LightType;
        meshRender: MeshRender;
    }[] = [];

    gl;
    camera;

    constructor(gl: WebGLRenderingContext, camera: Camera) {
        this.gl = gl;
        this.camera = camera;
    }

    addLight(light: LightType) {
        this.lights.push({
            entity: light,
            meshRender: new MeshRender(this.gl, light.mesh, light.mat),
        });
    }
    addMeshRender(mesh: MeshRender) {
        this.meshes.push(mesh);
    }
    addShadowMeshRender(mesh: MeshRender) {
        this.shadowMeshes.push(mesh);
    }
    addBufferMeshRender(mesh: MeshRender) {
        this.bufferMeshes.push(mesh);
    }

    render() {
        console.assert(this.lights.length != 0, "No light");
        console.assert(this.lights.length == 1, "Multiple lights");
        var light = this.lights[0];

        const gl = this.gl;
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clearDepth(1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // Update parameters
        let lightVP = light.entity.CalcLightVP();
        let lightDir = light.entity.CalcShadingDirection();
        let updatedParamters = {
            uLightVP: lightVP,
            uLightDir: lightDir,
        };

        // Draw light
        light.meshRender.mesh.transform.translate = light.entity.lightPos;
        light.meshRender.draw(this.camera, null, updatedParamters);

        // Shadow pass
        gl.bindFramebuffer(gl.FRAMEBUFFER, light.entity.fbo);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        for (let i = 0; i < this.shadowMeshes.length; i++) {
            this.shadowMeshes[i].draw(
                this.camera,
                light.entity.fbo,
                updatedParamters
            );
            // this.shadowMeshes[i].draw(this.camera);
        }
        // return;

        // Buffer pass
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.camera.fbo);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        for (let i = 0; i < this.bufferMeshes.length; i++) {
            this.bufferMeshes[i].draw(
                this.camera,
                this.camera.fbo,
                updatedParamters
            );
            // this.bufferMeshes[i].draw(this.camera);
        }
        // return

        // Camera pass
        for (let i = 0; i < this.meshes.length; i++) {
            this.meshes[i].draw(this.camera, null, updatedParamters);
        }
    }
}
