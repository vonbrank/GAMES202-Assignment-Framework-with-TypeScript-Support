interface ShaderLocations {
    uniforms: string[] | null;
    attribs: string[] | null;
}

interface ProgramInfo {
    glShaderProgram: WebGLProgram;
    uniforms: { [index: string]: WebGLUniformLocation };
    attribs: { [index: string]: number };
}

export class Shader {
    gl;
    program;

    constructor(
        gl: WebGLRenderingContext,
        vsSrc: string,
        fsSrc: string,
        shaderLocations: ShaderLocations
    ) {
        this.gl = gl;
        const vs = this.compileShader(vsSrc, gl.VERTEX_SHADER);
        const fs = this.compileShader(fsSrc, gl.FRAGMENT_SHADER);

        this.program = this.addShaderLocations(
            {
                glShaderProgram: this.linkShader(vs, fs),
                uniforms: {},
                attribs: {},
            },
            shaderLocations
        );
    }

    compileShader(shaderSource: string, shaderType: number) {
        const gl = this.gl;
        var shader = gl.createShader(shaderType);

        if (shader === null) throw new Error("shader creator error");

        gl.shaderSource(shader, shaderSource);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error(shaderSource);
            console.error(
                "shader compiler error:\n" + gl.getShaderInfoLog(shader)
            );
        }

        return shader;
    }

    linkShader(vs: WebGLShader, fs: WebGLShader) {
        const gl = this.gl;
        var prog = gl.createProgram();

        if (!prog) {
            throw new Error("shader creator error");
        }

        gl.attachShader(prog, vs);
        gl.attachShader(prog, fs);
        gl.linkProgram(prog);

        if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
            throw new Error(
                `shader linker error:\n ${gl.getProgramInfoLog(prog)}`
            );
        }
        return prog;
    }

    addShaderLocations(
        result: ProgramInfo,
        shaderLocations: ShaderLocations | null
    ) {
        const gl = this.gl;
        result.uniforms = {};
        result.attribs = {};

        if (
            shaderLocations &&
            shaderLocations.uniforms &&
            shaderLocations.uniforms.length
        ) {
            for (let i = 0; i < shaderLocations.uniforms.length; ++i) {
                result.uniforms = Object.assign(result.uniforms, {
                    [shaderLocations.uniforms[i]]: gl.getUniformLocation(
                        result.glShaderProgram,
                        shaderLocations.uniforms[i]
                    ),
                });
            }
        }
        if (
            shaderLocations &&
            shaderLocations.attribs &&
            shaderLocations.attribs.length
        ) {
            for (let i = 0; i < shaderLocations.attribs.length; ++i) {
                result.attribs = Object.assign(result.attribs, {
                    [shaderLocations.attribs[i]]: gl.getAttribLocation(
                        result.glShaderProgram,
                        shaderLocations.attribs[i]
                    ),
                });
            }
        }

        return result;
    }
}
