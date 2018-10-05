import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import MessageList from './MessageList';
import Title from './Title';
import SendMessageForm from './SendMessageForm';
import Chatkit from '@pusher/chatkit';


const instanceLocator = "v1:us1:d4824d95-d516-4aca-8f9f-43bb6f10dc82";
const testToken = "https://us1.pusherplatform.io/services/chatkit_token_provider/v1/d4824d95-d516-4aca-8f9f-43bb6f10dc82/token";
const username = "paulorcv";
const roomId = 17909154;


class App extends React.Component {
  constructor() {
      super()
      this.state = {
          messages: []
      }
      this.sendMessage = this.sendMessage.bind(this)
  } 
  
  componentDidMount() { 
      const chatManager = new Chatkit.ChatManager({
          instanceLocator: instanceLocator,
          userId: username,
          tokenProvider: new Chatkit.TokenProvider({
              url: testToken
          })
      })
      
      chatManager.connect()
      .then(currentUser => {
          this.currentUser = currentUser
          this.currentUser.subscribeToRoom({
          roomId: roomId,
          hooks: {
              onNewMessage: message => {

                  this.setState({
                      messages: [...this.state.messages, message]
                  })
              }
          }
      })
    })
  }
  
  sendMessage(text) {
      this.currentUser.sendMessage({
          text,
          roomId: roomId
      })
  }
  
  render() {
      return (
          <div className="app">
            <Title />
            <MessageList 
                roomId={this.state.roomId}
                messages={this.state.messages} />
            <SendMessageForm
                sendMessage={this.sendMessage} />
          </div>
      );
  }
}


export default App;
