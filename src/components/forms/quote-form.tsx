"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { type CurrencyCode, currencies, applyDiscount } from "@/lib/pricing";

const ADMIN_CURRENCY: CurrencyCode = "INR";

export function QuoteForm({
  projectId,
  referralDiscountPercent = 0,
}: {
  projectId: string;
  referralDiscountPercent?: number;
}) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [validUntil, setValidUntil] = useState("");
  const currency = ADMIN_CURRENCY;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`/api/projects/${projectId}/quotes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: parseFloat(amount),
          description,
          validUntil,
          currency,
        }),
      });

      if (response.ok) {
        setIsOpen(false);
        setAmount("");
        setDescription("");
        setValidUntil("");
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to create quote:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        size="sm"
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-2" />
        Send New Quote
      </Button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <Label htmlFor="amount">Amount ({currencies[currency].symbol})</Label>
        <Input
          id="amount"
          type="number"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder={currency === "INR" ? "25000" : "300"}
          required
          className="mt-1"
        />
        <p className="text-xs text-muted-foreground mt-1">
          Entered in {currencies[currency].name} ({currencies[currency].symbol}).
        </p>
        {referralDiscountPercent > 0 && amount && !isNaN(parseFloat(amount)) && (
          <p className="text-xs font-medium text-green-600 mt-1">
            Referred client: {referralDiscountPercent}% discount will be applied
            automatically. They&apos;ll pay {currencies[currency].symbol}
            {applyDiscount(parseFloat(amount), referralDiscountPercent).toLocaleString(undefined, { maximumFractionDigits: 0 })}.
          </p>
        )}
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe what's included..."
          required
          rows={3}
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="validUntil">Valid Until</Label>
        <Input
          id="validUntil"
          type="date"
          value={validUntil}
          onChange={(e) => setValidUntil(e.target.value)}
          required
          className="mt-1"
        />
      </div>
      <div className="flex gap-2">
        <Button type="submit" size="sm" disabled={isLoading} className="flex-1">
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send Quote"}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setIsOpen(false)}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
