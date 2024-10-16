import * as lib from "./js/canvas_funcs.mjs"

// Aeussere Funktion: anonym/lamda
// an Eventlistener; wird einmal nach dem Laden aufgerufen
window.onload = () => {
    const { canvas, ctx } = lib.init("canvas_id");
    ctx.fillStyle = "#f00";

    const PIH = Math.PI / - 2;


    ctx.fillStyle = 'black';

    function pad(num, size) {
        let s = num + "";
        while (s.length < size) s = "0" + s;
        return s;
    }


    // Haupt-Zeichnen-Funktion
    function draw() {
        ctx.resetTransform();
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.translate(ctx.canvas.width / 2, ctx.canvas.height / 2);

        const fontsize = canvas.width / 6;
        const border = fontsize / 10;
        ctx.font = `${fontsize}px Verdana`

        const radius = canvas.width / 5, hourAngle = Math.PI / 6;


        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();

        ctx.rotate(-Math.PI / 2);
        ctx.lineCap = "round";
        ctx.scale(3, 3);
        ctx.save();
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#000";

        for (let i = 0; i < 60; ++i) {
            if (i % 5 == 0) {
                ctx.beginPath();
                ctx.moveTo(radius, 0);
                ctx.lineTo(radius + 12, 0);
                ctx.closePath();
                ctx.stroke();
            } else {
                ctx.beginPath();
                ctx.moveTo(radius, 0);
                ctx.lineTo(radius + 5, 0);
                ctx.closePath();
                ctx.stroke();
            }
            ctx.rotate(Math.PI / 30);
        }
        ctx.restore();

        // hrs: 0-11: 2xPI/12 --> PI/6
        ctx.save();
        ctx.rotate(hours * hourAngle + (Math.PI / 360) * minutes + (Math.PI / 21600) * seconds)

        ctx.strokeStyle = "#000";
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.lineCap = "round";
        ctx.moveTo(0, 0);
        ctx.lineTo(60, 0);
        ctx.stroke();
        ctx.restore();

        // min: 0-59: 2xPI/60 --> PI/30
        ctx.save();
        ctx.rotate((Math.PI / 30) * minutes + (Math.PI / 1800) * seconds)
        ctx.strokeStyle = "#555";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(80, 0);
        ctx.stroke();
        ctx.restore();

        // sec: 0-59: 2xPI/60 --> PI/30
        ctx.rotate(seconds * Math.PI / 30);
        ctx.strokeStyle = "#f66";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-5, 0);
        ctx.lineTo(100, 0);
        ctx.stroke();

        ctx.resetTransform();
        const txt = `${pad(hours, 2)}:${pad(minutes, 2)}:${pad(seconds, 2)}`;
        const bb = ctx.measureText(txt);
        const height = bb.actualBoundingBoxAscent + bb.actualBoundingBoxDescent;
        console.log(bb.width, height);

        ctx.translate(ctx.canvas.width / 2, ctx.canvas.height / 2);

        ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
        ctx.fillRect(-bb.width / 2, -40 - height - border, bb.width, height + 2 * border);

        ctx.fillStyle = "#fff";
        ctx.fillText(txt, -bb.width / 2, -40);

        window.requestAnimationFrame(draw);
    }
    draw();
    const d = new Date().toLocaleString("de-DE");
    console.log("onload finish", d);
};
