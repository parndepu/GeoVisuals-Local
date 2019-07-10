var Text_video_name = $('#video-name-input');
var Text_data_name = $('#data-name-input');

exports.set_video_name = function (name)
{
    return Text_video_name.val(name);
}

exports.reset_video_name = function ()
{
    return Text_video_name.val('');
}