
import React from "react";
import AuthForm from "@/components/auth/AuthForm";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/shared/Header";
import PDFUploader from "@/components/dashboard/PDFUploader";
import PDFList from "@/components/dashboard/PDFList";
import ChatInterface from "@/components/chat/ChatInterface";
import { usePDF } from "@/contexts/PDFContext";

const Index: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const { selectedPDF } = usePDF();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-app-blue"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
        <div className="w-full max-w-md text-center mb-8">
          <h1 className="text-4xl font-bold text-app-blue mb-2">ChatMyPDF</h1>
          <p className="text-gray-600">Chat with your PDF documents using AI</p>
        </div>
        <AuthForm />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pb-8">
      <Header />
      {selectedPDF ? (
        <ChatInterface />
      ) : (
        <div className="mt-6">
          <PDFUploader />
          <PDFList />
        </div>
      )}
    </div>
  );
};

export default Index;
