// Importa os módulos necessários do Electron
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

// Função para criar a janela principal
function createWindow() {
    // Cria uma nova janela do navegador
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            
            nodeIntegration: true, // Permite o uso de APIs do Node.js na renderização da página
            contextIsolation: false // Desativa o isolamento de contexto para acessar variáveis globais no renderer process
        }
    });

    // Carrega o arquivo HTML da interface do usuário na janela principal
    mainWindow.loadFile(path.join(__dirname, 'src', 'index.html'));
}

// Aguarda o app estar pronto antes de criar a janela principal
app.whenReady().then(createWindow);

// Fecha o aplicativo quando todas as janelas são fechadas
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') { // Verifica se o sistema operacional não é macOS
        app.quit(); // Fecha o aplicativo
    }
});

// Cria uma nova janela quando o aplicativo é ativado e não há outras janelas abertas
app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) { // Verifica se não há janelas abertas
        createWindow(); // Cria uma nova janela
    }
});

// Escuta mensagens enviadas do processo de renderização Usando so para Debugs
ipcMain.on('message', (event, message) => {
    console.log('Mensagem recebida do processo de renderização:', message);
});
