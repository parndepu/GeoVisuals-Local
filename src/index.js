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
export var select_trips = null;
export var original_mode = false; // default or original view
export var Geovisuals_markers = [];

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

export function Enable_original_mode()
{
    original_mode = true;
    return;
}

export function Disable_original_mode()
{
    original_mode = false;
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
    components.Dom_original_button();
    // Set input
    components.Dom_video_input();
    components.Dom_spreadsheet_input();
    components.Dom_description_input();
    components.Dom_keyword_input();
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

        for (var i = 0; i < Geovisuals_markers.length; ++i) {
            Geovisuals_markers[i].remove();
        }

        Geovisuals_markers = [];

        if (original_mode) {

            console.log('Display original mode');
            components.Mapbox_clear_layers();

            let trip = result[0];

            // Create video 
            var video_player = document.createElement('video');
            video_player.id = "trip-video-" + trip.id.toString();;
            video_player.className = "trip-video-player";
            video_player.src = '../data/videos/' + trip.id.toString() + '.mp4';
            video_player.trip = trip;

            var video_container = $('#video-right-container');
            video_container.empty();
            
            let play_button = $('<button/>', {
                id: 'video-play-button'
            }).css({
                width: 'auto',
                height: '30px',
                position: 'absolute',
                'z-index': '10000',
                'right': '5px', 
                'top': '5px',
                'color': '#74c476',
                'background': '#ffffff',
                'border': '2px solid #d9d9d9', 
                'border-radius': '5px',
                'outline': 'none !important'
            }).html('<i class="fas fa-play"></i> Play');

            video_container.append(video_player);
            video_container.append(play_button);

            components.Mapbox_draw_trips(result);
            components.Mapbox_draw_editPoint(result);

            play_button.on('click', (e) => {
                e.stopPropagation();

                play_button.toggleClass('play');
                if (play_button.hasClass('play')) {
                    play_button.html('<i class="fas fa-pause"></i> Pause');
                    play_button.css({ 'color': '#fb6a4a' });
                    video_player.play();
                } else {
                    play_button.html('<i class="fas fa-play"></i> Play');
                    play_button.css({ 'color': '#74c476' });
                    video_player.pause();
                }

            });

            var marker = new mapboxgl.Marker()
                            .setLngLat(trip.path[0])
                            .addTo(components.Mapbox_map);

            let temp_index = 0;
            video_player.ontimeupdate = function () {
                // 
                let index = Math.floor(video_player.currentTime);

                if (temp_index !== index) {
                    marker.setLngLat(trip.path[index]);
                    $('#video-slider-' + trip.id).val(index);
                    $('#video-time-text-' + trip.id).html(video_player.trip.datetime[index]);

                    if (video_player.trip.narratives[index] !== 'none') {
                        $('#default-narrative-' + trip.id).html(video_player.trip.narratives[index]);
                    }
                    
                    $('#edit-narrative-' + trip.id).val(video_player.trip.edits[index]);
                    $('#edit-narrative-date-' + trip.id).html('<strong>Edit Comments:</strong> ( Last update at ' + video_player.trip.editDates[index] + ')');
                    temp_index = index;
                }
            };

            Geovisuals_markers.push(marker);
        } else {

            console.log('Display new mode');
            components.Mapbox_clear_layers();
            components.Mapbox_draw_trips(result);
            //components.Mapbox_draw_narratives(result);
            select_trips = result;
            components.Mapbox_draw_editPoint(select_trips);

        }

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

