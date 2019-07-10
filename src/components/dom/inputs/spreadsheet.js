import { default as inputs } from './inputs';

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

        console.log(e.target.files[0]);

    });

    return;
}