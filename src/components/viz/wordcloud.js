import {default as cloud} from 'd3-cloud'
import * as d3 from 'd3';
import { Mapbox_map } from '../index';

export var layers = [];
export var sources = [];
export var selected_keywords = [];
export var wordcloud_trip = undefined;

function prepare_data(keywords)
{
    var result = {};
    // Create keywords object with frequency.
    for (var i = 0; i < keywords.length; i++) {
        var words = keywords[i];
        for (var j = 0; j < words.length; j++) {
            // Check if words already existed in result object.
            if (result.hasOwnProperty(words[j])) {
                result[words[j]]++;
            } else {
                // Create new word with initialize value.
                result[words[j]] = 1;
            }
        }
    }

    // Sorted keywords by frequency and normalize it
    result = getSortedByValue(result);
    result = normalize(result);

    var pairs = Object.keys(result).map(function (key) {
        return [key, result[key]];
    });

    pairs.sort(function (a, b) {
        return a[1] - b[1];
    });

    result = pairs.slice(-100).reduce(function (obj, pair) {
        obj[pair[0]] = pair[1];
        return obj;
    }, {});

    return result;
}

function normalize(obj) {
    // Find min max
    var min = obj[Object.keys(obj)[Object.keys(obj).length-1]];
    var max = obj[Object.keys(obj)[0]];

    if (min == max || Object.keys(obj).length <= 1) {
        for (var item in obj) {
            obj[item] = 14;
        }
        return obj;
    } else {
        // Normalize function
        var norm = function(value, r1, r2) {
            return ( value - r1[ 0 ] ) * ( r2[ 1 ] - r2[ 0 ] ) / ( r1[ 1 ] - r1[ 0 ] ) + r2[ 0 ];
        };
        // Text size between 8 to 36
        for (var item in obj) {
            obj[item] = norm(obj[item], [min, max], [10,36]);
        }
        return obj;
    }
}

// Sort object with arrays are return a new objects
function getSortedByValue(obj) {
    var sortable = [];
    // Put item in sortable array.
    for (var item in obj) {
        sortable.push([item, obj[item]]);
    }
    // Sort value by decreasing.
    sortable.sort(function(a, b) {
        return b[1] - a[1];
    });

    obj = {};
    for (var i = 0, len = sortable.length; i < len; i++) {
        obj[sortable[i][0]] = sortable[i][1];
    }

    return obj;
}


export default function (trip, container)
{
    let data = prepare_data(trip.keywords);
    selected_keywords = [];
    wordcloud_trip = trip;

    container.empty();
    // Create trip index
    

    var width = container.width(),
    height = container.height();

    // Wordcloud options.
    var rescale = 50,
        fontFamily = 'sans-serif',
        fill = d3.schemeCategory10;

    //let fillcolor = '#000';

    
    var color = d3.scaleLinear()
                    .domain([36, 29, 23, 15, 10])
                    .range(["#000000", "#252525", "#525252", "#737373", "#969696"]);


    cloud().size([width, height])
        .words(Object.keys(data).map(function(d) {
            return {
                text: d,
                size: data[d]
            }
        }))
        .padding(0)
        .rotate(function () { return 0; })
        .font(fontFamily)
        .fontSize(function(d) { return d.size })
        .on("end", draw)
        .start();
    
        
    function draw(data) {
        
        var svg = d3.select('#' + container.attr('id')).append("svg")
                    .attr("width", width)
                    .attr("height", height)
                    .append("g")
                    .attr("background-color", "black")
                    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
        
        var wordcloud = svg.selectAll("text")
                            .data(data);
        wordcloud.enter()
            .append("text")
            .style("font-family", fontFamily)
            .style("font-size", (d) => { return d.size + 'px'; }) // set this to 1
            .style('font-weight', 'normal')
            .style('opacity', 0.7)
            .style("fill", function(d, i) {
                
                // position
                /*
                let pos = selected_keywords.map((x) => {
                    return x.word;
                }).indexOf(d.text);*/
                
                return '#000';//color(d.size);
                //return (pos !== -1) ? selected_keywords[pos].color : fillcolor;

            })
            .attr("text-anchor", "middle")
            .text(function(d) {
                return d.text;
            })
            .attr("transform", function(d) {
                return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
            })
            .on("click", click)
            .on("mouseover", mouseover)
            .on("mouseout", mouseout);

        wordcloud.transition()
            .duration (500)
            .style ("font-size", function(d) {
                return d.size + "px";
            })
            .attr("transform", function(d) {
                return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
            })
            .style("fill-opacity", 1);
    }

    function click(d, i) {

        if (d3.select(this).classed('select')) {
            d3.select(this).attr('class', '')
                .style('fill', '#000');

            remove_keyword(d.text);
            display_keyword();
            
        } else {
            d3.select(this)
                .attr('class', 'select')
                .style('fill', 'red');

            add_keyword(d.text);
            display_keyword();
        }
    }

    function mouseover(d, i) {
        d3.select(this).style('cursor', 'pointer');
        d3.select(this).style('font-weight', 'bold');
    }

    function mouseout(d, i) {
        d3.select(this).style('font-weight', 'normal');
    }

    return;
}

function add_keyword(word)
{
    let pos = selected_keywords.indexOf(word);
    if (pos == -1) {
        selected_keywords.push(word);
    }
}

function remove_keyword(word)
{
    let pos = selected_keywords.indexOf(word);
    if (pos !== -1) {
        selected_keywords.splice(pos, 1);
    }
}

function display_keyword()
{
    console.log(selected_keywords);
    console.log(wordcloud_trip);

    //const found = arr1.some(r=> arr2.includes(r))

    for (var i = 0; i < layers.length; ++i) {
        Mapbox_map.removeLayer(layers[i]);
    }

    for (var i = 0; i < sources.length; ++i) {
        Mapbox_map.removeSource(sources[i]);
    }

    layers = [];
    sources = [];

    var geojson =   {   
        "type": "FeatureCollection",
        "features": []
    };

    for (let i = 0; i < wordcloud_trip.path.length; ++i) {
        let keywords = wordcloud_trip.keywords[i];
        let founds = [];
        const found = keywords.some( function (r) {
            if(selected_keywords.includes(r)) {
                founds.push(r);
            }
            return selected_keywords.includes(r);
        });
        if (found) {
            let loc = {
                "type": "Feature",
                "geometry": {
                "type": "Point",
                "coordinates": wordcloud_trip.path[i],
                },
                "properties": {
                    "title": founds,
                    "icon": "monument"
                }
            };
            geojson.features.push(loc);
        }
    }

    Mapbox_map.addSource('wordcloud-point', {
        type: "geojson",
        data: geojson
    });

    Mapbox_map.addLayer({
        "id": 'wordcloud-point-circle2',
        "type": "circle",
        "source": 'wordcloud-point',
        "paint": {
            "circle-radius": 7,
            "circle-color": '#fff',
            'circle-opacity': 0.5
        }
    });

    Mapbox_map.addLayer({
        "id": 'wordcloud-point-circle1',
        "type": "circle",
        "source": 'wordcloud-point',
        "paint": {
            "circle-radius": 5,
            "circle-color": 'red',
            'circle-opacity': 0.5
        }
    });

    Mapbox_map.addLayer({
        'id': 'wordcloud-point-text',
        'type': 'symbol',
        //'type': 'circle',
        "source": 'wordcloud-point', 
        'layout': {
            //'icon-image': '{icon}-15',
            'text-field': '{title}',
            'text-offset': [0, 0.6],
            'text-anchor': 'top',
            'text-size': 10
        }
    });

    sources.push('wordcloud-point');
    layers.push('wordcloud-point-circle2');
    layers.push('wordcloud-point-circle1');
    layers.push('wordcloud-point-text');

    return;
}