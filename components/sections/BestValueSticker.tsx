interface BestValueStickerProps {
  /** Unique filter ID (to avoid conflicts when rendered multiple times) */
  filterId: string;
}

/**
 * BestValueSticker — Red starburst badge shown on featured pricing card.
 * Each instance needs a unique filterId to prevent SVG filter conflicts.
 */
export default function BestValueSticker({ filterId }: BestValueStickerProps) {
  return (
    <svg className="best-value-sticker" viewBox="0 0 70 70">
      <defs>
        <filter id={filterId}>
          <feGaussianBlur in="SourceAlpha" stdDeviation="1.5" />
          <feOffset dx="0" dy="1" result="offsetblur" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.35" />
          </feComponentTransfer>
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g filter={`url(#${filterId})`}>
        <path
          d="M 35 4 L 40 10 L 48 7 L 50 15 L 58 14 L 58 22 L 66 25 L 63 32 L 68 38 L 63 44 L 66 52 L 58 53 L 58 61 L 50 60 L 48 68 L 40 65 L 35 71 L 30 65 L 22 68 L 20 60 L 12 61 L 12 53 L 4 52 L 7 44 L 2 38 L 7 32 L 4 25 L 12 22 L 12 14 L 20 15 L 22 7 L 30 10 Z"
          fill="#dc2626"
        />
        <circle
          cx="35"
          cy="37"
          r="26"
          fill="none"
          stroke="#fff"
          strokeWidth="0.8"
          opacity="0.6"
        />
      </g>
      <text
        x="35"
        y="32"
        textAnchor="middle"
        fontFamily="Fraunces, serif"
        fontWeight="900"
        fontSize="10"
        fill="#fff"
        letterSpacing="0.5"
      >
        BEST
      </text>
      <text
        x="35"
        y="46"
        textAnchor="middle"
        fontFamily="Fraunces, serif"
        fontWeight="900"
        fontSize="10"
        fill="#fff"
        letterSpacing="0.5"
      >
        VALUE
      </text>
    </svg>
  );
}
