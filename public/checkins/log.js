// Making a map and tiles
const map = L.map('map').setView([0, 0], 1); // latitude, longitude, zoom level
const attribution = //  an attribution is obligatory as per the copyright notice
'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
const tiles = L.tileLayer(tileUrl, { attribution });
tiles.addTo(map)

getData();

async function getData() {
    const response = await fetch("/api1");
    const data = await response.json();

    for (item of data) {
        const marker = L.marker([item.lat, item.lon]).addTo(map);
        let txt = `latitude: ${item.lat}&deg;, longitude: ${item.lon}&deg;
        Summary: ${item.weather.weather.description},
        Temperature: ${item.weather.temp}&deg; C. `;

        if (item.air.value < 0) {
            txt += 'No air quality reading'
        } else {
            txt += `Air Quality: ${item.air.parameter} is ${item.air.value} 
            ${item.air.unit} last read on ${item.air.lastUpdated}`;
        }
        marker.bindPopup(txt); // leafletjs function, popup the binded text when hover
    }
    console.log(data)
}