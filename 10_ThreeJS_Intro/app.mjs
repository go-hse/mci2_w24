import * as THREE from '../99_Lib/three.module.min.js';
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
    const camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 1);
    scene.add(camera);
    //Geometrie
    const box = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.1, 0.1), new THREE.MeshStandardMaterial({
        color: 0xff33ff,
        roughness: 0.7,
        metalness: 0.0,
    }));
    scene.add(box);

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
        box.rotation.x += 0.01;
        // box.rotation.y += 0.01;
        renderer.render(scene, camera);
    }
    renderer.setAnimationLoop(render);

};
