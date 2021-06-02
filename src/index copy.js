"use strict"

import {sendMaintenance, getMaintenanceStorage} from "./api/transferJSON"
const saveAs = require("./filesaver/FileSaver")


function txtprocessing() {

    // Text aus dem Input-Feld einlesen
    let textinput = document.getElementById("textinput").value;
    // Text umwandeln in Javascript-Objekt
    let parsedJSON = JSON.parse(textinput);
    // Rückfrage. Bei OK überschrieben ansonsten abbrechen.
    if (confirm("Sind Sie sicher, dass die 'database' überschrieben werden soll?")) {
        // Überschreibt das Objekt mit Schlüssel "database" von localstorage
        localStorage.setItem("database", JSON.stringify(parsedJSON));
        console.log("'database' überschrieben! \ndatabase: ", localStorage.getItem("database"));
    }
    // Abbruch! database bleibt unverändert!
    else {
        console.log("Abbruch! 'database' wurde NICHT überschrieben!");
        return;
    }
}


// Erzeugung Liste für Input Aquariumbecken
let Aquariumbecken = [];
Aquariumbecken.push("<option value='Nano_1'>Nano_1</option>");
Aquariumbecken.push("<option value='Nano_2'>Nano_2</option>");
Aquariumbecken.push("<option value='Großes_Aquarium'>Großes_Aquarium</option>");
Aquariumbecken.push("<option value='Nachzuchtbecken'>Nachzuchtbecken</option>");
let optionsAquariumbecken = "<option value='' selected>Aquarium</option>";
Aquariumbecken.forEach(element => {
    optionsAquariumbecken += element;
});
document.getElementById('showaquarium').innerHTML = optionsAquariumbecken;
document.getElementById('aquarium').innerHTML = optionsAquariumbecken;

// Erzeugung Liste für Input gewechselte Wassermenge
var optionsWassermenge = '';
for (var i = 0; i <= 100; i += 5) {
    optionsWassermenge += "<option value=" + i + " />";
}
document.getElementById('Wassermenge').innerHTML = optionsWassermenge;


// Erzeugung Liste für Input Tierart
let Tier = [];
Tier.push("<option value='Red Sakura'>Red Sakura</option>");
Tier.push("<option value='Orange Sakura'>Orange Sakura</option>");
Tier.push("<option value='Algengarnele'>Algengarnele</option>");
Tier.push("<option value='Perlhuhnbärbling'>Perlhuhnbärbling</option>");
Tier.push("<option value='Feuersalmler'>Feuersalmler</option>");
Tier.push("<option value='Zwergfadenfisch'>Zwergfadenfisch</option>");
Tier.push("<option value='Ohrgitter Harnischwels'>Ohrgitter Harnischwels</option>");
Tier.push("<option value='Kleine Posthornschnecke'>Kleine Posthornschnecke</option>");
Tier.push("<option value='Geweihschnecke'>Geweihschnecke");
Tier.push("<option value='Zebra-Rennschnecke'>Zebra-Rennschnecke</option>");
Tier.push("<option value='Orange-Treck-Rennschnecke'>Orange-Treck-Rennschnecke</option>");
let optionsTiere = "<option value='' selected>Tierart</option>";
Tier.forEach(element => {
    optionsTiere += element;
});
document.getElementById('tierliste_verst').innerHTML = optionsTiere;
document.getElementById('tierliste_eiabw').innerHTML = optionsTiere;
document.getElementById('tierliste_neu').innerHTML = optionsTiere;



// Hole alle input-ids um später die Werte und Namen auszulesen:
const inputIDs = [
    "aquarium",
    "date",
    "h2oPrz",
    "h2oLit",
    "Mironekuton",
    "BacterAE",
    "Catappa-X",
    "düngNPKTpf",
    "düngNPKMil",
    "düngFeTpf",
    "düngFeMil",
    "tierliste_verst",
    "tierverst_nr",
    "tierliste_neu",
    "tierneu_nr",
    "tierliste_eiabw",
    "t_eipakete"
];
/*
let IDs = document.querySelectorAll("[id]");
IDs.forEach(element => {
    if (element.tagName === "INPUT"){
        inputIDs.push(element.id);
    }
});
console.log("Ausgelesene Input-IDs: ", inputIDs);
*/



function speichern() {

    // true/false Werte zuweisen für Angabe von "aquarium" und "alleAquarien"
    let isSetAquarium = false;
    if (document.getElementById("aquarium").value) { isSetAquarium = true };
    const isSetAllAquas = document.getElementById("alleAquarien").checked;
    // leeres Objekt erstellen
    let objPflege = {};
    // über alle InputIDs iterieren und Werte abrufen
    for (const ID of inputIDs) {
        let element = document.getElementById(ID);
        // Abbruch wenn kein Datum gesetzt wurde
        if (element.id === "date" && element.value === "") {
            alert("Bitte Datum angeben!");
            return;
        }
        // Abbruch wenn kein Aquarium gesetzt wurde
        if (isSetAquarium === false && isSetAllAquas === false) {
            alert("Bitte Aquarium angeben!");
            return;
        }
        if (element.id !== "aquarium" && element.id !== "date" && element.id !== "alleAquarien") {
            if (element.getAttribute("type") === "checkbox" && element.checked) {
                objPflege[element.name] = element.checked;
            }
            else if (element.getAttribute("type") !== "checkbox" && element.value !== "") {
                objPflege[element.name] = element.value;
            }
        }
    }
    // Abbruch wenn nicht mindestens ein Wert zusätzlich zu Datum und Aquarium angegeben wurde
    if (Object.keys(objPflege).length === 0) {
        alert("Kein Wert angegeben!");
        return;
    }
    // Datum und Aquarium werden noch hinzugefügt
    objPflege["Aquarium"] = document.getElementById("aquarium").value;
    objPflege["Datum"] = document.getElementById("date").value;


    // Umwandeln der Liste in Objekte
    // Die erstellten Objekte werden wiederum in eine Liste gepackt
    let objList = [];
    if (document.getElementById("alleAquarien").checked) {
        let objNano1 = Object.assign({}, objPflege);
        let objNano2 = Object.assign({}, objPflege);
        let objGross = Object.assign({}, objPflege);
        let objNachzucht = Object.assign({}, objPflege);
        objList = [objNano1, objNano2, objGross, objNachzucht];
        for (let i = 0; i < objList.length; i++) {
            objList[i]["Aquarium"] = Aquariumbecken[i].match(/'([^']+)'/)[1]; //match-Ausdruck extrahiert ersten string welcher zwischen Hochkommas ist
        }
    }
    else {
        objList.push(objPflege);
    }
    console.log("Erstellte Objektliste: ", objList);

    // Liste der neuen Objekte wird an den Server gesendet
    sendMaintenance(objList)
        .catch((e) => alert("Ein Fehler ist aufgetreten!"))


    // Nun wird das Fenster neu geladen damit die Inputs wieder zurückgesetzt werden.
    location.reload();

}


function saveJSON() {
    /*

    // Hole localstorage Objekt mit key "data"
    let data = localStorage.getItem("database");
    console.log("Rohdaten eingelesene localstorage: ", data);

    // Speichern als lokale Datei im JSON-Format mittels Blob und FileReader:
    // Umwandlung der lokalStorage-Datei nicht notwendig da bereits im JSON-Format vorliegend!
    // FileReader-Datei muss in HTML eingebunden sein (Befehl "saveAs")!
    let blob = new Blob([data], { type: "application/json" });
    saveAs(blob, "Aquariumpflege.json");
    */
}


/*
function getLocalStorage() {

    getMaintenanceStorage()
        .then((resp) => {
            if (!resp) { // Muss noch umgeschrieben werden für Server!
                alert('Kein Eintrag "database" in localstorage vorhanden!');
            }
            else {
                console.log("Server-Daten: ", resp);
            }
        })

}
*/



function showSelect() {

    // Hole Auswahl für welches Aquarium
    let aquaToShow = document.getElementById("showaquarium").value;

    // Hole HTML-Element für spätere Ausgabe
    let output = document.getElementById("eintrag");

    // Hole Daten von Server
    getMaintenanceStorage()
        .then((data) => {
            //console.log("Server-Daten: ", data);

            // Iteration über alle Objekte
            for (let i = 0; i < data.length; i++) {
                let obj = data[i];
                // Wenn kein Aquarium ausgewählt werden alle angezeigt
                if (aquaToShow !== "") {
                    // Wenn Aquarium gewählt werden die anderen übersprungen
                    if (obj.Aquarium !== aquaToShow) {
                        continue;
                    }
                }
                console.log("Objektinhalt: ", obj);
                let sumInputs = null;
                // Hole alle keys und values eines Objektes
                for (const [key, value] of Object.entries(obj)) {
                    // Datum und Aquariumtyp sollen ausgelassen werden (werden im Anschluss eingefügt!)
                    if (key != "Datum" && key != "Aquarium") {
                        // Wenn es sich um eine checkbox handelt soll der key ausgegeben werden
                        if (value === true) {
                            // Überprüfung ob bereits ein Wert in sumInputs eingefügt wurde anderfalls überschreiben
                            if (sumInputs != null) {
                                sumInputs += key + ", ";
                            } else {
                                sumInputs = key + ", ";
                            }
                        }
                        else {
                            // Überprüfung ob bereits ein Wert in sumInputs eingefügt wurde anderfalls überschreiben
                            if (sumInputs != null) {
                                sumInputs += key + ": " + value + ", ";
                            } else {
                                sumInputs = key + ": " + value + ", ";
                            }
                        }
                    }
                }
                // Ausgabe der Objekte im HTML sortiert mit Datum und Aquariumtyp am Anfang
                output.innerHTML += "<li>" + obj.Datum + ", " + obj.Aquarium + ", " + sumInputs + "</li>";
            }
        })
        .catch((e) => alert("Ein Fehler ist aufgetreten!"))
}