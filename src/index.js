"use strict"

import Stock from "./controllers/Stock"
import MaintenanceForm from "./controllers/MaintenanceForm"
import ListStoredMainetance from "./controllers/ListStoredMaintenance"
//import { sendMaintenance, getMaintenanceStorage } from "./api/transferJSON"
//const saveAs = require("./filesaver/FileSaver")


const stock = new Stock()
stock.init()
    .then((stock) => {

        const maintenance = new MaintenanceForm(
            {
                tank_Select: document.getElementById("aquarium"),
                allTank_Checkbox: document.getElementById("alleAquarien"),
                date_Input: document.getElementById("date"),
                waterChange_Select: document.getElementById("h2oPrz"),
                fertilizerNPK_drop_Input: document.getElementById("düngNPKTpf"),
                fertilizerFe_drop_Input: document.getElementById("düngFeTpf"),
                fertilizerNPK_ml_Input: document.getElementById("düngNPKMil"),
                fertilizerFe_ml_Input: document.getElementById("düngFeMil"),
                mironekuton_Checkbox: document.getElementById("Mironekuton"),
                bacterAE_Checkbox: document.getElementById("BacterAE"),
                catappa_Checkbox: document.getElementById("Catappa-X"),
                newAnimalType_Select: document.getElementById("tierliste_neu"),
                newAnimalNr_Input: document.getElementById("tierneu_nr"),
                deadAnimalType_Select: document.getElementById("tierliste_verst"),
                deadAnimalNr_Input: document.getElementById("tierverst_nr"),
                eggdropAnimalType_Select: document.getElementById("tierliste_eiabw"),
                eggdropAnimalNr_Input: document.getElementById("tierliste_eipakete"),
                sendFormButton: document.getElementById("sendFormButton"),
                tanksList: stock.tanks,
                animalsObj: stock.animals

            }
        )

        const listStoredMainetance = new ListStoredMainetance(
            {
                tank_Select: document.getElementById("showTankSelect"),
                show_Button: document.getElementById("showTankButton"),
                output_ListElement: document.getElementById("output"),
                tanksList: stock.tanks
            }
        )

    })

/*
    // Nun wird das Fenster neu geladen damit die Inputs wieder zurückgesetzt werden.
    location.reload();
*/


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
