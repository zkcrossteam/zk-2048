interface IProps {
  tag?: string;
  value: number;
  className?: string;
}

export default function CurrencyDisplay(props: IProps) {
  const { tag = "Currency", value } = props;
  return (
    <>
      <div className={`currency-display ${props.className}`}>
        <span className="tag">{tag}</span>
        <span className="value ms-2">{value}</span>
      </div>
    </>
  );
}
