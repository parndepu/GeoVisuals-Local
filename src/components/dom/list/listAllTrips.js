import { Util_random_color } from '../../index';
import { show_active_trip } from '../../../index';

var list_container = $('#datalist-tool');

/**
 * Clear all list
 */
function clear_list()
{
    return list_container.empty();
}

/**
 * Create trip container
 * @param {*} trip 
 */
function get_trip_container(trip)
{
    let trip_detail = "ID: " + trip.id + '<br>' 
        + "Created At: " + trip.upload_datetime + '<br>'
        + "Location: " + trip.upload_location + '<br>'
        + "Description: " + trip.upload_description + '<br>'
        + "Optional Comments: " + trip.upload_optional;

    return $('<div/>', {
        id: 'trip-' + trip.id ,
        class: 'trip-container active'
    }).html(trip_detail);
}

/**
 * Filter on selected trip
 * @param {*} container 
 * @param {*} trip 
 */
function set_onclick(container, trip)
{
    // Toggle active trip status
    container.on('click', function () {

        if ($(this).hasClass('active')) {
            $(this).removeClass('active');
            trip.active = false;
            // Show active trip
            show_active_trip();
        } else {
            $(this).addClass('active');
            trip.active = true;
            // Show active trip
            show_active_trip();
        }

    });

    return;
}

/**
 * List all trip from databases
 * @param {*} trips 
 */
export default function (trips)
{
    clear_list();

    for (var i = 0; i < trips.length; ++i) {

        var trip = trips[i];
        
        // Set all trip to active
        trip.active = true;
        // Random trip color
        trip.color = Util_random_color();

        // Get container and set onclick events
        var trip_container = get_trip_container(trip);
        set_onclick(trip_container, trip);
        // Add to list container
        list_container.append(trip_container);
    }

    return trips;
}