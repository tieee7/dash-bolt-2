import React from 'react';
import { createRoot } from 'react-dom/client';
import ChatbotWidget from './ChatbotWidget';
import '../index.css';

function initializeChatbot() {
  // Create container for widget
  const container = document.createElement('div');
  container.id = 'chatbot-widget-root';
  document.body.appendChild(container);

  // Get configuration from the window object
  const config = (window as any).CHATBOT_CONFIG || {};

  // Render widget
  const root = createRoot(container);
  root.render(<ChatbotWidget domainId={config.domainId} />);
}

// Initialize when the script loads
initializeChatbot();