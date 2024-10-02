import * as lib from "./js/canvas_funcs.mjs"

// Aeussere Funktion: anonym/lamda
// an Eventlistener; wird einmal nach dem Laden aufgerufen
window.onload = () => {
    // Kontext oder Scope / Gültigkeitbereich
    const { canvas, context } = lib.init("canvas_id");

    // inner Funktion draw
    function draw() {
        context.clearRect(0, 0, canvas.Width, canvas.height);

        // ab hier wird in dieser Farbe gefüllt
        context.fillStyle = "#f00";

        // rechteck malen
        context.fillRect(10, 40, 200, 100);

        // rand zeichnen
        context.strokeStyle = "#00f";
        context.lineWidth = 3;
        context.strokeRect(10, 40, 200, 100);
    }

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        draw();
    }
    window.addEventListener("resize", resize);

    resize();
    draw();

};

