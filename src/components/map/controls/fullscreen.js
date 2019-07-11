/**
 * Add fullscreen control to map
 * @param {*} map 
 */
export default function (map)
{
    return map.addControl(new mapboxgl.FullscreenControl());
}