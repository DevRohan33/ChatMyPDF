
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import BuyCreditsModal from "./BuyCreditsModal";

const CreditDisplay: React.FC = () => {
  const { user } = useAuth();
  const [showBuyCredits, setShowBuyCredits] = useState(false);

  if (!user) return null;

  const textColor = user.credits <= 5 ? "text-red-500" : "";

  return (
    <>
      <div className="flex items-center">
        <div className="flex items-center mr-2 px-3 py-1 bg-app-light-gray rounded-full">
          <span className={`font-medium ${textColor}`}>{user.credits}</span>
          <span className="ml-1 text-gray-500 text-sm">credits</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowBuyCredits(true)}
          className="text-app-blue border-app-blue hover:bg-app-blue/10"
        >
          Buy more
        </Button>
      </div>
      <BuyCreditsModal open={showBuyCredits} onOpenChange={setShowBuyCredits} />
    </>
  );
};

export default CreditDisplay;
