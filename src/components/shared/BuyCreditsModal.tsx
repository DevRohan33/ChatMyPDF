import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface CreditPack {
  id: string;
  name: string;
  price: number;
  credits: number;
}

interface BuyCreditsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const creditPacks: CreditPack[] = [
  {
    id: "mini",
    name: "Mini",
    price: 29,
    credits: 100,
  },
  {
    id: "standard",
    name: "Standard",
    price: 99,
    credits: 500,
  },
  {
    id: "pro",
    name: "Pro",
    price: 199,
    credits: 1500,
  },
];

const BuyCreditsModal: React.FC<BuyCreditsModalProps> = ({ open, onOpenChange }) => {
  const [selectedPack, setSelectedPack] = useState<CreditPack | null>(null);
  const { user } = useAuth();

  const handleBuy = () => {
    if (!selectedPack) return;

    const paymentLinks: Record<string, string> = {
      mini: "https://rzp.io/rzp/lZiF4LB",
      standard: "https://rzp.io/rzp/rZnmNA9n",
      pro: "https://rzp.io/rzp/Ov9mNp2",
    };

    const paymentUrl = paymentLinks[selectedPack.id];
    if (paymentUrl) {
      window.open(paymentUrl, "_blank");
      toast.success(`Redirecting to payment for ${selectedPack.credits} credits`);
      onOpenChange(false);
    } else {
      toast.error("Invalid pack selected.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Buy Credits</DialogTitle>
          <DialogDescription>
            Purchase credits to continue chatting with your documents.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-4 py-4">
          {creditPacks.map((pack) => (
            <div
              key={pack.id}
              className={`border rounded-lg p-4 text-center cursor-pointer transition-all ${
                selectedPack?.id === pack.id
                  ? "border-app-blue bg-app-blue/5"
                  : "border-gray-200 hover:border-app-blue/50"
              }`}
              onClick={() => setSelectedPack(pack)}
            >
              <h3 className="font-medium">{pack.name}</h3>
              <p className="text-xl font-bold my-2">₹{pack.price}</p>
              <p className="text-sm text-gray-500">{pack.credits} credits</p>
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button
            onClick={handleBuy}
            disabled={!selectedPack}
            className="w-full bg-app-blue hover:bg-app-blue/90"
          >
            Buy {selectedPack?.credits || ""} credits
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BuyCreditsModal;
