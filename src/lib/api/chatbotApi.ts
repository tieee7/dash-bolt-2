import { supabase } from '../supabase';
import { ChatbotConfig, DomainVerification } from '../types/chatbot';

export async function fetchChatbotConfig(userId: string): Promise<ChatbotConfig> {
  const { data, error } = await supabase
    .from('chatbot_configs')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) throw error;
  return data;
}

export async function updateChatbotSettings(userId: string, config: Partial<ChatbotConfig>) {
  const { error } = await supabase
    .from('chatbot_configs')
    .upsert({
      user_id: userId,
      ...config,
      updated_at: new Date().toISOString()
    });

  if (error) throw error;
}

export async function verifyDomain(userId: string, domain: string): Promise<DomainVerification> {
  const { data, error } = await supabase
    .from('domain_verifications')
    .select('*')
    .eq('user_id', userId)
    .eq('domain', domain)
    .single();

  if (error) throw error;
  return data;
}

export async function generateChatbotToken(userId: string): Promise<string> {
  const { data, error } = await supabase.rpc('generate_chatbot_token', {
    user_id: userId
  });

  if (error) throw error;
  return data;
}