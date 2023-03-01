import { vec3 } from "gl-matrix";
import { Transform } from "../engine";

class TRSTransform {
    translate;
    scale;

    constructor(translate: vec3 = [0, 0, 0], scale: vec3 = [1, 1, 1]) {
        this.translate = translate;
        this.scale = scale;
    }
}

interface AttribType {
    name: string;
    array: Float32Array;
}

export class Mesh {
    indices;
    count;
    hasVertices;
    hasNormals;
    hasTexcoords;

    transform;

    vertices = new Float32Array();
    verticesName = "";

    normals = new Float32Array();
    normalsName = "";

    texcoords = new Float32Array();
    texcoordsName = "";

    constructor(
        verticesAttrib: AttribType,
        normalsAttrib: AttribType | null,
        texcoordsAttrib: AttribType | null,
        indices: number[],
        transform: Transform
    ) {
        this.indices = indices;
        this.count = indices.length;
        this.hasVertices = false;
        this.hasNormals = false;
        this.hasTexcoords = false;

        const modelTranslation: vec3 = [
            transform.modelTransX,
            transform.modelTransY,
            transform.modelTransZ,
        ];
        const modelScale: vec3 = [
            transform.modelScaleX,
            transform.modelScaleY,
            transform.modelScaleZ,
        ];
        let meshTrans = new TRSTransform(modelTranslation, modelScale);
        this.transform = meshTrans;

        let extraAttribs = [];

        if (verticesAttrib != null) {
            this.hasVertices = true;
            this.vertices = verticesAttrib.array;
            this.verticesName = verticesAttrib.name;
        }
        if (normalsAttrib != null) {
            this.hasNormals = true;
            this.normals = normalsAttrib.array;
            this.normalsName = normalsAttrib.name;
        }
        if (texcoordsAttrib != null) {
            this.hasTexcoords = true;
            this.texcoords = texcoordsAttrib.array;
            this.texcoordsName = texcoordsAttrib.name;
        }
    }

    static cube(transform: Transform) {
        const positions = [
            // Front face
            -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0,

            // Back face
            -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0,

            // Top face
            -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0,

            // Bottom face
            -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, -1.0, -1.0, 1.0,

            // Right face
            1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0,

            // Left face
            -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0,
        ];
        const indices = [
            0,
            1,
            2,
            0,
            2,
            3, // front
            4,
            5,
            6,
            4,
            6,
            7, // back
            8,
            9,
            10,
            8,
            10,
            11, // top
            12,
            13,
            14,
            12,
            14,
            15, // bottom
            16,
            17,
            18,
            16,
            18,
            19, // right
            20,
            21,
            22,
            20,
            22,
            23, // left
        ];

        return new Mesh(
            { name: "aVertexPosition", array: new Float32Array(positions) },
            null,
            null,
            indices,
            transform
        );
    }
}
