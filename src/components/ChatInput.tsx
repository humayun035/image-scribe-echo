
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Image, Send, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";

interface ChatInputProps {
  onSubmit: (message: string, image?: File) => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSubmit, isLoading }) => {
  const [message, setMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Image size should be less than 5MB",
        variant: "destructive",
      });
      return;
    }

    setSelectedImage(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const removeImage = () => {
    setSelectedImage(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = () => {
    if (!message.trim() && !selectedImage) return;
    
    onSubmit(message, selectedImage || undefined);
    setMessage("");
    removeImage();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="border-t bg-background p-4">
      {previewUrl && (
        <div className="relative mb-2 inline-block">
          <img 
            src={previewUrl} 
            className="h-20 rounded-md object-contain" 
            alt="Preview" 
          />
          <Button 
            variant="destructive" 
            size="icon" 
            className="absolute -right-2 -top-2 h-6 w-6 rounded-full p-0"
            onClick={removeImage}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
      
      <div className="relative flex items-center">
        <Button 
          type="button" 
          size="icon" 
          variant="ghost" 
          className="absolute left-2"
          onClick={() => fileInputRef.current?.click()}
        >
          <Plus className="h-5 w-5" />
        </Button>
        
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageChange}
          accept="image/*"
          className="hidden"
        />
        
        <Button 
          type="button" 
          size="icon"
          variant="ghost" 
          className="absolute left-11"
          onClick={() => fileInputRef.current?.click()}
        >
          <Image className="h-5 w-5" />
        </Button>
        
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything..."
          className={cn(
            "min-h-12 resize-none overflow-hidden rounded-lg pl-20 pr-14 py-3",
            "focus-visible:ring-1 focus-visible:ring-offset-0"
          )}
          rows={1}
        />
        
        <Button 
          type="button" 
          size="icon" 
          className="absolute right-2"
          onClick={handleSubmit}
          disabled={isLoading || (!message.trim() && !selectedImage)}
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default ChatInput;
