javascript
const map = L.map("map", {
    minZoom: -3
});

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors"
}).addTo(map);

const url =
    "https://geo.stat.fi/geoserver/wfs?service=WFS&version=2.0.0&request=GetFeature&typeName=tilastointialueet:kunta4500k&outputFormat=json&srsName=EPSG:4326";

fetch(url)
    .then(response => response.json())
    .then(data => {

        console.log(data);

        const municipalities = L.geoJSON(data, {

            weight: 2,

            onEachFeature: function(feature, layer) {

                layer.bindTooltip(feature.properties.nimi);

            }

        }).addTo(map);

        map.fitBounds(municipalities.getBounds());
    })
    .catch(error => {
        console.error("ERROR:", error);
    });






