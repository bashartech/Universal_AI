import React, { useEffect, useRef } from 'react';
import { Message } from '../../types/chat.types';
import { ChatBubble } from './ChatBubble';
import { TypingIndicator } from '../shared/Loader';

interface MessageListProps {
  messages: Message[];
  isTyping: boolean;
}

export const MessageList: React.FC<MessageListProps> = ({ messages, isTyping }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2 bg-slate-900">
      {messages.map((message) => (
        <ChatBubble key={message.id} message={message} />
      ))}
      {isTyping && (
        <div className="flex justify-start">
          <div className="bg-slate-800 border border-purple-500/20 rounded-2xl rounded-bl-sm">
            <TypingIndicator />
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};
