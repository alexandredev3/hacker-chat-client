// gerenciar os eventos.
import { constants } from './constants.js';

export class EventManager {
  #allUser = new Map();

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

  updateUsers(users) {
    const connectedUsers = users;
    connectedUsers.forEach(({ id, username }) => this.#allUser.set(id, username));
    this.#updateUsersComponent();
  }

  #updateUsersComponent() {
    this.componentEmitter.emit(
      constants.events.app.STATUS_UPDATED,
      Array.from(this.#allUser.values())
    );
  }

  getEvents() {
    // pegando todos os metodos publicos dessa classe.
    const functions = Reflect.ownKeys(EventManager.prototype)
      .filter((fn) => fn !== 'constructor')
      .map((name) => [name, this[name].bind(this)])
      // nesse mapa estou retornando a chave que é o nome da função,
      // e passando o this dessa classe para a função, porque usamos o this nas funções.
  
    return new Map(functions);
  }
}