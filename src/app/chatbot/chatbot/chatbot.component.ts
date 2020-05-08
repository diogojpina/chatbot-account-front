import { Component, OnInit } from '@angular/core';

import { ChatbotRepositoryService } from './../../service/repository/chatbot-repository.service';

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss']
})
export class ChatbotComponent implements OnInit {

  messages :Array<ChatMessage> = new Array();
  userMessage: string;

  loginData :LoginData;

  state :string;

  constructor(private chatbotRepo :ChatbotRepositoryService) { }

  ngOnInit(): void {
    this.initChat();
  }

  initChat() {  
    this.messages = new Array();

    let message :ChatMessage = new ChatMessage('bot', 'Welcome!')
    this.messages.push(message);
    
    this.initLogin();
  }

  initLogin() {
    let message :ChatMessage = new ChatMessage('bot', 'Type your account number or type new to create an account:');
    this.messages.push(message);

    this.state = ChatStates.login;
  }

  login() {
    let userMessage :string = this.getUserMessage();
    if (!this.loginData) {
      if (userMessage == 'new') {
        this.initSignup();
        return 0;
      }
      this.loginData = new LoginData();
      this.loginData.username = userMessage;

      let message :ChatMessage = new ChatMessage('bot', 'Type your password:');
      this.messages.push(message);
      return 0;
    }
    else {
      this.loginData.password = userMessage;

      this.chatbotRepo.login(this.loginData);
    }
  }

  initSignup() {
    this.state = ChatStates.signup;

    console.log('signup');
  }

  getUserMessage() {
    let message :string = this.userMessage;
    this.userMessage = '';
    return message;
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
  static signup = 'Signup'
}

class LoginData {
  username: string;
  password: string;
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