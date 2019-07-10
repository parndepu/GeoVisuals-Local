const map = require('../map');
const panels = require('./panels');
const textbox = require('./textbox');
/**
 * Set all tools events
 */
function Set_tools_buttons()
{

    // Upload button events
    $('#upload-btn').on('click', () => {
        console.log('upload');
    });

    // Set hover events
    $('.tools-button').hover( function () {
        if (!$(this).hasClass('active')) {
            $(this).css('border', '1px dashed #000');
        }
    }, function () {
        if (!$(this).hasClass('active')) {
            $(this).css('border', 'none');
        }
    });

    // Set click events
    $('.tools-button').on('click', function () {

        if ($(this).hasClass('active')) {

            // Toggle left and right panel
            var left_panel = $('#tools-resizable-container');
            var right_panel = $('#map-container');

            $(this).toggleClass('hide-tools');

            if ($(this).hasClass('hide-tools')) {
                left_panel.css('width', '0px');
                right_panel.css('left', '45px');
                map.resize();
            } else {
                left_panel.css('width', '300px');
                right_panel.css('left', '345px');
                map.resize();
            }

        } else {

            // Change tool contents
            $('.tools-button').removeClass('active');
            $('.tools-button').css('border', 'none');

            $(this).css('border', '1px solid #000');
            $(this).addClass('active');

            // Open tool contents
            var tool_name = $(this).attr('name');
            panels.Open_tool(tool_name);
            
        }

    });
}

function Set_browse_buttons()
{
    // Browse input dom elements
    var video_input = $('#video-file-input');
    var data_input = $('#data-file-input');

    set_onclick(video_input);
    set_onclick(data_input);

    function set_onclick(input)
    {
        // Set click event
        input.on('click', function () {
            // Reset input when click
            $(this).val('');
        });

        return;
    }

    video_input.on('change', async function (e) {

        // Clear all previous files
        //
        var video_file = e.target.files[0];
    });

    data_input.on('change', async function (e) {

        // Clear all previous files
        //

        var data_file = e.target.files[0];
    });

    return;
}

module.exports = {
    Set_tools_buttons,
    Set_browse_buttons
}