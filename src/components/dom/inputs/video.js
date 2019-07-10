import { default as inputs } from './inputs';

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

        console.log(e.target.files[0]);
        // Check file type

    });

    return;
}