import { Mapbox_map, Mapbox_clear_layers } from '../../index';
import { default as Map_layers } from './layers';

/**
 * Draw trip trajectory
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
                    "properties": {},
                    "coordinates": trips[i].path
                }
            }]
        }

        // Create linestring layer
        var trajectory_layer = {
            "id": "trip-" + trips[i].id,
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

        // Add layer to current map
        Mapbox_map.addLayer(trajectory_layer);

        // Fit map to layer
        var coordinates = geojson.features[0].geometry.coordinates;

        var bounds = coordinates.reduce(function(bounds, coord) {
            return bounds.extend(coord);
        }, new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));
        
        Mapbox_map.fitBounds(bounds, {
            padding: 20
        });

        // Add trajectory layer to map layers
        Map_layers.trips.push(trajectory_layer);
    }

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
                    description: 'washington, d.c.'
                }
            }]
        };

        geojson.features.forEach( function (marker) {

            var marker_container = document.createElement('div');
            marker_container.className = 'trip-video-container';

            var video_player = document.createElement('video');
            video_player.className = "trip-video-player";
            video_player.src = '../data/videos/' + trips[i].id + '.mp4';
            video_player.trip = trips[i];
            
            marker_container.appendChild(video_player);
            marker_container.style.background = trips[i].color;
            marker_container.style.border = "2px solid " + trips[i].color;
            marker_container.addEventListener('click', () => {

                marker_container.classList.toggle('play');
                if (marker_container.classList.contains('play')) {
                    video_player.play();
                } else {
                    video_player.pause();
                }
            });

            var marker = new mapboxgl.Marker(marker_container)
                            .setLngLat(marker.geometry.coordinates)
                            .addTo(Mapbox_map);
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
                //console.log(video_player.currentTime);
                marker.setLngLat(video_player.trip.path[Math.round(video_player.currentTime)]);
                marker.addTo(Mapbox_map);
                //requestAnimationFrame(animate_marker);
            }
        });
    }
}