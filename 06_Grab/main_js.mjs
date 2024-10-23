import * as lib from "./js/canvas_funcs.mjs"

// Aeussere Funktion: anonym/lamda
// an Eventlistener; wird einmal nach dem Laden aufgerufen
window.onload = () => {
    const { canvas, ctx } = lib.init("canvas_id");
    ctx.fillStyle = "#f00";

    const u = lib.u_path();


    const interactiveElements = [];
    interactiveElements.push(lib.createButton(ctx, 100, 100, 50, () => { console.log("btn A"); }));
    interactiveElements.push(lib.createButton(ctx, 200, 100, 50, () => { console.log("btn B"); }));
    // interactiveElements.push(lib.createButtonFromPath(ctx, 400, 100, u, 30, () => { console.log("btn U"); }));
    interactiveElements.push(lib.createGrabbable(ctx, 400, 100, u, 30));

    const Touches = {};

    canvas.addEventListener("touchstart", (evt) => {
        evt.preventDefault();
        for (const t of evt.changedTouches) {
            Touches[t.identifier] = { x: t.pageX, y: t.pageY };
            for (const ie of interactiveElements) {
                ie.is_touched(t.identifier, t.pageX, t.pageY);
            }

            // console.log(`finger ${t.identifier}: ${t.pageX}, ${t.pageY}`);
        }
    });

    canvas.addEventListener("touchend", (evt) => {
        evt.preventDefault();
        for (const t of evt.changedTouches) {
            delete Touches[t.identifier];
            for (const ie of interactiveElements) {
                ie.reset(t.identifier);
            }
        }
    });


    canvas.addEventListener("touchmove", (evt) => {
        evt.preventDefault();
        for (const t of evt.changedTouches) {
            Touches[t.identifier] = { x: t.pageX, y: t.pageY };
            for (const ie of interactiveElements) {
                ie.move(t.identifier, t.pageX, t.pageY);
            }
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

        for (const ie of interactiveElements) {
            ie.draw();
        }

        window.requestAnimationFrame(draw);
    }
    draw();
    const d = new Date().toLocaleString("de-DE");
    console.log("onload finish", d);
};
