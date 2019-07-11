import { Dom_reset_upload_input } from '../index';
import { trip_data_model, Initialize_user_data } from '../../index';

/**
 * 
 * @param {*} file 
 * @param {*} trip_id 
 */
export default function (file, trip)
{
    var spreadsheet = file.spreadsheet.object;
    var trip_id = trip.id;

    // Add tripid attributes
    for (var i = 0; i < spreadsheet.length; ++i) {
        spreadsheet[i].datetime = new Date(spreadsheet[i].datetime);

        spreadsheet[i].location = [spreadsheet[i].longitude, spreadsheet[i].latitude];
        spreadsheet[i].tripID = trip_id;
        delete spreadsheet[i].latitude;
        delete spreadsheet[i].longitude;
    }

    trip_data_model.insertMany(spreadsheet)
    .then (function() {
        alert('Successfully upload your data!');

        // Clear all input and refresh user data
        Dom_reset_upload_input();
        Initialize_user_data();
    })
    .catch (function(err) {
        alert(err);
    });
}