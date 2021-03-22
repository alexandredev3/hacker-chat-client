// chamar todos os modulos do nosso sistema
import Events from 'events';
import { TerminalController } from './src/terminalController.js';

const componentEmitter = new Events();

const controller = new TerminalController();
await controller.initializeTable(componentEmitter);