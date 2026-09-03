'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

type FaqAccordionProps = {
  items: FaqItem[];
};

export function FaqAccordion({ items }: FaqAccordionProps) {
  return (
    <Accordion type="single" collapsible className="w-full">
      {items.map((item) => (
        <AccordionItem
          key={item.id}
          value={item.id}
          className="border-white/[0.08] px-5 first:border-t last:border-b-0"
        >
          <AccordionTrigger className="text-left text-sm font-medium text-white hover:no-underline hover:text-emerald-400">
            {item.question}
          </AccordionTrigger>
          <AccordionContent className="text-sm leading-6 text-slate-400">
            {item.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
