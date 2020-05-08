import { Component, OnInit } from '@angular/core';

import { ChatbotRepositoryService } from './../../service/repository/chatbot-repository.service';
import { AuthService } from './../../service/auth/auth.service';

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

  constructor(private chatbotRepo :ChatbotRepositoryService,
              private authService :AuthService) { }

  ngOnInit(): void {
    this.initChat();
  }

  initChat() {  
    this.messages = new Array();

    this.printMessage('bot', 'Welcome!');
    
    this.initLogin();
  }

  initLogin() {
    this.printMessage('bot', 'Type your account number or type new to create an account:');

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

      this.printMessage('user', userMessage);

      this.printMessage('bot', 'Type your password:');
      return 0;
    }
    else {
      this.loginData.password = userMessage;

      this.printMessage('user', '******');

      this.chatbotRepo.login(this.loginData).subscribe(
        data => {
          const response = (data as any);
          if (response.success == true) {
            this.authService.setLocalUserProfile(response.data);
            this.initMenu();
          }
          else {
            this.loginFail(response.message);            
          }

        },
        error => {  
          this.loginFail(error.message);
        }
      );
    }
  }

  loginFail(errorMessage) {
    this.printMessage('bot', errorMessage);

    this.initLogin();
  }

  initSignup() {
    this.state = ChatStates.signup;

    console.log('signup');
  }

  initMenu() {
    this.state = ChatStates.menu;

    
  }

  printMessage(who, msg) {
    let message :ChatMessage = new ChatMessage(who, msg);
    this.messages.push(message);
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
  static menu = 'Menu';
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