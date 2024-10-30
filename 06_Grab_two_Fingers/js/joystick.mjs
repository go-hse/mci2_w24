

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

    // Zeichenfunktion
    function draw() {
        if (touched) circle(ctx, x, y, radius, "red");
        else circle(ctx, x, y, radius, "gray");
    }

    // Berührungfunktion
    function is_touched(id, tx, ty) {
        touched = distance(x, y, tx, ty) < radius;
        if (touched) {
            identifier = id;
            callback();
        }
    }

    // Reset-Funktione
    function reset(id) {
        if (id === identifier) {
            touched = false;
            identifier = undefined;
        }
    }

    return { draw, is_touched, reset, move: () => { } };

}

export function createButtonFromPath(ctx, x, y, p, sc, callback) {
    let touched = false, identifier;
    let M = setTransform(ctx, x, y, 0, sc);  // Matrix M Transformation

    function draw() {
        ctx.save();
        // ctx.translate(x, y);
        // ctx.scale(sc, sc);
        // M = ctx.getTransform();
        // if (touched) path(ctx, p, "#f00", "#f00", 1);
        // else path(ctx, p, "#aaa", "#aaa", 1);
        if (touched)
            fillPath(ctx, p, M, "#f00");
        else
            fillPath(ctx, p, M, "#f0f");

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

    return { draw, is_touched, reset, move: () => { } };

}


export function createGrabbable(ctx, x, y, p, sc) {
    let touched = false, identifier, P;
    let L = setTransform(ctx, x, y, 0, sc);  // Matrix M Transformation

    function draw() {
        ctx.save();
        // console.log(L.e, L.f);
        if (touched)
            fillPath(ctx, p, L, "#f00");
        else
            fillPath(ctx, p, L, "#f0f");

        ctx.restore();
    }

    function is_touched(id, tx, ty) {
        const I = (new DOMMatrix(L)).invertSelf();  // M-1
        const transformedTP = I.transformPoint(new DOMPoint(tx, ty));
        touched = ctx.isPointInPath(p, transformedTP.x, transformedTP.y);
        if (touched) {
            identifier = id;
            P = (new DOMMatrix([1, 0, 0, 1, -tx, -ty])).multiplySelf(L); // Ti-1 Li
        }
    }

    function move(id, tx, ty) {
        if (id === identifier) {
            // console.log(id, tx, ty);
            L = (new DOMMatrix([1, 0, 0, 1, tx, ty])).multiplySelf(P);   // Tn P
        }

    }

    function reset(id) {
        if (id === identifier) {
            touched = false;
            identifier = undefined;
        }
    }

    return { draw, is_touched, reset, move };
}

export function createGrabbableTwo(ctx, x, y, p, sc) {
    let touched = false, identifier, P;
    let L = setTransform(ctx, x, y, 0, sc);  // Matrix M Transformation

    function draw() {
        ctx.save();
        // console.log(L.e, L.f);
        if (touched)
            fillPath(ctx, p, L, "#f00");
        else
            fillPath(ctx, p, L, "#f0f");

        ctx.restore();
    }

    function is_touched(id, tx, ty) {
        const I = (new DOMMatrix(L)).invertSelf();  // M-1
        const transformedTP = I.transformPoint(new DOMPoint(tx, ty));
        touched = ctx.isPointInPath(p, transformedTP.x, transformedTP.y);
        if (touched) {
            identifier = id;
            P = (new DOMMatrix([1, 0, 0, 1, -tx, -ty])).multiplySelf(L); // Ti-1 Li
        }
    }

    function move(id, tx, ty) {
        if (id === identifier) {
            // console.log(id, tx, ty);
            L = (new DOMMatrix([1, 0, 0, 1, tx, ty])).multiplySelf(P);   // Tn P
        }

    }

    function reset(id) {
        if (id === identifier) {
            touched = false;
            identifier = undefined;
        }
    }

    return { draw, is_touched, reset, move };
}


export function createJoystick(ctx, x, y, radius = 60) {
    let touched = false, identifier, Pre, moveIt = false;
    let L = getTransform(ctx, x, y - 100, 0, 1);

    const Touchpoints = {};

    // Zeichenfunktion
    function draw() {
        if (touched) circle(ctx, x, y, radius, "orange");
        else circle(ctx, x, y, radius, "red");

        drawWithTransformMatrix(ctx, L, () => {
            // console.log(L);
            ctx.fillStyle = "#aaa";
            ctx.fillRect(0, 0, 10, 20);
        });

        if (Touchpoints.initial !== undefined)
            circle(ctx, Touchpoints.initial.tx, Touchpoints.initial.ty, 6, "gray");
        if (Touchpoints.firstExternal !== undefined)
            circle(ctx, Touchpoints.firstExternal.tx, Touchpoints.firstExternal.ty, 6, "gray");
    }

    // Berührungfunktion
    function is_touched(id, tx, ty) {
        touched = distance(x, y, tx, ty) < radius;
        if (touched) {
            identifier = id;
            Touchpoints.initial = { tx, ty };

            const alpha = Math.atan2(ty - y, tx - x);
            Pre = getTransform(ctx, tx, ty, alpha).invertSelf().multiplySelf(L);
        }
    }

    function move(id, tx, ty) {
        if (id === identifier) {
            // console.log(id, tx, ty);
            if (Touchpoints.firstExternal === undefined) {
                const d = distance(x, y, tx, ty);
                if (d > radius) {
                    Touchpoints.firstExternal = { tx, ty };
                    moveIt = true;
                }
            }
        }
        if (moveIt) {
            const alpha = Math.atan2(ty - y, tx - x);
            L = getTransform(ctx, tx, ty, alpha).multiplySelf(Pre);
        }
    }

    function reset(id) {
        if (id === identifier) {
            touched = false;
            identifier = undefined;
            Touchpoints.firstExternal = undefined;
            Touchpoints.initial = undefined;
            moveIt = false;
        }
    }

    return { draw, is_touched, reset, move };

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

export function fillPath(ctx, path, Matrix, fillStyle = "#fff", strokeStyle = "#000", lineWidth = 0.1) {
    ctx.save();  // Speichern des Zustands mit der aktuellen Matrix auf Stack
    ctx.setTransform(Matrix); // Setzen der Matrix
    ctx.fillStyle = fillStyle;
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = strokeStyle;
    ctx.fill(path);
    ctx.stroke(path);
    ctx.restore(); // Holen der gespeicherten Matrix vom Stack
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


export function setTransform(ctx, x, y, alpha = 0, sc = 1) {
    ctx.resetTransform(); // Zurücksetzen auf Identität
    ctx.translate(x, y); // Translation
    ctx.rotate(alpha); // Rotation
    ctx.scale(sc, sc); // Skalierung
    return ctx.getTransform(); // Berechnete Matrix speichern
}

export function drawWithTransformMatrix(ctx, M, draw) {
    ctx.save();
    ctx.resetTransform(); // Zurücksetzen auf Identität
    ctx.setTransform(M);
    draw();
    ctx.restore();
}


export function getTransform(ctx, x, y, alpha = 0, sc = 1) {
    ctx.save();  // Speichern des Zustands mit der aktuellen Matrix auf Stack
    setTransform(ctx, x, y, alpha, sc);
    let L = ctx.getTransform(); // Berechnete Matrix speichern
    ctx.restore(); // Holen der gespeicherten Matrix vom Stack
    return L; // Rückgabe
}
