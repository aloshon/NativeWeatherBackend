const PORT = +process.env.PORT || 8081;
// const host = "166.171.121.139";
const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();

app.use(cors())

app.get("/", (req, res) => {
    res.status(200).json("why hello there!")
});

app.get("/weather", async (req, res, next) => {
    try {
        const params = {
            lat: req.query.lat,
            lon: req.query.lon,
            units: req.query.units
        }
        
        const headers = {
            'x-rapidapi-key': process.env.API_KEY
        }
        
        const currentRes = await axios.get(`https://weatherbit-v1-mashape.p.rapidapi.com/current`, {params, headers});
        const forecastRes = await axios.get(`https://weatherbit-v1-mashape.p.rapidapi.com/forecast/daily`, {params, headers});
    
        // Only get the data that we want
        const forecastData = forecastRes.data.data.map(day => {
            return {
                high: day.high_temp,
                low: day.low_temp,
                date: day.datetime,
                description: day.weather.description,
                uv: day.uv,
                icon_code: day.weather.icon,
            }
        });

        const currentData = currentRes.data.data[0];
    
        const result = {currentData, forecastData}
        console.log(result)
        JSON.stringify(result)
        res.status(200).json(result);
    } catch(err){
        console.log(err)
        return next(err)
    }
});

/** Generic error handler */
app.use( (err, req, res, next) => {
    if (process.env.NODE_ENV !== "test") console.error(err.stack);
    const status = err.status || 500;
    const message = err.message;
  
    return res.status(status).json({
      error: { message, status },
    });
  });

app.listen(PORT, console.log(`listening on port ${PORT}`));