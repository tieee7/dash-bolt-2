import { create } from 'zustand';
import { supabase } from '../supabase';
import { Database } from '../database.types';
import { toast } from 'react-hot-toast';

type Conversation = Database['public']['Tables']['conversations']['Row'];
type Message = Database['public']['Tables']['messages']['Row'];
type Tag = Database['public']['Tables']['tags']['Row'];

interface ConversationStore {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  messages: Message[];
  tags: Tag[];
  isLoading: boolean;
  error: string | null;
  fetchConversations: () => Promise<void>;
  fetchMessages: (conversationId: string) => Promise<void>;
  fetchTags: () => Promise<void>;
  sendMessage: (content: string, conversationId: string) => Promise<void>;
  createConversation: (title?: string) => Promise<string>;
  updateConversation: (id: string, updates: Partial<Conversation>) => Promise<void>;
  addTag: (conversationId: string, tagId: string) => Promise<void>;
  removeTag: (conversationId: string, tagId: string) => Promise<void>;
}

export const useConversationStore = create<ConversationStore>((set, get) => ({
  conversations: [],
  currentConversation: null,
  messages: [],
  tags: [],
  isLoading: false,
  error: null,

  fetchConversations: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .order('last_message_at', { ascending: false });

      if (error) throw error;
      set({ conversations: data || [] });
    } catch (error: any) {
      set({ error: error.message });
      toast.error('Failed to fetch conversations');
    } finally {
      set({ isLoading: false });
    }
  },

  fetchMessages: async (conversationId: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      set({ messages: data || [] });
    } catch (error: any) {
      set({ error: error.message });
      toast.error('Failed to fetch messages');
    } finally {
      set({ isLoading: false });
    }
  },

  fetchTags: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('tags')
        .select('*')
        .order('name');

      if (error) throw error;
      set({ tags: data || [] });
    } catch (error: any) {
      set({ error: error.message });
      toast.error('Failed to fetch tags');
    } finally {
      set({ isLoading: false });
    }
  },

  sendMessage: async (content: string, conversationId: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Insert user message
      const { error: messageError } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          content,
          sender_type: 'user',
          user_id: user.id
        });

      if (messageError) throw messageError;

      // Update conversation last_message_at
      const { error: updateError } = await supabase
        .from('conversations')
        .update({ last_message_at: new Date().toISOString() })
        .eq('id', conversationId);

      if (updateError) throw updateError;

      // Refresh messages
      await get().fetchMessages(conversationId);
    } catch (error: any) {
      set({ error: error.message });
      toast.error('Failed to send message');
    } finally {
      set({ isLoading: false });
    }
  },

  createConversation: async (title?: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('conversations')
        .insert({
          title,
          user_id: user.id,
          last_message_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      if (!data) throw new Error('Failed to create conversation');

      await get().fetchConversations();
      return data.id;
    } catch (error: any) {
      set({ error: error.message });
      toast.error('Failed to create conversation');
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateConversation: async (id: string, updates: Partial<Conversation>) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('conversations')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      await get().fetchConversations();
    } catch (error: any) {
      set({ error: error.message });
      toast.error('Failed to update conversation');
    } finally {
      set({ isLoading: false });
    }
  },

  addTag: async (conversationId: string, tagId: string) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('conversation_tags')
        .insert({ conversation_id: conversationId, tag_id: tagId });

      if (error) throw error;
      toast.success('Tag added successfully');
    } catch (error: any) {
      set({ error: error.message });
      toast.error('Failed to add tag');
    } finally {
      set({ isLoading: false });
    }
  },

  removeTag: async (conversationId: string, tagId: string) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('conversation_tags')
        .delete()
        .eq('conversation_id', conversationId)
        .eq('tag_id', tagId);

      if (error) throw error;
      toast.success('Tag removed successfully');
    } catch (error: any) {
      set({ error: error.message });
      toast.error('Failed to remove tag');
    } finally {
      set({ isLoading: false });
    }
  },
}));