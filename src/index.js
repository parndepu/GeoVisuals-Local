// Local version of GeoVisuals application
// (c) 2019, Suphanut Jamonnak

import mapboxgl from 'mapbox-gl';
window.mapboxgl = mapboxgl;

import * as components from './components';

// Geovisuals attributes
export var GeoVisuals_map = null;
export var db_name = "GeoVisuals-Local";

// All mongodb collections
export var trip_model = null;
export var trip_data_model = null;

// Initialize Geovisuals system
function Geovisuals_init()
{
    Initialize_map();
    Initialize_dom();
    Initilaize_database();
    return;
}

// Initialize mapbox and controls
function Initialize_map()
{
    GeoVisuals_map = components.Mapbox_init('map');
    // TODO: need to add more controls here
}

function Initialize_dom()
{
    // Set resizable panel
    components.Dom_resizable_panel();
    // Set tool button
    components.Dom_tool_buttons();
    components.Dom_upload_button();
    // Set input
    components.Dom_video_input();
    components.Dom_spreadsheet_input();
    components.Dom_description_input();
    return;
}

function Initilaize_database()
{
    // Connect to mongodb
    components.Query_db_connect(db_name);
    // Create trip model and schema
    var trip_schema = components.Query_db_schema.Trip();
    trip_model = components.Query_db_model('Trip', trip_schema);
    // Create trip data model and schema
    var trip_data_schema = components.Query_db_schema.Trip_data();
    trip_data_model = components.Query_db_model('TripData', trip_data_schema);

    return;
    /*
    var new_trip = new trip_model({
        upload_date: '12/12/1949',
        upload_time: '15:30:20',
        upload_location: 'Kent,OH',
        upload_description: 'My model testing',
        upload_optional: 'Optional testing'
    });*/

    // Save query
    /*
    new_trip.save( function (err, new_trip) {
        if (err) return console.error(err);
        console.log(new_trip);
    });*/

    // Find query
    /*
    trip_model.find( function (err, trip) {
        if (err) return console.error(err);
        console.log(trip);
    });*/
}

window.onload = function() {
    Geovisuals_init();
};