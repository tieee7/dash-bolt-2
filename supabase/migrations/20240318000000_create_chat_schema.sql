-- Create updated_at function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create conversations table
CREATE TABLE public.conversations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    title TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'archived', 'deleted')) NOT NULL,
    last_message_at TIMESTAMPTZ,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    is_starred BOOLEAN DEFAULT false NOT NULL,
    is_read BOOLEAN DEFAULT true NOT NULL
);

-- Create messages table
CREATE TABLE public.messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    sender_type TEXT CHECK (sender_type IN ('user', 'bot')) NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL
);

-- Create tags table
CREATE TABLE public.tags (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    color TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create conversation_tags junction table
CREATE TABLE public.conversation_tags (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE NOT NULL,
    tag_id UUID REFERENCES public.tags(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    UNIQUE(conversation_id, tag_id)
);

-- Create indexes
CREATE INDEX idx_conversations_user_id ON public.conversations(user_id);
CREATE INDEX idx_conversations_status ON public.conversations(status);
CREATE INDEX idx_messages_conversation_id ON public.messages(conversation_id);
CREATE INDEX idx_conversation_tags_conversation_id ON public.conversation_tags(conversation_id);
CREATE INDEX idx_conversation_tags_tag_id ON public.conversation_tags(tag_id);

-- Create updated_at triggers
CREATE TRIGGER handle_updated_at
    BEFORE UPDATE ON public.conversations
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Enable RLS on all tables
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_tags ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own conversations"
    ON public.conversations
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own conversations"
    ON public.conversations
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own conversations"
    ON public.conversations
    FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view messages in their conversations"
    ON public.messages
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.conversations
            WHERE conversations.id = messages.conversation_id
            AND conversations.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert messages in their conversations"
    ON public.messages
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.conversations
            WHERE conversations.id = conversation_id
            AND conversations.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can view all tags"
    ON public.tags
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Users can view conversation tags for their conversations"
    ON public.conversation_tags
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.conversations
            WHERE conversations.id = conversation_id
            AND conversations.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can manage tags for their conversations"
    ON public.conversation_tags
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.conversations
            WHERE conversations.id = conversation_id
            AND conversations.user_id = auth.uid()
        )
    );

-- Insert default tags
INSERT INTO public.tags (name, color) VALUES
    ('urgent', '#EF4444'),
    ('follow-up', '#3B82F6'),
    ('resolved', '#10B981'),
    ('pending', '#F59E0B');