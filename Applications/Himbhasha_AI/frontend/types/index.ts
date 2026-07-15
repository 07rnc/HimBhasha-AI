export interface Message {
  id: string;
  sender: "user" | "vaani";
  text: string;
  timestamp: string;
}

export type Language = "english" | "hindi" | "kangdi";

export interface TranslationState {
  text: string;
  translatedText: string;
  sourceLang: Language;
  targetLang: Language;
  pronunciation?: string;
  loading: boolean;
}

export interface DocumentState {
  file: File | null;
  filePreview: string | null;
  fileType: "pdf" | "image" | null;
  fileName: string | null;
  action: "summarize" | "translate" | "ask";
  question?: string;
  result?: string;
  loading: boolean;
}

export type ContributionType = "story" | "proverb" | "vocabulary" | "conversation" | "song";

export interface ContributionState {
  type: ContributionType;
  title: string;
  content: string;
  audioBase64?: string;
  speakerAge?: number;
  speakerGender?: "male" | "female" | "other";
  district?: string;
  village?: string;
  consent: boolean;
  loading: boolean;
}
