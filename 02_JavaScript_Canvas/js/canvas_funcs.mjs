

// Parameter: id:string des HTML-Canvas
export function init(id) {
    const canvas = document.getElementById(id);
    const context = canvas.getContext("2d");
    const d = new Date().toLocaleString("de-DE");
    console.log("Canvas Inited", d);

    // {"canvas": canvas, "context": context};
    return { canvas, context };
}


