import type { GuaranteeInfo } from "@/types/site-data";

interface GuaranteeSealProps {
  guarantee: GuaranteeInfo;
  affiliateUrl: string;
}

/**
 * GuaranteeSeal — 60-day money-back guarantee section.
 * Structure: Seal image + heading + 2 paragraphs + CTA button.
 *
 * The seal is rendered as SVG (generated on-the-fly) so it scales
 * to any guarantee duration (30/60/90 days) without needing assets.
 */
export default function GuaranteeSeal({ guarantee, affiliateUrl }: GuaranteeSealProps) {
  return (
    <section>
      <div className="guarantee">
        <div>
          <div className="guarantee-seal-wrap">
            <div className="guarantee-seal-shimmer" />
            <SealSvg days={guarantee.days} />
          </div>
        </div>
        <div className="guarantee-text reveal">
          <h3>{guarantee.heading}</h3>
          {guarantee.paragraphs.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
          <a
            href={affiliateUrl}
            target="_blank"
            rel="nofollow noopener sponsored"
            className="btn btn-primary btn-inline"
          >
            {guarantee.ctaText}
          </a>
        </div>
      </div>
    </section>
  );
}

/**
 * SealSvg — Inline SVG guarantee badge.
 * Scales dynamically to the number of days (30/60/90).
 */
function SealSvg({ days }: { days: number }) {
  return (
    <svg
      className="guarantee-seal-img"
      viewBox="0 0 240 240"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={`${days}-Day Money-Back Guarantee Seal`}
    >
      <defs>
        <radialGradient id="seal-gold" cx="50%" cy="40%" r="70%">
          <stop offset="0%" stopColor="#fde68a" />
          <stop offset="55%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#b45309" />
        </radialGradient>
        <filter id="seal-shadow">
          <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
          <feOffset dx="0" dy="3" result="offsetblur" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.4" />
          </feComponentTransfer>
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <path
          id="circlePath"
          d="M 120,120 m -92,0 a 92,92 0 1,1 184,0 a 92,92 0 1,1 -184,0"
        />
      </defs>

      {/* Starburst ribbon */}
      <g filter="url(#seal-shadow)">
        <polygon
          points="120,10 135,35 165,25 165,55 195,55 185,80 215,90 200,115 225,135 200,155 215,180 185,190 195,215 165,215 165,245 135,235 120,260 105,235 75,245 75,215 45,215 55,190 25,180 40,155 15,135 40,115 25,90 55,80 45,55 75,55 75,25 105,35"
          fill="#b91c1c"
        />
      </g>

      {/* Inner circle */}
      <circle cx="120" cy="135" r="92" fill="url(#seal-gold)" stroke="#7c2d12" strokeWidth="4" />
      <circle cx="120" cy="135" r="82" fill="none" stroke="#fff" strokeWidth="2" opacity="0.7" />

      {/* Center content */}
      <text
        x="120"
        y="120"
        textAnchor="middle"
        fontFamily="Fraunces, serif"
        fontWeight="900"
        fontSize="68"
        fill="#7c2d12"
      >
        {days}
      </text>
      <text
        x="120"
        y="150"
        textAnchor="middle"
        fontFamily="Fraunces, serif"
        fontWeight="700"
        fontSize="22"
        fill="#7c2d12"
        letterSpacing="2"
      >
        DAYS
      </text>
      <text
        x="120"
        y="178"
        textAnchor="middle"
        fontFamily="Inter Tight, sans-serif"
        fontWeight="700"
        fontSize="11"
        fill="#7c2d12"
        letterSpacing="1.5"
      >
        MONEY-BACK
      </text>
      <text
        x="120"
        y="193"
        textAnchor="middle"
        fontFamily="Inter Tight, sans-serif"
        fontWeight="700"
        fontSize="11"
        fill="#7c2d12"
        letterSpacing="1.5"
      >
        GUARANTEE
      </text>
    </svg>
  );
}
