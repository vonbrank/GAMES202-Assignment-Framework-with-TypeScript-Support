import { getShaderString } from "../loads/loadShader";
import { Material } from "./Material";
import { Texture } from "../textures/Texture";
import { LightType } from "../lights/Light";
import { Camera } from '../engine';
export class GBufferMaterial extends Material {
    constructor(
        diffuseMap: Texture,
        normalMap: Texture,
        light: LightType,
        camera: Camera,
        vertexShader: string,
        fragmentShader: string
    ) {
        let lightVP = light.CalcLightVP();

        super(
            {
                uKd: { type: "texture", value: diffuseMap.texture },
                uNt: { type: "texture", value: normalMap.texture },

                uLightVP: { type: "matrix4fv", value: lightVP },
                uShadowMap: { type: "texture", value: light.fbo.textures[0] },
            },
            [],
            vertexShader,
            fragmentShader,
            camera.fbo
        );
    }
}

export async function buildGbufferMaterial(
    diffuseMap: Texture,
    normalMap: Texture,
    light: LightType,
    camera: Camera,
    vertexPath: string,
    fragmentPath: string
) {
    let vertexShader = await getShaderString(vertexPath);
    let fragmentShader = await getShaderString(fragmentPath);

    return new GBufferMaterial(
        diffuseMap,
        normalMap,
        light,
        camera,
        vertexShader,
        fragmentShader
    );
}
