import { Mapbox_map } from '../../index';
import { default as Map_layers } from './layers';

/**
 *  Clear all layers  
 */
export default function ()
{
    for (var i = 0; i < Map_layers.trips.length; ++i) {
        // var layer = Map_layers[i];
        console.log('remove');
        if (Mapbox_map.getLayer(Map_layers.trips[i].id)){
            Mapbox_map.removeLayer(Map_layers.trips[i].id);
        }
        
        if (Mapbox_map.getSource(Map_layers.trips[i].id)){
            Mapbox_map.removeSource(Map_layers.trips[i].id);
        }
        
    }

    Map_layers.trips.splice(0, Map_layers.trips.length);

    for (var i = 0; i < Map_layers.trip_video_markers.length; ++i) {
        Map_layers.trip_video_markers[i].remove();
    }

    
    for (var i = 0; i < Map_layers.trip_narrative_markers.length; ++i) {
        if (Mapbox_map.getSource(Map_layers.trip_narrative_markers[i])) {
            Mapbox_map.removeSource(Map_layers.trip_narrative_markers[i]);
        }
    }

    Map_layers.trip_video_markers.slice(0, Map_layers.trip_video_markers.length);
    //Map_layers.trip_narrative_markers.slice(0, Map_layers.trip_narrative_markers.length);

    return;
}