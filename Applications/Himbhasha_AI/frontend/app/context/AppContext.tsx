"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Language, Message } from "../../types";
import { api } from "../../lib/api";

interface AppContextType {
  appLanguage: Language;
  setAppLanguage: (lang: Language) => void;
  voiceAutoplay: boolean;
  setVoiceAutoplay: (autoplay: boolean) => void;
  fontSize: "small" | "medium" | "large";
  setFontSize: (size: "small" | "medium" | "large") => void;
  apiStatus: "checking" | "online" | "offline";
  checkApiStatus: () => Promise<void>;
  chatHistory: Message[];
  addChatMessage: (msg: Message) => void;
  clearChatHistory: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [appLanguage, setAppLanguage] = useState<Language>("english");
  const [voiceAutoplay, setVoiceAutoplay] = useState<boolean>(true);
  const [fontSize, setFontSize] = useState<"small" | "medium" | "large">("medium");
  const [apiStatus, setApiStatus] = useState<"checking" | "online" | "offline">("checking");
  const [chatHistory, setChatHistory] = useState<Message[]>([]);

  const checkApiStatus = async () => {
    try {
      setApiStatus("checking");
      await api.checkHealth();
      setApiStatus("online");
    } catch (e) {
      console.warn("API offline or unreachable: ", e);
      setApiStatus("offline");
    }
  };

  useEffect(() => {
    checkApiStatus();
  }, []);

  const addChatMessage = (msg: Message) => {
    setChatHistory((prev) => [...prev, msg]);
  };

  const clearChatHistory = () => {
    setChatHistory([]);
  };

  return (
    <AppContext.Provider
      value={{
        appLanguage,
        setAppLanguage,
        voiceAutoplay,
        setVoiceAutoplay,
        fontSize,
        setFontSize,
        apiStatus,
        checkApiStatus,
        chatHistory,
        addChatMessage,
        clearChatHistory,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
