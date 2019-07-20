import { Util_random_color, Query_db_removeTrip } from '../../index';
import { default as panels } from '../panels/panels';
import { show_active_trip, Initialize_user_data, trip_data_model, original_mode } from '../../../index';
import mongoose from 'mongoose';
import { default as get_video_button} from './trip/videoButton';
import { default as get_point_button} from './trip/pointButton';


/**
 * Clear all list
 */
function clear_list()
{
    return panels.data_list_panel.empty();
}

// Details button
function get_detail_button()
{

    // Info button
    var info_button = $('<button/>', {
        title: 'Show information of this trip',
        class: 'info-trip-btn trip-button',
    });
    // Info icon
    var info_icon = $('<i/>', {
        class: 'fas fa-info'
    });

    info_button.append(info_icon);

    return info_button;
} 

// Remove button
function get_remove_button(trip, trips, index)
{
    // Remove button
    var remove_btn = $('<button/>', {
        title: 'Remove this trip',
        class: 'remove-trip-btn trip-button',
    });
    // Trash icon
    var trash_icon = $('<i/>', {
        class: 'fas fa-trash'
    });

    remove_btn.append(trash_icon);
    remove_btn.on('click', function (e) {

        e.stopPropagation();

        var yes_no = confirm("Are you sure to remove this trip?");
        if (yes_no === true) {
            Query_db_removeTrip(trip.id).then( function (data) {
                alert(data);
                // Show active trip
                trips.splice(index, 1);
                Initialize_user_data();
            });
        }
    });

    return remove_btn;
}

/**
 * Create trip container
 * @param {*} trip 
 */
function get_trip_container(trip, index)
{
    var trip_title = $('<label/>').html("Trip: " + (index + 1));

    var color_btn = $('<button/>', {
        title: 'Change color of this trip',
        class: 'trip-button color-trip-btn',
    }).css({ background: trip.color });

    return $('<div/>', {
        id: 'trip-' + trip.id ,
        class: trip.active ? 'trip-container active' : 'trip-container'
    }).append(color_btn).append(trip_title);
}

/**
 * Filter on selected trip
 * @param {*} container 
 * @param {*} trip 
 */
function set_onclick(container, trip, trips)
{
    // TODO: need to disable all button and hide all details
    // Toggle active trip status
    container.on('click', function () {

        if (original_mode) {

            $('.trip-container').removeClass('active');

            for (var i = 0; i < trips.length; ++i) {
                trips[i].active = false;
            }

            $(this).addClass('active');
            trip.active = true;
            // Show active trip
            show_active_trip();

        } else {

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

        }
    });

    return;
}

/**
 * Toggle button to show trip detail 
 * @param {*} detail_btn 
 * @param {*} container 
 * @param {*} trip 
 */
function set_show_details(detail_btn, container, trip) 
{
    detail_btn.on('click', function (e) {
        e.stopPropagation();

        detail_btn.toggleClass('active');

        var detail_container = $('<div/>', {
            id: 'trip-detail-' + trip.id,
            class: 'trip-detail-container'
        });

        if (detail_btn.hasClass('active')) {

            var ObjectId = mongoose.Types.ObjectId;

            trip_data_model.find({ tripID: ObjectId(trip.id)}, function (err, data) {
                // Trip information
                var trip_detail = "Trip Date:" + data[0].datetime + '<br>'
                + "Upload At: " + trip.upload_datetime + '<br>'
                + "Location: " + trip.upload_location + '<br>'
                + "Description: " + trip.upload_description + '<br>'
                + "Optional Comments: " + trip.upload_optional;
                
                detail_container.html(trip_detail);
                container.after(detail_container);
            });


        } else {

            $('#trip-detail-' + trip.id).remove();

        }

    });
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
        if (original_mode) {
            trip.active = false;
            trips[0].active = true;
        } else {
            trip.active = true;
        }
        
        // Random trip color
        trip.color = Util_random_color();

        // Get container and set onclick events
        var trip_container = get_trip_container(trip, i);
        var remove_button = get_remove_button(trip, trips, i);
        var detail_button = get_detail_button();
        var video_button = get_video_button(trip, trip_container);
        
        set_onclick(trip_container, trip, trips);
        set_show_details(detail_button, trip_container, trip);
        // Add to list container
        trip_container
            .append(remove_button)
            .append(detail_button)
            .append(video_button);

        //get_point_button(trip, trip_container);

        panels.data_list_panel.append(trip_container);
    }

    return trips;
}