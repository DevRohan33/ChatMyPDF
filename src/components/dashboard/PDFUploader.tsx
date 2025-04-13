
import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { usePDF } from "@/contexts/PDFContext";
import { Upload } from "lucide-react";

const PDFUploader: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadPDF } = usePDF();
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      uploadPDF(files[0]);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      uploadPDF(files[0]);
    }
  };

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div
          className={`border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center text-center ${
            isDragging ? "border-app-blue bg-app-blue/10" : "border-gray-300"
          }`}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf"
            className="hidden"
          />
          <Upload className="h-10 w-10 mb-3 text-app-blue" />
          <h3 className="text-lg font-medium mb-1">Upload a PDF</h3>
          <p className="text-sm text-gray-500 mb-3">
            Drag and drop a file here, or click to select
          </p>
          <Button
            type="button"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}
          >
            Select PDF
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PDFUploader;
