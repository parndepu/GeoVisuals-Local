import { Mapbox_map } from '../../index';
import { default as Map_layers } from './layers';

/**
 *  Clear all layers  
 */
export default function ()
{
    for (var i = 0; i < Map_layers.length; ++i) {
        // var layer = Map_layers[i];
        console.log('remove');
        if (Mapbox_map.getLayer(Map_layers[i].id)){
            Mapbox_map.removeLayer(Map_layers[i].id);
        }
        
        if (Mapbox_map.getSource(Map_layers[i].id)){
            Mapbox_map.removeSource(Map_layers[i].id);
        }
        
    }
    Map_layers.splice(0, Map_layers.length);

    return;
}