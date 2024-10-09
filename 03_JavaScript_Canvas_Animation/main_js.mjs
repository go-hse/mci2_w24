import * as lib from "./js/canvas_funcs.mjs"

// Aeussere Funktion: anonym/lamda
// an Eventlistener; wird einmal nach dem Laden aufgerufen
window.onload = () => {
    const { canvas, ctx } = lib.init("canvas_id");
    ctx.fillStyle = "#f00";

    const size = 20, speed = 10, countMax = 1000;
    let x = 0, y = 0, vx = speed, vy = speed, counter = 0;
    // Haupt-Zeichnen-Funktion
    let startTime = new Date();
    function draw() {
        ctx.resetTransform();   // Zurücksetzen der Transformation
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Löschen der Zeichnung wg. Animation

        ctx.fillRect(x, y, size, size);

        // Erhöhen der Koordinaten um Geschwindigkeit
        x += vx;
        y += vy;

        // Anstossen links oder rechts
        vx = (x + size > canvas.width || x < 0) ? -vx : vx;
        vy = (y + size > canvas.height || y < 0) ? -vy : vy;

        // Geschwindigkeitsmessung
        if (++counter % countMax == 0) {
            const newTime = new Date();
            const delta = newTime - startTime;
            console.log(`${countMax} frames took ${countMax * 1000 / delta} frames/sec.`);
            startTime = newTime;
        }

        window.requestAnimationFrame(draw);
    }
    draw();
    const d = new Date().toLocaleString("de-DE");
    console.log("onload finish", d);
};

