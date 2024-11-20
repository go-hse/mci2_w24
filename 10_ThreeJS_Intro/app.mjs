import * as THREE from '../99_Lib/three.module.min.js';
import { add } from './js/geometry.mjs';

console.log("ThreeJs " + THREE.REVISION);
window.onload = function () {

    // Szene
    const scene = new THREE.Scene();
    //Lichter
    scene.add(new THREE.HemisphereLight(0xffffff, 0x606060));
    const light = new THREE.DirectionalLight(0xffffff);
    light.position.set(0, 2, 2);
    scene.add(light);
    // Kamera
    const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 1);
    scene.add(camera);
    //Geometrie

    const arr = [];
    let count = 0;

    const delta = 0.3, z = -1;
    for (let x = -2; x <= 2; x += delta * 2) {
        for (let y = -1; y <= 1; y += delta) {
            if (++count % 2 == 0)
                arr.push(add(6, scene, x, y, z));
            else
                arr.push(add(1, scene, x, y, z));
        }

    }

    // Renderer erstellen
    const renderer = new THREE.WebGLRenderer({
        antialias: false,
    });
    // Renderer-Parameter setzen
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    // Renderer-Loop starten
    function render() {
        const t = (new Date().getMilliseconds()).toFixed() % 100;
        const x = Math.random() * 0.01;
        const y = Math.random() * 0.01;
        const z = Math.random() * 0.01;
        for (const o of arr) {
            o.rotation.x += x;
            o.rotation.y += y;
            o.rotation.z += z;
        }

        renderer.render(scene, camera);
    }
    renderer.setAnimationLoop(render);

};
