import { default as buttons } from './buttons';
import { default as panels } from '../panels/panels';
import { Mapbox_resize, Dom_open_tool } from '../../index';

export default function ()
{
    // Hover events
    buttons.tools_button.hover( function () {
        
        if (!$(this).hasClass('active')) {
            $(this).css('border', '1px dashed #000');
        }

    }, function () {
        
        if (!$(this).hasClass('active')) {
            $(this).css('border', 'none');
        }

    });

    // Click events
    buttons.tools_button.on('click', function () {

        if ($(this).hasClass('active')) {

            $(this).toggleClass('hide-tools');

            if ($(this).hasClass('hide-tools')) {
                panels.left_panel.css('width', '0px');
                panels.right_panel.css('left', '45px');
                Mapbox_resize();
            } else {
                panels.left_panel.css('width', '300px');
                panels.right_panel.css('left', '345px');
                Mapbox_resize();
            }

        } else {
            
            buttons.tools_button.removeClass('active');
            buttons.tools_button.css('border', 'none');

            $(this).css('border', '1px solid #000');
            $(this).addClass('active');

            // Open tool contents
            var tool_name = $(this).attr('name');
            Dom_open_tool(tool_name);
        }

    });
}