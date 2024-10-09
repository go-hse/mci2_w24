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
        const now = new Date();
        let hours = now.getHours();
        if (hours > 12) hours -= 12;
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();


        ctx.resetTransform();   // Zurücksetzen der Transformation
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Löschen der Zeichnung wg. Animation

        // 1. Verschiebung in die Mitte des Bildschirms
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(-2 * hourAngle);

        ctx.save();
        ctx.fillStyle = "#f00";
        ctx.rotate(-hourAngle + seconds * Math.PI / 30);
        ctx.fillRect(0, 0, radius + size, 1);
        ctx.restore();

        ctx.save();
        ctx.fillStyle = "#000";
        ctx.rotate(-hourAngle + minutes * Math.PI / 30);
        ctx.fillRect(0, 0, radius + size, 3);
        ctx.restore();

        ctx.save();
        ctx.fillStyle = "#000";
        ctx.rotate(-hourAngle + hours * Math.PI / 6);
        ctx.fillRect(0, 0, radius, 6);
        ctx.restore();

        ctx.save();
        ctx.fillStyle = "#000";
        for (let i = 0; i < 12; ++i) {
            ctx.fillRect(radius, 0, size, 1);
            ctx.save();
            ctx.translate(radius + size + 5, 0);
            ctx.rotate(Math.PI / 2 - (i + 1) * hourAngle);
            ctx.fillText(`${i + 1}`, 0, 0);
            ctx.restore();
            ctx.rotate(hourAngle);
        }
        ctx.restore();




        window.requestAnimationFrame(draw);
    }
    draw();
    const d = new Date().toLocaleString("de-DE");
    console.log("onload finish", d);
};
// https://prod.liveshare.vsengsaas.visualstudio.com/join?883342D3E7B3C3B21469F3AF099A56F21B59
