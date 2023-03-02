import { getShaderString } from "../loads/loadShader";
import { Material } from "./Material";
import { DirectionalLight } from "../lights/DirectionalLight";
import { vec3 } from "gl-matrix";
import { LightType } from "../lights/Light";

export class ShadowMaterial extends Material {
    constructor(
        light: LightType,
        vertexShader: string,
        fragmentShader: string
    ) {
        let lightVP = light.CalcLightVP();

        super(
            {
                uLightVP: { type: "matrix4fv", value: lightVP },
            },
            [],
            vertexShader,
            fragmentShader,
            light.fbo
        );
    }
}

export async function buildShadowMaterial(
    light: LightType,
    vertexPath: string,
    fragmentPath: string
) {
    let vertexShader = await getShaderString(vertexPath);
    let fragmentShader = await getShaderString(fragmentPath);

    return new ShadowMaterial(light, vertexShader, fragmentShader);
}
