import * as THREE from '../99_Lib/three.module.min.js';
import { keyboard, mouse } from './js/interaction2D.mjs';
import { add, createLine } from './js/geometry.mjs';
import { createRay } from './js/ray.mjs';

import { VRButton } from '../99_Lib/jsm/webxr/VRButton.js';
import { createVRcontrollers } from './js/vr.mjs';



console.log("ThreeJs " + THREE.REVISION);

window.onload = function () {
    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0.3, 2);

    const scene = new THREE.Scene();
    const world = new THREE.Group();
    world.matrixAutoUpdate = false;
    scene.add(world);

    scene.background = new THREE.Color(0x666666);

    const hemiLight = new THREE.HemisphereLight();
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 3);
    dirLight.position.set(5, 5, 5);
    dirLight.castShadow = true;
    dirLight.shadow.camera.zoom = 2;
    scene.add(dirLight);

    //////////////////////////////////////////////////////////////////////////////
    // FLOOR
    const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    // const floorShadowMaterial = new THREE.ShadowMaterial({ color: 0x554444 });
    const width = 0.1;
    const floor = new THREE.Mesh(
        new THREE.BoxGeometry(10, width, 10),
        floorMaterial
    );
    floor.position.y = -width / 2;
    floor.receiveShadow = true;
    floor.userData.physics = { mass: 0 };
    floor.name = "floor";
    scene.add(floor);

    const cursor = add(1, scene);
    const isMouseButton = mouse(cursor);

    let objects = [];
    let x = -0.8, y = 0.3, z = -0.5, delta = 0.4;
    for (let i = 0; i < 5; ++i) {
        objects.push(add(i, world, x, y, z)); x += delta;
    }

    const lineFunc = createLine(scene);
    const rayFunc = createRay(objects);

    let position = new THREE.Vector3();
    let rotation = new THREE.Quaternion();
    let scale = new THREE.Vector3();
    let endRay = new THREE.Vector3();
    let direction = new THREE.Vector3();

    // Renderer erstellen
    const renderer = new THREE.WebGLRenderer({
        antialias: true,
    });

    // Renderer-Parameter setzen
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    document.body.appendChild(renderer.domElement);
    document.body.appendChild(VRButton.createButton(renderer));

    //
    let last_active_controller;
    createVRcontrollers(scene, renderer, (controller, data, id) => {
        cursor.matrixAutoUpdate = false;
        cursor.visible = false;
        last_active_controller = controller;
        renderer.xr.enabled = true;
        console.log("verbinde", id, data.handedness)
    });



    const addKey = keyboard();
    addKey("Escape", active => {
        console.log("Escape", active);
    });

    let grabbed = false, squeezed = false;
    addKey(" ", active => {
        console.log("Space: Grabbed", active);
        grabbed = active;
    });

    addKey("s", active => {
        console.log("S: Squeeze", active);
        squeezed = active;
    });


    const maxDistance = 10;
    direction.set(0, 1, 0);

    let grabbedObject, initialGrabbed, distance, inverseHand, inverseWorld;
    const deltaFlyRotation = new THREE.Quaternion();
    const differenceMatrix = new THREE.Matrix4();
    const flySpeedRotationFactor = 0.01;
    const flySpeedTranslationFactor = -0.02;


    // Renderer-Loop starten
    function render() {
        if (last_active_controller) {
            cursor.matrix.copy(last_active_controller.matrix);
            squeezed = last_active_controller.userData.isSqueezeing;
            grabbed = last_active_controller.userData.isSelecting;
            direction.set(0, 0, -1);
        } else {
            direction.set(0, 1, 0);
        }

        cursor.matrix.decompose(position, rotation, scale);
        lineFunc(0, position);

        direction.applyQuaternion(rotation);

        let r;
        if (grabbedObject === undefined) {
            r = rayFunc(position, direction);
            if (r) {
                console.log(r.object.name, r.distance);
                distance = r.distance;
            } else {
                distance = maxDistance;
            }
            endRay.addVectors(position, direction.multiplyScalar(distance));
            lineFunc(1, endRay);
        }


        if (grabbed) {
            if (grabbedObject) {
                endRay.addVectors(position, direction.multiplyScalar(distance));
                lineFunc(1, endRay);
                // grabbedObject.matrix.copy(cursor.matrix.clone().multiply(initialGrabbed));
                grabbedObject.matrix.copy(inverseWorld.clone().multiply(cursor.matrix).multiply(initialGrabbed));
            } else if (r) {
                grabbedObject = r.object;
                inverseWorld = world.matrix.clone().invert();
                initialGrabbed = cursor.matrix.clone().invert().multiply(world.matrix).multiply(grabbedObject.matrix);
                // initialGrabbed = cursor.matrix.clone().invert().multiply(grabbedObject.matrix);
            }
        } else {
            grabbedObject = undefined;
        }

        if (squeezed) {
            lineFunc(1, position);
            if (inverseHand !== undefined) {
                let differenceHand = cursor.matrix.clone().multiply(inverseHand);
                differenceHand.decompose(position, rotation, scale);
                deltaFlyRotation.set(0, 0, 0, 1);
                deltaFlyRotation.slerp(rotation.conjugate(), flySpeedRotationFactor);
                differenceMatrix.compose(position.multiplyScalar(flySpeedTranslationFactor), deltaFlyRotation, scale);
                world.matrix.premultiply(differenceMatrix);
            } else {
                inverseHand = cursor.matrix.clone().invert();
            }
        } else {
            inverseHand = undefined;
        }
        renderer.render(scene, camera);
    }
    renderer.setAnimationLoop(render);
};
