import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChatbotRepositoryService {

  constructor() { }

  login(data) {
    console.log(data);
  }
}
