const { test: base } = require('@playwright/test')
const fs = require('fs')
const path = require('path')

// Formatar espacamento entre datas AM-PM
function isoTs() {
    const nova_data = new Date();
    return nova_data.toISOString().replace('T', ' ').replace('Z', '')

}

const LOGS_DIR = process.env.LOGS_DIR || path.join(process.cwd, 'artifacts', 'logs')  // dois pipes || representa OU cwd retorna pasta atual
if (!fs.existsSync(LOGS_DIR)) fs.mkdirSync(LOGS_DIR, {recursive: true}) // if testa se a pasta existe, se nao cria uma

// cria o arquivo de log para a execucao
const EXEC_LOG = path.join(LOGS_DIR, 'steps.log')

// estrutura para escrever no arquivo de log
export const test = base.extend({
    log: async ({}, use, testInfo) => {
        function log(message) {
            // cada linha sera composta por 
            // {Data/Hora} {Titulo do teste} {Mensagem}
            const line = `[${isoTs()}] [${testInfo.title}] ${message}\n`
            fs.appendFileSync(EXEC_LOG, line, 'utf8') // escreve no arquivo
            return line;
        }
        await use(log);
    }
})

export const expect = base.expect


