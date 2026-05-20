"use client";

import { useState } from "react";
import type { FaqItem } from "@/types/site-data";
import SectionBar from "@/components/layout/SectionBar";

interface FaqAccordionProps {
  faqs: FaqItem[];
  /** Index of the FAQ item that should start open (default: 0) */
  defaultOpenIndex?: number;
}

/**
 * FaqAccordion — Interactive FAQ accordion (client component).
 *
 * Uses single-open accordion pattern: clicking one item closes others.
 * First item is open by default for engagement.
 *
 * A11y: proper aria-expanded, button semantics, keyboard accessible.
 */
export default function FaqAccordion({
  faqs,
  defaultOpenIndex = 0,
}: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpenIndex);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
      <div id="faq" />
      <SectionBar>Frequently Asked Questions</SectionBar>
      <div className="faq-wrap reveal">
        {faqs.map((faq, i) => {
          const isOpen = openIndex === i;
          return (
            <div key={i} className={isOpen ? "faq-item open" : "faq-item"}>
              <button
                type="button"
                className="faq-trigger"
                aria-expanded={isOpen}
                onClick={() => handleToggle(i)}
              >
                <span className="q-mark">Q.</span>
                <span className="q-text">{faq.question}</span>
                <span className="q-toggle">+</span>
              </button>
              <div className="faq-body">
                <p className="faq-a">{faq.answer}</p>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
