import { default as inputs } from './inputs';
import { Upload_file } from '../../index';

/**
 * Description inputs
 */
export default function ()
{
    inputs.location_input.on('change', function () {
        Upload_file.location = inputs.location_input.val();
    });

    inputs.description_input.on('change', function () {
        Upload_file.description = inputs.description_input.val();
    });

    inputs.optional_input.on('change', function () {
        Upload_file.optional = inputs.optional_input.val();
    });

    return;
}