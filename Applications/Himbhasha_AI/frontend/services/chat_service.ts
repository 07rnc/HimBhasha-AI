import { api } from "../lib/api";

export interface ChatMessage {
  id: string;
  sender: "user" | "vaani";
  text: string;
  timestamp: string;
}

export interface ChatResponseData {
  response: string;
  session_id: string;
}

/**
 * ChatService Coordinates conversational logic with Vaani AI.
 */
export const ChatService = {
  /**
   * Send a chat message to the assistant
   * @param message Text query from user
   * @param sessionId Session token for conversation context mapping
   */
  sendMessage: async (message: string, sessionId?: string): Promise<ChatResponseData> => {
    // TODO: [AI Integration - Mem0 & Gemini]
    // 1. Connect frontend/middleware client directly to Mem0 instance to store user contextual memory.
    // 2. Alternatively, integrate Gemini 2.5 flash client on server backend to bypass proxying.
    // 3. For now, invoke the FastAPI backend route to fetch regional mock data responses.
    
    try {
      const response = await api.chat(message, sessionId);
      return response;
    } catch (error) {
      console.error("ChatService: failed to execute message generation.", error);
      throw error;
    }
  }
};
