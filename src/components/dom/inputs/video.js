import { default as inputs } from './inputs';
import {    Util_validate_filetype, 
            Dom_show_alert,
            Util_format_bytes,
            Upload_file } from '../../index';
/**
 * Video upload button 
 * Currently support .mp4 or .mov video format
 */
export default function ()
{
    // Click event
    inputs.video_file_input.on('click', function () {
        $(this).val('');
    });

    // Change event
    inputs.video_file_input.on('change', async function (e) {

        // Get single file
        var file = e.target.files[0];
        if (!file) return;

        // Clear upload file attributes
        if (Upload_file.video !== null) {
            Upload_file.video = undefined;
        }

        if (    Util_validate_filetype(file.type, 'mp4') || 
                Util_validate_filetype(file.type, 'mov')) {

            // Create video file structure
            var video_file = {
                name: file.name,
                size: Util_format_bytes(file.size),
                object: new File([file], 'geovisuals-video.mp4')
            };
            
            // Set upload file video
            Upload_file.video = video_file;
            inputs.video_name_input.val(video_file.name);
            
        } else {

            // Show alert of invalid file type
            Dom_show_alert.video_filetype();
            Dom_reset_upload_input();
        }

    });

    return;
}