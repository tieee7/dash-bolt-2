import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  profile: any | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, username: string) => Promise<void>;
  signOut: () => Promise<void>;
  fetchProfile: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  profile: null,
  isLoading: true,

  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    set({ user: data.user });
  },

  signUp: async (email: string, password: string, username: string) => {
    // Sign up the user
    const { error: signUpError, data } = await supabase.auth.signUp({
      email,
      password,
    });
  
    if (signUpError) throw signUpError;
  
    if (data.user) {
      // Insert profile with email and username into profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([{ id: data.user.id, username, email }]);  // Add email here
  
      if (profileError) throw profileError;
      set({ user: data.user });
    }
  },
  

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    set({ user: null, profile: null });
  },

  fetchProfile: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        set({ user, profile, isLoading: false });
      } else {
        set({ user: null, profile: null, isLoading: false });
      }
    } catch (error) {
      set({ user: null, profile: null, isLoading: false });
      throw error;
    }
  },
}));