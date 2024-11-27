import * as THREE from '../99_Lib/three.module.min.js';
import { add } from './js/geometry.mjs';
import { keyboard, mouse } from './js/interaction2D.mjs';

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

    const addKey = keyboard();

    addKey("a", active => { console.log(`a ist ${active}`) });
    addKey(" ", active => { console.log(`SPACE ist ${active}`) });

    const arr = [];
    let count = 0;

    const cursor = add(1, scene);
    mouse(cursor);

    const menuItems = [];
    for (let x = -2; x <= 2; x += 0.5) {
        for (let y = -2; y <= 2; y += 0.5) {
            menuItems.push(add(0, scene, x, y, -5))
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
    let startTime = new Date();

    let position = new THREE.Vector3();
    let rotation = new THREE.Quaternion();
    let scale = new THREE.Vector3();
    let direction = new THREE.Vector3();
    let diff = new THREE.Vector3();
    // Renderer-Loop starten
    {
        const x = Math.random() * 0.1;
        const y = Math.random() * 0.1;
        const z = Math.random() * 0.1;

        let selected = 0;
        function render() {
            const t = (new Date().getMilliseconds()).toFixed() % 100;
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
            renderer.render(scene, camera);
            const now = new Date();
            const delta = now - startTime;
            startTime = now;
            // console.log(`delta ${delta / 1000} sec`);
        }
        renderer.setAnimationLoop(render);
    }

};
