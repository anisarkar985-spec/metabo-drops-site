interface BuyNowButtonProps {
  affiliateUrl: string;
  text?: string;
}

/**
 * BuyNowButton — Red CTA button with cart icon, used on every pricing card.
 * Links out to the affiliate URL with proper rel="sponsored" for FTC compliance.
 */
export default function BuyNowButton({ affiliateUrl, text = "Buy Now" }: BuyNowButtonProps) {
  return (
    <a
      href={affiliateUrl}
      target="_blank"
      rel="nofollow noopener sponsored"
      className="price-cta-nitric"
    >
      <span>{text}</span>
      <span className="cart-icon">
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M7 4h-2c-.6 0-1 .4-1 1s.4 1 1 1h1.2l2.1 9.3c.2.9 1 1.7 2 1.7h9c.9 0 1.7-.6 1.9-1.5l1.8-7.2c.2-.6-.3-1.3-1-1.3H7.2l-.3-1.3c-.1-.4-.5-.7-.9-.7zm2.5 13c-.8 0-1.5.7-1.5 1.5S8.7 20 9.5 20s1.5-.7 1.5-1.5S10.3 17 9.5 17zm9 0c-.8 0-1.5.7-1.5 1.5s.7 1.5 1.5 1.5 1.5-.7 1.5-1.5-.7-1.5-1.5-1.5z" />
        </svg>
      </span>
    </a>
  );
}
