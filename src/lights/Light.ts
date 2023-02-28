import { Material } from '../materials/Material';
import LightCubeVertexShader from "../shaders/InternalShader/LightCubeVertexShader.glsl?raw";
import LightCubeFragmentShader from "../shaders/InternalShader/LightCubeFragmentShader.glsl?raw";
import { vec3 } from 'gl-matrix';


export class EmissiveMaterial extends Material {

    intensity: number;
    color: vec3;

    constructor(lightIntensity: number, lightColor: vec3) {    
        super({
            'uLigIntensity': { type: '1f', value: lightIntensity },
            'uLightColor': { type: '3fv', value: lightColor }
        }, [], LightCubeVertexShader, LightCubeFragmentShader);
        
        this.intensity = lightIntensity;
        this.color = lightColor;
    }
}
