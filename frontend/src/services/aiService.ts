// frontend/src/services/aiService.ts
import api from "@/lib/axios";

interface AIResponse {
  message: string;
  timestamp: string;
}

export const aiService = {
  async sendMessage(message: string): Promise<AIResponse> {
    try {
      const res = await api.post("/ai/chat", { message });
      return res.data;
    } catch (error) {
      console.error("AI service error:", error);
      throw error;
    }
  },

  async getAIHistory(): Promise<any[]> {
    try {
      const res = await api.get("/ai/history");
      return res.data.history || [];
    } catch (error) {
      console.error("AI history error:", error);
      return [];
    }
  },
};