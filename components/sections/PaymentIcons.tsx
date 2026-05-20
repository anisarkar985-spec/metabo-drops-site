/**
 * PaymentIcons — Row of payment brand badges below each CTA.
 * Pure presentational — same for every product.
 */
export default function PaymentIcons() {
  return (
    <div className="payment-icons">
      <div className="payment-icon visa">VISA</div>
      <div className="payment-icon mc">MC</div>
      <div className="payment-icon amex">AMEX</div>
      <div className="payment-icon paypal">
        Pay<span>Pal</span>
      </div>
      <div className="payment-icon discover">DISCOVER</div>
    </div>
  );
}
