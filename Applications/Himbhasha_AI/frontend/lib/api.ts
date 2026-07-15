import axios from "axios";
import { Language } from "../types";

const API_BASE_URL = "http://localhost:8000/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const api = {
  // Check backend health
  checkHealth: async () => {
    const response = await apiClient.get("/health");
    return response.data;
  },

  // POST /chat
  chat: async (message: string, sessionId?: string) => {
    const response = await apiClient.post("/chat", {
      message,
      session_id: sessionId,
    });
    return response.data; // { response: string, session_id: string }
  },

  // POST /translate
  translate: async (text: string, sourceLang: Language, targetLang: Language) => {
    const response = await apiClient.post("/translate", {
      text,
      source_lang: sourceLang,
      target_lang: targetLang,
    });
    return response.data; // { translated_text: string, pronunciation?: string, ... }
  },

  // POST /voice
  voice: async (audioBase64: string) => {
    const response = await apiClient.post("/voice", {
      audio_base64: audioBase64,
    });
    return response.data; // { transcription: string, response: string, audio_response_base64: string }
  },

  // POST /document
  document: async (
    fileName: string,
    fileType: "pdf" | "image",
    contentBase64: string,
    action: "summarize" | "translate" | "ask",
    question?: string
  ) => {
    const response = await apiClient.post("/document", {
      file_name: fileName,
      file_type: fileType,
      content_base64: contentBase64,
      action: action,
      question: question,
    });
    return response.data; // { result: string, pages_processed: number }
  },
};
