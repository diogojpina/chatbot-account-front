import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ChatbotRepositoryService {
  baseUrl :string;

  constructor(public http: HttpClient) {
    this.baseUrl = 'http://localhost:8000';
  }

  login(data) {
    let url:string = this.baseUrl + "/authentication/login";
    return this.http.post(url, data, this.getHttpOptionsSimple());
  }

  logout() {
    let url:string = this.baseUrl + "/authentication/logout";
    return this.http.post(url, {}, this.getHttpOptions());
  }

  validateToken(data) {
    let url:string = this.baseUrl + "/authentication/validate";
    return this.http.post(url, data, this.getHttpOptions());
  }

  signup(data) {
    const headers :HttpHeaders = new HttpHeaders({
      'Content-Type':  'application/json',
    });
    let url:string = this.baseUrl + "/authentication/signup";
    return this.http.post(url, data, this.getHttpOptionsSimple());
  }

  menuList() {
    let url:string = this.baseUrl + "/menu";
    return this.http.get(url, this.getHttpOptions());
  }

  menuChooseOption(option) {
    let data: any = {option: option};
    let url:string = this.baseUrl + "/menu/chooseOption";
    return this.http.post(url, data, this.getHttpOptions());
  }

  balance(accountNumber) {
    let url:string = this.baseUrl + "/transaction/balance/" + accountNumber;
    return this.http.get(url, this.getHttpOptions());
  }

  deposit(accountNumber, value) {
    let data: any = {value: value};
    let url:string = this.baseUrl + "/transaction/deposit/" + accountNumber;
    return this.http.post(url, data, this.getHttpOptions());
  }

  withdraw(accountNumber, value) {
    let data: any = {value: value};
    let url:string = this.baseUrl + "/transaction/withdraw/" + accountNumber;
    return this.http.post(url, data, this.getHttpOptions());
  }
  
  

  getHttpOptions() {
    return {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': this.getToken()
      })
    };
  }

  getHttpOptionsSimple() {
    return {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
  }

  getToken() {
    let userData = JSON.parse(localStorage.getItem("userProfile"));
    if(userData) {
       return userData.token;
    }
    return '';
 }
}
