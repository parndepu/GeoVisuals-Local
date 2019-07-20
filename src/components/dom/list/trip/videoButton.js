import { select_trips, trip_data_model } from '../../../../index';
import { Mapbox_draw_editPoint } from '../../../index';
import mongoose from 'mongoose';
import * as turf from '@turf/turf';

function video_time (video_player, t)
{
    for (let i = 0; i < select_trips.length; ++i) {

        let trip = select_trips[i];

        if (trip.id.toString() === t.id) {

            var text = $('<span/>', {
                id: 'video-time-text-' + t.id
            }).html(trip.datetime[video_player.currentTime]);

            return text;
        }
    }
}

function adding_button(video_player, tripid)
{
    mongoose.set('useFindAndModify', false);

    var add_button = $('<button/>', {
        title: 'add narratives',
        class: 'trip-button'
    }).css({'width': '100%', 'margin-top': '2px', 'background': '#9ecae1'}).html('Update Comments');

    add_button.on('click', function () {

        for (let i = 0; i < select_trips.length; ++i) {
            let trip = select_trips[i];
            if (trip.id.toString() === tripid) {
                var input = $('#edit-narrative-' + tripid).val();
                var id = trip.object_ids[video_player.currentTime];
                var ObjectId = mongoose.Types.ObjectId;

                trip_data_model.findOneAndUpdate({ tripID: ObjectId(tripid), _id: ObjectId(id)}, {
                    
                }, function (err, doc) {
                    if (err) throw err;
                    // Add to trip

                    select_trips[i].edits[video_player.currentTime] = input;
                    select_trips[i].editDates[video_player.currentTime] = new Date().getTime();

                    Mapbox_draw_editPoint(select_trips);
                    alert('Your comments is updated');
                });

                // Start inserting
                if (input !== 'none') {
                    trip_data_model.findOneAndUpdate({ tripID: ObjectId(tripid), _id: ObjectId(id)}, {
                        editNarrative: input,
                        editDate: new Date().getTime()
                    }, function(err, doc){
                        if (err) throw err;
                        // Add to trip
                        console.log(select_trips[i]);
                        select_trips[i].edits[video_player.currentTime] = input;
                        select_trips[i].editDates[video_player.currentTime] = new Date().getTime();
                        Mapbox_draw_editPoint(select_trips);
                        alert('Your comments is updated');
                        //console.log(select_trips.edits[video_player.currentTime]);
                    });
                }
            }
        }
    });

    return add_button;
}

function video_narrative (video_player, t)
{
    for (let i = 0; i < select_trips.length; ++i) {

        let trip = select_trips[i];

        if (trip.id.toString() === t.id) {

            $('#add-point-container-' + t.id).remove();

                var add_container = $('<div/>', {
                    id: 'add-point-container-' + t.id,
                    class: 'video-container'
                });


                var default_title = $('<span/>').html('<strong>Narrative:</strong>');
                //var edit_title = $('<span/>').html('Edit Narrative:');

                var default_narrative = $('<div/>', {
                    id: 'default-narrative-' + t.id
                }).css({ width: '100%', height: 'auto', 'outline': 'none !important', 'overflow-x': 'hidden', 'overflow-x': 'auto', 'color': '#6baed6'})
                .html(trip.narratives[video_player.currentTime]);

                default_narrative.attr('disabled', true);
                
                var last_update = $('<span/>', {
                    id: 'edit-narrative-date-' + t.id
                }).html('<strong>Edit Comments:</strong> ( Last update at ' + trip.editDates[video_player.currentTime] + ')').css({ color: '#000' });
                var edit_narrative = $('<input/>', {
                    id: 'edit-narrative-' + t.id,
                    type: 'text',
                    value: trip.edits[video_player.currentTime]
                }).css({ width: '100%', 'outline': 'none !important', 'border': '1px solid #000'});
                
                add_container.append(default_title);
                add_container.append(default_narrative);
                //add_container.append(edit_title);
                add_container.append(last_update);
                add_container.append(edit_narrative);
                add_container.append(adding_button(video_player, t.id));

                return add_container;
        }
    }
}

function add_video_map (t)
{
    for (let i = 0; i < select_trips.length; ++i) {

        let trip = select_trips[i];

        if (trip.id.toString() === t.id) {

            var driver = new mapboxgl.Map({
                container: 'video-map-' + t.id, // container id
                style: 'mapbox://styles/mapbox/light-v9', //stylesheet location
                center: trip.path[0],
                pitch:60,
                interactive: false,
                zoom: 17 // starting zoom
            });

            driver.on('load', function () {

                var geojson = {
                    "type": "FeatureCollection",
                    "features": [{
                        "type": "Feature",
                        "geometry": {
                            "type": "LineString",
                            "properties": {},
                            "coordinates": trip.path
                        }
                    }]
                }
                
                var trajectory_layer = {
                    "id": "trip-route-" + trip.id,
                    "type": "line",
                    "source": {
                        "type": "geojson",
                        "data": geojson
                    },
                    "layout": {
                        "line-join": "round",
                        "line-cap": "round"
                    },
                    "paint": {
                        "line-color": '#000',
                        "line-width": 3,
                        //"line-dasharray": [1, 2]
                    }
                };

                driver.addLayer({
                    'id': '3d-buildings',
                    'source': 'composite',
                    'source-layer': 'building',
                    'filter': ['==', 'extrude', 'true'],
                    'type': 'fill-extrusion',
                    'paint': {
                        'fill-extrusion-color': 'hsl(35, 28%, 70%)',
                        'fill-extrusion-height': {
                            'type': 'identity',
                            'property': 'height'
                        },
                        'fill-extrusion-base': {
                            'type': 'identity',
                            'property': 'min_height'
                        },
                        'fill-extrusion-opacity': .6
                    }
                })
                .addLayer(trajectory_layer);
                
                var coordinates = geojson.features[0].geometry.coordinates;

                var bounds = coordinates.reduce(function(bounds, coord) {
                    return bounds.extend(coord);
                }, new mapboxgl.LngLatBounds(coordinates[0], coordinates[1]));
                
                driver.fitBounds(bounds, {
                    padding: 20
                });
                    
            });

            return;
        }
    }
}

function video_map (t)
{

    for (let i = 0; i < select_trips.length; ++i) {

        let trip = select_trips[i];

        if (trip.id.toString() === t.id) {

            var map_container = $('<div/>', {
                id: 'video-map-' + t.id
            }).css({
                width: '100%',
                height: '200px',
                padding: '2px'
            });
            
            return map_container;
        }
    }
}

function video_slider (video_player, t, text)
{
    for (let i = 0; i < select_trips.length; ++i) {

        let trip = select_trips[i];

        if (trip.id.toString() === t.id) {

            var slider = $('<input/>', {
                id: 'video-slider-' + t.id,
                type: 'range',
                min: 0,
                max: trip.mediaTimes.length - 1,
                class: 'slider'
            });

            slider.val(video_player.currentTime);
            slider.on('input', function () {
                // update time
                video_player.currentTime = trip.mediaTimes[this.value];
                text.html(trip.datetime[this.value]);
            });

            return slider;
        }
    }
}

export default function (trip, container)
{
    // Select video player by trip id
    var video_player = document.getElementsByClassName('trip-video-player');
    var video_button = $('<button/>', {
        title: 'show video player',
        class: 'video-trip-btn trip-button'
    });

    var video_icon = $('<i/>', {
        class: 'fas fa-video'
    });

    video_button.append(video_icon);

    video_button.on('click', function (e) {

        e.stopPropagation();
        
        for (var i = 0; i < video_player.length; ++i) {
            if (video_player[i].id === 'trip-video-' + trip.id) {

                if ($('#video-container-' + trip.id).hasClass('open')) {
                    $('#video-container-' + trip.id).remove();
                    return;
                }

                $('#video-container-' + trip.id).remove();
                var video_container = $('<div/>', {
                    id: 'video-container-' + trip.id,
                    class: 'video-container open'
                });

                var text = video_time(video_player[i], trip);
                var narrative = video_narrative(video_player[i], trip);
                var slider = video_slider(video_player[i], trip, text, narrative);
                video_container.append(text);
                video_container.append(slider);
                video_container.append(narrative);
                //video_container.append(video_map(trip));

                container.after(video_container);
            }
        }
    });

    return video_button;
}