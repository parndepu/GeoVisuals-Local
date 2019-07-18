import { Mapbox_map } from '../../index';
import { default as Map_layers } from './layers';

export var sources = [];
export var layers = [];

export default function (trips)
{

    for (var i = 0; i < layers.length; ++i) {
        Mapbox_map.removeLayer(layers[i]);
    }

    for (var i = 0; i < sources.length; ++i) {
        Mapbox_map.removeSource(sources[i]);
    }

    layers = [];
    sources = [];

    for (var i = 0; i < trips.length; ++i) {
        
        var trip = trips[i];

        if (Mapbox_map.getSource('narrative-point-' + trip.id)){
            Mapbox_map.removeSource('narrative-point-' + trip.id);
        }

        var geojson =   {   
                            "type": "FeatureCollection",
                            "features": []
                        };

        // Get all narratives point
        for (var j = 0; j < trip.edits.length; ++j) {
            var narrative = trip.edits[j];
            if (narrative !== 'none') {
                console.log(narrative);
                // Get coords
                var coords = trip.path[j];

                var loc = {
                    "type": "Feature",
                    "geometry": {
                    "type": "Point",
                    "coordinates": coords,
                    },
                    "properties": {
                        "title": narrative,
                        "icon": "monument"
                    }
                };
                geojson.features.push(loc);
            }
        }

        Mapbox_map.addSource('narrative-point-' + trip.id, {
            type: "geojson",
            data: geojson
        });

        Mapbox_map.addLayer({
            "id": 'narrative-point-' + trip.id + '-circle2',
            "type": "circle",
            "source": 'narrative-point-' + trip.id,
            "paint": {
                "circle-radius": 7,
                "circle-color": '#fff'
            }
        });

        Mapbox_map.addLayer({
            "id": 'narrative-point-' + trip.id + '-circle1',
            "type": "circle",
            "source": 'narrative-point-' + trip.id,
            "paint": {
                "circle-radius": 5,
                "circle-color": trip.color
            }
        });

        Mapbox_map.addLayer({
            'id': 'narrative-point-' + trip.id + '-text',
            'type': 'symbol',
            //'type': 'circle',
            "source": 'narrative-point-' + trip.id, 
            'layout': {
                //'icon-image': '{icon}-15',
                'text-field': '{title}',
                'text-offset': [0, 0.6],
                'text-anchor': 'top',
                'text-size': 10
            }
        });

        sources.push('narrative-point-' + trip.id);
        layers.push('narrative-point-' + trip.id + '-circle2');
        layers.push('narrative-point-' + trip.id + '-circle1');
        layers.push('narrative-point-' + trip.id + '-text');

        //Map_layers.trip_narrative_markers.push(narrative_point);
    }
}