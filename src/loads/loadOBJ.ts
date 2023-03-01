import * as THREE from "three";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { Mesh } from "../objects/Mesh";
import { Material } from "../materials/Material";
import VertexShader from "../shaders/InternalShader/VertexShader.glsl?raw";
import FragmentShader from "../shaders/InternalShader/FragmentShader.glsl?raw";
import { MeshRender } from "../renderers/MeshRender";
import { Texture } from "../textures/Texture";
import { WebGLRenderer } from "../renderers/WebGLRenderer";
import { BufferAttribute } from "three";

export function loadOBJ(renderer: WebGLRenderer, path: string, name: string) {
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
                            const child = event as THREE.Mesh;

                            if (child.isMesh) {
                                let geo = child.geometry;
                                let mat: THREE.MeshPhongMaterial;
                                if (Array.isArray(child.material))
                                    mat = child
                                        .material[0] as THREE.MeshPhongMaterial;
                                else
                                    mat =
                                        child.material as THREE.MeshPhongMaterial;

                                var indices = Array.from(
                                    { length: geo.attributes.position.count },
                                    (v, k) => k
                                );
                                let mesh = new Mesh(
                                    {
                                        name: "aVertexPosition",
                                        array: new Float32Array(
                                            (
                                                geo.attributes
                                                    .position as BufferAttribute
                                            ).array
                                        ),
                                    },
                                    {
                                        name: "aNormalPosition",
                                        array: new Float32Array(
                                            (
                                                geo.attributes
                                                    .normal as BufferAttribute
                                            ).array
                                        ),
                                    },
                                    {
                                        name: "aTextureCoord",
                                        array: new Float32Array(
                                            (
                                                geo.attributes
                                                    .uv as BufferAttribute
                                            ).array
                                        ),
                                    },
                                    indices
                                );

                                let colorMap: Texture | null = null;
                                if (mat.map != null)
                                    colorMap = new Texture(
                                        renderer.gl,
                                        mat.map.image
                                    );
                                // MARK: You can change the myMaterial object to your own Material instance

                                let textureSample = 0;
                                let myMaterial;
                                if (colorMap != null) {
                                    textureSample = 1;
                                    myMaterial = new Material(
                                        {
                                            uSampler: {
                                                type: "texture",
                                                value: colorMap,
                                            },
                                            uTextureSample: {
                                                type: "1i",
                                                value: textureSample,
                                            },
                                            uKd: {
                                                type: "3fv",
                                                value: mat.color.toArray(),
                                            },
                                        },
                                        [],
                                        VertexShader,
                                        FragmentShader
                                    );
                                } else {
                                    myMaterial = new Material(
                                        {
                                            uTextureSample: {
                                                type: "1i",
                                                value: textureSample,
                                            },
                                            uKd: {
                                                type: "3fv",
                                                value: mat.color.toArray(),
                                            },
                                        },
                                        [],
                                        VertexShader,
                                        FragmentShader
                                    );
                                }

                                let meshRender = new MeshRender(
                                    renderer.gl,
                                    mesh,
                                    myMaterial
                                );
                                renderer.addMesh(meshRender);
                            }
                        });
                    },
                    onProgress,
                    onError
                );
        });
}
