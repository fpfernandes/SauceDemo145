const { defineConfig, devices } = require('@playwright/test')
const path = require('path')
const { compute_run_folder, ensure_subdirs } = require('./utils/path_tools')
 
// Diretorios onde ficam os artefatos 
const ARTIFACTS_ROOT = path.join(__dirname, 'artifacts') // nome da pasta raiz
const runDir = compute_run_folder(ARTIFACTS_ROOT)
const { resultsDir, screenshotsDir } = ensure_subdirs(runDir)

// Expoe caminhos de diretorio como variavies de ambiente
process.env.RUN_DIR         = runDir
process.env.SCREENSHOTS_DIR = screenshotsDir


module.exports = defineConfig({
    testDir: './tests',   // nossos testes estao na pasta tests
    timeout: 30000,      // 30_000 = 30 segundos
    fullyParallel: true,  // execucao em paralelo / multi thread
    outputDir: resultsDir,
    use: {
        baseURL: 'https://www.saucedemo.com',
        headless: false, // false - exibe o browser e true oculta
        // Politicas globais de artefatos automaticos
        screenshot: 'only-on-failure', // apenas quando der erro
        video:      'retain-on-failure', // salva o video, se houver erro
        trace:      'retain-on-failure', // salva o trace, se houver erro
        
        // outros tipos de timeout
        actionTimeout: 15000, // timeout se nada estiver acontecendo em 15 segundos
        navigationTimeout: 20000, // timeout se parar o navegador    
        
        
        launchOptions: {
            slowMo: 0  // espere 1 segundo entre cada acao
        }
 
    },

    projects: [
        {
            name:'chromium',
            use: { ...devices['Desktop Chrome']}
        }
    ]


})