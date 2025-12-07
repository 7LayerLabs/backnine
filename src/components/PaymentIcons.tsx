import Image from "next/image";

interface PaymentIconsProps {
  size?: "sm" | "md";
  showLabel?: boolean;
  className?: string;
}

export default function PaymentIcons({
  size = "md",
  showLabel = true,
  className = ""
}: PaymentIconsProps) {
  const iconHeight = size === "sm" ? "h-6" : "h-8";
  const labelClass = size === "sm" ? "text-xs" : "text-xs";

  return (
    <div className={`flex items-center justify-center gap-3 flex-wrap ${className}`}>
      {showLabel && (
        <span className={`${labelClass} text-stone-400 mr-1`}>
          {size === "sm" ? "Pay with" : "Secure payments with"}
        </span>
      )}
      <Image
        src="/payment-logos/visa.svg"
        alt="Visa"
        width={40}
        height={26}
        className={`${iconHeight} w-auto`}
      />
      <Image
        src="/payment-logos/mastercard.svg"
        alt="Mastercard"
        width={40}
        height={26}
        className={`${iconHeight} w-auto`}
      />
      <Image
        src="/payment-logos/amex.svg"
        alt="American Express"
        width={40}
        height={26}
        className={`${iconHeight} w-auto`}
      />
      <Image
        src="/payment-logos/klarna.png"
        alt="Klarna"
        width={40}
        height={26}
        className={`${iconHeight} w-auto`}
      />
    </div>
  );
}
