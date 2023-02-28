import { mat4 } from "gl-matrix";
import { Mesh } from "../objects/Mesh";
import { Material } from "../materials/Material";
import { Shader } from "../shaders/Shader";
import * as THREE from "three";
import { TRSTransform } from "./WebGLRenderer";

export class MeshRender {
    private vertexBuffer;
    private normalBuffer;
    private texcoordBuffer;
    private indicesBuffer;

    gl: WebGLRenderingContext;
    mesh: Mesh;
    material: Material;
    shader: Shader;

    constructor(gl: WebGLRenderingContext, mesh: Mesh, material: Material) {
        this.gl = gl;
        this.mesh = mesh;
        this.material = material;

        this.vertexBuffer = gl.createBuffer();
        this.normalBuffer = gl.createBuffer();
        this.texcoordBuffer = gl.createBuffer();
        this.indicesBuffer = gl.createBuffer();

        let extraAttribs = [];
        if (mesh.hasVertices) {
            extraAttribs.push(mesh.verticesName);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, mesh.vertices, gl.STATIC_DRAW);
            gl.bindBuffer(gl.ARRAY_BUFFER, null);
        }

        if (mesh.hasNormals) {
            extraAttribs.push(mesh.normalsName);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, mesh.normals, gl.STATIC_DRAW);
            gl.bindBuffer(gl.ARRAY_BUFFER, null);
        }

        if (mesh.hasTexcoords) {
            extraAttribs.push(mesh.texcoordsName);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.texcoordBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, mesh.texcoords, gl.STATIC_DRAW);
            gl.bindBuffer(gl.ARRAY_BUFFER, null);
        }

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indicesBuffer);
        gl.bufferData(
            gl.ELEMENT_ARRAY_BUFFER,
            new Uint16Array(mesh.indices),
            gl.STATIC_DRAW
        );
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

        this.material.setMeshAttribs(extraAttribs);
        this.shader = this.material.compile(gl);
    }

    draw(camera: THREE.PerspectiveCamera, transform: TRSTransform) {
        const gl = this.gl;

        let modelViewMatrix = mat4.create();
        let projectionMatrix = mat4.create();

        camera.updateMatrixWorld();
        mat4.invert(
            modelViewMatrix,
            new Float32Array(camera.matrixWorld.elements)
        );
        mat4.translate(modelViewMatrix, modelViewMatrix, transform.translate);
        mat4.scale(modelViewMatrix, modelViewMatrix, transform.scale);
        mat4.copy(
            projectionMatrix,
            new Float32Array(camera.projectionMatrix.elements)
        );

        if (this.mesh.hasVertices) {
            const numComponents = 3;
            const type = gl.FLOAT;
            const normalize = false;
            const stride = 0;
            const offset = 0;
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
            gl.vertexAttribPointer(
                this.shader.program.attribs[this.mesh.verticesName],
                numComponents,
                type,
                normalize,
                stride,
                offset
            );
            gl.enableVertexAttribArray(
                this.shader.program.attribs[this.mesh.verticesName]
            );
        }

        if (this.mesh.hasNormals) {
            const numComponents = 3;
            const type = gl.FLOAT;
            const normalize = false;
            const stride = 0;
            const offset = 0;
            gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
            gl.vertexAttribPointer(
                this.shader.program.attribs[this.mesh.normalsName],
                numComponents,
                type,
                normalize,
                stride,
                offset
            );
            gl.enableVertexAttribArray(
                this.shader.program.attribs[this.mesh.normalsName]
            );
        }

        if (this.mesh.hasTexcoords) {
            const numComponents = 2;
            const type = gl.FLOAT;
            const normalize = false;
            const stride = 0;
            const offset = 0;
            gl.bindBuffer(gl.ARRAY_BUFFER, this.texcoordBuffer);
            gl.vertexAttribPointer(
                this.shader.program.attribs[this.mesh.texcoordsName],
                numComponents,
                type,
                normalize,
                stride,
                offset
            );
            gl.enableVertexAttribArray(
                this.shader.program.attribs[this.mesh.texcoordsName]
            );
        }

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indicesBuffer);

        gl.useProgram(this.shader.program.glShaderProgram);

        gl.uniformMatrix4fv(
            this.shader.program.uniforms.uProjectionMatrix,
            false,
            projectionMatrix
        );
        gl.uniformMatrix4fv(
            this.shader.program.uniforms.uModelViewMatrix,
            false,
            modelViewMatrix
        );

        // Specific the camera uniforms
        gl.uniform3fv(this.shader.program.uniforms.uCameraPos, [
            camera.position.x,
            camera.position.y,
            camera.position.z,
        ]);

        for (let k in this.material.uniforms) {
            const uniform = this.material.uniforms[k];
            if (uniform.type == "matrix4fv") {
                gl.uniformMatrix4fv(
                    this.shader.program.uniforms[k],
                    false,
                    uniform.value
                );
            } else if (uniform.type == "3fv") {
                gl.uniform3fv(this.shader.program.uniforms[k], uniform.value);
            } else if (uniform.type == "1f") {
                gl.uniform1f(this.shader.program.uniforms[k], uniform.value);
            } else if (uniform.type == "1i") {
                gl.uniform1i(this.shader.program.uniforms[k], uniform.value);
            } else if (uniform.type == "texture") {
                gl.activeTexture(gl.TEXTURE0);
                gl.bindTexture(gl.TEXTURE_2D, uniform.value.texture);
                gl.uniform1i(this.shader.program.uniforms[k], 0);
            }
        }

        {
            const vertexCount = this.mesh.count;
            const type = gl.UNSIGNED_SHORT;
            const offset = 0;
            gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
        }
    }
}
