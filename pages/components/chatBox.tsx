import index from '..';
import styles from '../../styles/chatbox.module.css'

import React, { useEffect } from "react";

import { w3cwebsocket as W3CWebSocket } from "websocket";

const ChatBox = (props) => {
  const messages = [];
  let client;

  let chatList;
  let li;

  const setMessages = (message) => {
    let msgLI = li.cloneNode(true);


    chatList.appendChild(msgLI);

    messages.push(message);
    if (messages.length >= 50)
      messages.shift();
  }

  const username = 'peter';
  const level = 123;
  const pictureURL = '...';

  const newMessage = (e) => {
    const message = e.target.value;
    if (e.which == 13 || e.keyCode == 13 || e.key == 'Enter') {
      client.send(JSON.stringify({
        message: JSON.stringify({
          username,
          level,
          pictureURL,
          message
        }),
        type: "chatmessage"
      }));
      if (message.length < 3 || message.replace('\n', '').length < 3) return;
      e.target.value = null;
      setMessages(message);
      return;
    }
    if (e.isFromAPI) {
      setMessages(message);
    }
  };

  useEffect(() => {
    chatList = document.getElementById('chatList');
    li = document.getElementById('PlaceholderLI');
    client = new W3CWebSocket(`ws://${window.location.hostname}:8000`);
    client.onopen = () => {
      console.log('WebSocket Client Connected');
    };
    client.onmessage = (ServerMessage) => {
      let json = JSON.parse(ServerMessage.data);
      if(json.type == 'servermessage'){
        console.log('Active Clients: ' +json.message);
      } else if(json.type == 'chatmessagefromuser'){
        json = JSON.parse(json.message) // { client, level , pictureURL, message}
        console.log(json.message);
      }
    };

    client.onerror = function () {
      console.log('Connection Error');
    };

    client.onclose = function () {
      console.log('Server Closed');
    };
  }, []); // <-- [] prevents it from rerendering

  return (
    <div className={styles.main}>
      <div className={styles.header}>ChatBox - online</div>
      <div className={styles.chat_container}>
        <div className={styles.chat_content}>
          <ul id="chatList">
            <li id="PlaceholderLI">
              {/* [img] [level] [username]: [message]   */}
              <Message profile={"https://picsum.photos/200/300"} level={"45"} username={"username"} message={"Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At"}/>
            </li> {/* Placeholder Item */}
          </ul>
        </div>
      </div>
      <div className={styles.fab_field}>
        <textarea id="chatSend" name="chat_message" placeholder="Send a message" className={[styles.chat_field, styles.chat_message].join(' ')} onKeyUp={e => newMessage(e)}></textarea>
      </div>
    </div>
  )
};

export default ChatBox;


const Message = (props) => {
  return(
    <div className={styles.message_container}>
      <UserPicute profile={props.profile}/> <UserLevel level={props.level}/> [{props.username}] [:] [{props.message}]
    </div>
  );
}

const UserPicute = (props) => {
  return <img className={styles.message_icon} src={props.profile}/>
}

const UserLevel = (props) => {
  return <div className="">{props.level}</div>
}
