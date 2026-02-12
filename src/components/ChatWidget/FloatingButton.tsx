import React from 'react';
import { configService } from '../../services/configService';

interface FloatingButtonProps {
  onClick: () => void;
  unreadCount?: number;
}

export const FloatingButton: React.FC<FloatingButtonProps> = ({ onClick, unreadCount = 0 }) => {
  const theme = configService.getTheme();
  const position = theme.position === 'bottom-left' ? 'left-6' : 'right-6';

  return (
    <button
      onClick={onClick}
      className={`fixed bottom-6 ${position} w-9 h-9 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-full shadow-2xl hover:from-purple-700 hover:to-purple-800 transition-all duration-200 hover:scale-110 z-50 border border-purple-500/50`}
      aria-label="Open chat"
    >
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center border-2 border-slate-900">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 mx-auto"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
        />
      </svg>
    </button>
  );
};
