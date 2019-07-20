import { app, BrowserWindow, globalShortcut } from 'electron';
import mongoose from 'mongoose';
import * as path from 'path';
import * as os from 'os';

let main_window = null;

function Create_window()
{
    main_window = new BrowserWindow({
        backgroundColor: 'lightgray',
        width: 900,
        height: 600,
        minWidth: 900,
        minHeight: 600,
        show: false,
        webPreferences: {
            nodeIntegration: true,
            defaultEncoding: 'UTF-8',
            //webSecurity: false
        }
    });

    // Load index page
    main_window.loadURL(path.join('file://', __dirname, '/public/index.html'));

    // Open DevTools (remove this when production)
    let platform = os.platform();
    if (platform === 'darwin') {
        globalShortcut.register('Command + Shift + I', () => {
            main_window.webContents.openDevTools();
        });
    } else if (platform === 'linux' || platform === 'win32') {
        globalShortcut.register('Control + Shift + I', () => {
            main_window.webContents.openDevTools();
        });
    }

    // Disable menu bar when window started
    main_window.once('ready-to-show', () => {
        main_window.setMenu(null);
        main_window.show();
    });

    // Prevent command-R from unloading the window contents
    main_window.onbeforeunload = (e) => {
        e.returnValue = false;
    };

    // Close browser window
    main_window.on('closed', function () {
        main_window = null;
    });
}

app.on('ready', Create_window);

app.on('window-all-closed', function () {
    
    if (process.platform !== 'darwin') {
        app.quit();
    }
    // Close mongodb connection
    mongoose.disconnect();
});

app.on('activate', function () {
    // Prevent closing problem in mac osx to reopen it again
    if (main_window == null) {
        Create_window();
    }
});