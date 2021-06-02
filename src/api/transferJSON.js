"use strict"

const axios = require("axios")

async function sendMaintenance(maintenanceList) {
    const url = "/storage/saveNewMaintenance"
    const response = await axios
        .post(url, { maintenanceList })
        .catch(error => {
            if (error.response) {
              alert(error.response.data)
            }
          })
    return response
}

async function getMaintenanceStorage() {
    const url = "/storage/getMaintenanceStorage"
    const response = await axios
        .get(url)
        .catch(error => {
            if (error.response) {
              alert(error.response.data)
            }
          })
    return response.data
}

async function getStock() {
    const url = "/storage/getStock"
    const response = await axios
        .get(url)
        .catch(error => {
            if (error.response) {
              alert(error.response.data)
            }
          })
    return response.data
}

export { sendMaintenance, getMaintenanceStorage, getStock }