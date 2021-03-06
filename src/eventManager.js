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

  disconnectUser(user) {
    const { id } = user;

    const username = this.#allUser.get(id);

    this.#allUser.delete(id);

    this.#updateActivityLogComponent(`${username} left!`);
    this.#updateUsersComponent();
  }

  message(message) {
    this.componentEmitter.emit(
      constants.events.app.MESSAGE_RECEIVED,
      message
    );
  }

  newUserConnected(message) {
    const user = message;
    this.#allUser.set(user.id, user.username);
    this.#updateUsersComponent();
    this.#updateActivityLogComponent(`${user.username} joined!`);
  }

  #emitComponentUpdate(event, message) {
    this.componentEmitter.emit(
      event,
      message
    );
  }

  #updateActivityLogComponent(message) {
    this.componentEmitter.emit(
      constants.events.app.ACTIVITYLOG_UPDATED,
      message
    );
  }

  #updateUsersComponent() {
    this.#emitComponentUpdate(
      constants.events.app.STATUS_UPDATED,
      Array.from(this.#allUser.values())
    );
  }

  getEvents() {
    // pegando todos os metodos publicos dessa classe.
    const functions = Reflect.ownKeys(EventManager.prototype)
      .filter((fn) => fn !== 'constructor')
      .map((name) => [name, this[name].bind(this)])
      // nesse mapa estou retornando a chave que ?? o nome da fun????o,
      // e passando o this dessa classe para a fun????o, porque usamos o this nas fun????es.
  
    return new Map(functions);
  }
}