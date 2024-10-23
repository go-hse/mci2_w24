import * as lib from "./js/canvas_funcs.mjs"

// Aeussere Funktion: anonym/lamda
// an Eventlistener; wird einmal nach dem Laden aufgerufen
window.onload = () => {
    const { canvas, ctx } = lib.init("canvas_id");
    ctx.fillStyle = "#f00";

    const u = lib.u_path();


    const interactiveElements = [];
    const Touches = {}, points = []
    let lineColor = "#f00";
    interactiveElements.push(lib.createButton(ctx, 100, 100, 50, () => { lineColor = "#f00"; }));
    interactiveElements.push(lib.createButton(ctx, 200, 100, 50, () => { lineColor = "#0f0"; }));
    // interactiveElements.push(lib.createButtonFromPath(ctx, 400, 100, u, 30, () => { console.log("btn U"); }));
    interactiveElements.push(lib.createGrabbable(ctx, 400, 100, u, 30));


    canvas.addEventListener("touchstart", (evt) => {
        evt.preventDefault();
        for (const t of evt.changedTouches) {
            Touches[t.identifier] = { x: t.pageX, y: t.pageY };
            for (const ie of interactiveElements) {
                ie.is_touched(t.identifier, t.pageX, t.pageY);
            }
            points.push({ isStart: true, lineColor, x: t.pageX, y: t.pageY });
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
            points.push({ isStart: false, lineColor, x: t.pageX, y: t.pageY });
        }
    });

    function drawLines() {
        ctx.lineWidth = 3;
        ctx.beginPath();
        for (let p of points) {
            if (p.isStart) {
                ctx.stroke();
                ctx.strokeStyle = p.lineColor;
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
            } else {
                ctx.lineTo(p.x, p.y);
            }
        }
        ctx.stroke();

    }

    // Haupt-Zeichnen-Funktion
    function draw() {
        ctx.resetTransform();
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);


        for (const ie of interactiveElements) {
            ie.draw();
        }

        const ids = Object.keys(Touches);
        // console.log(ids);
        for (const identifier of ids) {
            const t = Touches[identifier];
            lib.drawStar(ctx, t.x, t.y, 6, 12, 8);
        }

        drawLines();

        window.requestAnimationFrame(draw);
    }
    draw();
    const d = new Date().toLocaleString("de-DE");
    console.log("onload finish", d);
};
