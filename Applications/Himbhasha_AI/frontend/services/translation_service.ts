import { api } from "../lib/api";
import { Language } from "../types";

export interface TranslationResponseData {
  translated_text: string;
  pronunciation?: string;
  source_lang: Language;
  target_lang: Language;
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
    sourceLang: Language,
    targetLang: Language
  ): Promise<TranslationResponseData> => {
    // TODO: [AI Integration - Gemini Translation model]
    // 1. Hook direct translation pipelines utilizing Gemini translator parameters (low temperature, system prompt grounding).
    // 2. grounding on regional terminology guidelines defined in HIMCorpus dictionary.
    // 3. For now, call the FastAPI backend to fetch dictionary aligned translation response.
    
    try {
      const response = await api.translate(text, sourceLang, targetLang);
      return response;
    } catch (error) {
      console.error("TranslationService: failed to execute translation.", error);
      throw error;
    }
  }
};
