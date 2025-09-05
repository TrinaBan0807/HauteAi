import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface ChatbotGreetingProps {
  onClose?: () => void;
  onUserResponse?: (response: string) => void;
}

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

const greetingMessages = [
  "👋 Welcome to our Interactive Fashion Experience!",
  "I'm your AI fashion assistant. How can I help you today?",
  "You can explore different sections by clicking on the video points or ask me anything!"
];

const responses: Record<string, string[]> = {
  greeting: [
    "Hello! I'm excited to help you discover amazing fashion finds! 👗",
    "Hi there! Ready to explore some incredible style options? ✨"
  ],
  help: [
    "I can help you navigate through different sections, find similar items, or describe fashion pieces! What interests you most?",
    "Feel free to click on the interactive points in the video or ask me about fashion recommendations!"
  ],
  default: [
    "That's interesting! Try clicking on the interactive video points to explore different features.",
    "Great question! The video above shows all our amazing features - give them a try!",
    "I'd love to help you more! Check out the navigation sections in the video."
  ]
};

export const ChatbotGreeting = ({ onClose, onUserResponse }: ChatbotGreetingProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-greet user when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true);
      startGreetingSequence();
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const startGreetingSequence = async () => {
    setIsTyping(true);
    
    for (let i = 0; i < greetingMessages.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newMessage: Message = {
        id: `bot-${Date.now()}-${i}`,
        text: greetingMessages[i],
        isBot: true,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, newMessage]);
      setCurrentMessageIndex(i + 1);
      
      if (i < greetingMessages.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
    
    setIsTyping(false);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return responses.greeting[Math.floor(Math.random() * responses.greeting.length)];
    }
    
    if (lowerMessage.includes('help') || lowerMessage.includes('how') || lowerMessage.includes('what')) {
      return responses.help[Math.floor(Math.random() * responses.help.length)];
    }
    
    return responses.default[Math.floor(Math.random() * responses.default.length)];
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: inputValue.trim(),
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    onUserResponse?.(inputValue.trim());
    setInputValue('');
    setIsTyping(true);

    // Simulate typing delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const botMessage: Message = {
      id: `bot-${Date.now()}`,
      text: getResponse(userMessage.text),
      isBot: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, botMessage]);
    setIsTyping(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    onClose?.();
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-saks-gold to-saks-gold-light hover:from-saks-gold-dark hover:to-saks-gold shadow-luxury hover:shadow-gold transition-all duration-300 z-50 bounce-in"
        size="icon"
      >
        <Bot className="w-6 h-6 text-saks-black animate-wiggle" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-6 right-6 w-80 h-96 shadow-luxury bg-white/95 backdrop-blur-lg border-0 flex flex-col z-50 slide-in-bottom">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border/50 bg-gradient-to-r from-saks-gold/10 to-saks-gold-light/10">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-saks-gold to-saks-gold-light flex items-center justify-center">
            <Bot className="w-4 h-4 text-saks-black" />
          </div>
          <div>
            <h3 className="font-medium text-sm">Fashion Assistant</h3>
            <p className="text-xs text-muted-foreground">Online now</p>
          </div>
        </div>
        <Button
          onClick={handleClose}
          variant="ghost"
          size="icon"
          className="w-8 h-8 hover:bg-destructive/10 hover:text-destructive"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg text-sm ${
                message.isBot
                  ? 'bg-gradient-to-r from-saks-gold/20 to-saks-gold-light/20 text-saks-black border border-saks-gold/30'
                  : 'bg-gradient-to-r from-saks-black to-saks-gray-dark text-saks-white'
              } fade-in-scale`}
            >
              {message.text}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gradient-to-r from-saks-gold/20 to-saks-gold-light/20 text-saks-black border border-saks-gold/30 p-3 rounded-lg">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-saks-gold rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-saks-gold rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-saks-gold rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border/50 bg-saks-gray-light/50">
        <div className="flex space-x-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything..."
            className="flex-1 text-sm border-saks-gold/30 focus:border-saks-gold focus:ring-saks-gold/30"
            disabled={isTyping}
          />
          <Button
            onClick={handleSendMessage}
            size="icon"
            className="w-9 h-9 bg-gradient-to-r from-saks-gold to-saks-gold-light hover:from-saks-gold-dark hover:to-saks-gold text-saks-black"
            disabled={isTyping || !inputValue.trim()}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};