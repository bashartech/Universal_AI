import React from 'react';
import { Message } from '../../types/chat.types';
import { format } from 'date-fns';

interface ChatBubbleProps {
  message: Message;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const isUser = message.sender === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-[75%] px-4 py-2 rounded-2xl ${
          isUser
            ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-br-sm shadow-lg'
            : 'bg-slate-800 text-slate-100 rounded-bl-sm border border-purple-500/20'
        }`}
      >
        <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
        <p
          className={`text-xs mt-1 ${
            isUser ? 'text-purple-200' : 'text-slate-400'
          }`}
        >
          {format(new Date(message.timestamp), 'HH:mm')}
        </p>
      </div>
    </div>
  );
};
