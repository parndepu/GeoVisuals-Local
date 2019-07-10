/**
 * Mapbox_map object
 */
export var Mapbox_map = null;

/**
 * Create map with mapbox-gl
 * @param {string} container_id
 */
export default function (container_id) 
{
    // Set access token
    mapboxgl.accessToken = 'pk.eyJ1IjoiZGlnaXRhbGtpIiwiYSI6ImNqNXh1MDdibTA4bTMycnAweDBxYXBpYncifQ.daSatfva2eG-95QHWC9Mig';
    
    Mapbox_map = new mapboxgl.Map({
        container: container_id,
        style: 'mapbox://styles/mapbox/light-v10',
        center: [-74.50, 40],
        zoom: 9,
        pitch: 45,
    });

    return;
}