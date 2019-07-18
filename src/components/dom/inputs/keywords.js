/**
 * This is keyword search
 */
import { default as inputs } from "./inputs";
import { Mapbox_map } from '../../index';
import { trip_data_model } from '../../../index';

export var layers = [];
export var sources = [];

// Create video container
function get_video_container()
{
    let container = $('<div/>', {
        id: '',
        class: ''
    }).css({
        
    });
}

export default function ()
{
    // Get search text
    var button = $('#search-btn');
    var query_container = $('#search-result');

    button.on('click', function (e) {
        e.stopPropagation();
        var search = inputs.keyword_input.val();
        trip_data_model.find({ $text: { $search: search }}).exec( function (err, docs) {
            if (err) throw err;

            var geojson =   {   
                "type": "FeatureCollection",
                "features": []
            };

            for (var i = 0; i < layers.length; ++i) {
                Mapbox_map.removeLayer(layers[i]);
            }
        
            for (var i = 0; i < sources.length; ++i) {
                Mapbox_map.removeSource(sources[i]);
            }
        
            layers = [];
            sources = [];
            query_container.empty();

            // Need to group by trip over here

            for (let i = 0; i < docs.length; ++i) {
                // Draw point here
                //search_points.push();

                var point = docs[i];

                var loc = {
                    "type": "Feature",
                    "geometry": {
                    "type": "Point",
                    "coordinates": [point.location[0], point.location[1]],
                    },
                    "properties": {
                        "title": point.narrative,
                        "icon": "monument"
                    }
                };
                geojson.features.push(loc);

                var div = $('<div/>', {
                    class: 'query-narrative'
                }).css({ width: '100%', height: 'auto', padding: '2px', 'margin-top': '2px', 'border': '1px solid #bdbdbd', 'border-radius': '4px'}).html(point.narrative);

                query_container.append(div);
            }

            var context = document.querySelectorAll(".query-narrative");
            var instance = new Mark(context);
            instance.mark(search);

            Mapbox_map.addSource('search-point', {
                type: "geojson",
                data: geojson
            });

            Mapbox_map.addLayer({
                "id": 'search-point-circle2',
                "type": "circle",
                "source": 'search-point',
                "paint": {
                    "circle-radius": 7,
                    "circle-color": '#fff'
                }
            });
    
            Mapbox_map.addLayer({
                "id": 'search-point-circle1',
                "type": "circle",
                "source": 'search-point',
                "paint": {
                    "circle-radius": 5,
                    "circle-color": '#2166ac'
                }
            });
    
            Mapbox_map.addLayer({
                'id': 'search-point-text',
                'type': 'symbol',
                //'type': 'circle',
                "source": 'search-point', 
                'layout': {
                    //'icon-image': '{icon}-15',
                    'text-field': '{title}',
                    'text-offset': [0, 0.6],
                    'text-anchor': 'top',
                    'text-size': 10
                }
            });

            sources.push('search-point');
            layers.push('search-point-circle2');
            layers.push('search-point-circle1');
            layers.push('search-point-text');

        });
    });
}