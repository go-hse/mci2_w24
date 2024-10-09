import * as lib from "./js/canvas_funcs.mjs"

// Aeussere Funktion: anonym/lamda
// an Eventlistener; wird einmal nach dem Laden aufgerufen
window.onload = () => {
    const { canvas, ctx } = lib.init("canvas_id");



    // Haupt-Zeichnen-Funktion
    function draw() {
        ctx.resetTransform();   // Zurücksetzen der Transformation
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Löschen der Zeichnung wg. Animation

        ctx.fillStyle = "#f00";
        ctx.fillRect(10, 10, 20, 20);

        window.requestAnimationFrame(draw);
    }

    // KEINE ENDLOS-SCHLEIFE
    // while (true) {
    //     draw();
    // }

    draw();

    const d = new Date().toLocaleString("de-DE");
    console.log("onload finish", d);

};

