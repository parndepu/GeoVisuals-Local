import { default as inputs } from './inputs';
import csv from 'csvtojson';
import {    Dom_show_alert,
            Util_validate_filetype,
            Util_format_bytes,
            Dom_reset_upload_input,
            Upload_file } from '../../index';
/**
 * Spreadsheet upload input
 * Currently support .csv or .json format
 */
export default function ()
{
    // Click event
    inputs.spreadsheet_file_input.on('click', function () {
        $(this).val('');
    });

    // Change event
    inputs.spreadsheet_file_input.on('change', async function (e) {

        // Get single file
        var file = e.target.files[0];
        if (!file) return;

        // Clear upload spreadsheet file
        if (Upload_file.spreadsheet !== null) {
            Upload_file.spreadsheet = undefined;
        }

        if (    Util_validate_filetype(file.type, 'csv') ||
                Util_validate_filetype(file.type, 'json')) {
            
            // Read csv file and parse it to json        
            var reader = new FileReader();
            
            // Reader onload
            reader.onload = (function () {
                return function (e) {
                    // Convert csv to json
                    csv({
                        noheader: false,
                        output: 'json'
                    })
                    .fromString(e.target.result)
                    .then(function (json_data) {
                        // Create spreadsheet file structure
                        var spreadsheet_file = {
                            name: file.name,
                            size: Util_format_bytes(file.size),
                            object: json_data 
                        };

                        // Set upload spreadsheet file
                        Upload_file.spreadsheet = spreadsheet_file;
                        inputs.spreadsheet_name_input.val(spreadsheet_file.name);

                    });
                };
            })(file);
            
            // Reader error
            reader.onerror = function () {
                alert('Cannot read your spreadsheet');
            }

            reader.readAsText(file);

        } else {
            // Show alert of invalid file type
            Dom_show_alert.data_filetype();
            Dom_reset_upload_input();
        }
        
    });

    return;
}