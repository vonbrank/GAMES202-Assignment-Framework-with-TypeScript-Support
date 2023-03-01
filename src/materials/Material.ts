import { Shader } from "../shaders/Shader";
import { Texture } from "../textures/Texture";
import { FBO } from "../textures/FBO";
import { vec3, mat4 } from 'gl-matrix';
type Uniform =
    | {
          type: "texture";
          value: Texture | FBO;
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
          value: vec3;
      }
    | {
          type: "uKd";
          value: number[];
      }
    | {
          type: "matrix4fv";
          value: mat4;
      };

export class Material {
    private flatten_uniforms;
    private flatten_attribs;
    private vsSrc;
    private fsSrc;
    // Uniforms is a map, attribs is a Array
    uniforms;
    attribs;
    frameBuffer;

    constructor(
        uniforms: {
            [index: string]: Uniform;
        },
        attribs: string[],
        vsSrc: string,
        fsSrc: string,
        frameBuffer: WebGLFramebuffer | null
    ) {
        this.uniforms = uniforms;
        this.attribs = attribs;
        this.vsSrc = vsSrc;
        this.fsSrc = fsSrc;

        this.flatten_uniforms = [
            "uViewMatrix",
            "uModelMatrix",
            "uProjectionMatrix",
            "uCameraPos",
            "uLightPos",
        ];
        for (let k in uniforms) {
            this.flatten_uniforms.push(k);
        }
        this.flatten_attribs = attribs;

        this.frameBuffer = frameBuffer;
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
