const child_process = require('child_process');
const path = require('path');
const main = require('./app')

function handle_squirrel_event()
{
    if (process.argv.length === 1) return false;

    const app_folder = path.resolve(process.execPath, '..');
    const root_folder = path.resolve(app_folder, '..');
    const update_dot_exe = path.resolve(path.join(root_folder, 'Update.exe'));
    const exe_name = path.basename(process.execPath);
    
    // Spawn child process
    const spawn = function (command, args) {
        var spawned_process, error;

        try {
            spawned_process = child_process.spawn(command, args, { detached: true });
        } catch (error) { }

        return spawned_process;
    }

    // Spawn update process
    const spawn_update = function (args) {
        return spawn(update_dot_exe, args);
    }

    const squirrel_event = process.argv[1];
    switch (squirrel_event) {

        case '--squirrel-install':

        case '--squirrel-updated':
            spawn_update(['--createShortcut', exe_name]);
            setTimeout(main.app.quit, 1000);
            return true;

        case '--squirrel-uninstall':
            spawn_update(['--removeShortcut', exe_name]);
            setTimeout(main.app.quit, 1000);
            return true;

        case '--squirrel-obsolete':
            main.app.quit();
            return true;
        
    }
}

module.exports = { handle_squirrel_event };