-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Chatbot configurations table
CREATE TABLE public.chatbot_configs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(255) NOT NULL,
    primary_color VARCHAR(7) NOT NULL,
    secondary_color VARCHAR(7) NOT NULL,
    avatar_url TEXT,
    welcome_message TEXT NOT NULL,
    position VARCHAR(10) CHECK (position IN ('left', 'right')) NOT NULL,
    custom_css TEXT,
    operating_hours JSONB NOT NULL DEFAULT '[]',
    response_delay INTEGER NOT NULL DEFAULT 1000,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(user_id)
);

-- Domain verification table
CREATE TABLE public.domain_verifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    domain VARCHAR(255) NOT NULL,
    verification_token UUID DEFAULT uuid_generate_v4() NOT NULL,
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(domain, user_id)
);

-- Rate limiting table
CREATE TABLE public.rate_limits (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    domain VARCHAR(255) NOT NULL,
    requests_count INTEGER DEFAULT 0 NOT NULL,
    window_start TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(domain)
);

-- Function to generate chatbot token
CREATE OR REPLACE FUNCTION public.generate_chatbot_token(user_id UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    token TEXT;
BEGIN
    token := encode(gen_random_bytes(32), 'base64');
    RETURN token;
END;
$$;

-- Policies
ALTER TABLE public.chatbot_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.domain_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- Chatbot configs policies
CREATE POLICY "Users can view their own chatbot config"
    ON public.chatbot_configs FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own chatbot config"
    ON public.chatbot_configs FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own chatbot config"
    ON public.chatbot_configs FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Domain verification policies
CREATE POLICY "Users can view their own domain verifications"
    ON public.domain_verifications FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own domain verifications"
    ON public.domain_verifications FOR ALL
    USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_chatbot_configs_user_id ON public.chatbot_configs(user_id);
CREATE INDEX idx_domain_verifications_user_id ON public.domain_verifications(user_id);
CREATE INDEX idx_domain_verifications_domain ON public.domain_verifications(domain);
CREATE INDEX idx_rate_limits_domain ON public.rate_limits(domain);