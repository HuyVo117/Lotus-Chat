import { useEffect, useRef } from "react";
import { Picker } from "emoji-mart";
import data from "@emoji-mart/data";
import { Smile } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { useThemeStore } from "@/stores/useThemeStore";

interface EmojiPickerProps {
  onChange: (value: string) => void;
}

const EmojiPicker = ({ onChange }: EmojiPickerProps) => {
  const { isDark } = useThemeStore();
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!pickerRef.current) return;

    pickerRef.current.innerHTML = "";

    const picker = new Picker({
      data,
      theme: isDark ? "dark" : "light",
      emojiSize: 24,
      onEmojiSelect: (emoji: any) => onChange(emoji.native),
    });

    pickerRef.current.appendChild(picker as any);
  }, [isDark, onChange]);

  return (
    <Popover>
      <PopoverTrigger className="cursor-pointer">
        <Smile className="size-4" />
      </PopoverTrigger>

      <PopoverContent className="bg-transparent border-none shadow-none">
        <div ref={pickerRef} />
      </PopoverContent>
    </Popover>
  );
};

export default EmojiPicker;
