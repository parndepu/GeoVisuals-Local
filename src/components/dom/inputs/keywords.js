/**
 * This is keyword search
 */
import { default as inputs } from "./inputs";
import { Mapbox_map } from '../../index';
import { trip_data_model, compute_keywords } from '../../../index';
import { Viz_wordcloud } from "../../viz";

export var layers = [];
export var sources = [];

// Create group by trip container
function get_trip_container(tripid, index, len)
{
    let container = $('<div/>', {
        id: 'keywords-' + tripid,
        class: 'trip-keywords-container'
    }).html('Trip: ' + (index + 1) + ' (' + len + ' narratives)');

    return container;
}

function get_wordcloud_button(trip, container)
{

    let wordcloud_button = $('<button/>', {
        title: 'Show trip wordcloud',
        id: 'wordcloud-btn-' + trip.id,
        class: 'info-trip-btn trip-button'
    });

    let wordcloud_icon = $('<i/>', {
        class: 'fab fa-wordpress-simple'
    });

    wordcloud_button.append(wordcloud_icon);
    return wordcloud_button;
};

function get_list_button(trip, container)
{

    let list_button = $('<button/>', {
        title: 'List all narratives',
        id: 'list-btn-' + trip.id,
        class: 'video-trip-btn trip-button'
    });

    let list_icon = $('<i/>', {
        class: 'fas fa-th-list'
    }); 

    list_button.append(list_icon);

    list_button.on('click', (e) => {
        e.stopPropagation();
        let search = inputs.keyword_input.val();

        $('.query-narrative').remove();
        trip.points.forEach( (point) => {
            let div = $('<div/>', {
                class: 'query-narrative'
            }).css({ width: '100%', height: 'auto', padding: '2px', 'margin-top': '2px', 'border': '1px solid #bdbdbd', 'border-radius': '4px'}).html(point.narrative);
            $('keywords-' + trip.id).after(div);
        });

        // Create a mark
        let context = document.querySelectorAll(".query-narrative");
        let instance = new Mark(context);
        instance.mark(search);
    });

    return list_button;

}

export default function ()
{
    // Get search text
    var button = $('#search-btn');
    var query_container = $('#search-result');

    button.on('click', function (e) {
        e.stopPropagation();
        let search = inputs.keyword_input.val();
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
            
            //console.log(docs);
            var trips = [];
            for (let i = 0; i < docs.length; ++i) {
                // Draw point here
                //search_points.push();

                var point = docs[i];

                var pos = trips.map( function (x) {
                    return x.id;
                }).indexOf(point.tripID.toString());

                // Add trip if it does not existed
                if ( pos === -1) {

                    let new_trip = {
                        id: point.tripID.toString(),
                        points: []
                    };

                    new_trip.points.push(point);
                    trips.push(new_trip);

                } else {
                    // add point to current trip
                    trips[pos].points.push(point);
                }
            }

            //console.log(trips);

            $('.word-count').remove();

            for (let i = 0, len = trips.length; i < len; ++i) {
                // Create trip container
                let trip_container = get_trip_container(trips[i].id, i, trips[i].points.length);
                
                $('#trip-' + trips[i].id).append(' <font color="#41b6c4"><span class="word-count">(' + trips[i].points.length + ')</span></font>');

                trip_container.append(get_wordcloud_button(trips[i]), trip_container);
                trip_container.append(get_list_button(trips[i]), trip_container);

                // Get all points
                trips[i].points.forEach( (point) => {
                    let loc = {
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
                });

                query_container.append(trip_container);
            }

            // Draw all narratives points
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
                    "circle-color": '#fff',
                    'circle-opacity': 0.5
                }
            });
    
            Mapbox_map.addLayer({
                "id": 'search-point-circle1',
                "type": "circle",
                "source": 'search-point',
                "paint": {
                    "circle-radius": 5,
                    "circle-color": '#41b6c4',
                    'circle-opacity': 0.5
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

            // Create location
            /*
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

            // Create a mark
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
            */
        });
    });
}