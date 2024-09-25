// import * as lib from "./js/funcs.mjs";

import { test, DATA, hallo, closure, Hund } from "./js/funcs.mjs"



// Arrow Function - Anonyme Funktion

const PI = 3.14;

let name = "Hans";
name = "Hochschule Es'lingen";

console.log(name);

DATA.size = 15;
DATA.HS = "Aalen";



window.onload = () => {
    // lib.test();
    test();
    console.log(DATA);

    const ausHallo = hallo();
    console.log(ausHallo);


    const { alter } = hallo();
    console.log(alter);


    for (let i = 5; i < 15; ++i) {
        const j = i * 2;
        console.log(i, j);

    }

    let a = 1;

    let b = a || 13;

    if (a !== 0) {

    }

    let c = DATA && DATA.alter;

    let arr = [1, 2, 3, 4, "Hans", { o: 13 }];
    arr.push(14);
    console.log(arr, arr.length);

    const barr = arr.splice(4, 1);
    console.log(arr, arr.length);
    console.log(barr, barr.length);


    const a1 = closure();
    console.log(a1());
    console.log(a1());


    const t = Hund();
    t.bewege();
    t.laut();


    for (let a of [12, 13, 14]) {
        console.log(a);
    }
    for (let a in { a: 1, b: 2, c: 3 }) {
        console.log(a);
    }

    // ES 6
    for (let [key, value] of Object.entries({ a: 1, b: 2, c: 3 })) {
        console.log(key, value);
    }
    Object.keys({ a: 1, b: 2, c: 3 }).forEach((k, i) => {
        console.log(i, k);
    });


};

