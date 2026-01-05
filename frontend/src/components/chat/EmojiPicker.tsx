import { useState } from "react";
import { Smile } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

interface EmojiPickerProps {
  onChange: (value: string) => void;
}

const COMMON_EMOJIS = [
  "😀", "😃", "😄", "😁", "😅", "😂", "🤣", "😊", "😇", "🙂",
  "😉", "😌", "😍", "🥰", "😘", "😗", "😙", "😚", "😋", "😛",
  "😝", "😜", "🤪", "🤨", "🧐", "🤓", "😎", "🥳", "😏", "😒",
  "😞", "😔", "😟", "😕", "🙁", "😣", "😖", "😫", "😩", "🥺",
  "😢", "😭", "😤", "😠", "😡", "🤬", "🤯", "😳", "🥵", "🥶",
  "😱", "😨", "😰", "😥", "😓", "🤗", "🤔", "🤭", "🤫", "🤥",
  "😶", "😐", "😑", "😬", "🙄", "😯", "😦", "😧", "😮", "😲",
  "👍", "👎", "👌", "✌️", "🤞", "🤟", "🤘", "🤙", "👈", "👉",
  "👆", "👇", "☝️", "✋", "🤚", "🖐️", "🖖", "👋", "🤝", "💪",
  "❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "💔",
  "💕", "💞", "💓", "💗", "💖", "💘", "💝", "💟", "☮️", "✝️",
  "🔥", "✨", "⭐", "🌟", "💫", "💥", "💢", "💦", "💨", "🎉",
  "🎊", "🎈", "🎁", "🎀", "🎂", "🍰", "🧁", "🍕", "🍔", "🍟",
];

const EmojiPicker = ({ onChange }: EmojiPickerProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleEmojiClick = (emoji: string) => {
    onChange(emoji);
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button 
          type="button" 
          className="cursor-pointer hover:opacity-80 transition-opacity p-1 rounded-md hover:bg-muted"
          aria-label="Pick emoji"
        >
          <Smile className="size-4" />
        </button>
      </PopoverTrigger>

      <PopoverContent 
        className="w-80 p-2"
        align="end"
        side="top"
        sideOffset={8}
      >
        <div className="grid grid-cols-10 gap-1 max-h-64 overflow-y-auto">
          {COMMON_EMOJIS.map((emoji, index) => (
            <Button
              key={index}
              variant="ghost"
              size="sm"
              className="text-xl p-1 h-8 hover:bg-muted"
              onClick={() => handleEmojiClick(emoji)}
            >
              {emoji}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default EmojiPicker;