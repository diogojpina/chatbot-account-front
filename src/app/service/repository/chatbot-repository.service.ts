import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ChatbotRepositoryService {
  baseUrl :string;

  constructor(public http: HttpClient) {
    this.baseUrl = 'https://localhost:8000';
  }

  login(data) {
    let url:string = this.baseUrl + "/authentication/login";
    return this.http.post(url, data, this.getHttpOptions());
  }

  logout() {
    let url:string = this.baseUrl + "/authentication/logout";
    return this.http.post(url, {}, this.getHttpOptions());
  }

  validateToken(data) {
    let url:string = this.baseUrl + "/authentication/validate";
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

  getToken() {
    let userData = JSON.parse(localStorage.getItem("userProfile"));
    if(userData) {
       return userData.token;
    }
    return false;
 }
}
