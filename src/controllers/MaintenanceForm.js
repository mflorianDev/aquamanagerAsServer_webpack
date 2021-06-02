"use strict"

import { sendMaintenance } from "../api/transferJSON"


export default class MaintenanceForm {

    constructor(formElements) {
        this.tank_Select = formElements.tank_Select
        this.allTank_Checkbox = formElements.allTank_Checkbox
        this.date_Input = formElements.date_Input
        this.waterChange_Select = formElements.waterChange_Select
        this.fertilizerNPK_drop_Input = formElements.fertilizerNPK_drop_Input
        this.fertilizerFe_drop_Input = formElements.fertilizerFe_drop_Input
        this.fertilizerNPK_ml_Input = formElements.fertilizerNPK_ml_Input
        this.fertilizerFe_ml_Input = formElements.fertilizerFe_ml_Input
        this.mironekuton_Checkbox = formElements.mironekuton_Checkbox
        this.bacterAE_Checkbox = formElements.bacterAE_Checkbox
        this.catappa_Checkbox = formElements.catappa_Checkbox
        this.newAnimalType_Select = formElements.newAnimalType_Select
        this.newAnimalNr_Input = formElements.newAnimalNr_Input
        this.deadAnimalType_Select = formElements.deadAnimalType_Select
        this.deadAnimalNr_Input = formElements.deadAnimalNr_Input
        this.eggdropAnimalType_Select = formElements.eggdropAnimalType_Select
        this.eggdropAnimalNr_Input = formElements.eggdropAnimalNr_Input

        this.sendFormButton = formElements.sendFormButton
        this.tanksList = formElements.tanksList
        this.animalsObj = formElements.animalsObj
        this.setEventlistener()
        this.setTankSelectOptions()
        this.setWaterChangeSelectOptions()
        this.setAnimalTypeSelectOptions()

    }

    setTankSelectOptions() {
        let tankSelectOptions = ["<option value='' selected>Aquarium</option>"]
        for (const tank of this.tanksList) {
            tankSelectOptions.push(`<option value='${tank}'>${tank}</option>`)
        }
        this.tank_Select.innerHTML = tankSelectOptions
    }

    setAnimalTypeSelectOptions() {
        let animalTypeSelectOptions = ["<option value='' selected>Tierart</option>"]
        let animalTypeSelectOptionsShrimps = ["<option value='' selected>Garnelenart</option>"]
        for (const animalType in this.animalsObj) {
            animalTypeSelectOptions.push(`<optgroup label='${animalType}'>`)
            if (animalType === "shrimps") {
                for (const animal of this.animalsObj[animalType]) {
                    animalTypeSelectOptionsShrimps.push(`<option value='${animal}'>${animal}</option>`)
                }
            }
            for (const animal of this.animalsObj[animalType]) {
                animalTypeSelectOptions.push(`<option value='${animal}'>${animal}</option>`)
            }
            animalTypeSelectOptions.push(`</optgroup>`)
        }
        // set all animaltype select inputs
        this.newAnimalType_Select.innerHTML = animalTypeSelectOptions
        this.deadAnimalType_Select.innerHTML = animalTypeSelectOptions
        this.eggdropAnimalType_Select.innerHTML = animalTypeSelectOptionsShrimps
    }

    setWaterChangeSelectOptions() {
        let waterChangeSelectOptions = ["<option value='' selected>Wassermenge</option>"]
        for (let i = 10; i <= 100; i += 10) {
            waterChangeSelectOptions.push(`<option value='${i}'>${i}</option>`)
        }
        this.waterChange_Select.innerHTML = waterChangeSelectOptions
    }

    setEventlistener() {
        // Event on save-button-click
        this.sendFormButton.addEventListener("click", (event) => {
            event.preventDefault()
            this.saveForm()
        })

        function setListenerAliasInputs(inputElem1, inputElem2) {
            function disableAlias(Elem1, Elem2) {
                Elem1.addEventListener("change", (event) => {
                    event.preventDefault()
                    if (Elem1.value !== "") {
                        Elem2.disabled = true
                    } else {
                        Elem2.disabled = false
                    }
                })
            }
            disableAlias(inputElem1, inputElem2)
            disableAlias(inputElem2, inputElem1)
        }
        setListenerAliasInputs(this.fertilizerNPK_drop_Input, this.fertilizerNPK_ml_Input)
        setListenerAliasInputs(this.fertilizerFe_drop_Input, this.fertilizerFe_ml_Input)
    }

    saveForm() {
        let maintenanceList = []
        const maintenanceObj = {}
        if (this.tank_Select.value === "" && this.allTank_Checkbox.checked === false) {
            return alert("Bitte Aquarium angeben!")
        }
        if (this.date_Input.value === "") {
            return alert("Bitte Datum angeben!")
        }
        for (const element in this) {
            // exclude sendFormButton and allTankCheckbox
            if (this[element] !== this.sendFormButton && this[element] !== this.allTank_Checkbox) {
                if (this[element].type === "checkbox" && this[element].checked) {
                    maintenanceObj[this[element].name] = true
                }
                if (this[element].type === "date" && this[element].value !== "") {
                    maintenanceObj[this[element].name] = this[element].value
                }
                if (this[element].tagName === "SELECT" && this[element].value !== "") {
                    maintenanceObj[this[element].name] = this[element].value
                }
                if (this[element].type === "number" && this[element].value !== "") {
                    maintenanceObj[this[element].name] = this[element].value
                }
            }
        }
        if (this.allTank_Checkbox.checked === false && Object.keys(maintenanceObj).length < 3) {
            return alert("Keine Werte angegeben!")
        }
        if (this.allTank_Checkbox.checked === true && Object.keys(maintenanceObj).length < 2) {
            return alert("Keine Werte angegeben!")
        }
        if (this.allTank_Checkbox.checked) {
            this.tanksList.forEach(tank => {
                maintenanceList.push({ ...maintenanceObj, [this.tank_Select.name]: tank })
            });
        } else {
            maintenanceList.push(maintenanceObj)
        }
        sendMaintenance(maintenanceList)
    }

}