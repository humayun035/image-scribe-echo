
import React from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type MessageType = "user" | "ai";

interface ChatMessageProps {
  content: string;
  type: MessageType;
  imageUrl?: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ content, type, imageUrl }) => {
  return (
    <div className={cn(
      "flex w-full gap-3 p-4",
      type === "user" ? "justify-end" : "justify-start"
    )}>
      {type === "ai" && (
        <Avatar className="h-8 w-8">
          <AvatarFallback>AI</AvatarFallback>
          <AvatarImage src="/lovable-uploads/ccfec79a-6940-45be-a884-b0330891f7ba.png" />
        </Avatar>
      )}
      
      <div className={cn(
        "flex flex-col max-w-[80%] rounded-lg p-4",
        type === "user" 
          ? "bg-primary text-primary-foreground" 
          : "bg-secondary text-secondary-foreground"
      )}>
        <p className="text-sm whitespace-pre-wrap">{content}</p>
        {imageUrl && (
          <div className="mt-2">
            <img 
              src={imageUrl} 
              alt="User uploaded" 
              className="max-w-full rounded-md object-contain max-h-60" 
            />
          </div>
        )}
      </div>
      
      {type === "user" && (
        <Avatar className="h-8 w-8">
          <AvatarFallback>U</AvatarFallback>
          <AvatarImage src="" />
        </Avatar>
      )}
    </div>
  );
};

export default ChatMessage;
