function setup() {      // p5 function like window onload
    noCanvas();
    const video = createCapture(VIDEO);         // get capture from video
    video.size(160, 120);
    let lat, lon; // global variable, can access but button and geolocation
    const button = document.getElementById("submit");
    button.addEventListener("click", async event =>{
        const anything = document.getElementById("anything").value;
        video.loadPixels();  // loadpixel for add the canvas property to capture
        const image64 = video.canvas.toDataURL(); // convert capture to base64
        const data = {lat, lon, anything, image64};
        const options = {
            method: "POST",
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }
        const db_response = await fetch("/api", options);
        const db_json = await db_response.json();
        console.log (db_json);  
    })
    
    if('geolocation' in navigator) {
    console.log ("geolocation is available")
    navigator.geolocation.getCurrentPosition(async position => {    // get the location * need user premission
        let lat, lon, weather, air;
        try {
            lat = position.coords.latitude;
            lon = position.coords.longitude;
            document.getElementById("latitude").textContent=lat;
            document.getElementById("longitude").textContent=lon;
            // console.log(position); 
            // fetch(resource[, options]); 
            const api_url = `weather/${lat},${lon}`;    // params sent to server (index.js)
            const response = await fetch(api_url);
            const json = await response.json(); // get responce
            weather = json.weather.data[0];
            air = json.air_quality.results[0].measurements[0];
            document.getElementById("aq_parameter").textContent = air.parameter;
            document.getElementById("aq_value").textContent = air.value;
            document.getElementById("aq_unit").textContent = air.unit;
            document.getElementById("aq_date").textContent = air.lastUpdated;
        } catch (error) {
            console.log("Error")
            console.error(error)
            air = {value: -1};
            document.getElementById("aq_value").textContent = "NO READING"
        }

        const data = {lat, lon, weather, air};
        const options = {
            method: "POST",
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }
        document.getElementById("summary").textContent = weather.weather.description;
        document.getElementById("temperature").textContent = weather.temp;
        const db_response = await fetch("/api1", options);
        const db_json = await db_response.json();
        console.log (db_json); 
    });
    } else {
    console.log ("geolocation IS NOT available")
    }
}
