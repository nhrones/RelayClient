

import { ChannelName, PostMethod, RelayURL } from './constants.js'
import { updateUI, hide, sendButton, chatInput } from './dom.js'
import * as main from './main.js'

/** 
 * Signaling Service 
 * 
 * This service will connect to a relay server that streams messages to our local
 * EventSource instance
 */
export class RelayClient {

   relay
   peer
   
   /** RelayClient ctor 
    * @param {string} me - the initial callee name
    */
   constructor( me ) {
       
      this.peer = me

      this.relay = new EventSource(`${RelayURL}subscribe?channel=${ChannelName}`)

      // report an initial state
      console.log("CONNECTING");

      this.relay.addEventListener("open", () => {
         console.log('Relay opened!')
         main.start()
      })

      // When problems occur (such as a network timeout,
      // notify any eventSource state change 
      this.relay.addEventListener("error", (_e) => {
         switch (this.relay.readyState) {
            case EventSource.OPEN:
               console.log("CONNECTED");
               break;
            case EventSource.CONNECTING:
               console.log("CONNECTING");
               break;
            case EventSource.CLOSED:
               console.log("DISCONNECTED");
               break;
         }
      });

      // Handle incoming messages from the signaling server.
      this.relay.onmessage = (evt) => {
         const { data } = JSON.parse(evt.data)
         const { from, payload } = data
         
         console.info('relay.onmessage!', data)
         const pay = JSON.parse(payload)
         console.info(pay)
         const { topic, content, who } = pay.payload
         
         console.log( 'topic:', topic )
         
         switch (topic) {
            case 'chat': {
               console.log('Got Chat message!')
               updateUI(from, content, who)
               break;
            }
            case 'bye': // peer hung up (pressed `hangup` button )
               hide(sendButton)
               hide(chatInput);
               break;

            default:
               break;
         }
      };
   }

   /**
    * By default, if the connection between the client and server closes, 
    * the connection is `restarted`. 
    * The connection can only be terminated with the .close() method.
    */
   close() {
      this.relay.close()
   }

   /** postMessage sends messages to peers via a signal service  
    * @param {SignalMessage type} - message - message payload
    * 
    * if (webRTC.dataChannel && webRTC.dataChannel.readyState === 'open') {
       if (DEBUG) console.log('DataChannel >> :', msg)
       webRTC.dataChannel.send(msg)
    */
   postMessage(message) {
      const msg = JSON.stringify(message)
      if (this.relay && this.relay.readyState === EventSource.OPEN) {
         console.log('Relay >> :', msg)
         fetch(RelayURL, {
            method: PostMethod,
            body: JSON.stringify({
               channel: ChannelName,
               data: {
                  from: this.peer.id,
                  payload: msg
               }
            })
         })
      }
   }
}
