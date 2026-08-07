"use client";

import { getFaqs } from "@/lib/faqs";
import { useCurrency } from "@/hooks/use-currency";

export function FaqSection() {
  const currency = useCurrency();
  const faqs = getFaqs(currency);

  return (
    <div className="space-y-4">
      {faqs.map((faq, index) => (
        <div
          key={index}
          className="p-6 rounded-2xl border bg-card hover-lift"
        >
          <h3 className="font-semibold text-lg mb-2">{faq.question}</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {faq.answer}
          </p>
        </div>
      ))}
    </div>
  );
}
