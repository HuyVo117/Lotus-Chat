import { useChatStore } from "@/stores/useChatStore";
import type { Conversation, Participant } from "@/types/chat";
import { SidebarTrigger } from "../ui/sidebar";
import { useAuthStore } from "@/stores/useAuthStore";
import { Separator } from "../ui/separator";
import UserAvatar from "./UserAvatar";
import StatusBadge from "./StatusBadge";
import GroupChatAvatar from "./GroupChatAvatar";
import { useSocketStore } from "@/stores/useSocketStore";
import { Button } from "../ui/button";
import { Phone, Video, Bot } from "lucide-react";
import { toast } from "sonner";
import { useCall } from "@/contexts/CallContext";

const ChatWindowHeader = ({ chat }: { chat?: Conversation }) => {
  const { conversations, activeConversationId } = useChatStore();
  const { user } = useAuthStore();
  const { onlineUsers } = useSocketStore();
  const { callUser } = useCall();

  let otherUser: Participant | null = null;

  chat = chat ?? conversations.find((c) => c._id === activeConversationId);

  if (!chat) {
    return (
      <header className="md:hidden sticky top-0 z-10 flex items-center gap-2 px-4 py-2 w-full">
        <SidebarTrigger className="-ml-1 text-foreground" />
      </header>
    );
  }

  // Kiểm tra nếu là AI chat
  const isAIChat = chat._id === "ai-assistant";

  if (chat.type === "direct" && !isAIChat) {
    const otherUsers = chat.participants.filter((p) => p._id !== user?._id);
    otherUser = otherUsers.length > 0 ? otherUsers[0] : null;

    if (!user || !otherUser) return;
  }

  const handleVoiceCall = () => {
    if (chat.type === "direct" && otherUser) {
      if (!onlineUsers.includes(otherUser._id)) {
        toast.error("Người dùng không online");
        return;
      }
      callUser(otherUser._id, "voice");
    } else {
      toast.info("Tính năng gọi nhóm đang được phát triển");
    }
  };

  const handleVideoCall = () => {
    if (chat.type === "direct" && otherUser) {
      if (!onlineUsers.includes(otherUser._id)) {
        toast.error("Người dùng không online");
        return;
      }
      callUser(otherUser._id, "video");
    } else {
      toast.info("Tính năng gọi nhóm đang được phát triển");
    }
  };

  return (
    <header className="sticky top-0 z-10 px-4 py-2 flex items-center bg-background border-b border-border">
      <div className="flex items-center justify-between gap-2 w-full">
        {/* Left side - Avatar & Name */}
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1 text-foreground" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />

          <div className="p-2 flex items-center gap-3">
            {/* avatar */}
            <div className="relative">
              {isAIChat ? (
                <div className="flex items-center justify-center size-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400">
                  <Bot className="size-6 text-white" />
                </div>
              ) : chat.type === "direct" ? (
                <>
                  <UserAvatar
                    type={"sidebar"}
                    name={otherUser?.displayName || "Lotus"}
                    avatarUrl={otherUser?.avatarUrl || undefined}
                  />
                  <StatusBadge
                    status={
                      onlineUsers.includes(otherUser?._id ?? "") ? "online" : "offline"
                    }
                  />
                </>
              ) : (
                <GroupChatAvatar
                  participants={chat.participants}
                  type="sidebar"
                />
              )}
            </div>

            {/* name */}
            <div>
              <h2 className="font-semibold text-foreground">
                {isAIChat 
                  ? "AI Assistant" 
                  : chat.type === "direct" 
                    ? otherUser?.displayName 
                    : chat.group?.name}
              </h2>
              {isAIChat && (
                <p className="text-xs text-muted-foreground">Trợ lý AI thông minh</p>
              )}
            </div>
          </div>
        </div>

        {/* Right side - Call buttons (không hiển thị cho AI chat) */}
        {!isAIChat && (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-primary/10 transition-smooth"
              onClick={handleVoiceCall}
              title="Gọi thoại"
            >
              <Phone className="size-5" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-primary/10 transition-smooth"
              onClick={handleVideoCall}
              title="Gọi video"
            >
              <Video className="size-5" />
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default ChatWindowHeader;