import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { WebGLRenderer } from "./renderers/WebGLRenderer";
import { DirectionalLight } from "./lights/DirectionalLight";
import { loadOBJ } from "./loads/loadOBJ";
import * as dat from "dat.gui";
import { vec3 } from "gl-matrix";

var cameraPosition = [30, 30, 30];

//生成的纹理的分辨率，纹理必须是标准的尺寸 256*256 1024*1024  2048*2048
export var resolution = 2048;

export interface Transform {
    modelTransX: number;
    modelTransY: number;
    modelTransZ: number;
    modelScaleX: number;
    modelScaleY: number;
    modelScaleZ: number;
}

export function GAMES202Main() {
    // Init canvas and gl
    const canvas = document.querySelector<HTMLCanvasElement>("#glcanvas");

    if (canvas === null) {
        throw "can not find element #glcanvas";
    }

    canvas.width = window.screen.width;
    canvas.height = window.screen.height;
    const gl = canvas.getContext("webgl");
    if (!gl) {
        alert(
            "Unable to initialize WebGL. Your browser or machine may not support it."
        );
        return;
    }

    // Add camera
    const camera = new THREE.PerspectiveCamera(
        75,
        canvas.clientWidth / canvas.clientHeight,
        1e-2,
        1000
    );
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
    cameraControls.target.set(0, 0, 0);

    // Add renderer
    const renderer = new WebGLRenderer(gl, camera);

    // Add lights
    // light - is open shadow map == true
    let lightPos: vec3 = [0, 80, 80];
    let focalPoint: vec3 = [0, 0, 0];
    let lightUp: vec3 = [0, 1, 0];
    const directionLight = new DirectionalLight(
        5000,
        [1, 1, 1],
        lightPos,
        focalPoint,
        lightUp,
        true,
        renderer.gl
    );
    renderer.addLight(directionLight);

    // Add shapes

    let floorTransform = setTransform(0, 0, -30, 4, 4, 4);
    let obj1Transform = setTransform(0, 0, 0, 20, 20, 20);
    let obj2Transform = setTransform(40, 0, -40, 10, 10, 10);

    loadOBJ(renderer, "assets/mary/", "Marry", "PhongMaterial", obj1Transform);
    loadOBJ(renderer, "assets/mary/", "Marry", "PhongMaterial", obj2Transform);
    loadOBJ(
        renderer,
        "assets/floor/",
        "floor",
        "PhongMaterial",
        floorTransform
    );

    // let floorTransform = setTransform(0, 0, 0, 100, 100, 100);
    // let cubeTransform = setTransform(0, 50, 0, 10, 50, 10);
    // let sphereTransform = setTransform(30, 10, 0, 10, 10, 10);

    //loadOBJ(renderer, 'assets/basic/', 'cube', 'PhongMaterial', cubeTransform);
    // loadOBJ(renderer, 'assets/basic/', 'sphere', 'PhongMaterial', sphereTransform);
    //loadOBJ(renderer, 'assets/basic/', 'plane', 'PhongMaterial', floorTransform);

    function createGUI() {
        const gui = new dat.GUI();
        // const panelModel = gui.addFolder('Model properties');
        // panelModelTrans.add(GUIParams, 'x').name('X');
        // panelModel.open();
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
    s_z: number
) {
    const transform: Transform = {
        modelTransX: t_x,
        modelTransY: t_y,
        modelTransZ: t_z,
        modelScaleX: s_x,
        modelScaleY: s_y,
        modelScaleZ: s_z,
    };

    return transform;
}
