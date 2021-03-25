// regra de negocio;
// delegação dos eventos;
// passar os dados para um lado e para o outro;
import { ComponentBuilder } from './components.js';
import { constants } from './constants.js';

export class TerminalController {
  #usersColors = new Map();

  constructor() {

  }

  #pickColor() {
    return `#${((1 << 24) * Math.random() | 0).toString(16)}-fg`;
  }

  #getUserColor(username) {
    if (this.#usersColors.has(username)) {
      return this.#usersColors.get(username);
    }

    const color = this.#pickColor()
    this.#usersColors.set(username, color);

    return color;
  }

  #onInputReceived(eventEmitter) {
    return function() {
      // o this que estamos usando aqui e o this do components;
      const message = this.getValue();

      // emitindo o evento de mensagem, para o eventManager pegar.
      eventEmitter.emit(constants.events.app.MESSAGE_SENT, message); 
      this.clearValue();
    }
  }

  #onMessageReceived({ screen, chat }) {
    return (msg) => {
      const { username, content } = msg;
      const color = this.#getUserColor(username);

      chat.addItem(`{${color}}{bold}${username}{/}: ${content}`);
      screen.render(); // todas vez que alterar a tela, precisamos chamar o metodo render.
    }
  }

  #onLogChanged({ screen, activityLog }) {
    return (msg) => {
      // alexandredev3 join
      // alexandredev3 left
      const [username] = msg.split(' ');
      const color = this.#getUserColor(username);

      activityLog.addItem(`{${color}}{bold}${String(msg)}{/}`);
      screen.render();
    }
  }

  #onStatusChanged({ screen, status }) {
    return (users) => {
      // aqui estamos pegando o primeiro item da lista.
      // no caso e o {bold}Users on Room{/}
      const { content } = status.items.shift();

      // remove todos os items
      status.clearItems();

      // adicionando o primeiro item.
      status.addItem(content);

      users.forEach(username => {
        const color = this.#getUserColor(username);

        status.addItem(`{${color}}{bold}${String(username)}{/}`);
      });

      screen.render();
    }
  }

  #registerEvents(eventEmitter, components) {
    const { events } = constants;

    eventEmitter.on(events.app.MESSAGE_RECEIVED, this.#onMessageReceived(components));
    eventEmitter.on(events.app.ACTIVITYLOG_UPDATED, this.#onLogChanged(components));
    eventEmitter.on(events.app.STATUS_UPDATED, this.#onStatusChanged(components));
  }

  async initializeTable(eventEmitter) {
    const components = new ComponentBuilder()
      .setScreen({ title: 'HackerChat - Alexandre Costa' })
      .setLayoutComponent()
      .setInputComponent(this.#onInputReceived(eventEmitter))
      .setChatComponent()
      .setActivityLogComponent()
      .setStatusComponent()
      .build();
      
    this.#registerEvents(eventEmitter, components);

    components.input.focus();
    components.screen.render(); // rendelizar a tela;

    // // setInterval(() => {
    //   const { events } = constants;

    //   const users = ['alexandredev3'];

    //   eventEmitter.emit(events.app.STATUS_UPDATED, users);
    //   users.push('sara');
    //   eventEmitter.emit(events.app.STATUS_UPDATED, users);
    //   users.push('maria', 'dienifer');
    //   eventEmitter.emit(events.app.STATUS_UPDATED, users);
    //   eventEmitter.emit(events.app.STATUS_UPDATED, users);
    //   users.push('mateus');
    //   eventEmitter.emit(events.app.STATUS_UPDATED, users);
    // // }, 2000)
  }
}