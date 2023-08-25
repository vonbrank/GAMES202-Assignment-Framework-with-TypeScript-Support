import { Texture } from "../textures/Texture";
import * as THREE from "three";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { WebGLRenderer } from "../renderers/WebGLRenderer";
import { Mesh } from "../objects/Mesh";
import { BufferAttribute } from "three";
import { buildShadowMaterial } from "../materials/ShadowMaterial";
import { MeshRender } from "../renderers/MeshRender";
import { Transform } from "../engine";
import { vec3 } from "gl-matrix";
import { buildSSRMaterial } from "../materials/SSRMaterial";

export function loadOBJ(
    renderer: WebGLRenderer,
    path: string,
    name: string,
    objMaterial: string,
    transform: Transform
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
    function onError() { }

    new MTLLoader(manager)
        .setPath(path)
        .load(name + ".mtl", function (materials) {
            materials.preload();
            new OBJLoader(manager)
                .setMaterials(materials)
                .setPath(path)
                .load(
                    name + ".obj",
                    function (object) {
                        object.traverse(function (event) {
                            const child = event;

                            if (child instanceof THREE.Mesh && child.isMesh) {
                                let geo = child.geometry;
                                let mat = new THREE.MeshPhongMaterial;
                                if (Array.isArray(child.material)) {
                                    let firstMaterial = child
                                        .material[0];
                                    if (firstMaterial instanceof THREE.MeshPhongMaterial) {
                                        mat = firstMaterial;
                                    }
                                }
                                else if (child.material instanceof THREE.MeshPhongMaterial) {
                                    mat = child.material;
                                }

                                var indices = Array.from(
                                    { length: geo.attributes.position.count },
                                    (v, k) => k
                                );
                                let mesh = new Mesh(
                                    {
                                        name: "aVertexPosition",
                                        array: new Float32Array(geo.attributes.position instanceof BufferAttribute ? geo.attributes.position.array : []),
                                    },
                                    {
                                        name: "aNormalPosition",
                                        array: new Float32Array(geo.attributes.normal instanceof BufferAttribute ? geo.attributes.normal.array : []),
                                    },
                                    {
                                        name: "aTextureCoord",
                                        array: new Float32Array(geo.attributes.uv instanceof BufferAttribute ? geo.attributes.uv.array : []),
                                    },
                                    indices,
                                    transform
                                );

                                let colorMap = new Texture(renderer.gl);
                                let specularMap = new Texture(renderer.gl);
                                specularMap.CreateConstantTexture(
                                    renderer.gl,
                                    [0, 0, 0]
                                );
                                if (mat.map != null) {
                                    colorMap.CreateImageTexture(
                                        renderer.gl,
                                        mat.map.image
                                    );
                                } else {
                                    colorMap.CreateConstantTexture(
                                        renderer.gl,
                                        new Float32Array(mat.color.toArray())
                                    );
                                }

                                let material = null;

                                let light = renderer.lights[0].entity;
                                switch (objMaterial) {
                                    case "SSRMaterial":
                                        material = buildSSRMaterial(
                                            colorMap,
                                            specularMap,
                                            light,
                                            renderer.camera,
                                            "./shaders/ssrShader/ssrVertex.glsl",
                                            "./shaders/ssrShader/ssrFragment.glsl"
                                        );
                                        break;
                                }

                                material?.then((data) => {
                                    let meshRender = new MeshRender(
                                        renderer.gl,
                                        mesh,
                                        data
                                    );
                                    renderer.addMeshRender(meshRender);
                                });
                            }
                        });
                    },
                    onProgress,
                    onError
                );
        });
}
