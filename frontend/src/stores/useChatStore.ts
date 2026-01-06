import { chatService } from "@/services/chatService";
import { aiService } from "@/services/aiService";
import type { ChatState } from "@/types/store";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useAuthStore } from "./useAuthStore";
import { useSocketStore } from "./useSocketStore";

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      conversations: [],
      messages: {},
      activeConversationId: null,
      convoLoading: false,
      messageLoading: false,
      loading: false,

      setActiveConversation: (id) => set({ activeConversationId: id }),
      createAIConversation: () => {
        const { conversations } = get();
        const aiExists = conversations.find((c) => c._id === "ai-assistant");
        
        if (!aiExists) {
          const aiConversation = {
            _id: "ai-assistant",
            type: "direct" as const,
            group: { name: "", createdBy: "" },
            participants: [
              {
                _id: "ai-bot",
                displayName: "AI Assistant",
                avatarUrl: null,
                joinedAt: new Date().toISOString(),
              },
            ],
            lastMessageAt: new Date().toISOString(),
            seenBy: [],
            lastMessage: {
              _id: "welcome",
              content: "Xin chào! Tôi là trợ lý AI của Lotus 🌸",
              createdAt: new Date().toISOString(),
              sender: {
                _id: "ai-bot",
                displayName: "AI Assistant",
                avatarUrl: null,
              },
            },
            unreadCounts: {},
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          
          set({ conversations: [aiConversation, ...conversations] });
          
          // Khởi tạo messages cho AI
          const welcomeMessage = {
            _id: "welcome",
            conversationId: "ai-assistant",
            senderId: "ai-bot",
            content: "Xin chào! Tôi là trợ lý AI của Lotus. Tôi có thể giúp gì cho bạn hôm nay? 🌸",
            imgUrl: null,
            createdAt: new Date().toISOString(),
            isOwn: false,
          };
          
          set((state) => ({
            messages: {
              ...state.messages,
              "ai-assistant": {
                items: [welcomeMessage],
                hasMore: false,
                nextCursor: null,
              },
            },
          }));
        }
      },
      reset: () => {
        set({
          conversations: [],
          messages: {},
          activeConversationId: null,
          convoLoading: false,
          messageLoading: false,
        });
      },
      fetchConversations: async () => {
        try {
          set({ convoLoading: true });
          const { conversations } = await chatService.fetchConversations();

          set({ conversations, convoLoading: false });
        } catch (error) {
          console.error("Lỗi xảy ra khi fetchConversations:", error);
          set({ convoLoading: false });
        }
      },
      fetchMessages: async (conversationId) => {
        const { activeConversationId, messages } = get();
        const { user } = useAuthStore.getState();

        const convoId = conversationId ?? activeConversationId;

        if (!convoId) return;

        // Skip fetching messages for AI conversation
        if (convoId === "ai-assistant") {
          return;
        }

        const current = messages?.[convoId];
        const nextCursor =
          current?.nextCursor === undefined ? "" : current?.nextCursor;

        if (nextCursor === null) return;

        set({ messageLoading: true });

        try {
          const { messages: fetched, cursor } = await chatService.fetchMessages(
            convoId,
            nextCursor
          );

          const processed = fetched.map((m) => ({
            ...m,
            isOwn: m.senderId === user?._id,
          }));

          set((state) => {
            const prev = state.messages[convoId]?.items ?? [];
            const merged = prev.length > 0 ? [...processed, ...prev] : processed;

            return {
              messages: {
                ...state.messages,
                [convoId]: {
                  items: merged,
                  hasMore: !!cursor,
                  nextCursor: cursor ?? null,
                },
              },
            };
          });
        } catch (error) {
          console.error("Lỗi xảy ra khi fetchMessages:", error);
        } finally {
          set({ messageLoading: false });
        }
      },
      sendDirectMessage: async (recipientId, content, image) => {
        try {
          const { activeConversationId } = get();
          
          let imgUrl: string | undefined;
          
          // Upload ảnh nếu có
          if (image) {
            console.log("📤 Uploading image...");
            imgUrl = await chatService.uploadMessageImage(image);
            console.log("✅ Image uploaded:", imgUrl);
          }
          
          await chatService.sendDirectMessage(
            recipientId,
            content,
            imgUrl,
            activeConversationId || undefined
          );
          
          set((state) => ({
            conversations: state.conversations.map((c) =>
              c._id === activeConversationId ? { ...c, seenBy: [] } : c
            ),
          }));
        } catch (error) {
          console.error("❌ Lỗi xảy ra khi gửi direct message", error);
          throw error;
        }
      },
      sendGroupMessage: async (conversationId, content, image) => {
        try {
          let imgUrl: string | undefined;
          
          // Upload ảnh nếu có
          if (image) {
            console.log("📤 Uploading image...");
            imgUrl = await chatService.uploadMessageImage(image);
            console.log("✅ Image uploaded:", imgUrl);
          }
          
          await chatService.sendGroupMessage(conversationId, content, imgUrl);
          
          set((state) => ({
            conversations: state.conversations.map((c) =>
              c._id === get().activeConversationId ? { ...c, seenBy: [] } : c
            ),
          }));
        } catch (error) {
          console.error("❌ Lỗi xảy ra gửi group message", error);
          throw error;
        }
      },
      sendAIMessage: async (content) => {
        try {
          const { user } = useAuthStore.getState();
          if (!user) return;

          // Thêm tin nhắn của user
          const userMessage = {
            _id: `user-${Date.now()}`,
            conversationId: "ai-assistant",
            senderId: user._id,
            content,
            imgUrl: null,
            createdAt: new Date().toISOString(),
            isOwn: true,
          };

          set((state) => ({
            messages: {
              ...state.messages,
              "ai-assistant": {
                items: [...(state.messages["ai-assistant"]?.items || []), userMessage],
                hasMore: false,
                nextCursor: null,
              },
            },
          }));

          // Gọi API AI thật
          const response = await aiService.sendMessage(content);
          
          const aiMessage = {
            _id: `ai-${Date.now()}`,
            conversationId: "ai-assistant",
            senderId: "ai-bot",
            content: response.message,
            imgUrl: null,
            createdAt: new Date().toISOString(),
            isOwn: false,
          };

          set((state) => ({
            messages: {
              ...state.messages,
              "ai-assistant": {
                items: [...(state.messages["ai-assistant"]?.items || []), aiMessage],
                hasMore: false,
                nextCursor: null,
              },
            },
            conversations: state.conversations.map((c) =>
              c._id === "ai-assistant"
                ? {
                    ...c,
                    lastMessage: {
                      _id: aiMessage._id,
                      content: aiMessage.content,
                      createdAt: aiMessage.createdAt,
                      sender: {
                        _id: "ai-bot",
                        displayName: "AI Assistant",
                        avatarUrl: null,
                      },
                    },
                    lastMessageAt: aiMessage.createdAt,
                  }
                : c
            ),
          }));
        } catch (error) {
          console.error("❌ Lỗi xảy ra khi gửi AI message", error);
          throw error;
        }
      },
      addMessage: async (message) => {
        try {
          const { user } = useAuthStore.getState();
          const { fetchMessages } = get();

          message.isOwn = message.senderId === user?._id;

          const convoId = message.conversationId;

          let prevItems = get().messages[convoId]?.items ?? [];

          if (prevItems.length === 0) {
            await fetchMessages(message.conversationId);
            prevItems = get().messages[convoId]?.items ?? [];
          }

          set((state) => {
            if (prevItems.some((m) => m._id === message._id)) {
              return state;
            }

            return {
              messages: {
                ...state.messages,
                [convoId]: {
                  items: [...prevItems, message],
                  hasMore: state.messages[convoId].hasMore,
                  nextCursor: state.messages[convoId].nextCursor ?? undefined,
                },
              },
            };
          });
        } catch (error) {
          console.error("Lỗi xảy khi ra add message:", error);
        }
      },
      updateConversation: (conversation) => {
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c._id === (conversation as any)._id ? { ...c, ...(conversation as any) } : c
          ),      
        }));
      },
      markAsSeen: async () => {
        try {
          const { user } = useAuthStore.getState();
          const { activeConversationId, conversations } = get();

          if (!activeConversationId || !user) {
            return;
          }

          const convo = conversations.find((c) => c._id === activeConversationId);

          if (!convo) {
            return;
          }

          if ((convo.unreadCounts?.[user._id] ?? 0) === 0) {
            return;
          }

          await chatService.markAsSeen(activeConversationId);

          set((state) => ({
            conversations: state.conversations.map((c) =>
              c._id === activeConversationId && c.lastMessage
                ? {
                    ...c,
                    unreadCounts: {
                      ...c.unreadCounts,
                      [user._id]: 0,
                    },
                  }
                : c
            ),
          }));
        } catch (error) {
          console.error("Lỗi xảy ra khi gọi markAsSeen trong store", error);
        }
      },
      addConvo: (convo) => {
        set((state) => {
          const exists = state.conversations.some(
            (c) => c._id.toString() === convo._id.toString()
          );

          return {
            conversations: exists
              ? state.conversations
              : [convo, ...state.conversations],
            activeConversationId: convo._id,
          };
        });
      },
      createConversation: async (type, name, memberIds) => {
        try {
          set({ loading: true });
          const conversation = await chatService.createConversation(
            type,
            name,
            memberIds
          );

          get().addConvo(conversation);

          useSocketStore
            .getState()
            .socket?.emit("join-conversation", conversation._id);
        } catch (error) {
          console.error("Lỗi xảy ra khi gọi createConversation trong store", error);
        } finally {
          set({ loading: false });
        }
      },
    }),
    {
      name: "chat-storage",
      partialize: (state) => ({ conversations: state.conversations }),
    }
  )
);