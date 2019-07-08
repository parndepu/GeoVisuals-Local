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

            // Hide tool contents
            console.log('hide tab');

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