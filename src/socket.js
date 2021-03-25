export class SocketClient {
  #serverConnection = {};

  constructor({ host, port, protocol }) {
    this.host = host;
    this.port = port;
    this.protocol = protocol;
  }

  sendMessage(event, message) {
    this.#serverConnection.write(JSON.stringify({ event, message }));
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