import { getShaderString } from "../loads/loadShader";
import { Material } from "./Material";
import { vec3 } from "gl-matrix";
import { DirectionalLight } from "../lights/DirectionalLight";
import { Texture } from "../textures/Texture";

class PhongMaterial extends Material {
    constructor(
        color: Texture,
        specular: vec3,
        light: DirectionalLight,
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
                uLightIntensity: { type: "3fv", value: lightIntensity },
                // Shadow
                uShadowMap: { type: "texture", value: light.fbo },
                uLightMVP: { type: "matrix4fv", value: lightMVP },
            },
            [],
            vertexShader,
            fragmentShader,
            null
        );
    }
}

export async function buildPhongMaterial(
    color: Texture,
    specular: vec3,
    light: DirectionalLight,
    translate: vec3,
    scale: vec3,
    vertexPath: string,
    fragmentPath: string
) {
    let vertexShader = await getShaderString(vertexPath);
    let fragmentShader = await getShaderString(fragmentPath);

    return new PhongMaterial(
        color,
        specular,
        light,
        translate,
        scale,
        vertexShader,
        fragmentShader
    );
}
