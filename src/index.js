// Local version of GeoVisuals application
// (c) 2019, Suphanut Jamonnak

import mapboxgl from 'mapbox-gl';
window.mapboxgl = mapboxgl;

import * as components from './components';

// Geovisuals attributes
export var GeoVisuals_map = null;

// Initialize Geovisuals system
function Geovisuals_init()
{
    Initialize_map();
    Initialize_dom();
    return;
}

// Initialize mapbox and controls
function Initialize_map()
{
    GeoVisuals_map = components.Mapbox_init('map');
}

function Initialize_dom()
{
    // Set resizable panel
    components.Dom_resizable_panel();
    // Set tool button
    components.Dom_tool_buttons();
    // Set input
    components.Dom_video_input();
    components.Dom_spreadsheet_input();
    return;
}

window.onload = function() {
    Geovisuals_init();
};