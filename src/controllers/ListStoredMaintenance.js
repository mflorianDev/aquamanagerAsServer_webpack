"use strict"

import { getMaintenanceStorage } from "../api/transferJSON"

export default class ListStoredMainetance {

    constructor(paramObj) {
        this.tank_Select = paramObj.tank_Select
        this.show_Button = paramObj.show_Button
        this.output_ListElement = paramObj.output_ListElement
        this.tanksList = paramObj.tanksList
        this.setTankSelectOptions()
        this.setEventlistener()
    }

    setTankSelectOptions() {
        let tankSelectOptions = ["<option value='' selected>Aquarium</option>"]
        for (const tank of this.tanksList) {
            tankSelectOptions.push(`<option value='${tank}'>${tank}</option>`)
        }
        this.tank_Select.innerHTML = tankSelectOptions
    }

    setEventlistener() {
        function setShowButtonListener() {
            this.show_Button.addEventListener("click", (event) => {
                event.preventDefault()
                this.showStoredData()
            })
        }
        setShowButtonListener.bind(this)()
    }

    showStoredData() {
        getMaintenanceStorage()
            .then((data) => {
                // Iteration über alle Objekte
                for (let i = 0; i < data.length; i++) {
                    let obj = data[i];
                    // Wenn kein Aquarium ausgewählt werden alle angezeigt
                    if (this.tank_Select.value !== "") {
                        // Wenn Aquarium gewählt werden die anderen übersprungen
                        if (obj.Aquarium !== this.tank_Select.value) {
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
                    const liElementHTML = "<li>" + obj.Datum + ", " + obj.Aquarium + ", " + sumInputs + "</li>"
                    this.output_ListElement.insertAdjacentHTML("afterbegin", liElementHTML)
                }
            })
    }

}