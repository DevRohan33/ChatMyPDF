
import React, { createContext, useState, useContext } from "react";
import { toast } from "sonner";
import { useAuth } from "./AuthContext";

interface PDF {
  id: string;
  name: string;
  size: number;
  uploadedAt: Date;
  file: File;
}

interface PDFContextType {
  pdfs: PDF[];
  uploadPDF: (file: File) => void;
  deletePDF: (id: string) => void;
  selectedPDF: PDF | null;
  selectPDF: (pdf: PDF | null) => void;
}

const PDFContext = createContext<PDFContextType | undefined>(undefined);

export const usePDF = () => {
  const context = useContext(PDFContext);
  if (!context) {
    throw new Error("usePDF must be used within a PDFProvider");
  }
  return context;
};

export const PDFProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pdfs, setPDFs] = useState<PDF[]>([]);
  const [selectedPDF, setSelectedPDF] = useState<PDF | null>(null);
  const { user } = useAuth();

  const uploadPDF = (file: File) => {
    if (!user) {
      toast.error("You must be logged in to upload PDFs");
      return;
    }

    if (file.type !== "application/pdf") {
      toast.error("Only PDF files are accepted");
      return;
    }

    const newPDF: PDF = {
      id: "pdf-" + Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      uploadedAt: new Date(),
      file,
    };

    setPDFs((prev) => [...prev, newPDF]);
    toast.success(`${file.name} uploaded successfully`);
  };

  const deletePDF = (id: string) => {
    setPDFs((prev) => prev.filter((pdf) => pdf.id !== id));
    if (selectedPDF?.id === id) {
      setSelectedPDF(null);
    }
    toast.success("PDF deleted successfully");
  };

  const selectPDF = (pdf: PDF | null) => {
    setSelectedPDF(pdf);
  };

  return (
    <PDFContext.Provider
      value={{
        pdfs,
        uploadPDF,
        deletePDF,
        selectedPDF,
        selectPDF,
      }}
    >
      {children}
    </PDFContext.Provider>
  );
};
