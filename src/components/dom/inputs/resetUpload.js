import { default as inputs } from './inputs';
import { Upload_file } from '../../index';

export default function ()
{
    // Reset upload file structure
    Upload_file.video = undefined;
    Upload_file.spreadsheet = undefined;
    Upload_file.location = undefined;
    Upload_file.description = undefined;
    Upload_file.optional = undefined;

    // Reset file and text inputs
    inputs.video_file_input.val('');
    inputs.spreadsheet_file_input.val('');
    inputs.video_name_input.val('');
    inputs.spreadsheet_name_input.val('');
    inputs.location_input.val('');
    inputs.description_input.val('');
    inputs.optional_input.val('');

    return;
}