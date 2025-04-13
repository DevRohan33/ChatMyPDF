
import React, { createContext, useState, useContext } from "react";
import { toast } from "sonner";
import { useAuth } from "./AuthContext";
import { usePDF } from "./PDFContext";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
}

interface ChatSession {
  id: string;
  pdfId: string;
  messages: Message[];
}

interface ChatContextType {
  sessions: ChatSession[];
  currentSession: ChatSession | null;
  startSession: (pdfId: string) => void;
  sendMessage: (content: string) => Promise<void>;
  isLoading: boolean;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user, updateCredits } = useAuth();
  const { selectedPDF } = usePDF();

  const startSession = (pdfId: string) => {
    // Check if session already exists for this PDF
    const existingSession = sessions.find((session) => session.pdfId === pdfId);
    
    if (existingSession) {
      setCurrentSession(existingSession);
      return;
    }

    // Create new session
    const newSession: ChatSession = {
      id: "session-" + Math.random().toString(36).substr(2, 9),
      pdfId,
      messages: [],
    };

    setSessions((prev) => [...prev, newSession]);
    setCurrentSession(newSession);
  };

  const sendMessage = async (content: string) => {
    if (!user) {
      toast.error("You must be logged in to send messages");
      return;
    }

    if (!currentSession) {
      toast.error("No active chat session");
      return;
    }

    if (user.credits <= 0) {
      toast.error("You have run out of credits");
      return;
    }

    // Add user message
    const userMessage: Message = {
      id: "msg-" + Math.random().toString(36).substr(2, 9),
      content,
      sender: "user",
      timestamp: new Date(),
    };

    // Update the session with the user message
    const updatedSession = {
      ...currentSession,
      messages: [...currentSession.messages, userMessage],
    };
    
    setCurrentSession(updatedSession);
    setSessions((prev) =>
      prev.map((session) =>
        session.id === currentSession.id ? updatedSession : session
      )
    );

    // Simulate AI response
    setIsLoading(true);
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Deduct credits
      const newCredits = user.credits - 1;
      updateCredits(newCredits);

      // Mock AI response
      const aiResponses = [
        "Based on the PDF content, I can provide the following information...",
        "The document suggests that the main findings are related to...",
        "According to the data in the PDF, the analysis shows...",
        "The methodology described in the document indicates...",
        "This PDF contains several key points worth noting...",
      ];
      
      const aiResponse: Message = {
        id: "msg-" + Math.random().toString(36).substr(2, 9),
        content: aiResponses[Math.floor(Math.random() * aiResponses.length)],
        sender: "ai",
        timestamp: new Date(),
      };

      // Update the session with the AI response
      const finalSession = {
        ...updatedSession,
        messages: [...updatedSession.messages, aiResponse],
      };
      
      setCurrentSession(finalSession);
      setSessions((prev) =>
        prev.map((session) =>
          session.id === currentSession.id ? finalSession : session
        )
      );

    } catch (error) {
      toast.error("Failed to get AI response: " + (error instanceof Error ? error.message : String(error)));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        sessions,
        currentSession,
        startSession,
        sendMessage,
        isLoading,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
