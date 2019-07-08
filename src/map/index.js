const mapboxgl = require('mapbox-gl');

var map = null;

function initialize()
{
    mapboxgl.accessToken = 'pk.eyJ1IjoiZGlnaXRhbGtpIiwiYSI6ImNqNXh1MDdibTA4bTMycnAweDBxYXBpYncifQ.daSatfva2eG-95QHWC9Mig';

    map = new mapboxgl.Map({
        container: 'map', // container id
        style: 'mapbox://styles/mapbox/light-v9',
        // style: 'mapbox://styles/mapbox/streets-v9', // stylesheet location
        center: [-74.50, 40], // starting position [lng, lat]
        zoom: 9, // starting zoom
        pitch: 45,
        //bearing: -17.6,
    });

    map.addControl(new mapboxgl.NavigationControl());
    map.addControl(new mapboxgl.FullscreenControl());
}

function resize()
{
    map.resize();
    return;
}

module.exports = {
    initialize, resize
}