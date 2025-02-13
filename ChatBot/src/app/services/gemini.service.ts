import { Injectable } from '@angular/core';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Observable, from, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    const API_KEY = 'YOUR_API_KEY'; // Replace with your actual API key
    if (!API_KEY || API_KEY === 'YOUR_API_KEY') {
      console.error('Please set your Gemini API key in the GeminiService');
    }
    
    this.genAI = new GoogleGenerativeAI(API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
  }

  chat(message: string): Observable<string> {
    return from(this.generateResponse(message)).pipe(
      catchError(error => {
        console.error('Gemini API Error:', error);
        if (error.message?.includes('API key')) {
          return throwError(() => new Error('Invalid API key. Please check your Gemini API key configuration.'));
        }
        if (error.message?.includes('rate limit')) {
          return throwError(() => new Error('Rate limit exceeded. Please try again in a moment.'));
        }
        return throwError(() => new Error('An error occurred while processing your request. Please try again.'));
      })
    );
  }

  private async generateResponse(message: string): Promise<string> {
    try {
      if (!message.trim()) {
        throw new Error('Empty message');
      }

      const result = await this.model.generateContent(message);
      const response = await result.response;
      return response.text();
    } catch (error: any) {
      throw error;
    }
  }
}