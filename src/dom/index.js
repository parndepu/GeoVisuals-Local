const buttons = require('./buttons');
const panels = require('./panels');

// Initialize all dom components
function init()
{
    buttons.Set_tools_buttons();
    panels.Set_resizable_panel();
}

module.exports = {
    init,
}