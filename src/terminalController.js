// regra de negocio;
// delegação dos eventos;
// passar os dados para um lado e para o outro;
import { ComponentBuilder } from './components.js';
import { constants } from './constants';

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
      console.log("message: >>", message);
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

  #registerEvents(eventEmitter, components) {
    const { events } = constants;

    eventEmitter.on(events.app.MESSAGE_RECEIVED, this.#onMessageReceived(components));
    eventEmitter.on(events.app.ACTIVITYLOG_UPDATED, this.#onLogChanged(components));
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

    setInterval(() => {
      eventEmitter.emit('activityLog:updated', 'alexandredev3 join');
      eventEmitter.emit('activityLog:updated', 'dienifer join');
      eventEmitter.emit('activityLog:updated', 'maria left');
      eventEmitter.emit('activityLog:updated', 'sara join');
      eventEmitter.emit('activityLog:updated', 'mateus left');
    }, 2000)
  }
}