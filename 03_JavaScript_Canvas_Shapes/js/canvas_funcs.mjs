

// Parameter: id:string des HTML-Canvas
export function init(id) {
    const canvas = document.getElementById(id);
    const context = canvas.getContext("2d");
    const d = new Date().toLocaleString("de-DE");
    console.log("Canvas Inited", d);

    // {"canvas": canvas, "context": context};
    return { canvas, context };
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

    ctx.translate(rectWidth, rectHeight)
    ctx.rotate(angle);
    ctx.fillStyle = 'blue';
    ctx.fillRect(-rectWidth / 2, -rectHeight / 2, rectWidth, rectHeight);
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
