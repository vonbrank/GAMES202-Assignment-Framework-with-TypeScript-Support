import { getShaderString } from "../loads/loadShader";
import { Material } from "./Material";
import { DirectionalLight } from "../lights/DirectionalLight";
import { vec3 } from "gl-matrix";

class ShadowMaterial extends Material {
    constructor(
        light: DirectionalLight,
        translate: vec3,
        scale: vec3,
        vertexShader: string,
        fragmentShader: string
    ) {
        let lightMVP = light.CalcLightMVP(translate, scale);

        super(
            {
                uLightMVP: { type: "matrix4fv", value: lightMVP },
            },
            [],
            vertexShader,
            fragmentShader,
            light.fbo
        );
    }
}

export async function buildShadowMaterial(
    light: DirectionalLight,
    translate: vec3,
    scale: vec3,
    vertexPath: string,
    fragmentPath: string
) {
    let vertexShader = await getShaderString(vertexPath);
    let fragmentShader = await getShaderString(fragmentPath);

    return new ShadowMaterial(
        light,
        translate,
        scale,
        vertexShader as string,
        fragmentShader as string
    );
}
