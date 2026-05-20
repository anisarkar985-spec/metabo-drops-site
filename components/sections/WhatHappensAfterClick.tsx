import type { WhatHappensAfterClickSection } from "@/types/site-data";
import SectionBar from "@/components/layout/SectionBar";

interface WhatHappensAfterClickProps {
  whatHappens: WhatHappensAfterClickSection;
}

/**
 * WhatHappensAfterClick — 'What Happens After You Click "Buy Now"' section.
 * Walks buyer through the 6 steps of the purchase flow.
 * Each step: H4 numbered title + body paragraph.
 */
export default function WhatHappensAfterClick({
  whatHappens,
}: WhatHappensAfterClickProps) {
  return (
    <>
      <SectionBar>What Happens After You Click &quot;Buy Now&quot;</SectionBar>
      <div className="prose-wrap reveal">
        <p>{whatHappens.intro}</p>
        {whatHappens.steps.map((step, i) => (
          <div key={i}>
            <h4>{step.title}</h4>
            <p>{step.body}</p>
          </div>
        ))}
      </div>
    </>
  );
}
