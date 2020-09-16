const yargs = require('yargs');
const axios = require('axios');

let api = '985a4842cf4e66dda685ffaa90e3c7db'

const argv = yargs
    .options({
        a: {
            demand: true,
            alias: 'address',
            describe: 'Address to fetch weather for',
            string: true
        }
    })
    .help()
    .alias('help', 'h')
    .argv;

let encodedAddress = encodeURIComponent(argv.address);
let geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=AIzaSyBDz017lqNk-v61NsNfIgETXxjK0v8BrWQ`;



axios.get(geocodeUrl).then((response) => {
    if (response.data.status === 'ZERO_RESULTS') {
        throw new Error('Unable to find that address.');
    } else {
        // console.log(response.data.results);
        let lat = response.data.results[0].geometry.location.lat;
        let lng = response.data.results[0].geometry.location.lng;
        let weatherUrl = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&appid=${api}`;
        console.log(response.data.results[0].formatted_address);
        return axios.get(weatherUrl);
    }

}).then((response) => {
    let temperature = response.data.main.temp;
    let apparentTemperature = response.data.main.feels_like;
    console.log(`It's currently ${temperature}. It feels like ${apparentTemperature}.`);

}).catch((e) => {
    if (e.code === 'ENOTFOUND') {
        console.log('Unable to connect to API servers.');
    } else {
        console.log(e.message);
    }
});