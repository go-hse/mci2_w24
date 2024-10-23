

// Parameter: id:string des HTML-Canvas
export function init(id) {
    const canvas = document.getElementById(id);
    // console.log(canvas);
    const ctx = canvas.getContext("2d");  // 

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        // console.log(`${canvas.width}x${canvas.height}`)
    }
    resize();
    window.addEventListener("resize", resize);

    return { canvas, ctx };
}

function distance(x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
}

export function createButton(ctx, x, y, radius, callback) {
    let touched = false, identifier;

    function draw() {
        if (touched) circle(ctx, x, y, radius, "red");
        else circle(ctx, x, y, radius, "gray");
    }

    function is_touched(id, tx, ty) {
        touched = distance(x, y, tx, ty) < radius;
        if (touched) {
            identifier = id;
            callback();
        }
    }

    function reset(id) {
        if (id === identifier) {
            touched = false;
            identifier = undefined;
        }
    }

    return { draw, is_touched, reset };

}

export function createButtonFromPath(ctx, x, y, p, sc, callback) {
    let touched = false, identifier, M;

    function draw() {
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(sc, sc);
        M = ctx.getTransform();
        if (touched) path(ctx, p, "#f00", "#f00", 1);
        else path(ctx, p, "#aaa", "#aaa", 1);

        ctx.restore();
    }

    function is_touched(id, tx, ty) {
        const I = (new DOMMatrix(M)).invertSelf();  // M-1
        const L = I.transformPoint(new DOMPoint(tx, ty));
        touched = ctx.isPointInPath(p, L.x, L.y);
        if (touched) {
            identifier = id;
            callback();
        }
    }


    function reset(id) {
        if (id === identifier) {
            touched = false;
            identifier = undefined;
        }
    }

    return { draw, is_touched, reset };

}


export function u_path() {
    let upath = new Path2D();
    upath.moveTo(-2, -2);
    upath.lineTo(-2, 2);
    upath.lineTo(-1, 2);
    upath.lineTo(-1, -1);
    upath.lineTo(1, -1);
    upath.lineTo(1, 2);
    upath.lineTo(2, 2);
    upath.lineTo(2, -2);
    upath.closePath();
    return upath;
}

export function path(ctx, p, fillStyle = "#fff", strokeStyle = "#000", lineWidth = 1) {
    ctx.fillStyle = fillStyle;
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = strokeStyle;
    ctx.fill(p);
    ctx.stroke(p);
}


const END_ANGLE = Math.PI * 2;

function circle(ctx, x, y, radius, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, END_ANGLE, true);
    ctx.fill();
}


export function rect(ctx) {
    ctx.fillStyle = "#f0f";
    ctx.fillRect(10, 10, 20, 40);
}

export function drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius) {
    let rot = (Math.PI / 2) * 3;
    const step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
        ctx.lineTo(cx + Math.cos(rot) * outerRadius, cy + Math.sin(rot) * outerRadius);
        rot += step;

        ctx.lineTo(cx + Math.cos(rot) * innerRadius, cy + Math.sin(rot) * innerRadius);
        rot += step;
    }
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
    ctx.lineWidth = 5;
    ctx.strokeStyle = 'black';
    ctx.stroke();
    ctx.fillStyle = 'yellow';
    ctx.fill();
}

let angle = 0;
export function drawRotatedRect(ctx) {
    const rectWidth = 100;
    const rectHeight = 60;

    ctx.translate(rectWidth, rectHeight);
    ctx.rotate(angle);
    ctx.fillStyle = 'blue';
    ctx.fillRect(-rectWidth / 2, -rectHeight / 2, rectWidth, rectHeight);
    ctx.fillStyle = 'gray';
    ctx.fillRect(0, 0, rectWidth, rectHeight);
    angle += 0.02;
}

export function drawGradient(ctx) {
    // ab hier wird in dieser Farbe gefüllt
    ctx.fillStyle = "#f00";

    // rechteck malen
    ctx.fillRect(10, 40, 200, 100);

    // rand zeichnen
    ctx.strokeStyle = "#00f";
    ctx.lineWidth = 3;
    ctx.strokeRect(10, 40, 200, 100);

    // Erstellen eines linearen Farbverlaufs
    const gradient = ctx.createLinearGradient(10, 40, 210, 40); // Horizontaler Verlauf von links nach rechts
    gradient.addColorStop(0, "red");    // Farbstartpunkt
    gradient.addColorStop(1, "blue");   // Farbendpunkt

    // Ab hier wird der Farbverlauf als Füllstil verwendet
    ctx.fillStyle = gradient;

    // Rechteck malen
    ctx.fillRect(10, 40, 200, 100);

    // Rand zeichnen
    ctx.strokeStyle = "#00f";
    ctx.lineWidth = 3;
    ctx.strokeRect(10, 40, 200, 100);

}
