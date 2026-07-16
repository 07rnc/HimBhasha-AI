import { api } from "../lib/api";

export interface DocumentResponseData {
  result: string;
  pages_processed: number;
}

/**
 * DocumentService Coordinates text extraction, summary generation,
 * and Q&A analysis on uploaded PDFs and images.
 */
export const DocumentService = {
  /**
   * Process uploaded document file
   * @param fileName Name of the uploaded file
   * @param fileType Format category ("pdf" or "image")
   * @param contentBase64 Base64 binary content stream
   * @param action Target analysis (summarize, translate, ask)
   * @param question Optional Q&A query text
   */
  processDocument: async (
    fileName: string,
    fileType: "pdf" | "image",
    contentBase64: string,
    action: "summarize" | "translate" | "ask",
    question?: string
  ): Promise<DocumentResponseData> => {
    // TODO: [AI Integration - PaddleOCR & Gemini Reasoning]
    // 1. Direct PDF pages to PaddleOCR layout analysis pipeline for table and header extraction.
    // 2. Wrap extracted tokens as context block and feed to Gemini API for summarization/answering.
    // 3. For now, invoke the FastAPI document router to parse mock summary results.
    
    try {
      const response = await api.document(fileName, fileType, contentBase64, action, question);
      return response;
    } catch (error) {
      console.error("DocumentService: failed to execute document process.", error);
      throw error;
    }
  }
};
