/* nq222af */

/**
 * The webSocket manges the websocket connection.
 * Sets up event listeners.
 */
const webSocket = {
  ws: null,
  listeners: [],
  /**
   * Initializes the websocket connection.
   * checks if already initialized then adds new listener.
   * @param {Object} listener - the listener to recieve messages.
   * @returns {WebSocket} wbs connection.
   */
  init: function(listener) {
      if (this.ws === null) {
        this.ws = new WebSocket("wss://courselab.lnu.se/message-app/socket")
        this.ws.addEventListener("message", (e) => {
          const receivedData = JSON.parse(e.data)
          if (receivedData.type === 'hearbeat' || receivedData.username === 'Server') {
            return
          }
        
          if (JSON.parse(e.data).username === 'The Server' ||
          JSON.parse(e.data).username === 'Server') return
          this.cacheMsgs([JSON.parse(e.data).username, JSON.parse(e.data).data, JSON.parse(e.data).channel])
          this.notify(e);
        })

        this.ws.addEventListener("close", () => {
          this.ws = null;
          this.listeners = []
        })
      }

    this.listeners.push(listener);
    listener.readCachedMsgs("General")
    return this.ws
  },

  /**
   * If no more listener then closes the websocket.
   * @param {object} listener -listener to be removed.
   */
  remove: function(listener) {
    this.listeners = this.listeners.filter(item => item !== listener)

    if (this.listeners.length === 0) {
      this.ws.close()
    }
  },

  /**
   * notifies the listener when received messages.
   * @param {object} message  when message data is received.
   */
  notify: function(message) {
    this.listeners.forEach(listener => {
      listener.newMessage(message)
    })
  },

  /**
   * caches the message to save to local storage and also limits the messages received.
   * @param {Array} msg msgs array containig the usename. 
   */
  cacheMsgs: function(msg) {
    let msgs = JSON.parse(localStorage.getItem('Any'))
    let msgs2 = null;

    const channel = msg[2]

    if (channel && channel.toLowerCase() === 'general' || channel.toLowerCase() === 'encrypted') {
      msgs2 = JSON.parse(localStorage.getItem(channel))

      if (msgs2 === null) {
        msgs2 = []
      }
      msgs2.push({ username: msg[0], msg: msg[1], time: new Date().toLocaleTimeString() })

      while (msgs2.length > 30) {
        msgs2.shift()
      }
      localStorage.setItem(channel, JSON.stringify(msgs2))
    }

    if (msgs === null) {
      msgs = []
    }
    msgs.push({ username: msg[0], msg: msg[1], time: new Date().toLocaleTimeString(), channel: msg[2] })

    while (msgs.length > 30) {
      msgs.shift()
    }
    localStorage.setItem('Any', JSON.stringify(msgs))
  }
}

export default webSocket
