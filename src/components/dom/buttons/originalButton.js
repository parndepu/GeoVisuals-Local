import { default as buttons } from './buttons';
import { Enable_original_mode, Disable_original_mode, all_trips, Initialize_user_data, original_mode } from '../../../index';
import { Mapbox_resize } from '../../index';

// Split pane if go back to original mode
function split_pane ()
{

    //var map = $('#map');
    var video_player = $('#video-right-container');
    var duration = 500;
    video_player.toggle('slide', { direction: 'right' }, duration);
}

export default function ()
{
    buttons.original_button.on('click', function (e) {

        e.stopPropagation();

        // Enable mode when button clicked
        if (buttons.original_button.hasClass('enable')) {

            buttons.original_button.removeClass('enable');
            Disable_original_mode();
            buttons.original_button.html('ENABLE ORIGINAL VIEW');
            buttons.original_button.css({ background: '#d9ef8b' });
            split_pane();
            Initialize_user_data();
        } else {

            buttons.original_button.addClass('enable');
            Enable_original_mode();
            Initialize_user_data();
            buttons.original_button.html('DISABLE ORIGINAL VIEW');
            buttons.original_button.css({ background: '#fdae61' });
            split_pane();
            Initialize_user_data();
        }
    });
}