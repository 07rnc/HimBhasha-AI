import { api } from "../lib/api";
import { Language } from "../types";

export interface TranslationResponseData {
  success?: boolean;
  translated_text: string;
  pronunciation?: string;
  source_language?: string;
  target_language?: string;
  source_lang?: Language | string;
  target_lang?: Language | string;
  confidence?: number;
  category?: string;
  source?: string;
  source_dataset?: string;
  match_type?: string;
  processing_time_ms?: number;
  related_words?: string[];
  message?: string;
  suggestions?: string[];
}

/**
 * TranslationService Coordinates translating text between regional languages.
 */
export const TranslationService = {
  /**
   * Translate user input text
   * @param text Text content to translate
   * @param sourceLang Native source language
   * @param targetLang Target output language
   */
  translateText: async (
    text: string,
    sourceLang?: Language | string,
    targetLang?: Language | string
  ): Promise<TranslationResponseData> => {
    try {
      const response = await api.translate(text, sourceLang as any, targetLang as any);
      return response;
    } catch (error) {
      console.error("TranslationService: failed to execute translation.", error);
      throw error;
    }
  }
};
