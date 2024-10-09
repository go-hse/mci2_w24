import * as lib from "./js/canvas_funcs.mjs"

// Aeussere Funktion: anonym/lamda
// an Eventlistener; wird einmal nach dem Laden aufgerufen
window.onload = () => {
    const { canvas, ctx } = lib.init("canvas_id");
    ctx.fillStyle = "#f00";

    const size = 50;
    const radius = 100, hourAngle = Math.PI / 6;
    const PIH = Math.PI / - 2;

    ctx.font = '10px Verdana';
    ctx.fillStyle = 'green';

    // Haupt-Zeichnen-Funktion
    function draw() {
        ctx.resetTransform();   // Zurücksetzen der Transformation
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Löschen der Zeichnung wg. Animation

        // 1. Verschiebung in die Mitte des Bildschirms
        ctx.translate(canvas.width / 2, canvas.height / 2);

        ctx.rotate(-2 * hourAngle);

        // 2. Schleife über 12 Einheiten / Stunden
        for (let i = 0; i < 12; ++i) {
            // 4. Zeichne schmales Rechteck
            ctx.fillRect(radius, 0, size, 2);

            ctx.save();
            ctx.translate(radius + 2 * size, 0);
            ctx.rotate(Math.PI / 2 - (i + 1) * hourAngle);
            ctx.fillText(`${i + 1}`, 0, 0);
            ctx.restore();

            // 3. Drehe um 30 Grad = 360 / 12; 2PI / 12 = Math.PI / 12;
            ctx.rotate(hourAngle);
        }

        window.requestAnimationFrame(draw);
    }
    draw();
    const d = new Date().toLocaleString("de-DE");
    console.log("onload finish", d);
};
// https://prod.liveshare.vsengsaas.visualstudio.com/join?883342D3E7B3C3B21469F3AF099A56F21B59
