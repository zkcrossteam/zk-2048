import { FC } from "react";

import "./style.scss";

interface CurrencyDisplayProps {
  value: number;
  tag: string;
  className?: string;
}

export const CurrencyDisplay: FC<CurrencyDisplayProps> = ({
  tag,
  value,
  className,
}) => (
  <>
    <div
      className={`currency-display fs-5 px-3 d-flex justify-content-between align-items-center fw-bold ${className}`}
    >
      <span className="text-white">{tag}</span>
      <span className="gradient-content">{value.toLocaleString()}</span>
    </div>
  </>
);
