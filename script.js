

javascript
const municipalityUrl =
    "https://geo.stat.fi/geoserver/wfs?service=WFS&version=2.0.0&request=GetFeature&typeName=tilastointialueet:kunta4500k&outputFormat=json&srsName=EPSG:4326";

const migrationUrl =
    "https://pxdata.stat.fi/PxWeb/api/v1/fi/StatFin/muutl/11a2.px";


// Create map
const map = L.map("map", {
    minZoom: -3
});


// OpenStreetMap background
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors"
}).addTo(map);


// Object containing migration data
const migrationData = {};


// First get the query from the JSON file
fetch("migration_data_query.json")
    .then(response => response.json())

    // Send the query to the migration API
    .then(query => {
        return fetch(migrationUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(query)
        });
    })

    // Process migration response
    .then(response => response.json())
    .then(data => {

        processMigrationData(data);

        // Get municipality GeoJSON
        return fetch(municipalityUrl);
    })

    // Create the map
    .then(response => response.json())
    .then(geojson => {

        const municipalityLayer = L.geoJSON(geojson, {

            // Required by the assignment
            weight: 2,

            // Colour municipalities according to migration
            style: function(feature) {

                const code = feature.properties.kunta;
                const migration = migrationData[code];

                if (!migration) {
                    return {
                        weight: 2
                    };
                }

                const positive = migration.positive;
                const negative = migration.negative;

                let hue =
                    Math.pow(positive / negative, 3) * 60;

                // Hue cannot be greater than 120
                hue = Math.min(hue, 120);

                return {
                    weight: 2,
                    color: `hsl(${hue}, 75%, 50%)`
                };
            },

            // Tooltip and popup
            onEachFeature: function(feature, layer) {

                const code = feature.properties.kunta;
                const name = feature.properties.nimi;

                const migration = migrationData[code];

                // Show municipality name when hovering
                layer.bindTooltip(name);

                // Show migration data when clicking
                if (migration) {

                    layer.bindPopup(`
                        <strong>${name}</strong><br>
                        Positive migration: ${migration.positive}<br>
                        Negative migration: ${migration.negative}
                    `);

                }
            }

        }).addTo(map);


        // Fit map to GeoJSON
        map.fitBounds(municipalityLayer.getBounds());
    })

    .catch(error => {
        console.error("Error:", error);
    });


// Process migration API response
function processMigrationData(data) {

    const values = data.value;

    const category =
        data.dimension.alue_23_20260101.category;

    const labels = category.label;
    const index = category.index;


    // Get municipality codes in the correct order
    let codes;

    if (Array.isArray(index)) {
        codes = index;
    } else {
        codes = Object.keys(index).sort(
            (a, b) => index[a] - index[b]
        );
    }


    codes.forEach((apiCode, i) => {

        // SSS = Finland as a whole, not a municipality
        if (apiCode === "SSS") {
            return;
        }


        // API uses KU005, KU009, etc.
        // GeoJSON uses 005, 009, etc.
        const municipalityCode =
            apiCode.replace("KU", "");


        // tulo = positive migration
        // lahto = negative migration
        const positive = Number(values[i * 2]);
        const negative = Number(values[i * 2 + 1]);


        migrationData[municipalityCode] = {
            positive: positive,
            negative: negative,
            name: labels[apiCode]
        };
    });
}



