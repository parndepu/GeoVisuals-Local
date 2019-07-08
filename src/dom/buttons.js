const map = require('../map');

/**
 * Set all tools events
 */
function Set_tools_buttons()
{

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
                right_panel.css('left', '300px');
                map.resize();
            }

        } else {

            // Change tool contents
            $('.tools-button').removeClass('active');
            $('.tools-button').css('border', 'none');

            $(this).css('border', '1px solid #000');
            $(this).addClass('active');
        }

    });

}

module.exports = {
    Set_tools_buttons
}