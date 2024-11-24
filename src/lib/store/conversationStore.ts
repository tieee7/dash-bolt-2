import { create } from 'zustand';
import { supabase } from '../supabase';
import { Database } from '../database.types';
import { toast } from 'react-hot-toast';

type Conversation = Database['public']['Tables']['conversations']['Row'];
type Message = Database['public']['Tables']['messages']['Row'];
type Tag = Database['public']['Tables']['tags']['Row'];
type ConversationTag = Database['public']['Tables']['conversation_tags']['Row'];

interface ConversationStore {
  conversations: (Conversation & { tags?: Tag[] })[];
  currentConversation: (Conversation & { tags?: Tag[] }) | null;
  messages: Message[];
  tags: Tag[];
  selectedTags: string[];
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
  setSelectedTags: (tags: string[]) => void;
  fetchConversationTags: (conversationId: string) => Promise<Tag[]>;
  createTag: (name: string, color: string) => Promise<void>;
  deleteTag: (id: string) => Promise<void>;
  sortOrder: 'newest' | 'oldest';
  setSortOrder: (order: 'newest' | 'oldest') => void;
  activeFilter: 'active' | 'all' | 'urgent' | 'closed';
  setActiveFilter: (filter: 'active' | 'all' | 'urgent' | 'closed') => void;
}

export const useConversationStore = create<ConversationStore>((set, get) => ({
  conversations: [],
  currentConversation: null,
  messages: [],
  tags: [],
  selectedTags: [],
  isLoading: false,
  error: null,
  sortOrder: 'newest',
  activeFilter: 'active' as 'active' | 'all' | 'urgent' | 'closed',

  setSelectedTags: (tags: string[]) => {
    set({ selectedTags: tags });
  },

  fetchConversations: async () => {
    set({ isLoading: true, error: null });
    try {
      const { selectedTags, sortOrder } = get();
      let query = supabase
        .from('conversations')
        .select(`
          *,
          conversation_tags!left (
            tags (
              id,
              name,
              color
            )
          )
        `)
        .eq('status', 'active')
        .order('last_message_at', { ascending: sortOrder === 'oldest' });

      switch (get().activeFilter) {
        case 'active':
          query = query.eq('is_starred', false);
          break;
        case 'closed':
          query = query.eq('is_starred', true);
          break;
      }

      if (selectedTags.length > 0) {
        const { data, error } = await query;
        if (error) throw error;

        const filteredConversations = data.filter(conv => {
          const convTags = conv.conversation_tags
            .map((ct: any) => ct.tags)
            .filter((tag: Tag | null): tag is Tag => tag !== null);
          return selectedTags.every(tagId => 
            convTags.some(tag => tag.id === tagId)
          );
        });

        set({ 
          conversations: filteredConversations.map(conv => ({
            ...conv,
            tags: conv.conversation_tags
              .map((ct: any) => ct.tags)
              .filter((tag: Tag | null): tag is Tag => tag !== null)
          }))
        });
      } else {
        const { data, error } = await query;
        if (error) throw error;

        set({
          conversations: (data || []).map(conv => ({
            ...conv,
            tags: conv.conversation_tags
              .map((ct: any) => ct.tags)
              .filter((tag: Tag | null): tag is Tag => tag !== null)
          }))
        });
      }
    } catch (error: any) {
      set({ error: error.message });
      toast.error('Failed to fetch conversations');
    } finally {
      set({ isLoading: false });
    }
  },

  fetchConversationTags: async (conversationId: string) => {
    try {
      const { data, error } = await supabase
        .from('conversation_tags')
        .select(`
          tags (
            id,
            name,
            color
          )
        `)
        .eq('conversation_id', conversationId);

      if (error) throw error;

      return data
        ?.map(item => item.tags)
        .filter((tag): tag is Tag => tag !== null) || [];
    } catch (error: any) {
      console.error('Error fetching conversation tags:', error);
      return [];
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

  fetchMessages: async (conversationId: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data: messages, error: messagesError } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (messagesError) throw messagesError;

      const { data: conversation, error: conversationError } = await supabase
        .from('conversations')
        .select('*')
        .eq('id', conversationId)
        .single();

      if (conversationError) throw conversationError;

      const tags = await get().fetchConversationTags(conversationId);

      set({ 
        messages: messages || [],
        currentConversation: conversation ? { ...conversation, tags } : null
      });
    } catch (error: any) {
      set({ error: error.message });
      toast.error('Failed to fetch messages');
    } finally {
      set({ isLoading: false });
    }
  },

  sendMessage: async (content: string, conversationId: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error: messageError } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          content,
          sender_type: 'user',
          user_id: user.id
        });

      if (messageError) throw messageError;

      const { error: updateError } = await supabase
        .from('conversations')
        .update({ last_message_at: new Date().toISOString() })
        .eq('id', conversationId);

      if (updateError) throw updateError;

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
      
      await get().fetchMessages(conversationId);
      await get().fetchConversations();
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
      
      await get().fetchMessages(conversationId);
      await get().fetchConversations();
    } catch (error: any) {
      set({ error: error.message });
      toast.error('Failed to remove tag');
    } finally {
      set({ isLoading: false });
    }
  },

  createTag: async (name: string, color: string) => {
    set({ isLoading: true, error: null });
    try {
      console.log('Attempting to create tag:', { name, color });

      // Check if user is authenticated
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Create the tag
      const { data, error } = await supabase
        .from('tags')
        .insert([{ name, color }])
        .select()
        .single();

      if (error) {
        console.error('Error creating tag:', error);
        throw error;
      }

      console.log('Created tag:', data);

      // Refresh the tags list
      await get().fetchTags();
      toast.success('Tag created successfully');
    } catch (error: any) {
      console.error('Create tag error:', error);
      set({ error: error.message });
      toast.error('Failed to create tag: ' + error.message);
    } finally {
      set({ isLoading: false });
    }
  },

  deleteTag: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      console.log('Attempting to delete tag:', id);

      // First, let's check if the tag exists
      const { data: tagCheck } = await supabase
        .from('tags')
        .select('*')
        .eq('id', id)
        .single();

      console.log('Tag to delete:', tagCheck);

      // Delete from tags table first
      const { data: deleteResult, error: tagError } = await supabase
        .from('tags')
        .delete()
        .eq('id', id)
        .select();

      if (tagError) {
        console.error('Error deleting tag:', tagError);
        throw tagError;
      }

      console.log('Delete result:', deleteResult);

      // Refresh the tags list
      await get().fetchTags();
      await get().fetchConversations();
      
      toast.success('Tag deleted successfully');
    } catch (error: any) {
      console.error('Delete tag error:', error);
      set({ error: error.message });
      toast.error('Failed to delete tag: ' + error.message);
    } finally {
      set({ isLoading: false });
    }
  },

  setSortOrder: (order: 'newest' | 'oldest') => {
    set({ sortOrder: order });
    get().fetchConversations();
  },

  setActiveFilter: (filter: 'active' | 'all' | 'urgent' | 'closed') => {
    set({ activeFilter: filter });
    get().fetchConversations();
  },
}));