import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { ChatbotRepositoryService } from './../repository/chatbot-repository.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

	userData   : any;
  isLoggedIn = false;

  constructor(private router : Router,
               private chatbotRepo :ChatbotRepositoryService) { 
   }

   public async getLocalStorageUser(){
      this.userData = JSON.parse(localStorage.getItem("userProfile"));
      if(this.userData) {
        await this.validateToken(this.userData.token);
        if (this.isLoggedIn == false)
          return false;
        
        return this.userData;
      } else {
         this.isLoggedIn = false;
         return false;
      }    
   }

   getToken() {
      this.userData = JSON.parse(localStorage.getItem("userProfile"));
      if(this.userData) {
         return this.userData.token;
      }
      return false;
   }


   validateToken(token) {  
      if (!token) {
        return false;
      }
  
      let data:any = {token: token};

      this.chatbotRepo.validateToken(data).subscribe(
        data => {
            const response = (data as any);
            if (response.success == true) {
              this.isLoggedIn = true;
            }
            else {
              this.isLoggedIn = false;
            }
        },
        error => {  
          this.isLoggedIn = false;
        }
      );
    }


   setLocalUserProfile(user){
   	localStorage.setItem("userProfile", JSON.stringify(user));
    this.isLoggedIn = true;
   }
}
