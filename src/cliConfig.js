// extrair comandos da linha de comando.
export class CliConfig {
  constructor({ username, hostUri, room }) {
    this.username = username;
    this.room = room;

    // com o URL podemos pegar parte de uma url;
    const { hostname, port, protocol } = new URL(hostUri);

    this.host = hostname;
    this.port = port;

    // essa regex so vai deixar as letras.
    this.protocol = protocol.replace(/\W/, '');
  }

  static parseArguments(commands) {
    const cmd = new Map(); 

    for(const key in commands) {
      const index = parseInt(key);
      const command = commands[key];

      const commandPrefix = '--';
      
      if (!command.includes(commandPrefix))
        continue;

      cmd.set(
        command.replace(commandPrefix, ''), // chave do map
        // pegando o valor, porque a segunda posicao e o valor;
        commands[index + 1] // valor do map
      )
    }

    // transformando o cmd que e um tipo map para um objeto.
    const cmdObject = Object.fromEntries(cmd);

    return new CliConfig(cmdObject);
  }
}