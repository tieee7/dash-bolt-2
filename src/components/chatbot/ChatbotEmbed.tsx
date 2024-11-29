import React, { useEffect, useRef } from 'react';
import { useAuthStore } from '../../store/authStore';

interface ChatbotEmbedProps {
  config: {
    primary_color: string;
    secondary_color: string;
    name: string;
    welcome_message: string;
    position: 'left' | 'right';
  };
}

export default function ChatbotEmbed({ config }: ChatbotEmbedProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { user } = useAuthStore();

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (!iframeRef.current || event.source !== iframeRef.current.contentWindow) {
        return;
      }

      // Handle incoming messages from the iframe
      switch (event.data.type) {
        case 'ready':
          // Send configuration to the iframe
          iframeRef.current.contentWindow?.postMessage({
            type: 'config',
            config: {
              ...config,
              userId: user?.id
            }
          }, '*');
          break;
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [config, user]);

  return (
    <iframe
      ref={iframeRef}
      src="/chatbot-embed.html"
      style={{
        border: 'none',
        width: '100%',
        height: '600px',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}
      title="Chatbot Embed"
      sandbox="allow-scripts allow-same-origin allow-forms"
    />
  );
}