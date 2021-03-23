// chamar todos os modulos do nosso sistema

/**
  node index.js \
    --username alexandredev3 \
    --room sala01 \
    --hostUri localhost
*/

import Events from 'events';
import { TerminalController } from './src/terminalController.js';
import { CliConfig } from './src/cliConfig.js';

const [nodePath, filePath, ...commands] = process.argv;
const config = CliConfig.parseArguments(commands);

console.log(config);

const componentEmitter = new Events();

// const controller = new TerminalController();
// await controller.initializeTable(componentEmitter);