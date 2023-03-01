import { Material } from "../materials/Material";
import LightCubeVertexShader from "../shaders/InternalShader/lightCubeVertexShader.glsl?raw";
import LightCubeFragmentShader from "../shaders/InternalShader/LightCubeFragmentShader.glsl?raw";
import { vec3 } from "gl-matrix";

export class EmissiveMaterial extends Material {
    intensity;
    color;
    constructor(lightIntensity: number, lightColor: vec3) {
        super(
            {
                uLigIntensity: { type: "1f", value: lightIntensity },
                uLightColor: { type: "3fv", value: lightColor },
            },
            [],
            LightCubeVertexShader,
            LightCubeFragmentShader,
            null
        );

        this.intensity = lightIntensity;
        this.color = lightColor;
    }

    GetIntensity() {
        return [
            this.intensity * this.color[0],
            this.intensity * this.color[1],
            this.intensity * this.color[2],
        ] as vec3;
    }
}
