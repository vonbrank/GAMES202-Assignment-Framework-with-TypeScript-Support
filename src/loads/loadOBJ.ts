import { Texture } from "../textures/Texture";
import * as THREE from "three";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { WebGLRenderer } from "../renderers/WebGLRenderer";
import { Mesh } from "../objects/Mesh";
import { BufferAttribute } from "three";
import { buildPhongMaterial } from "../materials/PhongMaterial";
import { buildShadowMaterial } from "../materials/ShadowMaterial";
import { MeshRender } from "../renderers/MeshRender";
// import { Transform } from '../engine';
import { vec3 } from "gl-matrix";
import { buildSkyBoxMaterial } from "../materials/SkyBoxMaterial";
import { Transform } from "../engine";

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
            if (percentComplete == 100) {
                //console.log(renderer)
            }
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
                                    //{ name: 'aTextureCoord', array: geo.attributes.uv.array },
                                    null,
                                    indices,
                                    transform
                                );
                                let colorMap = new Texture(renderer.gl);
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

                                let material = null,
                                    shadowMaterial = null;
                                let Translation: vec3 = [
                                    transform.modelTransX,
                                    transform.modelTransY,
                                    transform.modelTransZ,
                                ];
                                let Scale: vec3 = [
                                    transform.modelScaleX,
                                    transform.modelScaleY,
                                    transform.modelScaleZ,
                                ];

                                let light = renderer.lights[0].entity;

                                switch (objMaterial) {
                                    case "PhongMaterial":
                                        material = buildPhongMaterial(
                                            colorMap,
                                            new Float32Array(mat.specular),
                                            light,
                                            Translation,
                                            Scale,
                                            "./shaders/phongShader/phongVertex.glsl",
                                            "./shaders/phongShader/phongFragment.glsl"
                                        );
                                        shadowMaterial = buildShadowMaterial(
                                            light,
                                            Translation,
                                            Scale,
                                            "./shaders/shadowShader/shadowVertex.glsl",
                                            "./shaders/shadowShader/shadowFragment.glsl"
                                        );
                                        break;
                                    // TODO: Add your PRTmaterial here

                                    case "SkyBoxMaterial":
                                        material = buildSkyBoxMaterial(
                                            "./shaders/skyBoxShader/SkyBoxVertex.glsl",
                                            "./shaders/skyBoxShader/SkyBoxFragment.glsl"
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

                                if (
                                    renderer.lights[0].entity.hasShadowMap ==
                                    true
                                ) {
                                    shadowMaterial?.then((data) => {
                                        let shadowMeshRender = new MeshRender(
                                            renderer.gl,
                                            mesh,
                                            data
                                        );
                                        renderer.addShadowMeshRender(
                                            shadowMeshRender
                                        );
                                    });
                                }
                            }
                        });
                    },
                    onProgress,
                    onError
                );
        });
}
