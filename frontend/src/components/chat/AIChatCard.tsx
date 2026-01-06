// frontend/src/components/chat/AIChatCard.tsx
import { Bot, Sparkles } from "lucide-react";
import { useChatStore } from "@/stores/useChatStore";
import { SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";

const AIChatCard = () => {
  const { setActiveConversation, activeConversationId, createAIConversation } = useChatStore();
  const isActive = activeConversationId === "ai-assistant";

  const handleClick = () => {
    createAIConversation();
    setActiveConversation("ai-assistant");
  };

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        onClick={handleClick}
        className={`group relative overflow-hidden transition-all duration-200 ${
          isActive
            ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
            : "hover:bg-accent"
        }`}
      >
        <div className="flex items-center gap-3 w-full">
          <div
            className={`relative flex items-center justify-center size-10 rounded-full ${
              isActive
                ? "bg-white/20"
                : "bg-gradient-to-br from-purple-400 to-pink-400"
            }`}
          >
            <Bot className={`size-5 ${isActive ? "text-white" : "text-white"}`} />
            <Sparkles className="absolute -top-1 -right-1 size-3 text-yellow-300 animate-pulse" />
          </div>

          <div className="flex-1 text-left overflow-hidden">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm">AI Assistant</span>
              <span className="text-xs px-1.5 py-0.5 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 text-white font-medium">
                Beta
              </span>
            </div>
            <p className="text-xs text-muted-foreground line-clamp-1">
              Trợ lý AI thông minh của bạn
            </p>
          </div>
        </div>

        {isActive && (
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 animate-pulse" />
        )}
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

export default AIChatCard;