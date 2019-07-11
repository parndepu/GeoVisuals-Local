import fs from 'fs';
import path from 'path';
import { trip_model } from '../../index';

/**
 * Get current upload date and time
 */
function get_current_datetime()
{
    var date = new Date();

    var hour = date.getHours(); hour = (hour < 10 ? "0" : "") + hour;
    var min  = date.getMinutes(); min = (min < 10 ? "0" : "") + min;
    var sec  = date.getSeconds(); sec = (sec < 10 ? "0" : "") + sec;

    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;
    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    return month + "/" + day + "/" + year + "-" + hour + ":" + min + ":" + sec;
}

/**
 * Save video file to directory
 * Named by tripid
 * @param {*} file 
 */
function save_videofile(file, trip_id)
{
    fs.copyFile(file.path, path.resolve('data','videos', trip_id + '.mp4'), (err) => {
        if (err) throw err;
        console.log('Copied video file with trip id');
    });
}

export default function (file) 
{
    return new Promise( function (resolve, reject) {

        var new_trip = new trip_model({
            upload_datetime: get_current_datetime(),
            upload_location: (file.location) ? file.location : 'none',
            upload_description: (file.description) ? file.description: 'none',
            upload_optional: (file.optional) ? file.optional : 'none'
        });
        
        // Save to mongodb and move video file to directory
        new_trip.save().then( function (saved_trip) {
            // Save video file
            save_videofile(file.video.object, saved_trip.id);
            resolve(saved_trip);
        });

    });
}