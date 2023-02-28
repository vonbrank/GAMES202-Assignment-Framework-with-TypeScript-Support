import { Shader } from "../shaders/Shader";
import { vec3 } from "gl-matrix";
import { Texture } from "../textures/Texture";

type Uniform =
    | {
          type: "texture";
          value: Texture;
      }
    | {
          type: "1i";
          value: number;
      }
    | {
          type: "1f";
          value: number;
      }
    | {
          type: "3fv";
          value: Float32List;
      }
    | {
          type: "uKd";
          value: number[];
      }
    | {
          type: "matrix4fv";
          value: Float32List;
      };
export class Material {
    private flatten_uniforms;
    private flatten_attribs;
    private vsSrc;
    private fsSrc;

    uniforms;
    attribs;

    // Uniforms is a map, attribs is a Array
    constructor(
        uniforms: {
            [index: string]: Uniform;
        },
        attribs: string[],
        vsSrc: string,
        fsSrc: string
    ) {
        this.uniforms = uniforms;
        this.attribs = attribs;
        this.vsSrc = vsSrc;
        this.fsSrc = fsSrc;

        this.flatten_uniforms = [
            "uModelViewMatrix",
            "uProjectionMatrix",
            "uCameraPos",
            "uLightPos",
        ];
        for (let k in uniforms) {
            this.flatten_uniforms.push(k);
        }
        this.flatten_attribs = attribs;
    }

    setMeshAttribs(extraAttribs: string[]) {
        for (let i = 0; i < extraAttribs.length; i++) {
            this.flatten_attribs.push(extraAttribs[i]);
        }
    }

    compile(gl: WebGLRenderingContext) {
        return new Shader(gl, this.vsSrc, this.fsSrc, {
            uniforms: this.flatten_uniforms,
            attribs: this.flatten_attribs,
        });
    }
}
