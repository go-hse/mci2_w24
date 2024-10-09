import * as lib from "./js/canvas_funcs.mjs"

// Aeussere Funktion: anonym/lamda
// an Eventlistener; wird einmal nach dem Laden aufgerufen
window.onload = () => {
    const { canvas, ctx } = lib.init("canvas_id");

    function drawStarWithParas(ctx) {
        lib.drawStar(ctx, 100, 100, 5, 50, 30);
    }

    const drawFuncs = [lib.drawRotatedRect, lib.rect, ctx => lib.drawStar(ctx, 100, 100, 5, 50, 30), lib.drawGradient];

    // Haupt-Zeichnen-Funktion
    function draw() {
        ctx.resetTransform();   // Zurücksetzen der Transformation
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Löschen der Zeichnung wg. Animation

        const deltaX = canvas.width / drawFuncs.length;
        let startX = 0;
        for (const func of drawFuncs) {
            ctx.resetTransform();
            ctx.translate(startX, 0);
            func(ctx);
            startX += deltaX;
        }

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

