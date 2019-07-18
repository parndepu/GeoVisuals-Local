export default function (trip)
{
    console.log(trip);
    var container = $('<div/>', {
        id: 'video-container-' + trip.id,
        class: 'video-container'
    }).html('this is video player');

    return container;
}