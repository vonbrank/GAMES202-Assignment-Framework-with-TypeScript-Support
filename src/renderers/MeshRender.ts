import { mat4 } from "gl-matrix";
import { precomputeLT, guiParams, cubeMaps, resolution } from '../engine';
import { Mesh } from "../objects/Mesh";
import { Material } from "../materials/Material";

export class MeshRender {
    #vertexBuffer;
    #normalBuffer;
    #texcoordBuffer;
    #indicesBuffer;

    gl;
    mesh;
    material;
    shader;

    constructor(gl: WebGLRenderingContext, mesh: Mesh, material: Material) {
        this.gl = gl;
        this.mesh = mesh;
        this.material = material;

        this.#vertexBuffer = gl.createBuffer();
        this.#normalBuffer = gl.createBuffer();
        this.#texcoordBuffer = gl.createBuffer();
        this.#indicesBuffer = gl.createBuffer();

        let extraAttribs: string[] = [];
        if (mesh.hasVertices) {
            extraAttribs.push(mesh.verticesName);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.#vertexBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, mesh.vertices, gl.STATIC_DRAW);
            gl.bindBuffer(gl.ARRAY_BUFFER, null);
        }

        if (mesh.hasNormals) {
            extraAttribs.push(mesh.normalsName);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.#normalBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, mesh.normals, gl.STATIC_DRAW);
            gl.bindBuffer(gl.ARRAY_BUFFER, null);
        }

        if (mesh.hasTexcoords) {
            extraAttribs.push(mesh.texcoordsName);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.#texcoordBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, mesh.texcoords, gl.STATIC_DRAW);
            gl.bindBuffer(gl.ARRAY_BUFFER, null);
        }

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.#indicesBuffer);
        gl.bufferData(
            gl.ELEMENT_ARRAY_BUFFER,
            new Uint16Array(mesh.indices),
            gl.STATIC_DRAW
        );
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

        this.material.setMeshAttribs(extraAttribs);
        this.shader = this.material.compile(gl);
    }

    bindGeometryInfo() {
        const gl = this.gl;

        if (this.mesh.hasVertices) {
            const numComponents = 3;
            const type = gl.FLOAT;
            const normalize = false;
            const stride = 0;
            const offset = 0;
            gl.bindBuffer(gl.ARRAY_BUFFER, this.#vertexBuffer);
            //console.log(this.shader.program.attribs[this.mesh.verticesName])
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
            gl.bindBuffer(gl.ARRAY_BUFFER, this.#normalBuffer);
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
            gl.bindBuffer(gl.ARRAY_BUFFER, this.#texcoordBuffer);
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

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.#indicesBuffer);
    }

    bindCameraParameters(camera: THREE.PerspectiveCamera) {
        const gl = this.gl;

        let modelMatrix = mat4.create();
        let viewMatrix = mat4.create();
        let projectionMatrix = mat4.create();
        // Model transform
        mat4.identity(modelMatrix);
        mat4.translate(modelMatrix, modelMatrix, this.mesh.transform.translate);
        mat4.scale(modelMatrix, modelMatrix, this.mesh.transform.scale);
        // View transform
        camera.updateMatrixWorld();
        mat4.invert(viewMatrix, new Float32Array(camera.matrixWorld.elements));
        // mat4.lookAt(viewMatrix, cameraPosition, [0,0,0], [0,1,0]);
        // Projection transform
        mat4.copy(
            projectionMatrix,
            new Float32Array(camera.projectionMatrix.elements)
        );

        gl.uniformMatrix4fv(
            this.shader.program.uniforms.uProjectionMatrix,
            false,
            projectionMatrix
        );
        gl.uniformMatrix4fv(
            this.shader.program.uniforms.uModelMatrix,
            false,
            modelMatrix
        );
        gl.uniformMatrix4fv(
            this.shader.program.uniforms.uViewMatrix,
            false,
            viewMatrix
        );
        gl.uniform3fv(this.shader.program.uniforms.uCameraPos, [
            camera.position.x,
            camera.position.y,
            camera.position.z,
        ]);
    }

    bindMaterialParameters() {
        const gl = this.gl;

        let textureNum = 0;
        for (let k in this.material.uniforms) {
			const uniform = this.material.uniforms[k];
            if (uniform.type == "matrix4fv") {
                gl.uniformMatrix4fv(
                    this.shader.program.uniforms[k],
                    false,
                    uniform.value
                );
            } else if (uniform.type == "matrix3fv") {
                gl.uniformMatrix3fv(
                    this.shader.program.uniforms[k],
                    false,
                    uniform.value
                );
            } else if (uniform.type == "3fv") {
                gl.uniform3fv(
                    this.shader.program.uniforms[k],
                    uniform.value
                );
            } else if (uniform.type == "1f") {
                gl.uniform1f(
                    this.shader.program.uniforms[k],
                    uniform.value
                );
            } else if (uniform.type == "1i") {
                gl.uniform1i(
                    this.shader.program.uniforms[k],
                    uniform.value
                );
            } else if (uniform.type == "texture") {
                gl.activeTexture(gl.TEXTURE0 + textureNum);
                gl.bindTexture(
                    gl.TEXTURE_2D,
                    uniform.value.texture
                );
                gl.uniform1i(this.shader.program.uniforms[k], textureNum);
                textureNum += 1;
            } else if (uniform.type == "CubeTexture") {
                gl.activeTexture(gl.TEXTURE0 + textureNum);
                //console.log(cubeMap.texture)
                gl.bindTexture(
                    gl.TEXTURE_CUBE_MAP,
                    cubeMaps[guiParams.envmapId].texture
                );
                gl.uniform1i(this.shader.program.uniforms[k], textureNum);
                textureNum += 1;
            }
        }
    }

    draw(camera: THREE.PerspectiveCamera) {
        const gl = this.gl;

        gl.bindFramebuffer(gl.FRAMEBUFFER, this.material.frameBuffer);
        if (this.material.frameBuffer != null) {
            // Shadow map
            gl.viewport(0.0, 0.0, resolution, resolution);
        } else {
            gl.viewport(0.0, 0.0, window.screen.width, window.screen.height);
        }

        gl.useProgram(this.shader.program.glShaderProgram);

        // Bind attribute mat3 - LT
        const buf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array(precomputeLT[guiParams.envmapId]),
            gl.STATIC_DRAW
        );

        for (var ii = 0; ii < 3; ++ii) {
            gl.enableVertexAttribArray(
                this.shader.program.attribs["aPrecomputeLT"] + ii
            );
            gl.vertexAttribPointer(
                this.shader.program.attribs["aPrecomputeLT"] + ii,
                3,
                gl.FLOAT,
                false,
                36,
                ii * 12
            );
        }

        // Bind geometry information
        this.bindGeometryInfo();

        // Bind Camera parameters
        this.bindCameraParameters(camera);

        // Bind material parameters
        this.bindMaterialParameters();

        // Draw
        {
            const vertexCount = this.mesh.count;
            const type = gl.UNSIGNED_SHORT;
            const offset = 0;
            gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
        }
    }
}
