import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { setTransform, gl } from "../engine";
import { buildGbufferMaterial } from "../materials/GBufferMaterial";
import { buildShadowMaterial } from "../materials/ShadowMaterial";
import { buildSSRMaterial } from "../materials/SSRMaterial";
import { Mesh } from "../objects/Mesh";
import { Texture } from "../textures/Texture";
import { MeshRender } from "../renderers/MeshRender";
import { BufferAttribute } from "three";
import { WebGLRenderer } from "../renderers/WebGLRenderer";

export function loadGLTF(
    renderer: WebGLRenderer,
    path: string,
    name: string,
    materialName: string
) {
    const manager = new THREE.LoadingManager();
    manager.onProgress = function (item, loaded, total) {
        console.log(item, loaded, total);
    };

    function onProgress(xhr: ProgressEvent<EventTarget>) {
        if (xhr.lengthComputable) {
            const percentComplete = (xhr.loaded / xhr.total) * 100;
            console.log(
                // "model " + Math.round(percentComplete, 2) + "% downloaded"
                "model " + Math.round(percentComplete) + "% downloaded"
            );
        }
    }
    function onError() {}

    new GLTFLoader(manager).setPath(path).load(name + ".gltf", function (gltf) {
        gltf.scene.traverse(function (event) {
            const child = event as THREE.Mesh;
            if (child.isMesh) {
                let geo = child.geometry;
                let mat: THREE.MeshPhongMaterial;
                if (Array.isArray(child.material))
                    mat = child.material[0] as THREE.MeshPhongMaterial;
                else mat = child.material as THREE.MeshPhongMaterial;
                const gltfTransform = setTransform(
                    child.position.x,
                    child.position.y,
                    child.position.z,
                    child.scale.x,
                    child.scale.y,
                    child.scale.z,
                    child.rotation.x,
                    child.rotation.y,
                    child.rotation.z
                );
                var indices = Array.from(
                    { length: geo.attributes.position.count },
                    (v, k) => k
                );
                let mesh = new Mesh(
                    {
                        name: "aVertexPosition",
                        array: new Float32Array(
                            (geo.attributes.position as BufferAttribute).array
                        ),
                    },
                    {
                        name: "aNormalPosition",
                        array: new Float32Array(
                            (geo.attributes.normal as BufferAttribute).array
                        ),
                    },
                    {
                        name: "aTextureCoord",
                        array: new Float32Array(
                            (geo.attributes.uv as BufferAttribute).array
                        ),
                    },
                    Array.from(geo.index?.array || []),
                    gltfTransform
                );

                let diffuseMap = new Texture(renderer.gl);
                if (mat.map != null) {
                    diffuseMap.CreateImageTexture(renderer.gl, mat.map.image);
                } else {
                    diffuseMap.CreateConstantTexture(
                        renderer.gl,
                        new Float32Array(mat.color.toArray()),
                        true
                    );
                }
                let specularMap = new Texture(renderer.gl);
                specularMap.CreateConstantTexture(renderer.gl, [0, 0, 0]);
                let normalMap = new Texture(renderer.gl);
                if (mat.normalMap != null) {
                    normalMap.CreateImageTexture(
                        renderer.gl,
                        mat.normalMap.image
                    );
                } else {
                    normalMap.CreateConstantTexture(
                        renderer.gl,
                        [0.5, 0.5, 1],
                        false
                    );
                }

                let material = null,
                    shadowMaterial = null,
                    bufferMaterial = null;

                let light = renderer.lights[0].entity;
                switch (materialName) {
                    case "SSRMaterial":
                        material = buildSSRMaterial(
                            diffuseMap,
                            specularMap,
                            light,
                            renderer.camera,
                            "./shaders/ssrShader/ssrVertex.glsl",
                            "./shaders/ssrShader/ssrFragment.glsl"
                        );
                        shadowMaterial = buildShadowMaterial(
                            light,
                            "./shaders/shadowShader/shadowVertex.glsl",
                            "./shaders/shadowShader/shadowFragment.glsl"
                        );
                        bufferMaterial = buildGbufferMaterial(
                            diffuseMap,
                            normalMap,
                            light,
                            renderer.camera,
                            "./shaders/gbufferShader/gbufferVertex.glsl",
                            "./shaders/gbufferShader/gbufferFragment.glsl"
                        );
                        break;
                }

                material?.then((data) => {
                    let meshRender = new MeshRender(renderer.gl, mesh, data);
                    renderer.addMeshRender(meshRender);
                });
                shadowMaterial?.then((data) => {
                    let shadowMeshRender = new MeshRender(
                        renderer.gl,
                        mesh,
                        data
                    );
                    renderer.addShadowMeshRender(shadowMeshRender);
                });
                bufferMaterial?.then((data) => {
                    let bufferMeshRender = new MeshRender(
                        renderer.gl,
                        mesh,
                        data
                    );
                    renderer.addBufferMeshRender(bufferMeshRender);
                });
            }
        });
    });
}
