import { getShaderString } from "../loads/loadShader";
import { Material } from "./Material";
import { Texture } from "../textures/Texture";
import { bufferFBO } from "../engine";
export class SceneDepthMaterial extends Material {
    constructor(color: Texture, vertexShader: string, fragmentShader: string) {
        super(
            {
                uSampler: { type: "texture", value: color.texture },
            },
            [],
            vertexShader,
            fragmentShader,
            bufferFBO
        );
        this.notShadow = true;
    }
}

export async function buildSceneDepthMaterial(
    color: Texture,
    vertexPath: string,
    fragmentPath: string
) {
    let vertexShader = await getShaderString(vertexPath);
    let fragmentShader = await getShaderString(fragmentPath);

    return new SceneDepthMaterial(color, vertexShader, fragmentShader);
}
