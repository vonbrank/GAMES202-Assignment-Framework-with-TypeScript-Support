import { getShaderString } from "../loads/loadShader";
import { Material } from "./Material";

export class SkyBoxMaterial extends Material {
    constructor(vertexShader: string, fragmentShader: string) {
        super(
            {
                skybox: { type: "CubeTexture", value: null },
                uMoveWithCamera: { type: "updatedInRealTime", value: null },
            },
            [],
            vertexShader,
            fragmentShader,
            null
        );
    }
}

export async function buildSkyBoxMaterial(
    vertexPath: string,
    fragmentPath: string
) {
    let vertexShader = await getShaderString(vertexPath);
    let fragmentShader = await getShaderString(fragmentPath);

    return new SkyBoxMaterial(vertexShader, fragmentShader);
}
