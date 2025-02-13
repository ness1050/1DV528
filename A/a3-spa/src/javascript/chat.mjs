/*nq222af*/

import webSocket from "./websocket.mjs"

/**
 * Chat Class application with functionality. 
 * message sending, and display.
 */
export default class Chat {

  #password = 'eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd'
  nameVerfier = e => {this.checkName(e)}

  /**
   * Constructs a new Chat instances.
   */
  constructor() {
    this.chat = document.createElement('div')
    this.chat.classList.add('chat')
    this.chatBody = document.createElement('div')
    this.chatInput = document.createElement('input')
    this.chatInput.classList.add('chatInput')
    this.wbs = {
      type: 'message',
      data: '',
      username: localStorage.getItem('username') || '',
      channel: 'General',
      key: this.#password
    }
    this.bindEvents()
    this.initializeChat()
  }

  /**
   * Chat division.
   * @returns {HTMLElement} returns chat division element.
   */
  getDiv() {
    return this.chat
  }

  /**
   * It checks the name and creates a Chat division.
   * @param {event} e - events associated with username.
   */
  checkName (e) {
    e.preventDefault()
    const username = document.querySelector('.username')
    const regex = /[^a-zA-Z0-9]/g
    if (username.value === '') {
      alert ('Must enter name!')
    } else {
      if (regex.test(username.value)) {
        alert('Please enter a valid name!')
      } else {
        const user = username.value
        localStorage.setItem('username', user)
        this.wbs.username = user
        this.chat.removeChild(this.chat.childNodes[0])
        this.createChatDivision()
      }
    }
  }

  /**
   * Handles the displaying of new messages in the chat.
   * @param {Event} e - The event object containing the new message data.
   */
  newMessage(e) {
    const messageDiv = document.createElement('div')
    messageDiv.style.backgroundColor = 'grey'
    messageDiv.style.color = 'black'
    messageDiv.style.borderRadius = '5px'

    const t = document.createElement('p')
    t.innerHTML = 'Channel: ' + JSON.parse(e.data).channel + ' | ' + new Date().toLocaleString()

    const message = document.createElement('P')
    message.classList.add('msg')

    if (JSON.parse(e.data).username === this.wbs.username) {
      messageDiv.style.backgroundColor = 'darkgrey'
      messageDiv.style.marginLeft = '28%'
    }

    message.innerHTML = JSON.parse(e.data).username + ': ' + JSON.parse(e.data).data
    messageDiv.appendChild(message)
    messageDiv.appendChild(t)

    if (this.wbs.channel === 'General') {
      if (JSON.parse(e.data).channel === 'General' || JSON.parse(e.data).channel === 'general') {
        this.chatBody.appendChild(messageDiv)
      }
    } else if (this.wbs.channel === 'Encrypted') {
      if (JSON.parse(e.data).channel === 'Encrypted'|| JSON.parse(e.data).channel === 'encrypted') {
        message.innerHTML = JSON.parse(e.data).username + ': ' + this.decrypt(JSON.parse(e.data).data)
        this.chatBody.appendChild(messageDiv)
      }
    } else {
      this.chatBody.appendChild(messageDiv)
    }
    this.chatBody.scrollTop = this.chatBody.scrollHeight
  }

  /**
   * Binds relevant events to the chat application.
   */
  bindEvents() {
    this.chat.addEventListener('max', () => {
      this.chatBody.classList.add('max');
      this.chatBody.scrollTop = this.chatBody.scrollHeight;
    })

    this.chat.addEventListener('min', () => {
      this.chatBody.classList.add('max');
      this.chatBody.scrollTop = this.chatBody.scrollHeight;
    })

    this.chatInput.addEventListener('keyup', (e) => {
      if (e.key === 'Enter') {
        this.sendMessage(this.chatInput.value);
      }
    })
  }

  /**
   * Initializes the chat based on whether a username is set.
   */
  initializeChat() {
    if (!this.wbs.username || this.wbs.username === 'undefined') {
      this.createUserNameDiv();
    } else {
      this.createChatDivision();
    }
  }

  /**
   * Creates the division for entering a username.
   */
  createUserNameDiv() {
    const userNameDiv = document.createElement('namediv')
    const username = document.createElement('Inputdiv')

    const th = document.createElement('h1')
    th.innerHTML = `Welcome to the Chat Application!!`
    userNameDiv.appendChild(th)

    const tt = document.createElement('h3')
    tt.innerHTML = `Please Enter a user name to start chatting.`
    userNameDiv.appendChild(tt)

    userNameDiv.classList.add('userNameDiv')
    username.classList.add('username')
    username.placeHolder = 'Username'
    
    username.addEventListener('focus', e => {
      username.placeHolder = ''
    })
    
    username.addEventListener('blur', e => {
      username.placeHolder = 'Username'
    })
    
    username.addEventListener('keyup', e => {
      switch (e.key) {
        case 'Enter':
          this.checkName(e)
          break
        default:
          break
      }
    })

    const nameBtn = document.createElement('button')
    nameBtn.classList.add('nameBtn')
    nameBtn.innerHTML = 'Set username'
    userNameDiv.appendChild(username)
    userNameDiv.appendChild(nameBtn)
    nameBtn.addEventListener('click', this.nameVerfier)
    this.chat.appendChild(userNameDiv)
  }

  /**
   * setup WebSocket connection for the chat.
   */
  initWebsocket () {
    webSocket.init(this)
    this.chat.addEventListener('closeSocket', () => {
      webSocket.remove(this)
    })
  }

  /**
   * Creates the main chat division with header, body, and footer.
   */
  createChatDivision() {
    const chatDivision = document.createElement('div')
    chatDivision.classList.add('chatDivision')
    
    const chatheader = this.chatHeader()
    chatDivision.appendChild(chatheader)

    this.chatBody = document.createElement('div')
    this.chatBody.classList.add('chatBody')

    chatDivision.appendChild(this.chatBody)

    const chatFooter = this.chatFooter()
    chatDivision.appendChild(chatFooter)

    this.chat.appendChild(chatDivision)
    
    this.initWebsocket()
  }

  /**
   * Sends a chat message over the WebSocket.
   * @param {string} msg - The message to be sent.
   */
  sendMsg(msg) {
    if (!this.wbs.username) {
      alert ('Please enter a name before starting a chat!')
      return
    }
    if (!webSocket.ws || webSocket.ws.readyState !== WebSocket.OPEN) {
      return
    }
    if (this.wbs.channel === 'Encrypted') {
      this.wbs.data = this.encrypt(msg)
    } else {
      this.wbs.data = msg
    }
    console.log('here')
    webSocket.ws.send(JSON.stringify(this.wbs))
  }

  /**
   * Encrypt the message if the channel is encrypted.
   * @param {string} msg message encrypted
   * @returns {string} encrypted messages.
   */
  encrypt (msg) {
    let encrypted = ''
    for (let i = 0; i < msg.length; i++) {
      encrypted += String.fromCharCode(msg.charCodeAt(i) ^ this.#password.charCodeAt(i % this.#password.length))
    }
    return encrypted
  }

  /**
   * Decryptes the message if the channel is decrypted.
   * @param {string} msg  decrypts message.
   * @returns {string} decypted messages.
   */
  decrypt (msg) {
    let decrypted = ''
    for (let i = 0; i < msg.length; i++) {
      decrypted += String.fromCharCode(msg.charCodeAt(i) ^ this.#password.charCodeAt(i % this.#password.length))
    }
    return decrypted
  }

  /**
   * creates chat header with user and channel controls.
   * @returns {HTMLDivElement} The chat header division.
   */
  chatHeader () {
    
    const chatheader = document.createElement('div')
    chatheader.classList.add('chatheader')

    const userDiv = document.createElement('div')
  
    const username = document.createElement('p')
    username.classList.add('username-display')
    username.innerHTML = 'Username: ' +  localStorage.getItem('username')
    userDiv.appendChild(username)

    const nameField = document.createElement('input')
    nameField.type = 'text'
    nameField.classList.add('username-input')

    const changeUserBtn = document.createElement('button')
    changeUserBtn.classList.add('changeUserBtn')
    changeUserBtn.innerHTML = 'Change user'
    userDiv.appendChild(changeUserBtn)
    

    nameField.addEventListener('keyup', e => {
      switch (e.key) {
        case 'Enter':
          const regex = /[^a-zA-Z0-9]/g
          if (regex.test(nameField.value)) {
            alert('Please enter a valid username')
          } else {
            localStorage.setItem ('username', nameField.value)
            username.innerHTML = 'Username: ' + localStorage.getItem('username')
            userDiv.removeChild(nameField)
            userDiv.appendChild(changeUserBtn)
            this.wbs.username = localStorage.getItem('username')
          }
          break
        default:
          break
      }
    })

    nameField.addEventListener('blur', e => {
      new Promise(r => setTimeout(() => {
        if (userDiv.contains(nameField)) {
          userDiv.removeChild(nameField)
          userDiv.appendChild(changeUserBtn)
        }
      }, 10))
      username.innerHTML = 'Username: ' + localStorage.getItem('username')
    })

    changeUserBtn.addEventListener('click', e => {
      username.innerHTML= 'Username: '
      userDiv.replaceChildren(username, nameField)
      nameField.focus()
    })

    chatheader.appendChild(userDiv)

    const channelDiv = document.createElement('div')
    const channel = document.createElement('p')
    channel.innerHTML = 'Channel'
    
    const channelSelect = document.createElement('select')
    channelSelect.classList.add('channelSelect')
    const op1 = document.createElement('option')
    op1.innerHTML = 'General'

    const op2 = document.createElement('option')
    op2.innerHTML = 'Encrypted'

    const op3 = document.createElement('option')
    op3.innerHTML = 'Any'

    channelSelect.addEventListener('change', e => {
      this.wbs.channel = channelSelect.options[channelSelect.selectedIndex].value
      this.readCachedMsgs(this.wbs.channel)
    })

    channelSelect.appendChild(op1)
    channelSelect.appendChild(op2)
    channelSelect.appendChild(op3)
    channel.appendChild(channelSelect)
    channelDiv.appendChild(channel)

    const clearBtn = document.createElement('button')
    clearBtn.classList.add('clearBtn')
    clearBtn.innerHTML = 'Clear/delete chat history'
    clearBtn.addEventListener('click', e => {
      e.preventDefault()
      this.chatBody.innerHTML = ''
      localStorage.setItem(this.wbs.channel, null)
    })

    channelDiv.appendChild(clearBtn)
    chatheader.appendChild(channelDiv)
    return chatheader
  }

  /**
   * Creates the chat footer with message input and controls.
   * @returns {HTMLDivElement} The chat footer division.
   */
  chatFooter () {
    const chatFooter = document.createElement('div')
    chatFooter.classList.add('chatFooter')
    const emoji = document.createElement('Button')
    emoji.classList.add('emojiButton')
    emoji.innerHTML = '😀'
    const emojiDiv = this.generatEmojies()
    emojiDiv.style.display = 'none'
    chatFooter.appendChild(emojiDiv)

    emoji.addEventListener('click', e => {
      if (emojiDiv.style.display === 'none') {
        emojiDiv.style.display = 'block'
      } else {
        emojiDiv.style.display = 'none'
      }
    })

    chatFooter.appendChild(emoji)
    this.chatInput = document.createElement('Input')
    this.chatInput.classList.add('chatInput')
    this.chatInput.placeHolder = 'Message'
    this.chatInput.addEventListener('keyup', e => {
      switch (e.key) {
        case 'Enter':
          //if empy the it should break.
          if (this.chatInput.value === '') {
            break
          }
          this.sendMsg(this.chatInput.value)
          this.chatInput.value = ''
          break
        default:
          break
      }
    })

    chatFooter.appendChild(this.chatInput)
    const chatbutton = document.createElement('BUTTON')
    chatbutton.classList.add('chatButton')
    chatbutton.innerHTML = 'Send'

    chatbutton.addEventListener('click', e => {
      if (this.chatInput.vlaue === '') {
        return
      }
      this.sendMsg(this.chatInput.value)
      this.chatInput.value = ''
    })

    const refreshBtn = document.createElement('button')
    refreshBtn.classList.add('refreshbutton')
    refreshBtn.innerHTML = 'Refresh'
    refreshBtn.addEventListener('click', () => {
      this.refreshMessages()
    })
    chatFooter.appendChild(refreshBtn)
    chatFooter.appendChild(chatbutton)
    return chatFooter
  }

  /**
   * Refreshes messages in the chat body from cached messages.
   */
  refreshMessages () {
    this.chatBody.innerHTML = ''
    this.readCachedMsgs(this.wbs.channel)
  }

  
  /**
   * Generates emoji buttons for the chat.
   * @returns {HTMLDivElement} The emoji container-division.
   */
  generatEmojies() {
    const emojRange = [[128512, 128592], [128636, 128700]]
    const emojiContainer = document.createElement('div')
    emojiContainer.classList.add('emojiContainer')

    const fragment = document.createDocumentFragment()

    const addEmojis = (start, end) => {
      for (let i = start; i < end; i++) {
        const emoji = String.fromCodePoint(i);
        const emojiButton = document.createElement('button')
        emojiButton.innerHTML = emoji
        emojiButton.addEventListener('click', () => {
          this.chatInput.value += emoji
          emojiContainer.style.display = 'none'
        })
        fragment.appendChild(emojiButton)
      }
    }

    emojRange.forEach(range => addEmojis(range[0], range[1]))
    emojiContainer.appendChild(fragment)
    return emojiContainer
  }

  /**
   * Reads and displays the cached message from local storage.
   * @param {string} channel - displays the name of channel reading the msgs from.
   * @returns exits if the first condition is meet.
   */
  readCachedMsgs(channel) {
    this.chatBody.replaceChildren();
    const msgs = JSON.parse(localStorage.getItem(channel))
    if (msgs === null) {
      return; // if no message then return back.
    }
  
    msgs.forEach(msg => {
      const msgDiv = document.createElement('div')
      msgDiv.style.color = 'white'
      msgDiv.style.borderRadius = '5px'
      msgDiv.style.padding = '10px'
      msgDiv.style.marginBottom = '10px'
  
      if (msg.username === this.wbs.username) {
        msgDiv.style.backgroundColor = 'darkgrey'
      } else {
        msgDiv.style.backgroundColor = 'black'
      }
  
      const msgElmt = document.createElement('p')
      msgElmt.innerHTML = `${msg.username}: ${channel === 'Encrypted' ? this.decrypt(msg.msg) : msg.msg}`
  
      const timeStamp = document.createElement('p');
      timeStamp.innerHTML = `Channel: ${channel === 'Any' ? msg.channel : channel} | ${msg.time}`
  
      msgDiv.appendChild(msgElmt)
      msgDiv.appendChild(timeStamp)
  
      this.chatBody.appendChild(msgDiv)
    });
  
    this.chatBody.scrollTop = this.chatBody.scrollHeight
  }
}
