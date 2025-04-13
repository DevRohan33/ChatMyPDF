
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { usePDF } from "@/contexts/PDFContext";
import { useChat } from "@/contexts/ChatContext";
import { FileText, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const PDFList: React.FC = () => {
  const { pdfs, deletePDF, selectPDF } = usePDF();
  const { startSession } = useChat();

  const handleChat = (pdfId: string) => {
    const pdf = pdfs.find(p => p.id === pdfId);
    if (pdf) {
      selectPDF(pdf);
      startSession(pdfId);
    }
  };

  if (pdfs.length === 0) {
    return (
      <Card className="w-full mt-6">
        <CardHeader>
          <CardTitle>My PDFs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-gray-500">
            No PDFs uploaded yet. Upload a PDF to get started.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full mt-6">
      <CardHeader>
        <CardTitle>My PDFs</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {pdfs.map((pdf) => (
            <li
              key={pdf.id}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50"
            >
              <div className="flex items-center">
                <FileText className="h-5 w-5 text-app-blue mr-3" />
                <div>
                  <h4 className="font-medium text-gray-900">{pdf.name}</h4>
                  <p className="text-xs text-gray-500">
                    {formatDistanceToNow(pdf.uploadedAt, { addSuffix: true })}
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  className="bg-app-blue hover:bg-app-blue/90"
                  onClick={() => handleChat(pdf.id)}
                >
                  Chat
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-red-500 border-red-200 hover:bg-red-50"
                  onClick={() => deletePDF(pdf.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default PDFList;
