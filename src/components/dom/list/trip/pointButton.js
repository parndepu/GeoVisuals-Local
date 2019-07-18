import { Mapbox_map } from '../../../index';
import { select_trips } from '../../../../index';

export default function (trip, container)
{
    var button = $('<button/>', {
        title: 'add point',
        class: 'point-trip-btn trip-button'
    });

    var icon = $('<i/>', {
        class: 'fas fa-plus'
    });

    button.append(icon);
    container.append(button);

    button.on('click', function (e) {
        
        e.stopPropagation();

        for (let i = 0; i < select_trips.length; ++i) {

            let t = select_trips[i];
    
            if (t.id.toString() === trip.id) {

                $('#add-point-container-' + trip.id).remove();

                var add_container = $('<div/>', {
                    id: 'add-point-container-' + trip.id,
                    class: 'video-container'
                });


                var default_title = $('<span/>').html('Default Narrative:');
                var edit_title = $('<span/>').html('Edit Narrative:');

                var default_narrative = $('<input/>', {
                    id: 'default-narrative-' + trip.id,
                    type: 'text',
                    value: t.narratives[0]
                }).css({ width: '100%', 'outline': 'none !important', 'border': '1px solid #000'});

                default_narrative.attr('disabled', true);
        
                var edit_narrative = $('<input/>', {
                    id: 'edit-narrative-' + trip.id,
                    type: 'text',
                }).css({ width: '100%', 'outline': 'none !important', 'border': '1px solid #000'});
                
                add_container.append(default_title);
                add_container.append(default_narrative);
                add_container.append(edit_title);
                add_container.append(edit_narrative);
            
                container.after(add_container);
            }
        }
    });

    return;
}