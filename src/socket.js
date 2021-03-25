import Event from 'events'

export class SocketClient {
  #serverConnection = {};
  #serverListener = new Event()

  constructor({ host, port, protocol }) {
    this.host = host;
    this.port = port;
    this.protocol = protocol;
  }

  sendMessage(event, message) {
    this.#serverConnection.write(JSON.stringify({ event, message }));
  }

  attachEvents(events) {
    this.#serverConnection.on('data', data => {
      try {
        data
          .toString()
          .split('\n') // separando pela quebra de linha
          .filter((line) => !!line) // pegando linhas vazias
          .map(JSON.parse) // transformando linhas vazias em json
          .map(({ event, message }) => {
            this.#serverListener.emit(event, message);
          });
      } catch(error) {
        console.log(`Invalid ${String(data)} >>>> ${error}`);
      }
    });

    this.#serverConnection.on('end', () => {
      console.log('I Disconnected!');
    });    
    
    this.#serverConnection.on('error', (error) => {
      console.error(`DEU MERDA >>>> ${error}`);
    });

    for (const [key, value] of events) {
      this.#serverListener.on(key, value);
    }
  }

  async createConnection() {
    const options = {
      port: this.port,
      host: this.host,
      headers: {
        // temos que enviar um header parecido com que o server espera.
        Connection: 'Upgrade',
        Upgrade: 'websocket' // um upgrate de protocolo
      }
    }
  
    const http = await import(this.protocol);
    const req = http.request(options);
    req.end();
  
    return new Promise((resolve) => {

      // podemos so executar uma promise apenas uma vez.
      // se esse evento for acontecer varias vezes.
      // nos vamos peder as proximas vezes.
      // então vamos usar o once para escutar so uma vez.
      req.once('upgrade', (res, socket) => resolve(socket));
    });
  }

  async initialize() {
    // populando a conexão;
    this.#serverConnection = await this.createConnection();

    console.log('I connected to the server!');
  }
}