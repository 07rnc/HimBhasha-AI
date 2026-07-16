import { api } from "../lib/api";

export interface ContributionPayload {
  type: "vocabulary" | "proverb" | "story" | "conversation" | "song";
  title: string;
  content: string;
  age?: number | "";
  gender?: string;
  district?: string;
  village?: string;
  consent: boolean;
  audio_attached: boolean;
}

export interface ContributionResponseData {
  status: string;
  contribution_id: string;
}

/**
 * ContributionService Handles user preservation uploads for regional vocabulary, folklore,
 * proverbs, and custom audio records.
 */
export const ContributionService = {
  /**
   * Submit linguistic preservation content
   * @param payload Contribution parameters and demographics
   */
  submitContribution: async (payload: ContributionPayload): Promise<ContributionResponseData> => {
    // TODO: [AI Integration - Dataset Review Moderation & Slashy]
    // 1. Direct incoming text entries to validation classifiers.
    // 2. Open moderation tickets on Slashy to flag dataset entries for peer validation.
    // 3. For now, invoke the FastAPI backend routes to save contribution logs.
    
    try {
      const response = await api.contribute(payload);
      return response;
    } catch (error) {
      console.error("ContributionService: failed to upload preservation entry.", error);
      throw error;
    }
  }
};
