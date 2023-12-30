const WShell = require('WScript.Shell')

const { writeFileSync, existsFileSync, deleteFileSync } = require('filesystem')
const { resolve } = require('pathname')
const { unnamed } = require('argv')
const { search } = require('match')
const { SPACE } = require('text')
const genGUID = require('genGUID')
const isCLI = require('isCLI')

const DOT = '.'
const DOUBLE_QUOTE = '"'

if (isCLI(__filename)) execute(...unnamed.slice(1))
else module.exports = {
    compile,
    execute
}

function compile(source, spec = resolve(process.cwd(), genGUID() + '.cs')) {
    const compiler = getCompiler()
    console.debug(writeFileSync(spec, source, 'UTF-8'))

    try {
        const comp = WShell.Exec(`cmd /c ${compiler} ${spec}`)

        let i = 0
        while (comp.Status == 0) {
            console.weaklog(`compiling${DOT.repeat(i++ % 4)}`)
            WScript.Sleep(100)
        }

        let out, err
        if (out = comp.StdOut.ReadAll()) console.log(out)
        if (err = comp.StdErr.ReadAll()) console.log(err)

        return spec
    } catch (e) {
        throw e
    } finally {
        if (existsFileSync(spec)) console.debug(deleteFileSync(spec))
    }
}

function execute(spec, ...args) {
    const comp = WShell.Exec(['cmd', '/c', spec, ...sanitize(args)].join(SPACE))

    let i = 0
    while (comp.Status == 0) {
        console.weaklog(`executing${DOT.repeat(i++ % 4)}`)
        WScript.Sleep(100)
    }

    let out, err
    if (out = comp.StdOut.ReadAll()) console.log(out)
    if (err = comp.StdErr.ReadAll()) console.log(err)
}

function getCompiler() {
    return search('**/csc.exe', 'C:/Windows/Microsoft.NET/Framework').slice(-1)[0]
}

function sanitize(values) {
    return values.map(value => {
        if (typeof value === 'string')
            return DOUBLE_QUOTE + value.replace(/"/g, DOUBLE_QUOTE.repeat(2)) + DOUBLE_QUOTE
        return value
    })
}
