// regra de negocio;
// delegação dos eventos;
// passar os dados para um lado e para o outro;
import { ComponentBuilder } from './components.js';

export class TerminalController {
  constructor() {

  }

  #onInputReceived(eventEmitter) {
    return function() {
      // o this que estamos usando aqui e o this do components;
      const message = this.getValue();
      console.log("message: >>", message);
      this.clearValue();
    }
  }

  async initializeTable(eventEmitter) {
    const components = new ComponentBuilder()
      .setScreen({ title: 'HackerChat - Alexandre Costa' })
      .setLayoutComponent()
      .setInputComponent(this.#onInputReceived(eventEmitter))
      .build();

    components.input.focus();
    components.screen.render(); // rendelizar a tela;
  }
}