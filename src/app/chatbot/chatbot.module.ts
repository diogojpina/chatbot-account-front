import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ChatbotComponent } from './chatbot/chatbot.component';
import { ChatbotRoutes } from './chatbot.routing';



@NgModule({
  declarations: [ChatbotComponent],
  imports: [
    CommonModule,
       FormsModule,
       ReactiveFormsModule,
       RouterModule.forChild(ChatbotRoutes),
  ]
})
export class ChatbotModule { }
