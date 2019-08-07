const { app, BrowserWindow, Menu } = require('electron');

let win;

function createWindow () {
  win = new BrowserWindow({ width: 1024, height: 680 });

  win.loadFile('dist/shop-app/index.html');

  win.maximize();

  //win.webContents.openDevTools();

  menu = Menu.buildFromTemplate(mainMenuTemplate);
  Menu.setApplicationMenu(menu);

  win.on('closed', () => {
    win = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});

const mainMenuTemplate = [
  {
    label: 'Fichier',
    submenu: [
      {
        label: 'Quitter'
      }
    ]
  },
  {
    label: 'Aide',
    submenu: [
      {
        label: 'A propos'
      },
      {
        label: 'Version Mobile'
      },
      {
        label: 'Nous contacter'
      }
    ]
  }
];