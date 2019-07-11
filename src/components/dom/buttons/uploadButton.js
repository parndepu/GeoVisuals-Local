import { default as buttons } from './buttons';
import {    Upload_file,
            Dom_reset_upload_input,
            Upload } from '../../index';

export default function ()
{
    buttons.upload_button.on('click', function () {
        // Retrieve data and upload

        // Check if upload_file is invalid

        if (!Upload_file.video) {

            alert('Please select your video');
            Dom_reset_upload_input();
            return;
        } else if (!Upload_file.spreadsheet) {

            alert('Please select your spreadsheet');
            Dom_reset_upload_input();
            return;
        } else {

            // Start uploading
            Upload(Upload_file);
            return;
        }

    });
}