import { Mapbox_map, Mapbox_clear_layers } from '../../index';
import { default as Map_layers } from './layers';
import * as turf from '@turf/turf';
import { original_mode, map_tooltip } from '../../../index';
import * as d3 from 'd3';

function get_route()
{

}

export var sources = [];
export var layers = [];

/**
 * Draw all active trip trajectory
 * @param {*} trips 
 */
export default function (trips)
{
    for (var i = 0; i < trips.length; ++i) {

        // Geojson features
        var geojson = {
            "type": "FeatureCollection",
            "features": [{
                "type": "Feature",
                "geometry": {
                    "type": "LineString",
                    "coordinates": trips[i].path
                },
                'properties': {
                    trip: trips[i]
                }
            }]
        }

        // Create linestring layer
        var trajectory_layer = {
            "id": "trip-route-" + trips[i].id,
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
                "line-color": trips[i].color,
                "line-width": 3,
                //"line-dasharray": [1, 2]
            }
        };

        var start = {
            'id': 'trip-start-' + trips[i].id,
            'type': 'circle',
            'source': {
                'type': 'geojson',
                'data': {
                    'type': 'Feature',
                    'geometry': {
                        'type': 'Point',
                        'properties': {},
                        'coordinates': trips[i].path[0]
                    }
                }
            },
            'paint': {
                'circle-radius': 5,
                'circle-color': '#addd8e'
            }
        };

        var stop = {
            'id': 'trip-stop-' + trips[i].id,
            'type': 'circle',
            'source': {
                'type': 'geojson',
                'data': {
                    'type': 'Feature',
                    'geometry': {
                        'type': 'Point',
                        'properties': {},
                        'coordinates': trips[i].path[trips[i].path.length - 1]
                    }
                }
            },
            'paint': {
                'circle-radius': 5,
                'circle-color': '#fc9272'
            }
        };

        var arrow = {
            id: 'trip-arrow-' + trips[i].id,
            type: 'symbol',
            source: {
                type: 'geojson',
                data: geojson
            },
            layout: {
                'symbol-placement': 'line',
                'text-field': '▶',
                'text-size': [
                    'interpolate',
                    ['linear'], ['zoom'],
                    12, 24, 22, 60
                ],
                'symbol-spacing': [
                    'interpolate',
                    ['linear'], ['zoom'],
                    12, 30, 22, 160
                ],
                'text-keep-upright': false
            },
            paint: {
                'text-color': trips[i].color,
                'text-halo-color': '#fff',
                'text-halo-width': 2
            }
        }



        // Add layer to current map
        Mapbox_map.addLayer(arrow);
        Mapbox_map.addLayer(start);
        Mapbox_map.addLayer(stop);
        Mapbox_map.addLayer(trajectory_layer);

        // Fit map to layer
        var coordinates = geojson.features[0].geometry.coordinates;

        var bounds = coordinates.reduce(function(bounds, coord) {
            return bounds.extend(coord);
        }, new mapboxgl.LngLatBounds(coordinates[0], coordinates[1]));
        
        Mapbox_map.fitBounds(bounds, {
            padding: 20
        });

        // Add trajectory layer to map layers
        Map_layers.trips.push(trajectory_layer);
        Map_layers.trips.push(arrow);
        Map_layers.trips.push(start);
        Map_layers.trips.push(stop);
    }

    if (original_mode) {
        
        var video = $(".trip-video-player");
        // create marker here
        Mapbox_map.on('click', "trip-route-" + video[0].trip.id.toString(), function (e) {

            let coord = e.lngLat;
            let line = turf.lineString(video[0].trip.path);
            let pt = turf.point([coord.lng, coord.lat]);
            let snapped = turf.nearestPointOnLine(line, pt, {units: 'miles'});

            let index = snapped.properties.index;
            video[0].currentTime = video[0].trip.mediaTimes[index];

        });

        Mapbox_map.on('mouseenter', "trip-route-" + video[0].trip.id.toString(), function (e) {
            Mapbox_map.getCanvas().style.cursor = 'pointer';
        });

        Mapbox_map.on('mouseleave', "trip-route-" + video[0].trip.id.toString(), function (e) {
            Mapbox_map.getCanvas().style.cursor = '';
        });

        return;
    } else {
        // Create video marker
        for (var i = 0; i < trips.length; ++i) {

            var geojson = {
                type: 'FeatureCollection',
                features: [{
                    type: 'Feature',
                    geometry: {
                        type: 'Point',
                        coordinates: trips[i].path[0]
                    },
                    properties: {
                        id: 'video-marker-' + trips[i].id, 
                        title: 'Mapbox',
                        description: 'washington, d.c.',
                        trip: trips[i]
                    }
                }]
            };

            geojson.features.forEach( function (marker) {

                var marker_container = document.createElement('div');
                marker_container.className = 'trip-video-container';
                marker_container.trip = trips[i];

                var video_player = document.createElement('video');
                video_player.id = "trip-video-" + trips[i].id;
                video_player.className = "trip-video-player";
                video_player.src = '../data/videos/' + trips[i].id + '.mp4';
                video_player.trip = trips[i];
                
                marker_container.appendChild(video_player);
                marker_container.style.background = trips[i].color;
                marker_container.style.border = "2px solid " + trips[i].color;

                
                // Create draging events
                marker_container.addEventListener('mousedown', () => {

                });

                marker_container.addEventListener('mousemove', () => {

                });

                // Add onclick listener;
                marker_container.addEventListener('click', () => {

                    marker_container.classList.toggle('play');
                    if (marker_container.classList.contains('play')) {
                        video_player.play();
                    } else {
                        video_player.pause();
                    }
                });

                var marker = new mapboxgl.Marker(marker_container, {
                    draggable: true
                })
                                .setLngLat(marker.geometry.coordinates)
                                .addTo(Mapbox_map);

                

                function on_drag() {
                    
                    var coord = marker.getLngLat();
                    var trip = marker.getElement().trip;

                    var line = turf.lineString(trip.path);
                    var pt = turf.point([coord.lng, coord.lat]);
                    var snapped = turf.nearestPointOnLine(line, pt, {units: 'miles'});

                    var index = snapped.properties.index;
                    //console.log(trip.narratives[index]);

                    video_player.currentTime = trip.mediaTimes[index];

                    marker.setLngLat(snapped.geometry.coordinates);
                }
                marker.on('drag', on_drag);

                Map_layers.trip_video_markers.push(marker);

                /*
                function animate_marker(timestamp) 
                {
                    console.log(timestamp / 1000);
                    var radius = 20;

                    marker.setLngLat([]);
                    
                    // Ensure it's added to the map. This is safe to call if it's already added.
                    marker.addTo(Mapbox_map);
                    requestAnimationFrame(animate_marker);
                }*/

                
                video_player.ontimeupdate = function() {

                    var video_time = Math.round(video_player.currentTime);

                    var index = 0;
                    for (let i = 0; i < video_player.trip.mediaTimes.length; ++i) {
                        if (video_player.trip.mediaTimes[i] === video_time) {
                            index = i;
                            break;
                        }
                    }

                    var trip_id = video_player.trip.id.toString();

                    //console.log(index);

                    //console.log(video_player.currentTime);
                    marker.setLngLat(video_player.trip.path[index]);
                    $('#video-slider-' + trip_id).val(index);
                    $('#video-time-text-' + trip_id).html(video_player.trip.datetime[index]);
                    $('#default-narrative-' + trip_id).html(video_player.trip.narratives[index]);
                    $('#edit-narrative-' + trip_id).val(video_player.trip.edits[index]);
                    $('#edit-narrative-date-' + trip_id).html('<strong>Edit Comments:</strong> ( Last update at ' + video_player.trip.editDates[index] + ')');
                    //marker.addTo(Mapbox_map);
                    //requestAnimationFrame(animate_marker);
                }

                Mapbox_map.on('click', "trip-route-" + trips[i].id, function (e) {
                    let coord = e.lngLat;
                    let line = turf.lineString(video_player.trip.path);
                    let pt = turf.point([coord.lng, coord.lat]);
                    let snapped = turf.nearestPointOnLine(line, pt, {units: 'miles'});

                    let index = snapped.properties.index;
                    video_player.currentTime = video_player.trip.mediaTimes[index];

                });

                Mapbox_map.on('mouseenter', "trip-route-" + trips[i].id, function (e) {
                    Mapbox_map.getCanvas().style.cursor = 'pointer';

                    let coord = e.lngLat;
                    let line = turf.lineString(video_player.trip.path);
                    let pt = turf.point([coord.lng, coord.lat]);
                    let snapped = turf.nearestPointOnLine(line, pt, {units: 'miles'});
                    let index = snapped.properties.index;

                    map_tooltip.transition()
                        .duration(200)
                        .style('opacity', .9);
                    map_tooltip.html(video_player.trip.narratives[index])
                                .style('left', (event.pageX) + 'px')
                                .style('top', (event.pageY - 28) + 'px' );

                });

                Mapbox_map.on('mouseleave', "trip-route-" + trips[i].id, function (e) {
                    Mapbox_map.getCanvas().style.cursor = '';
                    map_tooltip.transition()
                        .duration(200)
                        .style('opacity', 0);
                });
            });
        }
    }
}