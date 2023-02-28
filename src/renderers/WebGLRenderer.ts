import { MeshRender } from "./MeshRender";
import * as THREE from "three";
import { PointLight } from "../lights/PointLight";
import { vec3 } from "gl-matrix";

// Remain rotatation
export class TRSTransform {
    translate: vec3;
    scale: vec3;

    constructor(translate: vec3 = [0, 0, 0], scale: vec3 = [1, 1, 1]) {
        this.translate = translate;
        this.scale = scale;
    }
}

export class WebGLRenderer {
    meshes: MeshRender[] = [];
    lights: {
        entity: PointLight;
        meshRender: MeshRender;
    }[] = [];

    gl: WebGLRenderingContext;
    camera: THREE.PerspectiveCamera;

    constructor(gl: WebGLRenderingContext, camera: THREE.PerspectiveCamera) {
        this.gl = gl;
        this.camera = camera;
    }

    addLight(light: PointLight) {
        this.lights.push({
            entity: light,
            meshRender: new MeshRender(this.gl, light.mesh, light.mat),
        });
    }

    addMesh(mesh: MeshRender) {
        this.meshes.push(mesh);
    }

    render(guiParams: {
        modelTransX: number;
        modelTransY: number;
        modelTransZ: number;
        modelScaleX: number;
        modelScaleY: number;
        modelScaleZ: number;
    }) {
        const gl = this.gl;

        gl.clearColor(0.0, 0.0, 0.0, 1.0); // Clear to black, fully opaque
        gl.clearDepth(1.0); // Clear everything
        gl.enable(gl.DEPTH_TEST); // Enable depth testing
        gl.depthFunc(gl.LEQUAL); // Near things obscure far things

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // Handle light
        const timer = Date.now() * 0.00025;
        let lightPos: vec3 = [
            Math.sin(timer * 6) * 100,
            Math.cos(timer * 4) * 150,
            Math.cos(timer * 2) * 100,
        ];

        if (this.lights.length != 0) {
            for (let l = 0; l < this.lights.length; l++) {
                let trans = new TRSTransform(lightPos);
                this.lights[l].meshRender.draw(this.camera, trans);

                for (let i = 0; i < this.meshes.length; i++) {
                    const mesh = this.meshes[i];

                    const modelTranslation: vec3 = [
                        guiParams.modelTransX,
                        guiParams.modelTransY,
                        guiParams.modelTransZ,
                    ];
                    const modelScale: vec3 = [
                        guiParams.modelScaleX,
                        guiParams.modelScaleY,
                        guiParams.modelScaleZ,
                    ];
                    let meshTrans = new TRSTransform(
                        modelTranslation,
                        modelScale
                    );

                    this.gl.useProgram(mesh.shader.program.glShaderProgram);
                    this.gl.uniform3fv(
                        mesh.shader.program.uniforms.uLightPos,
                        lightPos
                    );
                    mesh.draw(this.camera, meshTrans);
                }
            }
        } else {
            // Handle mesh(no light)
            for (let i = 0; i < this.meshes.length; i++) {
                const mesh = this.meshes[i];
                let trans = new TRSTransform();
                mesh.draw(this.camera, trans);
            }
        }
    }
}
