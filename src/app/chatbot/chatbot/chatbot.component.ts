import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss']
})
export class ChatbotComponent implements OnInit {

  messages :Array<ChatMessage> = new Array();
  userMessage: string;

  state :string;

  constructor() { }

  ngOnInit(): void {
    this.initChat();
  }

  initChat() {  
    this.messages = new Array();

    let message :ChatMessage = new ChatMessage('bot', 'Welcome!')
    this.messages.push(message);
    
  }

  initLogin() {
    let message :ChatMessage = new ChatMessage('bot', 'Type your account number or type new to create an account:');
    this.messages.push(message);

    this.state = ChatStates.login;
  }

  login() {
    console.log('resolve aqui');
  }

  send() {
    switch (this.state) {
      case ChatStates.login:
        this.login();
    }
  }

  
}

class ChatStates {
  static login = 'Login';
}

class ChatMessage {
  private who: string;
  private message: string;

  constructor(who, message) {
    this.who = who;
    this.message = message;
  }

  getWho() {
    this.who;
  }

  getMessage() {
    this.message;
  }
}