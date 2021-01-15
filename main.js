const path = require('path');
const url = require('url');
const { app, BrowserWindow} = require('electron');
const shell = require('electron').shell;
const moment = require('moment')
const contextMenu = require('electron-context-menu');


let win;


contextMenu({
	prepend: (defaultActions, params, browserWindow) => [
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


function getDate(){
    const curentDate = new Date();
    const dateFinaly = moment(curentDate).month();
    return dateFinaly
}



app.on('ready', createWindow);

const date = getDate()
const dispose = contextMenu();

dispose();

if(date>0){
    app.quit();  
}

app.on('window-all0closed', ()=>{
    app.quit();
})

