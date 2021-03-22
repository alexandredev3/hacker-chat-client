// vamos construir nossas interfaces sobe demanda aqui.
import blessed from 'blessed';

export class ComponentBuilder {
  #screen;
  #layout;
  #input;

  constructor() {

  }

  #baseComponent() {
    // retornará as propriedades que são comuns para criar um component.

    return {
      border: 'line',
      mouse: true,
      keys: true,
      top: 0,
      scrollboar: {
        ch: '  ',
        inverse: true
      },
      // abilita cores e tags nos textos.
      tags: true,
    }
  }

  setScreen({ title }) {
    // retornará a tela.
    this.#screen = blessed.screen({
      smartCSR: true, // redimensionar a tela automaticamente,
      title,
    });

    // C-c === ctrl + c
    // quando o usuario apertar uma dessas teclas, vai executar o process.exit(0);
    // ou seja, vai sair do programa.
    this.#screen.key(['escape', 'q', 'C-c'], () => process.exit(0));

    return this;
  }

  setLayoutComponent() {
    this.#layout = blessed.layout({
      parent: this.#screen, // a tela que setamos
      width: '100%',
      height: '100%',
    });

    return this;
  }

  setInputComponent(onEnterPressed) {
    // para pegar o texto do terminal
    const input = blessed.textarea({
      parent: this.#screen,
      bottom: 0,
      height: '10%',
      inputOnFocus: true, // deixar o usuario escrever.
      padding: {
        top: 1,
        left: 2,
      },
      style: {
        fg: '#f6f6f6', // cor do texto.
        bg: '#353535'
      }
    });

    // quando o usuario apertar enter vou chamar o evento onEnterPressed;
    input.key('enter', onEnterPressed);
    this.#input = input;

    return this;
  }

  build() {
    const components = {
      screen: this.#screen,
      input: this.#input,
    }

    return components;
  }
}
