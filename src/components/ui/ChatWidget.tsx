import React, { useState, createContext, useContext } from 'react';
import { X, MessageSquare } from 'lucide-react';

interface ChatContextType {
  openChat: () => void;
}

const ChatContext = createContext<ChatContextType>({ openChat: () => {} });

export const useChatWidget = () => useContext(ChatContext);

let globalChatOpener: (() => void) | null = null;

// Simple function to trigger chat from anywhere
export const triggerChatOpen = () => {
  if (globalChatOpener) {
    globalChatOpener();
  }
};

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const openChat = () => {
    setIsOpen(true);
  };

  // Set the global reference
  React.useEffect(() => {
    globalChatOpener = openChat;
    return () => {
      globalChatOpener = null;
    };
  }, []);

  return (
    <ChatContext.Provider value={{ openChat }}>
      <div className="fixed bottom-0 right-0 z-50">
        <button
          onClick={toggleChat}
          aria-label="Toggle Chat"
          className={`fixed sm:bottom-4 bottom-32 right-4 w-[60px] h-[60px] bg-[#003366] rounded-full cursor-pointer flex justify-center items-center shadow-lg z-[1000] transition-all duration-300 hover:bg-[#004480] ${isOpen ? 'rotate-180' : ''}`}
        >
          {isOpen ? (
            <X className="w-7 h-7 text-white" />
          ) : (
            <MessageSquare className="w-7 h-7 text-white" />
          )}
        </button>

        <div
          className={`fixed sm:bottom-20 sm:right-4 sm:w-[400px] sm:h-[600px] sm:rounded-lg shadow-2xl bg-white overflow-hidden transition-all duration-300 z-[999] ${
            isOpen
              ? 'top-0 left-0 right-0 bottom-0 sm:top-auto sm:left-auto transform scale-100 opacity-100'
              : 'transform scale-80 opacity-0 pointer-events-none'
          }`}
        >
          <iframe
            src="/chat-widget.html"
            title="Chatbot"
            className="w-full h-full border-none"
            style={{
              height: '100%',
              width: '100%',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0
            }}
          />
        </div>
      </div>
    </ChatContext.Provider>
  );
};

export default ChatWidget;