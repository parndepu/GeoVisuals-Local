import { Mapbox_map } from '../index';

export default function (layer, z_index)
{
    layer.setZIndex(z_index);
    Mapbox_map.addLayer(layer);

    return;
}