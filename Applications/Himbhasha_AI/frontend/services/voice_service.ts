import { api } from "../lib/api";

export interface VoiceResponseData {
  transcription: string;
  response: string;
  audio_response_base64: string;
}

/**
 * VoiceService Handles speech recording operations, transcribing regional language speech
 * and synthesizing regional spoken output.
 */
export const VoiceService = {
  /**
   * Process recorded speech audio base64 payload
   * @param audioBase64 Recorded voice base64 WAV stream
   */
  processVoiceStream: async (audioBase64: string): Promise<VoiceResponseData> => {
    // TODO: [AI Integration - Gnani STT & TTS]
    // 1. Hook client recorder directly to Gnani Speech-to-Text WebSocket engine for real-time Indic streaming transcription.
    // 2. Hook generated chat response output to Gnani Text-to-Speech synthesizer.
    // 3. For now, invoke the FastAPI voice endpoint which runs simulated audio conversions.
    
    try {
      const response = await api.voice(audioBase64);
      return response;
    } catch (error) {
      console.error("VoiceService: failed to execute voice sequence.", error);
      throw error;
    }
  }
};
