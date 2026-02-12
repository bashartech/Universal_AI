import React from 'react';
import { configService } from '../../services/configService';

interface QuickRepliesProps {
  onReplyClick: (reply: string) => void;
}

export const QuickReplies: React.FC<QuickRepliesProps> = ({ onReplyClick }) => {
  const quickReplies = configService.getQuickReplies();

  return (
    <div className="px-4 py-3 border-t border-purple-500/20 bg-slate-800">
      <p className="text-xs text-slate-400 mb-2">Quick replies:</p>
      <div className="flex flex-wrap gap-2">
        {quickReplies.map((reply, index) => (
          <button
            key={index}
            onClick={() => onReplyClick(reply)}
            className="px-3 py-1.5 text-sm bg-slate-900 border border-purple-500/30 text-slate-200 rounded-full hover:bg-purple-600/20 hover:border-purple-500 transition-all duration-200"
          >
            {reply}
          </button>
        ))}
      </div>
    </div>
  );
};
