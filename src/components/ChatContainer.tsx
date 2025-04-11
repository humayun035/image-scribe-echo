
import React, { useState, useRef, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { InfoIcon } from "lucide-react";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import { useToast } from "@/components/ui/use-toast";

interface Message {
  id: string;
  content: string;
  type: "user" | "ai";
  imageUrl?: string;
}

const ChatContainer: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = async (message: string, image?: File) => {
    if (!message.trim() && !image) return;

    // Generate a unique ID for the message
    const messageId = `msg-${Date.now()}`;
    
    // Create image URL for preview if image exists
    let localImageUrl: string | undefined = undefined;
    if (image) {
      localImageUrl = URL.createObjectURL(image);
    }

    // Add user message
    const newUserMessage: Message = {
      id: messageId,
      content: message,
      type: "user",
      imageUrl: localImageUrl,
    };
    
    setMessages((prev) => [...prev, newUserMessage]);
    setIsLoading(true);

    try {
      // Create FormData for API call
      const formData = new FormData();
      formData.append("message", message);
      if (image) {
        formData.append("image", image);
      }

      // Make API call to the AI service
      const response = await fetch('/api/connect-ai/message', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`API call failed with status: ${response.status}`);
      }

      const data = await response.json();
      console.log("AI response:", data);

      // Add AI response
      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        content: data.response || "I'm not sure how to respond to that.",
        type: "ai",
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again later.",
        variant: "destructive",
      });
      
      // Add error message as AI response
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        content: "I'm sorry, I couldn't process your request. Please try again later.",
        type: "ai",
      };
      
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen flex-col bg-chat-background">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center p-6 text-center">
            <div className="mb-4 rounded-full bg-secondary p-4">
              <InfoIcon className="h-6 w-6 text-secondary-foreground" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">Temporary Chat</h3>
            <p className="max-w-md text-sm text-muted-foreground">
              This chat won't appear in history, use or update AI's memory, or be used to 
              train our models. For safety purposes, we may keep a copy of this chat for up to 30 days.
            </p>
          </div>
        ) : (
          messages.map((msg) => (
            <ChatMessage
              key={msg.id}
              content={msg.content}
              type={msg.type}
              imageUrl={msg.imageUrl}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <ChatInput onSubmit={handleSubmit} isLoading={isLoading} />
      <Toaster />
    </div>
  );
};

export default ChatContainer;
