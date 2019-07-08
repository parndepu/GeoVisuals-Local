// GeoVisuals System (local version)
// (c) 2019, Suphanut Jamonnak

const electron = require('electron');
const os = require('os');
const path = require('path');

// Set configuration
const config = require(path.join(__dirname, 'package.json'));
const squirrel = require('./squirrel');

// Electrons shortcuts
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const globalShortcut = electron.globalShortcut;

// Set squirrel events
if (require('electron-squirrel-startup')) return;
if (squirrel.handle_squirrel_event()) return;

// Set name of the application
app.setName(config.productName);

// Global window
let mainWindow = null;
function createWindow () {

    // Create browser window
    mainWindow = new BrowserWindow({
        backgroundColor: 'lightgray',
        title: config.productName,
        width: 800,
        height: 600,
        minWidth: 800,
        minHeight: 600,
        show: false,
        webPreferences: {
            nodeIntegration: true,
            defaultEncoding: 'UTF-8',
            webSecurity: false
        }
    });


    // Load index page
    mainWindow.loadURL(path.join('file://', __dirname, '/src/index.html'));

    // Open DevTools (remove this when production)
    let platform = os.platform();
    if (platform === 'darwin') {
        globalShortcut.register('Command + Shift + I', () => {
            mainWindow.webContents.openDevTools();
        });
    } else if (platform === 'linux' || platform === 'win32') {
        globalShortcut.register('Control + Shift + I', () => {
            mainWindow.webContents.openDevTools();
        });
    }

    // Disable menu bar when window started
    mainWindow.once('ready-to-show', () => {
        mainWindow.setMenu(null);
        mainWindow.show();
    });

    // Prevent command-R from unloading the window contents
    mainWindow.onbeforeunload = (e) => {
        e.returnValue = false;
    };

    // Close browser window
    mainWindow.on('closed', function () {
        mainWindow = null;
    });
    
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
    
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function () {
    // Prevent closing problem in mac osx to reopen it again
    if (mainWindow == null) {
        createWindow();
    }
});

module.exports = { app };