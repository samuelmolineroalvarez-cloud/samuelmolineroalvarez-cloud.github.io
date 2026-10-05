
const map = L.map("map", {
    minZoom: -3
});


// OpenStreetMap
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors"
}).addTo(map);


// URLs
const geojsonUrl =
    "https://geo.stat.fi/geoserver/wfs?service=WFS&version=2.0.0&request=GetFeature&typeName=tilastointialueet:kunta4500k&outputFormat=json&srsName=EPSG:4326";

const migrationUrl =
    "https://pxdata.stat.fi/PxWeb/api/v1/fi/StatFin/muutl/11a2.px";


// Get the query from the JSON file
fetch("migration_data_query.json")
    .then(response => {

        if (!response.ok) {
            throw new Error("Could not load migration_data_query.json");
        }

        return response.json();
    })

    // Send query to Statistics Finland
    .then(query => {

        return fetch(migrationUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(query)
        });
    })

    .then(response => {

        if (!response.ok) {
            throw new Error(
                "Migration API error: " + response.status
            );
        }

        return response.json();
    })

    .then(migration => {

        console.log("MIGRATION DATA:");
        console.log(migration);

        // Create an object containing migration data
        const migrationData = {};

        const area =
            migration.dimension.alue_23_20260101;

        const codes = area.category.index;
        const labels = area.category.label;

        // JSON-stat2 may return index as an object
        const orderedCodes = Object.keys(codes).sort(
            (a, b) => codes[a] - codes[b]
        );


        orderedCodes.forEach((code, index) => {

            // SSS = Finland total
            if (code === "SSS") {
                return;
            }

            // API code: KU005
            // GeoJSON code: 005
            const municipalityCode =
                code.replace("KU", "");


            // Last dimension is contents:
            // tulo, lahto
            const positive =
                Number(migration.value[index * 2]);

            const negative =
                Number(migration.value[index * 2 + 1]);


            migrationData[municipalityCode] = {
                name: labels[code],
                positive: positive,
                negative: negative
            };
        });


        console.log("PROCESSED MIGRATION DATA:");
        console.log(migrationData);


        // Now load municipality GeoJSON
        return fetch(geojsonUrl)
            .then(response => response.json())
            .then(geojson => {

                createMap(geojson, migrationData);

            });
    })

    .catch(error => {
        console.error(error);
    });



function createMap(geojson, migrationData) {

    const layer = L.geoJSON(geojson, {

        weight: 2,

        style: function(feature) {

            const code = feature.properties.kunta;

            const data = migrationData[code];


            // If there is no migration data
            if (!data) {
                return {
                    weight: 2
                };
            }


            let hue =
                Math.pow(
                    data.positive / data.negative,
                    3
                ) * 60;


            // Maximum hue = 120
            hue = Math.min(hue, 120);


            return {
                weight: 2,
                color: `hsl(${hue}, 75%, 50%)`
            };
        },


        onEachFeature: function(feature, layer) {

            const code = feature.properties.kunta;
            const name = feature.properties.nimi;

            const data = migrationData[code];


            // Tooltip
            layer.bindTooltip(name);


            // Popup
            if (data) {

                layer.bindPopup(
                    "<strong>" + name + "</strong><br>" +
                    "Positive migration: " + data.positive + "<br>" +
                    "Negative migration: " + data.negative
                );

            }
        }

    }).addTo(map);


    // Fit map to Finland
    map.fitBounds(layer.getBounds());
}




