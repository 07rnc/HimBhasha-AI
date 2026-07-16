import { api } from "../lib/api";

export interface VoiceResponseData {
  transcription: string;
  response: string;
  audio_response_base64: string;
  confidence?: number;
}

export interface VoiceStatusData {
  status: string;
  service: string;
  health: boolean;
}

/**
 * VoiceService Handles speech recording operations, transcribing regional language speech
 * and synthesizing regional spoken output.
 */
export const VoiceService = {
  /**
   * Initialize a voice recording trace session
   * @param sessionId Session identifier
   */
  startRecord: async (sessionId?: string): Promise<{ status: string; session_id: string }> => {
    try {
      return await api.voiceRecord(sessionId);
    } catch (error) {
      console.error("VoiceService: startRecord trace failed.", error);
      throw error;
    }
  },

  /**
   * Send audio base64 to Gnani STT for transcription
   * @param audioBase64 Audio data
   * @param samplingRate Frequency
   */
  transcribeAudio: async (audioBase64: string, samplingRate?: number): Promise<{ transcription: string; confidence: number }> => {
    try {
      return await api.voiceTranscribe(audioBase64, samplingRate);
    } catch (error) {
      console.error("VoiceService: transcribe failed.", error);
      throw error;
    }
  },

  /**
   * Convert text into synthesized regional speech
   * @param text Message to read
   * @param language Locale string
   */
  synthesizeSpeech: async (text: string, language?: string): Promise<{ audio_base64: string }> => {
    try {
      return await api.voiceSpeak(text, language);
    } catch (error) {
      console.error("VoiceService: synthesize failed.", error);
      throw error;
    }
  },

  /**
   * Check status and health of the Gnani client
   */
  checkStatus: async (): Promise<VoiceStatusData> => {
    try {
      return await api.voiceStatus();
    } catch (error) {
      console.error("VoiceService: status check failed.", error);
      throw error;
    }
  },

  /**
   * Process recorded speech audio base64 payload in sequence (transcribe, mock reasoning, synthesize response)
   * @param audioBase64 Recorded voice base64 WAV stream
   */
  processVoiceStream: async (audioBase64: string): Promise<VoiceResponseData> => {
    // TODO: [AI Integration - Gnani STT & TTS]
    // 1. Hook client recorder directly to Gnani Speech-to-Text WebSocket engine for real-time Indic streaming transcription.
    // 2. Hook generated chat response output to Gnani Text-to-Speech synthesizer.
    // 3. For now, invoke the individual FastAPI voice endpoints sequentially.
    
    try {
      // 1. Transcribe via Gnani STT endpoint
      const transResult = await api.voiceTranscribe(audioBase64);
      
      // 2. Mock AI response generation matching regional prompts
      // TODO: Replace mocked response with Gemini-generated content after Sprint 7.
      let responseText = "Kangdi is one of the major regional languages spoken in Himachal Pradesh.";
      const transcriptLower = (transResult.transcription || "").toLowerCase();
      if (transcriptLower.includes("हाल") || transcriptLower.includes("hello")) {
        responseText = "नमस्ते! मैं बिल्कुल ठीक हूँ। आप कैसे हैं?";
      } else if (transcriptLower.includes("पानी") || transcriptLower.includes("पाणी")) {
        responseText = "कांगड़ी भाषा में पानी को 'पाणी' बोला जाता है।";
      } else if (transcriptLower.includes("खाना") || transcriptLower.includes("खाणा")) {
        responseText = "कांगड़ी में भोजन को 'खाणा' कहते हैं।";
      }

      // 3. Synthesize via Gnani TTS endpoint
      const ttsResult = await api.voiceSpeak(responseText);

      return {
        transcription: transResult.transcription,
        response: responseText,
        audio_response_base64: ttsResult.audio_base64,
        confidence: transResult.confidence
      };
    } catch (error) {
      console.error("VoiceService: failed to execute voice sequence.", error);
      throw error;
    }
  }
};
