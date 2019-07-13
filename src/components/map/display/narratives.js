import { Mapbox_map, Mapbox_clear_layers } from '../../index';
import { default as Map_layers } from './layers';

export default function (trips)
{
    for (var i = 0; i < trips.length; ++i) {
        
        var trip = trips[i];

        var geojson =   {   
                            "type": "FeatureCollection",
                            "features": []
                        };

        // Get all narratives point
        for (var j = 0; j < trip.narratives.length; ++j) {
            var narrative = trip.narratives[j];
            if (trip.narratives[j] !== 'none') {
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

        var narrative_point = Mapbox_map.addSource('narrative-point-' + trip.id, {
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

        Map_layers.trip_narrative_markers.push(narrative_point);
    }
}

/*
map.addLayer({
    "id": "points",
    "type": "symbol",
    "source": {
    "type": "geojson",
    "data": 
    },
    "layout": {
    "icon-image": "{icon}-15",
    "text-field": "{title}",
    "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
    "text-offset": [0, 0.6],
    "text-anchor": "top"
    }
});*/