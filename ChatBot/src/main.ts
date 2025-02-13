import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { ChatComponent } from './app/chat/chat.component';

@Component({
  selector: 'app-root',
  template: '<app-chat></app-chat>',
  standalone: true,
  imports: [ChatComponent]
})
export class App {}

bootstrapApplication(App);