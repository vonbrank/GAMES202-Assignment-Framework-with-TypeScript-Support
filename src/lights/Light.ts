import { Material } from "../materials/Material";
import {
    LightCubeFragmentShader,
    LightCubeVertexShader,
} from "../shaders/InternalShader";
import { vec3 } from "gl-matrix";
import { DirectionalLight } from './DirectionalLight';
import { PointLight } from './PointLight';
export class EmissiveMaterial extends Material {
    color;

    constructor(lightRadiance: vec3) {
        super(
            {
                uLightRadiance: { type: "3fv", value: lightRadiance },
            },
            [],
            LightCubeVertexShader,
            LightCubeFragmentShader,
        );

        this.color = lightRadiance;
    }

    GetIntensity() {
        return this.color;
    }
}

export type LightType = DirectionalLight | PointLight;