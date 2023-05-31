
import {Emoji, Server} from './constants.js'   
import { RelayClient } from './relayClient.js'
import { 
    hide, 
    initUI, 
    updateUI,
    sendButton,
    chatInput 
} from './dom.js'

const t = Date.now().toString()
export const myID = t.substring(t.length-3)
const eNum = parseInt(Math.random() * 6 +"" )
const name = 'Peer-' + myID

export const Me = {
   id: myID,
   name: name,
   emoji: Emoji[eNum]
}

export const relay = new RelayClient(Me)

// tell them your listening/waiting
updateUI(myID, `⌛  Waiting for a peer connection!`, Server);

// initialize all UI DOM elements
initUI()

/** Start the peerConnection process by signaling an invitation */
export const start = () => {
    /*
      TODO To protect against a server timeout, 
      include a comment line 
      (one starting with a ':' character),
      every 15 seconds or so.
    */
    console.log('main.start')
   
    relay.postMessage({
      from: Me.id,  
      payload: {
         topic: "chat",
         content: 'Hi',
         who: Me
     }  
   });
   hide(sendButton)
   hide(chatInput);
}
  
