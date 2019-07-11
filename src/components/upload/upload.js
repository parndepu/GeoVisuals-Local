import { default as Upload_video } from './uploadVideo';
import { default as Upload_data } from './uploadData';
import { Dom_reset_upload_input } from '../index';

// Need to first check data attributes;
function check_attributes(data)
{
    var required_property = ['datetime', 'latitude', 'longitude'];

    for (let i = 0; i < required_property.length; ++i) {
        if (!data[0].hasOwnProperty(required_property[i])) {
            return false;   
        }
    }

    // Pre generate narrative if does not exist
    if (!data[0].hasOwnProperty('narrative')) {
        for (var i = 0; i < data.length; ++i) {
            data[i].narrative = 'none';
        }
    }

    return true;
}

/**
 * Upload all data from file structures
 * @param {*} file 
 */
export default function (file)
{
    console.log('Start uploading ...');
    if (check_attributes(file.spreadsheet.object)) {

        // Upload video
        Upload_video(file).then( function (trip) {
            Upload_data(file, trip);
        }); 
        
    } else {
        // Spreadsheet must match our required values
        alert('Your data does not match our data format');
        Dom_reset_upload_input();
    }

    return;
}