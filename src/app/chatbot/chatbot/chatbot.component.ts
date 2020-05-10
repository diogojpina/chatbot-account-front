import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { ChatbotRepositoryService } from './../../service/repository/chatbot-repository.service';
import { AuthService } from './../../service/auth/auth.service';

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss']
})
export class ChatbotComponent implements OnInit {
  @ViewChild("usermessage") userMessageField: ElementRef;
  @ViewChild("chatbox") chatboxDiv: ElementRef;

  messages :Array<ChatMessage> = new Array();
  userMessage: string;

  loginData :LoginData;
  userData :UserData;

  state :string;

  constructor(private chatbotRepo :ChatbotRepositoryService,
              private authService :AuthService) { }

  ngOnInit(): void {
    this.initChat();
  }

  initChat() {  
    this.messages = new Array();
    this.loginData = null;
    this.userData = null;

    this.printMessage('bot', 'Welcome!');
    
    this.initLogin();
  }
 
  initLogin() {
    this.loginData = null;
    this.printMessage('bot', 'Type your "username" or type "signup" to create an account:');

    this.state = ChatStates.login;
  }

  login() {
    let userMessage :string = this.getUserMessage();
    if (userMessage == 'signup') {
      this.initSignup();
      return 0;
    }
    

    if (!this.loginData) {      
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
    this.printMessage('bot', 'Type your firstname:');

    this.state = ChatStates.signup;
  }

  signup() {
    let userMessage :string = this.getUserMessage();

    if (userMessage == 'cancel') {
      this.initLogin();
      return false;
    }
    if (!this.userData) {
      this.userData = new UserData();
      this.userData.firstname = userMessage;

      this.printMessage('user', userMessage);
      this.printMessage('bot', 'Type your lastname:');
      return 0;
    }
    else if (!this.userData.lastname) {
      this.userData.lastname = userMessage;
      this.printMessage('user', userMessage);
      this.printMessage('bot', 'Type your username:');
      return 0;
    }
    else if (!this.userData.username) {
      this.userData.username = userMessage;
      this.printMessage('user', userMessage);
      this.printMessage('bot', 'Type your password:');
      return 0;
    }
    else if (!this.userData.password) {
      this.userData.password = userMessage;
      this.printMessage('user', '******');
      this.printMessage('bot', 'Type your currency code (USD, EUR, BRL, ...):');
      return 0;
    }
    else {
      this.userData.currency = userMessage;
      this.printMessage('user', userMessage);

      this.chatbotRepo.signup(this.userData).subscribe(
        data => {
          const response = (data as any);
          if (response.success == true) {            
            this.printMessage('bot', 'User and account successfully created.');
            this.userData = null;
            this.initLogin();
          }
          else {
            this.signupFail(response.message);            
          }

        },
        error => {  
          console.log('aqui');
          this.signupFail(error.message);
        }
      );
    }
  }

  signupFail(errorMessage) {
    this.printMessage('bot', errorMessage);

    this.initLogin();
  }

  initMenu() {
    this.state = ChatStates.menu;


    this.chatbotRepo.menuList().subscribe(
      data => {
        const response = (data as any);
        if (response.success == true) {
          let message :string = 'What do you want to do? <br />';

          for (let option of response.data) {
            message += '[' + option.code + '] ' + option.name + '<br />';
          }

          this.printMessage('bot', message);
        }
        else {
          //TODO: treat error            
        }

      },
      error => {  
        console.log(error);
        //TODO: treat error
      }
    );
  }

  menuChooseOption() {
    let userMessage :string = this.getUserMessage();

    this.printMessage('user', userMessage);

    this.chatbotRepo.menuChooseOption(userMessage).subscribe(
      data => {
        const response = (data as any);
        if (response.success == true) {
          let option = response.data;
          this.state = option.code;
          this.send();
        }
        else {
          this.menuChooseOptionFail(response.message);      
        }

      },
      error => {          
        this.menuChooseOptionFail(error.message);    
      }
    );
  }

  menuChooseOptionFail(errorMessage) {
    this.printMessage('bot', errorMessage);    
    this.initMenu();    
  }

  initBalance() {
    let userMessage :string = this.getUserMessage();

    let userData = JSON.parse(localStorage.getItem("userProfile"));
    let accountNumber = userData.account[0].accountNumber;

    this.chatbotRepo.balance(accountNumber).subscribe(
      data => {
        const response = (data as any);
        if (response.success == true) {
          this.printMessage('bot', 'Your balance is: ' + response.data);
          this.state = ChatStates.waiting;
          this.printMessage('bot', 'Prees any key to continue...');
        }
        else {
          this.balanceFail(response.message);      
        }

      },
      error => {          
        this.balanceFail(error.message);    
      }
    );
  }

  balanceFail(errorMessage) {
    this.printMessage('bot', errorMessage);  
    this.initMenu();  
  }

  initDeposit() {
    let userMessage :string = this.getUserMessage();

    if (userMessage) {
      this.deposit(userMessage);
    }
    else {
      this.printMessage('bot', 'Type the amount you want to deposit:');
    }
  }

  deposit(value) {
    let userData = JSON.parse(localStorage.getItem("userProfile"));
    let accountNumber = userData.account[0].accountNumber;

    this.chatbotRepo.deposit(accountNumber, value).subscribe(
      data => {
        const response = (data as any);
        if (response.success == true) {
          let transaction :any = response.data;
          let message = response.value + " deposit made successfully! <br />";
          message += 'Transaction code: ' + transaction.id;
          this.printMessage('bot', message);
          this.state = ChatStates.waiting;
          this.printMessage('bot', 'Prees any key to continue...');
        }
        else {
          this.balanceFail(response.message);      
        }

      },
      error => {          
        this.balanceFail(error.message);    
      }
    );

  }

  depositFail(errorMessage) {
    this.printMessage('bot', errorMessage);  
    this.initMenu();  
  }

  initWithdraw() {
    let userMessage :string = this.getUserMessage();

    if (userMessage) {
      this.withdraw(userMessage);
    }
    else {
      this.printMessage('bot', 'Type the amount you want to withdraw:');
    }
  }

  withdraw(value) {
    let userData = JSON.parse(localStorage.getItem("userProfile"));
    let accountNumber = userData.account[0].accountNumber;

    this.chatbotRepo.withdraw(accountNumber, value).subscribe(
      data => {
        const response = (data as any);
        if (response.success == true) {
          let transaction :any = response.data;
          let message = response.value + " withdraw made successfully! <br />";
          message += 'Transaction code: ' + transaction.id;
          this.printMessage('bot', message);
          this.state = ChatStates.waiting;
          this.printMessage('bot', 'Prees any key to continue...');
        }
        else {
          this.withdrawFail(response.message);      
        }
      },
      error => {          
        this.withdrawFail(error.message);    
      }
    );

  }

  withdrawFail(errorMessage) {
    this.printMessage('bot', errorMessage);  
    this.initMenu();  
  }

  waiting() {
    this.initMenu(); 
  }

  onKeyup(event){
    if (event.key == "Enter") {
      this.send();
      return 0;
    }

    if (this.state == ChatStates.waiting) {
      this.userMessage = '';
      this.send();
      return 0;
    }
  }

  async printMessage(who, msg) {
    let message :ChatMessage = new ChatMessage(who, msg);
    this.messages.push(message);

    if (this.chatboxDiv) {
      await this.delay(300);

      console.log(this.chatboxDiv.nativeElement.scrollHeight);
      this.chatboxDiv.nativeElement.scrollTop = this.chatboxDiv.nativeElement.scrollHeight;
    }
  }

  getUserMessage() {
    let message :string = this.userMessage;
    this.userMessage = '';
    return message;
  }

  send() {
    if (this.userMessage == 'quit' || this.userMessage == 'bye') {
      this.userMessage = '';
      localStorage.removeItem("userProfile");
      this.initChat();
      return false;
    }

    switch (this.state) {
      case ChatStates.login:
        this.login();
        break;
      case ChatStates.signup:
        this.signup();
        break;
      case ChatStates.menu:
        this.menuChooseOption();
        break;
      case ChatStates.balance:
        this.initBalance();
        break;
      case ChatStates.deposit:
        this.initDeposit();
        break;
      case ChatStates.withdraw:
        this.initWithdraw();
        break;
      case ChatStates.waiting:
        this.waiting();
      default:
    }

    this.userMessageField.nativeElement.focus();
  }

  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }
  
}



class ChatStates {
  static login = 'login';
  static signup = 'signup'
  static menu = 'menu';
  static deposit = 'deposit';
  static withdraw = 'withdraw';
  static balance = 'balance';
  static waiting = 'waiting';
}

class LoginData {
  username: string;
  password: string;
}

class UserData {
  firstname :string;
  lastname :string;
  username :string;
  password :string;
  currency :string;
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