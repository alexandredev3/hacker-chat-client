export const constants = {
  events: {
    app: { // tudo que for do app
      MESSAGE_SENT: 'message:sent',
      MESSAGE_RECEIVED: 'message:received',
      ACTIVITYLOG_UPDATED: 'activityLog:updated',
      STATUS_UPDATED: 'status:updated'
    },

    socket: { // tudo que for do socket
      JOIN_ROOM: 'joinRoom', // tem que ser o mesmo nom que colocamos na função la no server
      MESSAGE: 'message'
    }
  }
}