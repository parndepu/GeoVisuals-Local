import mapbox_draw from '@mapbox/mapbox-gl-draw';

export default function (map)
{
    // Initialize drawing object
    var draw = new mapbox_draw({
        displayControlsDefault: false,
        controls: {
            point: false,
            polygon: true,
            trash: true
        }
    });
    // Add mapbox draw controls
    map.addControl(draw, 'top-left');
    // Add map drawing events
    map.on('draw.create', update_area);
    map.on('draw.delete', update_area);
    map.on('draw.update', update_area);

    // Update area after drawing polygon
    function update_area(e)
    {
        var data = draw.getAll();
        // Make mongodb query here
        console.log(data);
        return;
    }

    return;
}