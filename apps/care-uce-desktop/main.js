const { app, BrowserWindow } = require('electron');

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    title: 'CareUCE - Clinical Workspace',
    autoHideMenuBar: true, // Oculta el menú feo de Windows arriba
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // Conectamos con el servidor de desarrollo de Vite (Nx) en el puerto 4200
  win.loadURL('http://localhost:4200');

  // Abre la consola de desarrollo automáticamente (útil para depurar el PDF)
  win.webContents.openDevTools();
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
