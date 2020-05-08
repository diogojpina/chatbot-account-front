import { Routes } from '@angular/router';

import { ChatbotComponent } from './chatbot/chatbot.component';

export const ChatbotRoutes: Routes = [{
    path: '',
    component: ChatbotComponent
  },{ 
    path: '',
    children: [{
      path: 'chatbot',
      component: ChatbotComponent
    }]
}];