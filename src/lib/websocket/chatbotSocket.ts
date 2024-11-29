import { createClient } from '@supabase/supabase-js';
import { ChatbotMessage } from '../types/chatbot';

export class ChatbotSocket {
  private supabase;
  private subscription: any;

  constructor(supabaseUrl: string, supabaseKey: string) {
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async connect(conversationId: string, onMessage: (message: ChatbotMessage) => void) {
    // Subscribe to new messages
    this.subscription = this.supabase
      .channel(`conversation:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`
        },
        (payload) => {
          onMessage(payload.new as ChatbotMessage);
        }
      )
      .subscribe();
  }

  disconnect() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  async sendMessage(message: Omit<ChatbotMessage, 'id' | 'created_at'>) {
    const { error } = await this.supabase
      .from('messages')
      .insert([message]);

    if (error) throw error;
  }
}