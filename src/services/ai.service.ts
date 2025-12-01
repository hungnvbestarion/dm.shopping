import { GoogleGenAI } from '@google/genai'

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export interface ChatResponse {
  message: string
  suggestions?: string[]
}

class AIService {
  private apiKey: string
  private conversationHistory: Message[] = []
  private model: string = 'gemini-2.5-flash'
  private aiClient: GoogleGenAI

  constructor() {
    this.apiKey = import.meta.env.VITE_GEMINI_API_KEY
    this.aiClient = new GoogleGenAI({ apiKey: this.apiKey })
  }

  /**
   * Send a message to Google Gemini AI and get a response
   */
  async sendMessage(userMessage: string): Promise<ChatResponse> {
    if (!this.apiKey) {
      throw new Error('API key is not configured')
    }

    // Add user message to history
    this.conversationHistory.push({
      id: this.generateId(),
      role: 'user',
      content: userMessage,
      timestamp: new Date(),
    })

    try {
      const response = await this.aiClient.models.generateContent({
        model: this.model,
        contents: userMessage,
        config: {
          systemInstruction: this.getSystemPrompt(),
        },
      })

      // Extract the response text
      if (response.text?.length === 0) {
        throw new Error('No response from Gemini API')
      }

      // Add assistant response to history
      this.conversationHistory.push({
        id: this.generateId(),
        role: 'assistant',
        content: response.text as string,
        timestamp: new Date(),
      })

      return {
        message: response.text as string,
        suggestions: this.extractSuggestions(response.text as string),
      }
    } catch (error: any) {
      console.error('AI Service Error:', error.response?.data || error.message)
      const errorMsg =
        error.response?.data?.error?.message || 'Failed to get response from AI assistant'
      throw new Error(errorMsg)
    }
  }

  /**
   * Get system prompt for the shopping assistant
   */
  private getSystemPrompt(): string {
    return `You are a helpful shopping assistant for DM Shopping, an e-commerce platform. Your role is to:
        1. Help customers find products they're looking for
        2. Answer questions about products, categories, and policies
        3. Provide product recommendations based on customer interests
        4. Help with order and cart management
        5. Assist with account and payment questions

        Available categories: Electronics, Clothing, Home, Sports, and Books.

        Be friendly, concise, and helpful. Keep responses under 300 words. If you need to recommend products, describe them clearly.
        When suggesting products, mention relevant categories and price ranges when possible.
        Always prioritize customer satisfaction and provide accurate information.`
  }

  /**
   * Clear conversation history
   */
  clearHistory(): void {
    this.conversationHistory = []
  }

  /**
   * Get conversation history
   */
  getHistory(): Message[] {
    return this.conversationHistory
  }

  /**
   * Extract suggested follow-up questions from response
   */
  private extractSuggestions(message: string): string[] {
    const suggestions: string[] = []

    // Extract numbered list items as suggestions
    const numberedPattern = /^\d+\.\s+(.+?)$/gm
    const matches = message.matchAll(numberedPattern)

    for (const match of matches) {
      const suggestion = match[1]?.trim()
      if (suggestion && suggestion.length < 100) {
        suggestions.push(suggestion)
      }
    }

    return suggestions.slice(0, 3) // Return max 3 suggestions
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }
}

export default AIService
