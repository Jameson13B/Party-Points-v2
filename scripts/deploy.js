/**
 * Deploy
 *
 * To deploy run:
 *   `npm run deploy firebase`
 *   `npm run deploy -- --help`
 */

/* eslint no-console: "off" */

const colors = require('colors/safe')
const commander = require('commander')

const logInfo = (text) => console.log(colors.green(text))
const logCommand = (text) => console.log(colors.cyan(text))

const exec = require('child_process').execSync
const execPrint = (command) => {
  logCommand(`Running: ${colors.bold(command)}`)
  exec(command, { stdio: 'inherit' })
}

commander
  .command('firebase')
  .description('deploy to firebase')
  .action(() => {
    deployToFirebase()
  })

function deployToFirebase() {
  logStart('firebase')
  execPrint('yarn build')
  execPrint(`firebase deploy --only hosting:partypoint`)
  logDone()
}

function logStart(hostEnv) {
  logInfo(`Deploying to ${colors.bold(hostEnv)}...\n`)
}

function logDone() {
  logInfo('\nFinished.')
  logInfo('To see the status of the build visit:\n  https://gitlab.mx.com/mx/raja/pipelines')
}

/**
 * MAIN LOGIC
 */
const noArgsProvided = !process.argv.slice(2).length

if (noArgsProvided) commander.outputHelp(colors.red)

commander.parse(process.argv)
