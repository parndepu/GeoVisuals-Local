import { trip_data_model } from '../../index';

function sort_data(trip_data)
{
    for ( var i = 0; i < trip_data.length; ++i) {
        // Get unix timestamp
        var seconds = trip_data[i].datetime.getTime() / 1000;
        trip_data[i].seconds = seconds;
    }

    // Sort by seconds
    trip_data.sort( function (a, b) {
        return (a.seconds > b.seconds) ? 1 : -1;
    });

    return trip_data;
}

/**
 * 
 * @param {*} trip_ids 
 * @param {*} trips 
 */
export default function (trip_ids, trips)
{
    return new Promise( function (resolve, reject) {
        trip_data_model.find({ tripID: {$in: trip_ids}}).then( function (result) {

            var output = [];
    
            sort_data(result);
            for (var i = 0; i < trip_ids.length; ++i) {
    
                var trip_data = {
                    id: trip_ids[i],
                    color: trips[i].color,
                    datetime: [],
                    path: [],
                    narratives: []
                }
    
                for (var j = 0; j < result.length; ++j) {
                    if (result[j].tripID.equals(trip_data.id)) {
                        // Set to [longitude, latitude];
                        var point = [result[j].location[0], result[j].location[1]];
                        var narrative = result[j].narrative;
                        var datetime = result[j].datetime;
    
                        trip_data.path.push(point);
                        trip_data.narratives.push(narrative);
                        trip_data.datetime.push(datetime);
                    }
                }
    
                output.push(trip_data);
            }
    
            resolve(output);
        });
    });
}