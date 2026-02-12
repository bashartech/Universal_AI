import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChatWidget } from '../components/ChatWidget/ChatWidget';
import '../index.css';

// Widget initialization function
interface WidgetConfig {
  widgetId?: string;
  position?: 'bottom-right' | 'bottom-left';
  theme?: {
    primaryColor?: string;
  };
}

class UniversalChatbot {
  private root: ReactDOM.Root | null = null;
  private container: HTMLDivElement | null = null;

  init(config?: WidgetConfig) {
    // Create container if it doesn't exist
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.id = 'universal-chatbot-root';
      this.container.style.position = 'fixed';
      this.container.style.zIndex = '9999';
      document.body.appendChild(this.container);
    }

    // Mount React app
    if (!this.root) {
      this.root = ReactDOM.createRoot(this.container);
      this.root.render(
        <React.StrictMode>
          <ChatWidget />
        </React.StrictMode>
      );
    }

    console.log('Universal Chatbot initialized', config);
  }

  open() {
    // Trigger chat open via custom event
    window.dispatchEvent(new CustomEvent('chatbot:open'));
  }

  close() {
    // Trigger chat close via custom event
    window.dispatchEvent(new CustomEvent('chatbot:close'));
  }

  destroy() {
    if (this.root) {
      this.root.unmount();
      this.root = null;
    }
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
      this.container = null;
    }
  }
}

// Create global instance
const chatbotInstance = new UniversalChatbot();

// Auto-initialize on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    chatbotInstance.init();
  });
} else {
  chatbotInstance.init();
}

// Expose to window
declare global {
  interface Window {
    UniversalChatbot: UniversalChatbot;
  }
}

window.UniversalChatbot = chatbotInstance;

export default chatbotInstance;
