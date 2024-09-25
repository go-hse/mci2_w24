

export function test() {
    console.log("Test Funktion");
}


export function hallo(name = "Hans") {
    console.log("Hallo Funktion");
    let alter = 23;

    return { name, alter };
}




export const DATA = {
    HS: "Hochschule Esslingen",
    alter: 15
}

export function closure() {
    let counter = 0;

    function add() {
        return ++counter
    }
    return add;

}


export function Tier(b) {
    let beine = b;

    function laut() {
        console.log("hmmm");
    }

    function bewege() {
        console.log(`das Tier läuft auf ${beine} Beinen`);
    }


    return { bewege, laut };
}

export function Hund() {
    let that = Tier(4);

    that.laut = function () {
        console.log("Wau");
    }

    return that;
}


export function Fisch() {
    let that = Tier();

    that.laut = function () {
        console.log("Fische sind still");
    }

    that.bewege = function () {
        console.log(`Fische haben keine Beine`);
    }


    return that;
}



