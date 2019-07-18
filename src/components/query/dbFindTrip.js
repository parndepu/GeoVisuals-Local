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
 * Generate media time base on date
 * @param {*} trip 
 */
function generate_mediaTime(trip)
{

    trip.mediaTimes = [];

    var start = trip.datetime[0];
    trip.mediaTimes.push(0);

    for (var i = 1; i < trip.datetime.length; ++i) {
        
        var current = trip.datetime[i];

        var previous_date = new Date(start);
        var current_date = new Date(current);

        var seconds = (current_date.getTime() - previous_date.getTime()) / 1000;
        trip.mediaTimes.push(trip.mediaTimes[i - 1] + seconds);
        
        start = current;
    }

    return trip; 
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
                    narratives: [],
                    object_ids: [],
                    edits: [],
                    editDates: []
                }
    
                for (var j = 0; j < result.length; ++j) {
                    if (result[j].tripID.equals(trip_data.id)) {

                        // Set to [longitude, latitude];
                        var point = [result[j].location[0], result[j].location[1]];
                        var narrative = result[j].narrative;
                        var datetime = result[j].datetime;
                        var id = result[j].id;
    
                        trip_data.path.push(point);
                        trip_data.narratives.push(narrative);
                        trip_data.datetime.push(datetime);
                        trip_data.object_ids.push(id);
                        trip_data.edits.push(result[j].editNarrative);
                        trip_data.editDates.push(result[j].editDate);
                    }
                }
                

                trip_data = generate_mediaTime(trip_data);
                output.push(trip_data);
            }
    
            resolve(output);
        });
    });
}