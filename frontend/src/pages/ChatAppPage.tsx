
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import  ChatWindowLayout  from "@/components/chat/ChatWindowLayout";

const ChatAppPage = () => {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <div className="flex-1 p-2">
          <ChatWindowLayout />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default ChatAppPage;
