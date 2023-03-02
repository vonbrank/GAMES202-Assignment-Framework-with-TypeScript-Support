import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { WebGLRenderer } from "./renderers/WebGLRenderer";
import { DirectionalLight } from "./lights/DirectionalLight";
import { loadOBJ } from "./loads/loadOBJ";
import * as dat from "dat.gui";
import { vec3 } from "gl-matrix";
import { FBO } from "./textures/FBO";
import { loadGLTF } from "./loads/loadGLTF";
import { LightDir } from "./lights/Light";

export var gl: WebGLRenderingContext, gl_draw_buffers: WEBGL_draw_buffers;

export var bufferFBO: WebGLFramebuffer | null = null;
var bumpMap;

export interface Transform {
    modelTransX: number;
    modelTransY: number;
    modelTransZ: number;
    modelScaleX: number;
    modelScaleY: number;
    modelScaleZ: number;
    modelRotateX: number;
    modelRotateY: number;
    modelRotateZ: number;
}

export class Camera extends THREE.PerspectiveCamera {
    fbo;
    constructor(
        fov: number | undefined,
        aspect: number | undefined,
        near: number | undefined,
        far: number | undefined,
        fbo: FBO
    ) {
        super(fov, aspect, near, far);
        this.fbo = fbo;
    }
}

export function GAMES202Main() {
    // Init canvas
    const canvas = document.querySelector<HTMLCanvasElement>("#glcanvas");

    if (canvas === null) {
        throw new Error("can not find element #glcanvas");
    }

    canvas.width = window.screen.width;
    canvas.height = window.screen.height;
    // Init gl
    const webgl_context = canvas.getContext("webgl");
    if (!webgl_context) {
        throw new Error(
            "Unable to initialize WebGL. Your browser or machine may not support it."
        );
    }
    gl = webgl_context;

    gl.getExtension("OES_texture_float");
    const webgl_draw_buffers = gl.getExtension("WEBGL_draw_buffers");
    if (webgl_draw_buffers === null) {
        throw new Error("failed to get webgl draw buffers");
    }
    gl_draw_buffers = webgl_draw_buffers;
    var maxdb = gl.getParameter(gl_draw_buffers.MAX_DRAW_BUFFERS_WEBGL);
    console.log("MAX_DRAW_BUFFERS_WEBGL: " + maxdb);

    // Add camera
    const camera = new Camera(
        75,
        canvas.clientWidth / canvas.clientHeight,
        1e-3,
        1000,
        new FBO(gl)
    );
    let cameraPosition, cameraTarget;
    // /*
    // Cube
    cameraPosition = [6, 1, 0];
    cameraTarget = [0, 0, 0];
    // */
    /*
	// Cave
	cameraPosition = [4.18927, 1.0313, 2.07331]
	cameraTarget = [2.92191, 0.98, 1.55037]
	*/
    camera.position.set(
        cameraPosition[0],
        cameraPosition[1],
        cameraPosition[2]
    );

    // Add resize listener
    function setSize(width: number, height: number) {
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    }
    setSize(canvas.clientWidth, canvas.clientHeight);
    window.addEventListener("resize", () =>
        setSize(canvas.clientWidth, canvas.clientHeight)
    );

    // Add camera control
    const cameraControls = new OrbitControls(camera, canvas);
    cameraControls.enableZoom = true;
    cameraControls.enableRotate = true;
    cameraControls.enablePan = true;
    cameraControls.rotateSpeed = 0.3;
    cameraControls.zoomSpeed = 1.0;
    cameraControls.panSpeed = 0.8;
    cameraControls.target.set(
        cameraTarget[0],
        cameraTarget[1],
        cameraTarget[2]
    );

    // Add renderer
    const renderer = new WebGLRenderer(gl, camera);

    // Add light
    let lightPos: vec3, lightDir: LightDir, lightRadiance: vec3;
    /*
	// Cave
	lightRadiance = [20, 20, 20];
	lightPos = [-0.45, 5.40507, 0.637043];
	lightDir = {
		'x': 0.39048811,
		'y': -0.89896828,
		'z': 0.19843153,
	};
	*/
    // /*
    // Cube
    lightRadiance = [1, 1, 1];
    lightPos = [-2, 4, 1];
    lightDir = {
        x: 0.4,
        y: -0.9,
        z: -0.2,
    };
    // */
    let lightUp: vec3 = [1, 0, 0];
    const directionLight = new DirectionalLight(
        lightRadiance,
        lightPos,
        lightDir,
        lightUp,
        renderer.gl
    );
    renderer.addLight(directionLight);

    // Add shapes
    loadGLTF(renderer, "assets/cube/", "cube1", "SSRMaterial");
    // loadGLTF(renderer, 'assets/cube/', 'cube2', 'SSRMaterial');
    // loadGLTF(renderer, 'assets/cave/', 'cave', 'SSRMaterial');

    function createGUI() {
        const gui = new dat.GUI();
        const lightPanel = gui.addFolder("Directional Light");
        lightPanel.add(renderer.lights[0].entity.lightDir, "x", -10, 10, 0.1);
        lightPanel.add(renderer.lights[0].entity.lightDir, "y", -10, 10, 0.1);
        lightPanel.add(renderer.lights[0].entity.lightDir, "z", -10, 10, 0.1);
        lightPanel.open();
    }
    createGUI();

    function mainLoop(now: number) {
        cameraControls.update();

        renderer.render();
        requestAnimationFrame(mainLoop);
    }
    requestAnimationFrame(mainLoop);
}

export function setTransform(
    t_x: number,
    t_y: number,
    t_z: number,
    s_x: number,
    s_y: number,
    s_z: number,
    r_x = 0,
    r_y = 0,
    r_z = 0
) {
    return {
        modelTransX: t_x,
        modelTransY: t_y,
        modelTransZ: t_z,
        modelScaleX: s_x,
        modelScaleY: s_y,
        modelScaleZ: s_z,
        modelRotateX: r_x,
        modelRotateY: r_y,
        modelRotateZ: r_z,
    } as Transform;
}
