import { default as panels } from './panels';
import { Mapbox_resize } from '../../index';

export var is_resizing = false;
export var last_down_X = 0;

export default function ()
{
    // Mousedown on handle
    panels.handle.on('mousedown', function (e) {
        is_resizing = true;
        last_down_X = e.clientX;
    });

    // Movemove when on handle
    $(document).on('mousemove', function (e) {

        if (!is_resizing) return;
        // Calculate right offset (See https://stackoverflow.com/questions/3043102/how-to-get-right-offset-of-an-element-jquery)
        var rt = $(window).width() - (panels.main_panel.offset().left + panels.main_panel.outerWidth());

        var left_offset = (e.clientX - rt);
        // Set minimum offset to 200
        var right_offset = panels.main_panel.outerWidth() - 200;
        // Resizable events
        if (left_offset > right_offset) {
            panels.left_panel.css('width', right_offset);
            panels.right_panel.css('left', right_offset + 45);
        } else if (left_offset < 100) {
            panels.left_panel.css('width', '0px');
            panels.right_panel.css('left', '45px');
        } else {
            panels.left_panel.css('width', left_offset);
            panels.right_panel.css('left', left_offset + 45);
        }

        // Resize map on respectively
        Mapbox_resize();

    }).on('mouseup', function (e) { is_resizing = false });

    return;
}