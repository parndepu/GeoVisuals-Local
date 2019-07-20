import { default as buttons } from './buttons';
import { Enable_original_mode, Disable_original_mode, all_trips, Initialize_user_data, original_mode } from '../../../index';
import { Mapbox_resize } from '../../index';

// Split pane if go back to original mode
function split_pane ()
{

    //var map = $('#map');
    //var video_player = $('#video-right-container');
    //var duration = 500;
    //video_player.toggle('slide', { direction: 'right' }, duration);
}

function open_video_container()
{
    var map = $('#map');
    var video_player = $('#video-container');

    map.css({ height: '60%' });
    video_player.css({ height: '40%' });
    Mapbox_resize();
}

function close_video_container()
{
    var map = $('#map');
    var video_player = $('#video-container');

    map.css({ height: '100%' });
    video_player.css({ height: '0' });
    Mapbox_resize();
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
            close_video_container();
            Initialize_user_data();

            return;

        } else {

            buttons.original_button.addClass('enable');
            Enable_original_mode();
            buttons.original_button.html('DISABLE ORIGINAL VIEW');
            buttons.original_button.css({ background: '#fdae61' });
            open_video_container();
            Initialize_user_data();

            return;
        }
    });
}