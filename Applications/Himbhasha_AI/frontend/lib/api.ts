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

  // POST /v1/voice/record
  voiceRecord: async (sessionId?: string) => {
    const response = await apiClient.post("/v1/voice/record", {
      session_id: sessionId,
    });
    return response.data; // { status: string, session_id: string }
  },

  // POST /v1/voice/transcribe
  voiceTranscribe: async (audioBase64: string, samplingRate?: number) => {
    const response = await apiClient.post("/v1/voice/transcribe", {
      audio_base64: audioBase64,
      sampling_rate: samplingRate || 16000,
    });
    return response.data; // { transcription: string, confidence: number }
  },

  // POST /v1/voice/speak
  voiceSpeak: async (text: string, language?: string) => {
    const response = await apiClient.post("/v1/voice/speak", {
      text,
      language: language || "hi-IN",
    });
    return response.data; // { audio_base64: string }
  },

  // GET /v1/voice/status
  voiceStatus: async () => {
    const response = await apiClient.get("/v1/voice/status");
    return response.data; // { status: string, service: string, health: boolean }
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

  // POST /contribute
  contribute: async (payload: {
    type: string;
    title: string;
    content: string;
    age?: number | "";
    gender?: string;
    district?: string;
    village?: string;
    consent: boolean;
    audio_attached: boolean;
  }) => {
    const response = await apiClient.post("/contribute", payload);
    return response.data; // { status: string, contribution_id: string }
  },
};
