

import { myID, Me, relay } from './main.js'

export let sendButton;
export let chatInput;

export const initUI = () => {
   sendButton = document.getElementById('sendButton');
   chatInput = document.getElementById('chatInput');
   chatInput.placeholder = 'say something ' + myID + '!'
   unhide(sendButton)
   unhide(chatInput);

   // key pressed
   chatInput.addEventListener("keypress",(e) => {  
      console.log('keypress: ', e.key)
      if (e.key === "Enter") {
         sendIt()
      }
      if (chatInput.value.length) {
         unhide(sendButton)
      }
   })

   sendButton.onclick = () => {
      sendIt()
   }
}

function sendIt() {
   const data = {
      from: Me.id,
      payload: {
         topic: 'chat',
         content: chatInput.value || '',
         who: Me,
      }
   };
   hide(sendButton)
   chatInput.value = '';
   relay.postMessage(data)
   
}

export function updateUI(
   fromID,
   content,
   who, 
   clearFirst = false
) {
   console.log('UpdateUI called!')
   let isMe = false
   
   //TODO cleanup message layout based on `from`
   //TODO use correct emoji for each peer ???
   
   if (fromID === myID) {
      console.log('It was just me!')
      isMe = true
   } else { // first peer? 
      unhide(sendButton)
      unhide(chatInput)
      const banner = document.getElementById('banner');
      banner.textContent = `Welcome ${fromID}!`
   }
   if (who.name === 'server') {
      who.name = ''
      clearFirst = true
      isMe = true
      const banner = document.getElementById('banner');
      banner.textContent = content
   } else {

      const template = document.querySelector('template[data-template="message"]');

      const nameEl = template.content.querySelector('.message__name');

      if (who.emoji || who.name) {
         nameEl.innerText = who.emoji + ' ' + who.name;
      }
      
      const bub = template.content.querySelector('.message__bubble')
      bub.innerText = content;
      const clone = document.importNode(template.content, true);
      const messageEl = clone.querySelector('.message');
      if (isMe) {
         messageEl.classList.add('message--mine');
      } else {
         messageEl.classList.add('message--theirs');
      }

      const messagesEl = document.querySelector('.messages');

      // should clear?
      if (clearFirst) { messagesEl.innerHTML = '' }

      messagesEl.appendChild(clone);

      // Scroll to bottom
      messagesEl.scrollTop = messagesEl.scrollHeight - messagesEl.clientHeight;
   }
}

export const hide = (el) => {
   el.style.display = "none";
   el.disabled = false;
}

export const unhide = (el) => {
   el.style.display = "block";
   el.disabled = false;
}

