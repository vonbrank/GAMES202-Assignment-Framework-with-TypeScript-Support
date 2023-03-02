import { getShaderString } from "../loads/loadShader";
import { Material } from "./Material";
import { Texture } from "../textures/Texture";
import { LightType } from "../lights/Light";
import { Camera } from "../engine";
import { vec3 } from 'gl-matrix';
export class SSRMaterial extends Material {
    constructor(
        diffuseMap: Texture,
        specularMap: Texture,
        light: LightType,
        camera: Camera,
        vertexShader: string,
        fragmentShader: string
    ) {
        let lightIntensity = light.mat.GetIntensity();
        let lightVP = light.CalcLightVP();
        let lightDir = light.CalcShadingDirection();

        super(
            {
                uLightRadiance: { type: "3fv", value: lightIntensity },
                uLightDir: { type: "3fv", value: lightDir },

                uGDiffuse: { type: "texture", value: camera.fbo.textures[0] },
                uGDepth: { type: "texture", value: camera.fbo.textures[1] },
                uGNormalWorld: {
                    type: "texture",
                    value: camera.fbo.textures[2],
                },
                uGShadow: { type: "texture", value: camera.fbo.textures[3] },
                uGPosWorld: { type: "texture", value: camera.fbo.textures[4] },
            },
            [],
            vertexShader,
            fragmentShader
        );
    }
}

export async function buildSSRMaterial(
    diffuseMap: Texture,
    specularMap: Texture,
    light: LightType,
    camera: Camera,
    vertexPath: string,
    fragmentPath: string
) {
    let vertexShader = await getShaderString(vertexPath);
    let fragmentShader = await getShaderString(fragmentPath);

    return new SSRMaterial(
        diffuseMap,
        specularMap,
        light,
        camera,
        vertexShader,
        fragmentShader
    );
}
