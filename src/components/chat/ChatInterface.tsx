
import React, { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { usePDF } from "@/contexts/PDFContext";
import { useChat } from "@/contexts/ChatContext";
import { ArrowLeft, LoaderCircle, Send } from "lucide-react";
import CreditDisplay from "../shared/CreditDisplay";
import BuyCreditsModal from "../shared/BuyCreditsModal";

const ChatInterface: React.FC = () => {
  const [inputMessage, setInputMessage] = useState("");
  const [showBuyCredits, setShowBuyCredits] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { selectedPDF, selectPDF } = usePDF();
  const { currentSession, sendMessage, isLoading } = useChat();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentSession?.messages]);

  // Check if user has credits
  useEffect(() => {
    if (user && user.credits <= 0) {
      setShowBuyCredits(true);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    if (user && user.credits <= 0) {
      setShowBuyCredits(true);
      return;
    }

    await sendMessage(inputMessage);
    setInputMessage("");
  };

  const handleBack = () => {
    selectPDF(null);
  };

  if (!selectedPDF || !currentSession) {
    return null;
  }

  return (
    <>
      <Card className="flex flex-col h-[calc(100vh-2rem)]">
        <CardHeader className="flex-none py-4 px-4 border-b">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                className="mr-2"
                onClick={handleBack}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <CardTitle className="text-lg">{selectedPDF.name}</CardTitle>
            </div>
            <CreditDisplay />
          </div>
        </CardHeader>
        <CardContent className="flex-1 overflow-auto p-4">
          {currentSession.messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6">
              <h3 className="text-xl font-medium mb-2">Chat with your PDF</h3>
              <p className="text-gray-500 mb-4 max-w-md">
                Ask questions about your document and get AI-powered answers
                based on its content.
              </p>
              <div className="grid grid-cols-2 gap-2 w-full max-w-md">
                <Button
                  variant="outline"
                  className="justify-start text-left"
                  onClick={() => sendMessage("Summarize this document")}
                >
                  Summarize this document
                </Button>
                <Button
                  variant="outline"
                  className="justify-start text-left"
                  onClick={() => sendMessage("What are the key points?")}
                >
                  What are the key points?
                </Button>
                <Button
                  variant="outline"
                  className="justify-start text-left"
                  onClick={() => sendMessage("Find the main argument")}
                >
                  Find the main argument
                </Button>
                <Button
                  variant="outline"
                  className="justify-start text-left"
                  onClick={() => sendMessage("Extract important data")}
                >
                  Extract important data
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col space-y-4">
              {currentSession.messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={
                      message.sender === "user" ? "message-user" : "message-ai"
                    }
                  >
                    {message.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="message-ai flex items-center space-x-2">
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                    <span>Thinking...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </CardContent>
        <CardFooter className="flex-none border-t p-4">
          <form onSubmit={handleSubmit} className="flex w-full space-x-2">
            <Input
              placeholder="Type your message..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              disabled={isLoading || user?.credits === 0}
              className="flex-1"
            />
            <Button
              type="submit"
              disabled={isLoading || !inputMessage.trim() || user?.credits === 0}
              className="bg-app-blue hover:bg-app-blue/90"
            >
              {isLoading ? (
                <LoaderCircle className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>
        </CardFooter>
      </Card>

      <BuyCreditsModal open={showBuyCredits} onOpenChange={setShowBuyCredits} />
    </>
  );
};

export default ChatInterface;
