const fetch = require("node-fetch");

const url = "https://services1.arcgis.com/tp9wqSVX1AitKgjd/ArcGIS/rest/services/";

// Simple script to pull metadata from an ArcGIS server
// Prints out each Feature Service, each layer in each Feature Service, and each field in each layer
(async () => {
    const response = await fetch(url + "?f=json");
    const json = await response.json();

    json.services.forEach(async (service) => {
        const fs_response = await fetch(service.url + "/layers" + "?f=json");
        const fs_json = await fs_response.json();
        
        console.log("Feature Service:", service.name);
        fs_json.layers.forEach(layer => {
            console.log("  Layer:", layer.name)
            layer.fields.forEach(field => {
                console.log("    Field:", field.name);
            })
        })
    })
})()