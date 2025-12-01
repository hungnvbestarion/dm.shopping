# Shop AI Assistant - ChatWidget

A smart shopping assistant chatbot powered by Google Gemini AI.

## Features

- **AI-Powered Conversations**: Uses Google Gemini 2.5 Flash for intelligent responses
- **Shopping Assistant**: Specialized in helping with:
  - Product recommendations
  - Category browsing
  - Shopping queries
  - Account and payment questions
  - Order management assistance
- **Smart Suggestions**: Auto-generated follow-up question suggestions
- **Conversation Memory**: Maintains conversation context for better responses
- **Smooth UI**: Beautiful chat interface with animations and real-time updates
- **Error Handling**: Graceful error messages and API key validation
- **Responsive Design**: Works on all screen sizes

## Setup Instructions

### 1. Get Google Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Select or create a Google Cloud project
5. Copy the generated API key

### 2. Add API Key to Environment

Update `.env` file in the project root:

```env
VITE_API_MODE = mock
VITE_BASE_API_URL = https://api.escuelajs.co/api/v1
VITE_GEMINI_API_KEY = YOUR_API_KEY_HERE
```

Replace `YOUR_API_KEY_HERE` with your actual Google Gemini API key.

### 3. Restart Development Server

```bash
npm run dev
```

The ChatWidget will appear as a blue chat bubble in the bottom-right corner of your application.

## Usage

### For Users

1. Click the blue chat bubble in the bottom-right corner
2. Type your question or use the suggested questions
3. The AI assistant will respond with helpful information
4. Click the trash icon to clear the conversation
5. Click the X button to close the chat panel

### For Developers

#### Importing ChatWidget

The ChatWidget is already integrated in `App.vue`. To use it in other components:

```vue
<script setup lang="ts">
import ChatWidget from '@/components/ChatWidget.vue'
</script>

<template>
  <ChatWidget />
</template>
```

#### Using AIService Directly

```typescript
import AIService from '@/services/ai.service'

const aiService = new AIService('sk-ant-YOUR_API_KEY')
const response = await aiService.sendMessage('Tell me about electronics')
console.log(response.message)
console.log(response.suggestions)
```

#### API Response Format

```typescript
interface ChatResponse {
  message: string // The AI's response
  suggestions?: string[] // Suggested follow-up questions (max 3)
}
```

## Component Structure

### ChatWidget.vue

- Main component for the chat interface
- Handles user interactions and message display
- Manages AI service initialization
- Features include:
  - Collapsible chat panel
  - Message display with user/assistant differentiation
  - Loading indicator
  - Suggestion buttons
  - Clear conversation option

### ai.service.ts

- Handles communication with Claude API
- Maintains conversation history
- Extracts suggestions from responses
- Error handling and API key validation
- Shopping assistant system prompt

## Features Breakdown

### Smart Suggestions

The AI automatically extracts numbered list items from responses to generate follow-up suggestions. These appear as clickable buttons for quick navigation.

### Conversation Memory

The service maintains full conversation history, allowing Claude to understand context across multiple exchanges.

### System Prompt

The AI is configured with a specialized shopping assistant system prompt that:

- Understands the store's product categories
- Provides product recommendations
- Answers e-commerce related questions
- Maintains a friendly tone
- Keeps responses concise (under 300 words)

## Troubleshooting

### Chat Widget Not Showing

1. Check that ChatWidget is imported in App.vue
2. Verify z-index is high enough (default is `z-40`)
3. Clear browser cache and reload

### "API Key not configured" Warning

1. Make sure `VITE_AI_API_KEY` is set in `.env`
2. Restart the development server after updating `.env`
3. The key should start with `sk-ant-`

### No Response from AI

1. Verify your Claude API key is valid
2. Check that your API key has sufficient credits
3. Check browser console for detailed error messages
4. Ensure you're using a valid model name

### Slow Responses

- Claude API responses may take 2-5 seconds depending on query complexity
- Loading indicator will show while waiting for response
- Longer conversations may take slightly longer

## Customization

### Change AI Model

Edit `src/services/ai.service.ts`:

```typescript
model: 'claude-3-5-sonnet-20241022', // Change this line
```

Available models:

- `claude-3-opus-20250219`
- `claude-3-sonnet-20240229`
- `claude-3-haiku-20240307`

### Customize System Prompt

Edit the `getSystemPrompt()` method in `ai.service.ts` to change the assistant's personality and knowledge base.

### Adjust UI Colors

The ChatWidget uses Tailwind CSS classes. Key classes:

- `bg-gradient-to-r from-blue-600 to-blue-700` - Header gradient
- `bg-blue-600` - User message background
- `bg-gray-200` - Assistant message background

## Security Notes

⚠️ **Important**: Never commit your API key to version control.

- Add `.env.local` to `.gitignore` if you haven't already
- Use different API keys for development and production
- Set appropriate rate limits on your API key in Anthropic's console
- Monitor API usage to prevent unexpected charges

## API Costs

Claude API calls are billed per token. For the default configuration:

- Input tokens: $0.003 per 1K tokens
- Output tokens: $0.015 per 1K tokens

The shopping assistant system prompt is approximately 200 tokens, which is sent with each request.

## Browser Compatibility

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Mobile browsers: ✅ Full support (responsive design)

## Future Enhancements

Potential improvements:

- Integration with real product database
- User authentication for personalized recommendations
- Chat history persistence
- Multiple language support
- Voice input/output
- Integration with order tracking
- Real-time inventory checks
