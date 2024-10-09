import * as lib from "./js/canvas_funcs.mjs"

// Aeussere Funktion: anonym/lamda
// an Eventlistener; wird einmal nach dem Laden aufgerufen
window.onload = () => {
    // Kontext oder Scope / Gültigkeitbereich
    const { canvas, context } = lib.init("canvas_id");
    const ctx = context;
    // inner Funktion draw

    // drawRotatedRect();
    // drawGradient();


    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener("resize", resize);

    const drawFuncs = [lib.rect, ctx => lib.drawStar(ctx, 100, 100, 5, 50, 30), lib.drawGradient, lib.drawRotatedRect];

    function draw() {
        ctx.resetTransform();
        ctx.clearRect(0, 0, canvas.width, canvas.height);

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


    resize();
    draw();

};

