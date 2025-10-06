// snapshot = print --> queremos quando passa e quando falha
// Varios prints por execucao
// Criar uma pasta chamada Snapshot e colocar todos os prints dentro 
// Organize as datas no formato universal ano-mes-dia

// Bibliotecas
const fs = require('fs') // File system / biblioteca do sistema operacional
const path = require('path') // biblioteca de caminhos de pastas/arquivos

// Formatar numeros com zero na frente se precisar
function pad2(num) {return String(num).padStart(2, '0')
}

// Funcao para definir data e hora baseado no momento da execucao 
function compute_run_folder(baseDir){
    // Cria o carimbo de data via CI(Integracao Continua)
    if (process.env.RUN_TAG){ // == true
        const tag = process.env.RUN_TAG.replace(/[^\w-:.]/g, '_') //CI
        const runDir = path.join(baseDir, tag)
        fs.mkdirSync(runDir, {recursive: true})
        return runDir
    }

    // Verifica data e hora
    const now = new Date() // perguntar para o computador que dia e que horas sao
    const yyyy = now.getFullYear()    // Ano com 4 digitos
    const MM = pad2(now.getMonth())   // Mes com dois digitos
    const dd = pad2(now.getDate())    // Dia com dois digitos
    const HH = pad2(now.getHours())   // Hora com dois digitos
    const mm = pad2(now.getMinutes())  // Minutos com dois digitos
    const ss = pad2(now.getSeconds())  // Segundos com 2 digitos
        
    // const Mes = String(now.getMonth()).padStart(2, '0') // outro jeito de fazer o mes formatado
    // const Dia = String(now.getDate()).padStart(2, '0') // outro jeito de fazer o dia formatado

    // Criar pastas 
    const runDir = path.join(baseDir, `${yyyy}`, `${MM}`, `${dd}`, `${HH}-${mm}-${ss}`)
    fs.mkdirSync(runDir, {recursive: true})
    return runDir

}

// Criar subpastas dentro da estrutura de datas e horas
function ensure_subdirs(runDir){
    const dirs = {
        runDir,
        resultsDir:     path.join(runDir, 'test-results'),
        screenshotsDir: path.join(runDir, 'screenshots')
    }

    Object.values(dirs).forEach(d => {  // d = diretorio (subdiretorio)
        if (!fs.existsSync(d)) fs.mkdirSync(d, {recursive: true})
    })
    return dirs

}

module.exports = { compute_run_folder, ensure_subdirs }