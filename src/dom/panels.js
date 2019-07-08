const map = require('../map');

var is_resizing = false;
var last_down_x = 0;
var previous_left = 0;

function Set_resizable_panel()
{
    var container = $('#main-container');
    var left_panel = $('#tools-resizable-container');
    var right_panel = $('#map-container');
    var handle = $('#drag-handle');

    // Mouse down on drag handle
    handle.on('mousedown', function (e) {
        is_resizing = true;
        last_down_x = e.clientX;
    });

    // Mouse move
    $(document).on('mousemove', function (e) {

        if (!is_resizing) return;

        var rt = ($(window).width() - (container.offset().left + container.outerWidth()));
        var left_offset = (e.clientX - rt);

        //console.log(left_offset);
        //console.log(container.outerWidth());

        var right_offset = container.outerWidth() - 200;

        if (left_offset > right_offset) {
            left_panel.css('width', right_offset);
            right_panel.css('left', right_offset + 45);
        } else if (left_offset < 100) {
            left_panel.css('width', '0px');
            right_panel.css('left', '45px');
        } else {
            left_panel.css('width', left_offset);
            right_panel.css('left', left_offset + 45);
        }
        
        //left_panel.css('width', left_offset);
        //right_panel.css('left', left_offset);
        map.resize();
    }).on('mouseup', function (e) {
        is_resizing = false;
    });
}

// Open tool tab by name
function Open_tool(tool_name)
{
    $('.tools-content').removeClass('active');

    switch (tool_name) {
        case 'data':
            $('#data-tools-content').addClass('active');
            break;
        case 'query':
            $('#query-tools-content').addClass('active');
            break;
        default: 
            break;
    }

    return;
}

module.exports = {
    Set_resizable_panel,
    Open_tool
}