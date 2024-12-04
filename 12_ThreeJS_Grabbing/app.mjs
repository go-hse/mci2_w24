import * as THREE from '../99_Lib/three.module.min.js';
import { add, createLine } from './js/geometry.mjs';
import { keyboard, mouse } from './js/interaction2D.mjs';
import { createRay } from './js/ray.mjs';

console.log("ThreeJs " + THREE.REVISION);

window.onload = function () {

    // Szene
    const scene = new THREE.Scene();
    // Lichter
    scene.add(new THREE.HemisphereLight(0x808080, 0x606060));
    const light = new THREE.DirectionalLight(0xffffff);
    light.position.set(0, 2, 1);
    scene.add(light);
    // Kamera
    const camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 0.3);
    scene.add(camera);

    // Cursor-Geometry bzw. Mesh
    const cursor = add(1, scene);
    cursor.position.z = -0.5;

    // Cursor mit 2D-Maus steuern
    mouse(cursor);

    const arr = [];
    let count = 0;

    const delta = 0.3, z = -3;
    for (let x = -1; x <= 1; x += delta) {
        for (let y = -1; y <= 1; y += delta) {
            if (++count % 2 == 0)
                arr.push(add(6, scene, x, y, z));
            else
                arr.push(add(4, scene, x, y, z));
        }
    }

    const menuItems = [];
    for (let x = -1; x <= 1; x += 1) {
        menuItems.push(add(0, scene, x, 0, z + 1));
    }

    for (let i = 0; i < arr.length; ++i) {
        arr[i].name = `o_${i}`;
    }

    const lineFunc = createLine(scene);

    let position = new THREE.Vector3();
    let rotation = new THREE.Quaternion();
    let scale = new THREE.Vector3();
    let direction = new THREE.Vector3();
    let endRay = new THREE.Vector3();

    // Renderer erstellen
    const renderer = new THREE.WebGLRenderer({
        antialias: true,
    });

    const addKey = keyboard();
    const maxDistance = 10;

    let grabbed = false;
    addKey(" ", active => {
        console.log("Space: Grabbed", active);
        grabbed = active;
    });

    const rayFunc = createRay(arr);

    // Renderer-Parameter setzen
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);


    let grabbedObject, initialGrabbed, distance, selected;

    // Renderer-Loop starten
    const diff = new THREE.Vector3();
    function render() {
        cursor.matrix.decompose(position, rotation, scale);
        direction.set(0, 1, 0);
        direction.applyQuaternion(rotation);

        const distances = menuItems.map(item => diff.subVectors(item.position, position).cross(direction).length());
        const minSelect = distances.indexOf(Math.min(...distances));
        if (minSelect !== selected) {
            selected = minSelect;
            console.log(distances, minSelect);
            for (let i = 0; i < menuItems.length; ++i) {
                menuItems[i].material.color.set(0x888888);
            }
            menuItems[selected].material.color.set(0xffaaaa);
        }


        lineFunc(1, position);

        direction.normalize();

        // false: undefined; 0, null, ""
        const intersectObject = rayFunc(position, direction);
        if (intersectObject) {
            // console.log(intersectObject.object.name);
            endRay.addVectors(position, direction.multiplyScalar(intersectObject.distance));
            distance = intersectObject.distance;
        } else {
            endRay.addVectors(position, direction.multiplyScalar(maxDistance));
            distance = maxDistance;
        }


        if (grabbed) {
            if (grabbedObject) {
                endRay.addVectors(position, direction.multiplyScalar(distance));
                lineFunc(1, endRay);
                grabbedObject.matrix.copy(cursor.matrix.clone().multiply(initialGrabbed));
            } else if (intersectObject) {
                grabbedObject = intersectObject.object;
                initialGrabbed = cursor.matrix.clone().invert().multiply(grabbedObject.matrix);
            }
        } else {
            grabbedObject = undefined;
        }


        lineFunc(0, endRay);

        renderer.render(scene, camera);
    }
    renderer.setAnimationLoop(render);


};
