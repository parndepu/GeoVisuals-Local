import { default as panels } from './panels';

/**
 * Open tool content based on tool's name
 * @param {*} tool_name 
 */
export default function (tool_name)
{
    // Reset all active tools content
    panels.toolContent.removeClass('active');

    switch (tool_name) {
        case 'data':
            panels.dataTool.addClass('active');
            break;
        case 'query':
            panels.queryTool.addClass('active');
            break;
        default:
            alert('Wrong tools name');
            break;
    }

    return;
}