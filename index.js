// This is server // client - index.html
// Client has no ablility to access index.js
// run node index.js & index.html can access at localhost:3000
// npm install node-fetch <-- install fatch function in service side
const express = require("express"); // access express package -> detail http://expressjs.com/en/
const Datastore = require("nedb");  // nedb // https://github.com/louischatriot/nedb#creatingloading-a-database
const fs = require('fs');  // define the fs(file system)
const fetch = require("node-fetch");
const { Console } = require("console");
require('dotenv').config(); // load anything in a file call dotenv into an environment variable

const app = express(); // call the express function
app.listen(3000, () => console.log("listening at 3000")) // running & server listen at port 3000
app.use(express.static("public")); // access folder "public"
app.use(express.json({limit: "1mb"})); // let server understand the incoming data as JSON * http://expressjs.com/en/4x/api.html#express.json

const database = new Datastore("database.db");
database.loadDatabase();

app.get("/api",(request, response) => {
    database.find({},(err, data) => {   // {} = Find all documents in the collection
        if (err){
            response.end();
            console.log ("error")
            return;
        }
        response.json(data);
    })
})

app.post("/api",(request, response) => { // (req,res) <--set call back // request = data that client send to you // response = send things back to client
    // response.end();  <-- complete the request
    const data = request.body;
    const timestamp = Date.now();
    const filepath = "public/image/";

    // create filename and path
    data.filename = timestamp+'.png';
	// create and write file from base64
	const base64Data = data.image64.replace(/^data:image\/\w+;base64,/, '')
	fs.writeFile(filepath + data.filename, base64Data, 'base64', error => {
		if (error) throw error;
        console.log("sucessful");
		delete data.image64;
        console.log (data)
        data.timestamp = timestamp;
        database.insert(data);
        response.json(data);
	})
});       

const database2 = new Datastore("database2.db");
database2.loadDatabase();

app.get("/api1",(request, response) => {
    database2.find({},(err, data) => {   // {} = Find all documents in the collection
        if (err){
            response.end();
            console.log ("error")
            return;
        }
        response.json(data);
    })
})

app.post("/api1",(request,response) => {
    const data = request.body;
    const timestamp = Date.now();

    database2.insert(data);
    response.json(data);
})

// api url only can access on server not client side
app.get('/weather/:latlon', async (request, response) => { // express.js route parameter
    console.log(request.params)   // params sent from sketch.js
    const latlon = request.params.latlon.split(",");
    console.log(latlon)
    const lat = latlon[0];
    const lon = latlon[1];
    const api_key = process.env.API_KEY;
    const weather_url = `https://api.weatherbit.io/v2.0/current?lat=${lat}&lon=${lon}&key=${api_key}&include=minutely`
    const weather_response = await fetch(weather_url);
    const weather_data = await weather_response.json();

    const aq_url = `https://api.openaq.org/v2/latest?coordinates=${lat},${lon}`
    const aq_response = await fetch(aq_url);
    const aq_data = await aq_response.json();

    const data = {
        weather: weather_data,
        air_quality: aq_data
    };
    response.json(data); // send back
});