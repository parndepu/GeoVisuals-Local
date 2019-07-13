// Local version of GeoVisuals application
// (c) 2019, Suphanut Jamonnak

import mapboxgl from 'mapbox-gl';
window.mapboxgl = mapboxgl;

import * as components from './components';

// Geovisuals attributes
export var db_name = "GeoVisuals-Local";

// All mongodb collections
export var trip_model = null;
export var trip_data_model = null;

// Global geovisuals data
export var all_trips = null;

// Initialize Geovisuals system
function Geovisuals_init()
{
    Initialize_map();

    //components.Mapbox_map.on('style.load', function () {
        Initialize_dom();
        Initilaize_database();
        Initialize_user_data();
    //});

    return;
}

// Initialize mapbox and controls
function Initialize_map()
{
    components.Mapbox_init('map');
    
    // TODO: need to add more controls here
    components.Mapbox_map.on('load', function () {
        components.Mapbox_fullscreen_control(components.Mapbox_map);
        components.Mapbox_navigation_control(components.Mapbox_map);
        components.Mapbox_draw_control(components.Mapbox_map);
        console.log('d');
    });

    return;
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
}

// Initialize user data from here
export function Initialize_user_data()
{
    // Find all trips and list it again
    trip_model.find( function (err, trips) {
        all_trips = components.Dom_list_allTrips(trips);
        show_active_trip();
    });
    return;
}

/**
 * Show active trip
 */
export function show_active_trip()
{
    // Filter active trips
    var trips_id = [];
    var active_trips = [];
    for (var i = 0; i < all_trips.length; ++i) {
        if (all_trips[i].active) {
            trips_id.push(all_trips[i]._id);
            active_trips.push(all_trips[i]);
        }
    }

    // Find all active trips
    components.Query_db_findTrip(trips_id, active_trips).then( function (result) {
        components.Mapbox_clear_layers();
        components.Mapbox_draw_trips(result);
        components.Mapbox_draw_narratives(result);
    });
    // Draw trips

    return;
}

/**
 * Starting points
 */
window.onload = function() {
    Geovisuals_init();
};