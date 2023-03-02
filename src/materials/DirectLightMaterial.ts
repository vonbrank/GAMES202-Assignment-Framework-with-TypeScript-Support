import { getShaderString } from "../loads/loadShader";
import { Material } from "./Material";
import { Texture } from "../textures/Texture";
import { vec3 } from "gl-matrix";
import { LightType } from "../lights/Light";
export class DirectLightMaterial extends Material {
    constructor(
        color: Texture,
        specular: vec3,
        light: LightType,
        translate: vec3,
        scale: vec3,
        vertexShader: string,
        fragmentShader: string
    ) {
        let lightMVP = light.CalcLightMVP(translate, scale);
        let lightIntensity = light.mat.GetIntensity();

        super(
            {
                // Phong
                uSampler: { type: "texture", value: color },
                uKs: { type: "3fv", value: specular },
                uLightRadiance: { type: "3fv", value: lightIntensity },
                // Shadow
                uShadowMap: { type: "texture", value: light.fbo },
                uLightMVP: { type: "matrix4fv", value: lightMVP },
            },
            [],
            vertexShader,
            fragmentShader
        );
    }
}

export async function buildDirectLightMaterial(
    color: Texture,
    specular: vec3,
    light: LightType,
    translate: vec3,
    scale: vec3,
    vertexPath: string,
    fragmentPath: string
) {
    let vertexShader = await getShaderString(vertexPath);
    let fragmentShader = await getShaderString(fragmentPath);

    return new DirectLightMaterial(
        color,
        specular,
        light,
        translate,
        scale,
        vertexShader,
        fragmentShader
    );
}
