<script setup lang="ts">
import { ref, nextTick, onMounted } from 'vue'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import ProgressSpinner from 'primevue/progressspinner'
import AIService, { type Message } from '@/services/ai.service'
import { ToastHelper } from '@/helpers/toast.helper'

const isOpen = ref(false)
const inputMessage = ref('')
const isLoading = ref(false)
const messages = ref<Message[]>([])
const messagesContainer = ref<HTMLElement | null>(null)
const aiService = ref<AIService | null>(null)
const suggestions = ref<string[]>([])

const initializeAI = () => {
  aiService.value = new AIService()
  return true
}

const sendMessage = async () => {
  if (!inputMessage.value.trim() || !aiService.value) return

  const userMessage = inputMessage.value.trim()
  inputMessage.value = ''

  // Add user message to display
  messages.value.push({
    id: Date.now().toString(),
    role: 'user',
    content: userMessage,
    timestamp: new Date(),
  })

  isLoading.value = true

  try {
    const response = await aiService.value.sendMessage(userMessage)
    messages.value.push({
      id: Date.now().toString(),
      role: 'assistant',
      content: response.message,
      timestamp: new Date(),
    })
    suggestions.value = response.suggestions || []
  } catch (error) {
    ToastHelper.showError(error instanceof Error ? error.message : 'Failed to get response from AI')
  } finally {
    isLoading.value = false
    await nextTick()
    scrollToBottom()
  }
}

/**
 * Send suggested question
 */
const sendSuggestion = async (suggestion: string) => {
  inputMessage.value = suggestion
  await nextTick()
  await sendMessage()
}

/**
 * Clear conversation
 */
const clearChat = () => {
  messages.value = []
  suggestions.value = []
  if (aiService.value) {
    aiService.value.clearHistory()
  }
}

/**
 * Toggle chat widget
 */
const toggleChat = () => {
  isOpen.value = !isOpen.value
  if (isOpen.value && !aiService.value) {
    initializeAI()
  }
}

/**
 * Scroll to bottom of messages
 */
const scrollToBottom = () => {
  if (messagesContainer.value) {
    setTimeout(() => {
      if (messagesContainer.value) {
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
      }
    }, 0)
  }
}

onMounted(() => {
  if (isOpen.value) {
    initializeAI()
  }
})
</script>

<template>
  <div class="chat-widget fixed bottom-6 right-6 z-40 font-sans">
    <!-- Chat Bubble Button -->
    <Button
      v-if="!isOpen"
      icon="pi pi-comment"
      rounded
      severity="success"
      size="large"
      class="w-16 h-16 shadow-lg hover:shadow-xl transition-shadow"
      @click="toggleChat"
      v-tooltip.left="'AI Shopping Assistant'"
    />

    <!-- Chat Panel -->
    <div
      v-if="isOpen"
      class="chat-panel bg-white rounded-lg shadow-2xl overflow-hidden flex flex-col w-80 h-120 animate-in fade-in slide-in-from-bottom-4"
    >
      <!-- Header -->
      <div class="bg-green-600 text-white px-6 py-4 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <i class="pi pi-fw pi-sparkles text-xl"></i>
          <h3 class="text-lg font-semibold">Shopping Assistant</h3>
        </div>
        <div class="flex items-center gap-2">
          <Button
            icon="pi pi-trash"
            class="text-white"
            rounded
            text
            size="small"
            @click="clearChat"
            v-tooltip="'Clear conversation'"
          />
          <Button icon="pi pi-times" rounded text size="small" @click="toggleChat" />
        </div>
      </div>

      <!-- Messages Container -->
      <div ref="messagesContainer" class="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        <!-- Welcome Message -->
        <div
          v-if="messages.length === 0"
          class="flex flex-col items-center justify-center h-full text-center text-gray-500 py-8"
        >
          <i class="pi pi-fw pi-comments text-4xl mb-3 text-blue-400"></i>
          <p class="font-medium">Welcome to Shopping Assistant!</p>
          <p class="text-sm mt-2">Ask me anything about products, categories, or shopping tips.</p>
        </div>

        <!-- Messages List -->
        <div v-for="message in messages" :key="message.id" class="flex gap-3">
          <!-- User Message -->
          <div v-if="message.role === 'user'" class="flex justify-end w-full">
            <div
              class="bg-blue-600 text-white rounded-lg rounded-tr-none px-4 py-2 max-w-xs text-sm shadow-sm"
            >
              {{ message.content }}
            </div>
          </div>

          <!-- Assistant Message -->
          <div v-else class="flex justify-start w-full">
            <div
              class="bg-gray-200 text-gray-900 rounded-lg rounded-tl-none px-4 py-2 max-w-xs text-sm shadow-sm whitespace-pre-wrap"
            >
              {{ message.content }}
            </div>
          </div>
        </div>

        <!-- Loading Indicator -->
        <div v-if="isLoading" class="flex justify-start">
          <div class="flex items-center gap-2 bg-gray-200 rounded-lg px-4 py-3">
            <ProgressSpinner
              :style="{ width: '20px', height: '20px' }"
              stroke-width="3"
              class="opacity-70"
            />
            <span class="text-gray-600 text-sm">AI is thinking...</span>
          </div>
        </div>
      </div>

      <!-- Suggestions -->
      <div
        v-if="suggestions.length > 0 && !isLoading"
        class="px-4 py-2 border-t border-gray-200 bg-white"
      >
        <p class="text-xs text-gray-500 font-semibold mb-2">Suggestions:</p>
        <div class="flex flex-col gap-2">
          <Button
            v-for="(suggestion, index) in suggestions"
            :key="index"
            :label="suggestion"
            severity="secondary"
            text
            size="small"
            class="justify-start text-xs h-auto py-2 px-2 text-left normal-case"
            @click="sendSuggestion(suggestion)"
          />
        </div>
      </div>

      <!-- Input Area -->
      <div class="px-4 py-3 border-t border-gray-200 bg-white">
        <div class="flex gap-2">
          <InputText
            v-model="inputMessage"
            placeholder="Ask me anything..."
            class="flex-1 text-sm"
            :disabled="isLoading"
            @keyup.enter="sendMessage"
          />
          <Button
            icon="pi pi-send"
            rounded
            :loading="isLoading"
            :disabled="!inputMessage.trim() || isLoading"
            @click="sendMessage"
            size="small"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.chat-widget {
  font-family:
    system-ui,
    -apple-system,
    sans-serif;
}

.chat-panel {
  backdrop-filter: blur(10px);
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

:deep(.p-inputtext) {
  font-size: 0.875rem;
}

:deep(.p-button-sm) {
  padding: 0.5rem 1rem;
}
</style>
