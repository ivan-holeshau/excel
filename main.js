const path = require('path');
const url = require('url');
const { app, BrowserWindow} = require('electron');
const shell = require('electron').shell;
const contextMenu = require('electron-context-menu');
console.log(shell)
let win;


contextMenu({
	prepend: (defaultActions, params, browserWindow) => [
		// {
		// 	label: 'Rainbow',
		// 	// Only show it when right-clicking images
		// 	visible: params.mediaType === 'image'
        // },
        
		// {
		// 	label: 'Search Google for “{selection}”',
		// 	// Only show it when right-clicking text
		// 	visible: params.selectionText.trim().length > 0,
		// 	click: () => {
		// 		shell.openExternal(`https://google.com/search?q=${encodeURIComponent(params.selectionText)}`);
		// 	}
		// }
	]
});

function createWindow() {
    win = new BrowserWindow({width:1280, height:720, icon:__dirname+'/img/icon.png',
    webPreferences: {
        nodeIntegration: true,
        enableRemoteModule: true,
        enableRemoteModule:true,},
        center:true,
});

    win.loadURL(url.format({
        pathname:path.join(__dirname,'index.html'),
        protocol:'file',
        slashes: true,
    }));
    var handleRedirect = (e, url) => {
        console.log(e)
        if(url != webContents.getURL()) {
          e.preventDefault()
          require('electron').shell.openExternal(url)
        }
      }
      
    
    win.webContents.openDevTools();
    win.on('will-navigate', handleRedirect)
    win.on('new-window', handleRedirect)
    //win.webContents.on('will-navigate', handleRedirect)
    win.on('closed',()=>{
        win= null;
    })
}




app.on('ready', createWindow);

const dispose = contextMenu();

dispose();

app.on('window-all0closed', ()=>{
    app.quit();
})

