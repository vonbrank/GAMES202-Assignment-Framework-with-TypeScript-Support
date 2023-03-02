import { Material } from "../materials/Material";

import { vec3 } from "gl-matrix";
import { DirectionalLight } from "./DirectionalLight";
import { PointLight } from "./PointLight";
import {
    LightCubeFragmentShader,
    LightCubeVertexShader,
} from "../shaders/InternalShader";

export class EmissiveMaterial extends Material {
    color;
    constructor(lightRadiance: vec3, lightColor: vec3 | null = null) {
        super(
            {
                uLightRadiance: { type: "3fv", value: lightRadiance },
            },
            [],
            LightCubeVertexShader,
            LightCubeFragmentShader
        );

        this.color = lightRadiance;
    }

    GetIntensity() {
        return this.color;
    }
}

export interface LightDir {
    x: number;
    y: number;
    z: number;
}

export type LightType = DirectionalLight | PointLight;
