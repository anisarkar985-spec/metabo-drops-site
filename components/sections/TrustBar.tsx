import type { TrustItem } from "@/types/site-data";

interface TrustBarProps {
  items: TrustItem[];
  guaranteeDays: number;
}

/**
 * TrustBar — Row of trust seal pills below the hero.
 * Each pill has a custom SVG icon + label + subtext.
 * Icon choice driven by TrustItem.iconType enum.
 */
export default function TrustBar({ items, guaranteeDays }: TrustBarProps) {
  return (
    <section className="trust-bar">
      <div className="trust-bar-inner">
        {items.map((item, i) => (
          <div key={i} className="trust-pill">
            <div className="pill-icon">
              <TrustIcon type={item.iconType} guaranteeDays={guaranteeDays} />
            </div>
            <div className="pill-text">
              {item.label}
              <span>{item.sub}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

interface TrustIconProps {
  type: TrustItem["iconType"];
  guaranteeDays: number;
}

function TrustIcon({ type, guaranteeDays }: TrustIconProps) {
  switch (type) {
    case "fda":
      return (
        <svg viewBox="0 0 48 48" width="48" height="48">
          <circle cx="24" cy="24" r="22" fill="#0c1e3e" stroke="#c8342c" strokeWidth="1.5" />
          <text
            x="24"
            y="27"
            textAnchor="middle"
            fontFamily="serif"
            fontWeight="800"
            fontSize="13"
            fill="#fff"
          >
            FDA
          </text>
          <text
            x="24"
            y="38"
            textAnchor="middle"
            fontFamily="sans-serif"
            fontSize="6"
            fill="#fff"
            opacity="0.8"
          >
            REGISTERED
          </text>
        </svg>
      );

    case "gmp":
      return (
        <svg viewBox="0 0 48 48" width="48" height="48">
          <circle cx="24" cy="24" r="22" fill="#15803d" stroke="#fff" strokeWidth="1.5" />
          <text
            x="24"
            y="28"
            textAnchor="middle"
            fontFamily="serif"
            fontWeight="800"
            fontSize="15"
            fill="#fff"
          >
            GMP
          </text>
        </svg>
      );

    case "usa":
      return (
        <svg viewBox="0 0 48 48" width="48" height="48">
          <rect x="2" y="10" width="44" height="28" fill="#fff" stroke="#0c1e3e" strokeWidth="1" />
          <rect x="2" y="10" width="44" height="4" fill="#c8342c" />
          <rect x="2" y="18" width="44" height="4" fill="#c8342c" />
          <rect x="2" y="26" width="44" height="4" fill="#c8342c" />
          <rect x="2" y="34" width="44" height="4" fill="#c8342c" />
          <rect x="2" y="10" width="19" height="12" fill="#0c1e3e" />
        </svg>
      );

    case "natural":
      return (
        <svg viewBox="0 0 48 48" width="48" height="48">
          <circle cx="24" cy="24" r="22" fill="#dcfce7" stroke="#15803d" strokeWidth="1.5" />
          <path d="M17 30 C 17 20, 24 15, 31 15 C 29 25, 24 30, 17 30 Z" fill="#15803d" />
          <path d="M17 30 Q 22 25 31 15" stroke="#fff" strokeWidth="1.2" fill="none" />
        </svg>
      );

    case "guarantee":
      return (
        <svg viewBox="0 0 48 48" width="48" height="48">
          <circle cx="24" cy="24" r="22" fill="#fef3c7" stroke="#b45309" strokeWidth="1.5" />
          <text
            x="24"
            y="22"
            textAnchor="middle"
            fontFamily="serif"
            fontWeight="800"
            fontSize="12"
            fill="#b45309"
          >
            {guaranteeDays}
          </text>
          <text
            x="24"
            y="33"
            textAnchor="middle"
            fontFamily="serif"
            fontWeight="700"
            fontSize="8"
            fill="#b45309"
          >
            DAYS
          </text>
        </svg>
      );

    case "shipping":
      return (
        <svg viewBox="0 0 48 48" width="48" height="48">
          <circle cx="24" cy="24" r="22" fill="#dbeafe" stroke="#1e40af" strokeWidth="1.5" />
          <text
            x="24"
            y="28"
            textAnchor="middle"
            fontFamily="sans-serif"
            fontWeight="700"
            fontSize="20"
            fill="#1e40af"
          >
            🚚
          </text>
        </svg>
      );
  }
}
