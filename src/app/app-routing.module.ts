import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {
    path: 'chatbot',loadChildren: () =>
    import('./chatbot/chatbot.module').then(m =>m.ChatbotModule)
  },
  {
    path: '**',
    redirectTo: 'chatbot'
 } 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
