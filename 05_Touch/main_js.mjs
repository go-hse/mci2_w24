import * as lib from "./js/canvas_funcs.mjs"

// Aeussere Funktion: anonym/lamda
// an Eventlistener; wird einmal nach dem Laden aufgerufen
window.onload = () => {
    const { canvas, ctx } = lib.init("canvas_id");
    ctx.fillStyle = "#f00";


    const Touches = {};

    canvas.addEventListener("touchstart", (evt) => {
        evt.preventDefault();
        for (const t of evt.changedTouches) {
            Touches[t.identifier] = { x: t.pageX, y: t.pageY };
            // console.log(`finger ${t.identifier}: ${t.pageX}, ${t.pageY}`);
        }
    });

    canvas.addEventListener("touchend", (evt) => {
        evt.preventDefault();
        for (const t of evt.changedTouches) {
            delete Touches[t.identifier];
        }
    });


    canvas.addEventListener("touchmove", (evt) => {
        evt.preventDefault();
        for (const t of evt.changedTouches) {
            Touches[t.identifier] = { x: t.pageX, y: t.pageY };
        }
    });


    // Haupt-Zeichnen-Funktion
    function draw() {
        ctx.resetTransform();
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        const ids = Object.keys(Touches);
        // console.log(ids);
        for (const identifier of ids) {
            const t = Touches[identifier];
            lib.drawStar(ctx, t.x, t.y, 6, 40, 30);
        }

        window.requestAnimationFrame(draw);
    }
    draw();
    const d = new Date().toLocaleString("de-DE");
    console.log("onload finish", d);
};
