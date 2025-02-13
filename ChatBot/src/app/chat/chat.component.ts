import { Component, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GeminiService } from '../services/gemini.service';
import { trigger, style, animate, transition } from '@angular/animations';

interface ChatMessage {
  content: string;
  isUser: boolean;
  timestamp: Date;
  isError?: boolean;
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  animations: [
    trigger('messageAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class ChatComponent implements AfterViewChecked {
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;
  
  messages: ChatMessage[] = [];
  newMessage = '';
  isLoading = false;

  constructor(private geminiService: GeminiService) {}

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    try {
      this.messagesContainer.nativeElement.scrollTop = 
        this.messagesContainer.nativeElement.scrollHeight;
    } catch (err) {}
  }

  sendMessage() {
    if (!this.newMessage.trim() || this.isLoading) return;

    const userMessage: ChatMessage = {
      content: this.newMessage,
      isUser: true,
      timestamp: new Date()
    };

    this.messages.push(userMessage);
    this.isLoading = true;
    const currentMessage = this.newMessage;
    this.newMessage = '';

    this.geminiService.chat(currentMessage).subscribe({
      next: (response) => {
        const botMessage: ChatMessage = {
          content: response,
          isUser: false,
          timestamp: new Date()
        };
        this.messages.push(botMessage);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error:', error);
        const errorMessage: ChatMessage = {
          content: error.message || 'An error occurred. Please try again.',
          isUser: false,
          timestamp: new Date(),
          isError: true
        };
        this.messages.push(errorMessage);
        this.isLoading = false;
      }
    });
  }
}