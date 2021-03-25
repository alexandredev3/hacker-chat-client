// gerenciar os eventos.
import { constants } from './constants.js';

export class EventManager {
  constructor({ componentEmitter, socketClient }) {
    this.componentEmitter = componentEmitter;
    this.socketClient = socketClient;
  }

  joinRoomAndWaitForMessages(data) {
    // quando o usuario entrar na sala, ele vai mandar um socket para o servidor
    this.socketClient.sendMessage(constants.events.socket.JOIN_ROOM, data);

    // quando for enviado uma mensagem no chat.
    // vamos enviar esssa mensagem para o socket.
    this.componentEmitter.on(constants.events.app.MESSAGE_SENT, (msg) => {
      this.socketClient.sendMessage(constants.events.socket.MESSAGE, msg)
    });
  }
}